const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load creator data
const creatorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/creators.json'), 'utf8')
);

// GET all creators
app.get('/api/creators', (req, res) => {
  res.json(creatorsData);
});

// GET filtered creators
app.get('/api/creators/filter', (req, res) => {
  try {
    // Implement filtering logic based on query parameters
    let filtered = [...creatorsData]; // start with all creators
    const { platforms, categories, followerRange, engagementRateMin, regions, verifiedOnly } = req.query;

    // Filter by platforms
    if (platforms) {
      const platformList = Array.isArray(platforms) ? platforms : [platforms];
      if (platformList.length > 0 && platformList[0] !== '') {
        filtered = filtered.filter(c => platformList.includes(c.platform));
        console.log(`Filtered by platforms: ${platformList}, remaining: ${filtered.length}`);
      }
    }

    // Filter by categories
    if (categories) {
      const categoryList = Array.isArray(categories) ? categories : [categories];
      if (categoryList.length > 0 && categoryList[0] !== '') {
        filtered = filtered.filter(c =>
          c.contentCategories.some(cat => categoryList.includes(cat))
        );
        console.log(`Filtered by categories: ${categoryList}, remaining: ${filtered.length}`);
      }
    }

    // Filter by follower range
    if (followerRange) {
      const [minFollowers, maxFollowers] = followerRange.split(',').map(Number);
      if (!isNaN(minFollowers) && !isNaN(maxFollowers)) {
        filtered = filtered.filter(c =>
          c.followers >= minFollowers && c.followers <= maxFollowers
        );
        console.log(`Filtered by follower range: ${minFollowers}-${maxFollowers}, remaining: ${filtered.length}`);
      }
    }

    // Filter by engagement rate
    if (engagementRateMin && !isNaN(parseFloat(engagementRateMin))) {
      const minRate = parseFloat(engagementRateMin);
      filtered = filtered.filter(c => c.engagementRate >= minRate);
      console.log(`Filtered by min engagement rate: ${minRate}, remaining: ${filtered.length}`);
    }

    // Filter by verified status
    if (verifiedOnly === 'true') {
      filtered = filtered.filter(c => c.verified === true);
      console.log(`Filtered by verified only, remaining: ${filtered.length}`);
    }

    // Filter by regions
    if (regions) {
      const regionList = Array.isArray(regions) ? regions : [regions];
      if (regionList.length > 0 && regionList[0] !== '') {
        filtered = filtered.filter(c => regionList.includes(c.location));
        console.log(`Filtered by regions: ${regionList}, remaining: ${filtered.length}`);
      }
    }

    console.log(`Total filtered from ${creatorsData.length} to ${filtered.length} creators`);
    res.json(filtered);
  } catch (err) {
    console.error('Error in filtering:', err);
    console.error('Error stack:', err.stack); // Print the full error stack
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// POST calculate match scores
app.post('/api/match', (req, res) => {
  // Implementation of the match score calculation algorithm
  const campaignSettings = req.body;
  
  // Calculate match scores for all creators
  const creatorsWithScores = creatorsData.map(creator => {
    const matchScore = calculateMatchScore(creator, campaignSettings);
    return {
      ...creator,
      matchScore
    };
  });
  
  res.json(creatorsWithScores);
});

// Match score calculation algorithm
function calculateMatchScore(creator, campaignSettings) {
  // default to Brand Awareness campaign
  let weights = {
    budgetFit: 0.25,
    contentRelevance: 0.30,
    audienceFit: 0.20,
    engagementQuality: 0.15,
    previousPerformance: 0.10,
    platformFit: 0.10,
    locationFit: 0.10
  };

  // Adjust weights based on campaign type
  if (campaignSettings.campaignType === 'Brand Awareness') {
    weights = {
      budgetFit: 0.15,        // important but not as much as reach.
      contentRelevance: 0.40, // key to ensure the right message is spread.
      audienceFit: 0.20,      // make sure you're reaching the right group.
      engagementQuality: 0.10, // less important here; the focus is on reach.
      previousPerformance: 0.05, // less relevant for brand awareness.
      platformFit: 0.05,      // important but not as critical as reach and content.
      locationFit: 0.05       // important for regional campaigns but less so for global reach.
    };
  } else if (campaignSettings.campaignType === 'Product Launch') {
    weights = {
      budgetFit: 0.20,         // must fit the launch budget as there are likely lots of other costs as well.
      contentRelevance: 0.35,  // important.
      audienceFit: 0.15,       // still matters but isn't as critical as for conversions.
      engagementQuality: 0.20, // vital to drive interest and buzz.
      previousPerformance: 0.05, // somewhat relevant.
      platformFit: 0.05,       // important, especially for video-heavy platforms.
      locationFit: 0.10        // less significant for global launches, but important for local launches.
    };
  } else if (campaignSettings.campaignType === 'Community Engagement') {
    weights = {
      budgetFit: 0.10,         // less important compared to engagement and relationship building.
      contentRelevance: 0.20,  // relevance is important, but community engagement takes priority.
      audienceFit: 0.30,       // crucial for community campaigns.
      engagementQuality: 0.25, // top priority for community-building campaigns.
      previousPerformance: 0.05, // not as critical.
      platformFit: 0.05,       // important, especially for platforms that support live interaction.
      locationFit: 0.05        // relevant if targeting specific regional communities.
    };
  } else if (campaignSettings.campaignType === 'Conversions and Sales') {
      weights = {
        budgetFit: 0.15,         // still plays a role, but conversions require engagement.
        contentRelevance: 0.20,  // helps ensure the product fits the creator’s content.
        audienceFit: 0.25,       // key to driving conversions with the right demographic.
        engagementQuality: 0.30, // critical in driving conversions.
        previousPerformance: 0.05, // can be an indicator of conversion success.
        platformFit: 0.05,       // isn’t as important as engagement for conversions.
        locationFit: 0.05        // can be useful, especially for products that have regional availability.
      };
    
  }
  
  const platformWeights = {
    BrandAwareness: {
      TikTok: 1.2,
      YouTube: 1.0,
      Twitch: 0.8
    },
    ProductLaunch: {
      TikTok: 1.1,
      YouTube: 1.3,
      Twitch: 0.9
    },
    CommunityEngagement: {
      TikTok: 1.0,
      YouTube: 0.8,
      Twitch: 1.2
    },
    ConversionsAndSales: {
      TikTok: 0.8,
      YouTube: 1.3,
      Twitch: 1.0
    }
  };

  // Select the appropriate platform weights based on the campaign type
  let selectedPlatformWeights = platformWeights[campaignSettings.campaignType] || platformWeights.BrandAwareness;

  // Calculate platform fit score based on selected platforms for the campaign
  let platformFitScore = 0;
  campaignSettings.platforms.forEach(platform => {
    // Only consider the allowed platforms (Twitch, YouTube, TikTok)
    if (selectedPlatformWeights[platform]) {
      platformFitScore += selectedPlatformWeights[platform];
    }
  });

  // Normalize the platform fit score by dividing by the number of platforms to get a weighted average
  platformFitScore = platformFitScore / campaignSettings.platforms.length;

  // Calculate individual component scores
  const budgetFitScore = calculateBudgetFit(creator, campaignSettings);
  const contentRelevanceScore = calculateContentRelevance(creator, campaignSettings);
  const audienceFitScore = calculateAudienceFit(creator, campaignSettings);
  const engagementQualityScore = calculateEngagementQuality(creator);
  const previousPerformanceScore = normalizePreviousPerformance(creator);

  // Combine scores using weights and include platformFit
  const matchScore = (
    (budgetFitScore * weights.budgetFit) +
    (contentRelevanceScore * weights.contentRelevance) +
    (audienceFitScore * weights.audienceFit) +
    (engagementQualityScore * weights.engagementQuality) +
    (previousPerformanceScore * weights.previousPerformance) +
    (platformFitScore * weights.platformFit) +
    (locationFitScore * weights.locationFit)  // Add location fit if applicable
  ) * 100;

  // Ensure the score is between 0-100
  return Math.min(100, Math.max(0, Math.round(matchScore)));
}

// Calculate how well creator's rate fits within campaign budget
function calculateBudgetFit(creator, campaignSettings) {
  if (!campaignSettings.budget || !Array.isArray(campaignSettings.budget) || campaignSettings.budget.length !== 2) {
    return 0.5; // Default score if budget isn't properly specified
  }
  
  const [minBudget, maxBudget] = campaignSettings.budget;
  const creatorRate = creator.hourlyRate;
  
  if (creatorRate < minBudget) {
    // Below budget - score decreases as the gap increases
    return Math.max(0, 1 - (minBudget - creatorRate) / minBudget);
  } else if (creatorRate > maxBudget) {
    // Above budget - score decreases as the gap increases
    return Math.max(0, 1 - (creatorRate - maxBudget) / maxBudget);
  } else {
    // Within budget - full score
    return 1;
  }
}

// Calculate how relevant creator's content is to the campaign
function calculateContentRelevance(creator, campaignSettings) {
  if (!campaignSettings.targetGenres || !Array.isArray(campaignSettings.targetGenres) || campaignSettings.targetGenres.length === 0) {
    return 0.5; // Default score if target genres aren't specified
  }
  
  const targetGenres = campaignSettings.targetGenres;
  const creatorCategories = creator.contentCategories;
  
  // Count matching categories
  const matchingCategories = creatorCategories.filter(category => 
    targetGenres.includes(category)
  ).length;
  
  if (creatorCategories.length === 0) return 0;
  
  // Calculate relevance score based on percentage of matching categories
  return matchingCategories / Math.max(targetGenres.length, creatorCategories.length);
}

// Calculate audience demographic fit
function calculateAudienceFit(creator, campaignSettings) {
  if (!creator.audienceDemographics || 
      !campaignSettings.targetAgeGroups || 
      !campaignSettings.targetGenders) {
    return 0.5; // Default score if demographics aren't specified
  }
  
  const targetAgeGroups = campaignSettings.targetAgeGroups;
  const targetGenders = campaignSettings.targetGenders;
  
  // Skip if no target demographics selected
  if (targetAgeGroups.length === 0 && targetGenders.length === 0) {
    return 0.5;
  }
  
  let ageScore = 0.5;
  let genderScore = 0.5;
  
  // Calculate age group match
  if (targetAgeGroups.length > 0) {
    const creatorAgeGroups = creator.audienceDemographics.age;
    let targetAgePercentage = 0;
    
    // Sum up the percentages of target age groups
    targetAgeGroups.forEach(ageGroup => {
      if (creatorAgeGroups[ageGroup]) {
        targetAgePercentage += creatorAgeGroups[ageGroup];
      }
    });
    
    ageScore = targetAgePercentage / 100;
  }
  
  // Calculate gender match
  if (targetGenders.length > 0) {
    const creatorGenders = creator.audienceDemographics.gender;
    let targetGenderPercentage = 0;
    
    // Sum up the percentages of target genders
    targetGenders.forEach(gender => {
      if (creatorGenders[gender]) {
        targetGenderPercentage += creatorGenders[gender];
      }
    });
    
    genderScore = targetGenderPercentage / 100;
  }
  
  // Average age and gender scores for overall demographic match
  return (ageScore + genderScore) / 2;
}

// Calculate engagement quality score
function calculateEngagementQuality(creator) {
  // Normalize engagement rate to a 0-1 scale (considering 15% as excellent)
  const normalizedEngagement = Math.min(1, creator.engagementRate / 15);
  
  // Normalize follower count to a 0-1 scale (considering 2M as maximum)
  const normalizedFollowers = Math.min(1, creator.followers / 2000000);
  
  // Engagement quality considers both metrics, with emphasis on engagement rate
  return (normalizedEngagement * 0.7) + (normalizedFollowers * 0.3);
}

// Normalize previous performance score
function normalizePreviousPerformance(creator) {
  // Convert campaign performance (0-100) to a 0-1 scale
  return creator.previousCampaignPerformance / 100;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
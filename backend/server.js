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
  // Implement filtering logic based on query parameters
  let filteredCreators = [...creatorsData];
  const { platforms, categories, followerRange, engagementRateMin, regions, verifiedOnly } = req.query;
  
  // Filter by platform
  if (platforms && platforms.length > 0) {
    const platformArray = Array.isArray(platforms) ? platforms : [platforms];
    filteredCreators = filteredCreators.filter(creator => 
      platformArray.includes(creator.platform)
    );
  }
  
  // Filter by content categories
  if (categories && categories.length > 0) {
    const categoryArray = Array.isArray(categories) ? categories : [categories];
    filteredCreators = filteredCreators.filter(creator => 
      creator.contentCategories.some(category => categoryArray.includes(category))
    );
  }
  
  // Filter by follower range
  if (followerRange) {
    const [min, max] = Array.isArray(followerRange) ? followerRange : [parseInt(followerRange[0]), parseInt(followerRange[1])];
    filteredCreators = filteredCreators.filter(creator => 
      creator.followers >= min && creator.followers <= max
    );
  }
  
  // Filter by minimum engagement rate
  if (engagementRateMin) {
    const minRate = parseFloat(engagementRateMin);
    filteredCreators = filteredCreators.filter(creator => 
      creator.engagementRate >= minRate
    );
  }
  
  // Filter by regions
  if (regions && regions.length > 0) {
    const regionArray = Array.isArray(regions) ? regions : [regions];
    filteredCreators = filteredCreators.filter(creator => 
      regionArray.includes(creator.location)
    );
  }
  
  // Filter by verified status
  if (verifiedOnly === 'true') {
    filteredCreators = filteredCreators.filter(creator => creator.verified);
  }
  
  res.json(filteredCreators);
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
  // These weights balance the importance of different factors
  const weights = {
    budgetFit: 0.25,
    contentRelevance: 0.30,
    audienceFit: 0.20,
    engagementQuality: 0.15,
    previousPerformance: 0.10
  };
  
  // Calculate individual component scores
  const budgetFitScore = calculateBudgetFit(creator, campaignSettings);
  const contentRelevanceScore = calculateContentRelevance(creator, campaignSettings);
  const audienceFitScore = calculateAudienceFit(creator, campaignSettings);
  const engagementQualityScore = calculateEngagementQuality(creator);
  const previousPerformanceScore = normalizePreviousPerformance(creator);
  
  // Combine scores using weights
  const matchScore = (
    (budgetFitScore * weights.budgetFit) +
    (contentRelevanceScore * weights.contentRelevance) +
    (audienceFitScore * weights.audienceFit) +
    (engagementQualityScore * weights.engagementQuality) +
    (previousPerformanceScore * weights.previousPerformance)
  ) * 100;
  
  // Ensure score is between 0-100
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
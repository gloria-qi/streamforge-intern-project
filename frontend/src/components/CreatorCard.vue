<script setup>
import { computed } from 'vue';

const props = defineProps({
  creator: {
    type: Object,
    required: true
  }
});

// TODO: Implement computed properties and helper functions to format data
// For example, format large follower numbers, calculate match score width, etc.

// Format large numbers with K/M suffix
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num;
};

// Calculate the width percentage for the match score progress bar
const matchScoreWidth = computed(() => {
  return props.creator.matchScore ? `${props.creator.matchScore}%` : '0%';
});

// Calculate the color class for the match score
const matchScoreColorClass = computed(() => {
  const score = props.creator.matchScore || 0;
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
});

// Determine platform icon and color
const platformInfo = computed(() => {
  switch(props.creator.platform) {
    case 'Twitch':
      return { 
        icon: '🟣', 
        colorClass: 'bg-purple-100 text-purple-800 border-purple-300'
      };
    case 'YouTube':
      return { 
        icon: '🔴', 
        colorClass: 'bg-red-100 text-red-800 border-red-300'
      };
    case 'TikTok':
      return { 
        icon: '⚫', 
        colorClass: 'bg-gray-100 text-gray-800 border-gray-300'
      };
    default:
      return { 
        icon: '🌐', 
        colorClass: 'bg-blue-100 text-blue-800 border-blue-300'
      };
  }
});

</script>

<template>
  <div class="border rounded-lg shadow-md bg-white overflow-hidden hover:shadow-lg transition-all duration-200">
    <!-- TODO: Implement the creator card UI -->
    <!-- 
      Requirements:
      1. Display basic creator info (username, platform, etc.)
      2. Show the match score prominently
      3. Display key metrics (followers, engagement rate)
      4. Show content categories
      5. Make it visually appealing and informative for marketers
      6. Use Tailwind CSS for styling
    -->

    <!-- Header with platform and match score -->
    <div class="p-4 border-b flex justify-between items-center">
      <div class="flex items-center gap-2">
        <span class="text-xl">{{ platformInfo.icon }}</span>
        <div>
          <h3 class="font-bold text-lg">{{ creator.username }}</h3>
          <span class="text-sm text-gray-500">{{ creator.platform }}</span>
        </div>
      </div>
      <div v-if="creator.verified" class="flex items-center">
        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Verified</span>
      </div>
    </div>

    <!-- Match score section -->
    <div class="p-4 border-b bg-gray-50">
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-medium">Match Score</span>
        <span class="text-sm font-bold">{{ creator.matchScore || 0 }}%</span>
      </div>
      <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="h-full rounded-full transition-all duration-500" 
          :class="matchScoreColorClass"
          :style="{ width: matchScoreWidth }"
        ></div>
      </div>
    </div>
    
    <!-- Key metrics -->
    <div class="p-4 grid grid-cols-2 gap-4">
      <div class="text-center">
        <p class="text-sm text-gray-500">Followers</p>
        <p class="font-bold text-lg">{{ formatNumber(creator.followers) }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Engagement</p>
        <p class="font-bold text-lg">{{ creator.engagementRate }}%</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Avg Viewers</p>
        <p class="font-bold text-lg">{{ formatNumber(creator.avgViewers) }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Rate/Hour</p>
        <p class="font-bold text-lg">${{ creator.hourlyRate }}</p>
      </div>
    </div>
  </div>
</template>
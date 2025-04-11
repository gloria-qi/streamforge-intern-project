<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Props to receive creator data and campaign settings
const props = defineProps({
  creator: {
    type: Object,
    required: true
  },
  campaignSettings: {
    type: Object,
    required: true
  }
});

const explanation = ref(null);
const loading = ref(false);
const error = ref(null);

// Format large numbers with K/M suffix
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num;
};

// Determine color class based on score
const getScoreColorClass = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

// Load match score explanation
const loadExplanation = async () => {
  if (!props.creator || !props.campaignSettings) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.post(
      `http://localhost:3000/api/match/explain/${props.creator.id}`, 
      props.campaignSettings
    );
    explanation.value = response.data;
  } catch (e) {
    console.error('Error fetching match explanation:', e);
    error.value = 'Failed to load match score details. Please try again.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadExplanation();
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden border">
    <!-- Header section -->
    <div class="p-6 bg-gray-50 border-b">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold">
            {{ creator.username.slice(0, 2).toUpperCase() }}
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ creator.username }}</h2>
            <div class="flex items-center gap-2">
              <span class="text-gray-600">{{ creator.platform }}</span>
              <span v-if="creator.verified" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Verified</span>
              <span class="text-gray-500">•</span>
              <span class="text-gray-600">{{ creator.location }}</span>
            </div>
          </div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">{{ creator.matchScore }}%</div>
          <div class="text-sm text-gray-500">Match Score</div>
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      <p class="mt-4 text-gray-500">Loading match details...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="p-8 text-center">
      <p class="text-red-500">{{ error }}</p>
      <button 
        @click="loadExplanation" 
        class="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Try Again
      </button>
    </div>
    
    <!-- Match score details -->
    <div v-else-if="explanation" class="p-6">
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-2">Match Score Breakdown</h3>
        <div class="grid gap-4">
          <div v-for="(score, category) in explanation.componentScores" :key="category" class="border rounded p-4">
            <div class="flex justify-between items-center mb-1">
              <span class="font-medium capitalize">{{ category.replace(/([A-Z])/g, ' $1') }}</span>
              <span class="font-bold">{{ score }}%</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full"
                :class="getScoreColorClass(score)"
                :style="{ width: `${score}%` }"
              ></div>
            </div>
            <p class="mt-2 text-sm text-gray-600">{{ explanation.explanations[category] }}</p>
          </div>
        </div>
      </div>
      
      <!-- Platform boost info -->
      <div v-if="explanation.platformBoost !== 1" class="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 class="font-semibold">Platform Boost Applied</h3>
        <p class="text-sm text-gray-700">
          {{ creator.platform }} platform has a 
          {{ Math.round((explanation.platformBoost - 1) * 100) }}% boost 
          for {{ campaignSettings.campaignObjective?.replace('_', ' ') || 'this campaign objective' }}.
        </p>
      </div>
    </div>
    
    <!-- Key metrics -->
    <div class="border-t p-6">
      <h3 class="text-lg font-semibold mb-4">Creator Metrics</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-3 bg-gray-50 rounded">
          <p class="text-gray-500 text-sm">Followers</p>
          <p class="font-bold text-xl">{{ formatNumber(creator.followers) }}</p>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded">
          <p class="text-gray-500 text-sm">Engagement Rate</p>
          <p class="font-bold text-xl">{{ creator.engagementRate }}%</p>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded">
          <p class="text-gray-500 text-sm">Avg. Viewers</p>
          <p class="font-bold text-xl">{{ formatNumber(creator.avgViewers) }}</p>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded">
          <p class="text-gray-500 text-sm">Hourly Rate</p>
          <p class="font-bold text-xl">${{ creator.hourlyRate }}</p>
        </div>
      </div>
    </div>
    
    
    <!-- Content categories & Demographics -->
    <div class="grid md:grid-cols-2 border-t">
      <div class="p-6 border-r">
        <h3 class="text-lg font-semibold mb-3">Content Categories</h3>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="category in creator.contentCategories" 
            :key="category"
            class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
          >
            {{ category }}
          </span>
        </div>
      </div>
      
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-3">Audience Demographics</h3>
        <div class="space-y-4">
          <!-- Age breakdown -->
          <div v-if="creator.audienceDemographics?.age">
            <p class="font-medium mb-2">Age Groups</p>
            <div class="space-y-2">
              <div 
                v-for="(percentage, group) in creator.audienceDemographics.age" 
                :key="group"
                class="flex items-center"
              >
                <span class="w-16 text-sm">{{ group }}</span>
                <div class="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-brand-purple"
                    :style="{ width: `${percentage}%` }"
                  ></div>
                </div>
                <span class="w-10 text-right text-sm">{{ percentage }}%</span>
              </div>
            </div>
          </div>
          
          <!-- Gender breakdown -->
          <div v-if="creator.audienceDemographics?.gender">
            <p class="font-medium mb-2">Gender</p>
            <div class="space-y-2">
              <div 
                v-for="(percentage, gender) in creator.audienceDemographics.gender" 
                :key="gender"
                class="flex items-center"
              >
                <span class="w-16 text-sm capitalize">{{ gender }}</span>
                <div class="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-brand-teal"
                    :style="{ width: `${percentage}%` }"
                  ></div>
                </div>
                <span class="w-10 text-right text-sm">{{ percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
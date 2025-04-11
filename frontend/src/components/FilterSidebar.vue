<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  platforms: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['filter-change']);

// Filter state
const selectedPlatforms = ref([]);
const selectedCategories = ref([]);
const followerRange = ref([0, 2000000]);
const minEngagementRate = ref(0);
const verifiedOnly = ref(false);
const selectedRegions = ref([]);



// Available regions derived from common regions in gaming
const availableRegions = [
  'US-West', 
  'US-East', 
  'US-Central', 
  'US-South',
  'EU-West', 
  'EU-East', 
  'EU-North', 
  'EU-South', 
  'EU-Central', 
  'APAC'
];

// Format the follower range for display
const formattedFollowerRange = computed(() => {
  return followerRange.value.map(val => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val;
  }).join(' - ');
});

// Apply the filters
function emitFilterChange() {
  const filterData = {
    platforms: selectedPlatforms.value,
    categories: selectedCategories.value,
    followerRange: followerRange.value,
    engagementRateMin: minEngagementRate.value,
    verifiedOnly: verifiedOnly.value,
    regions: selectedRegions.value
  };
  emit('filter-change', filterData);
}

// Reset all filters
function resetFilters() {
  selectedPlatforms.value = [];
  selectedCategories.value = [];
  followerRange.value = [0, 2000000];
  minEngagementRate.value = 0;
  verifiedOnly.value = false;
  selectedRegions.value = [];
  emitFilterChange();
}

</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 class="text-2xl font-semibold leading-none tracking-tight">Filters</h3>
      <p class="text-sm text-gray-500">Refine creator search results</p>
    </div>
    
    <div class="p-6 pt-0">

      <!-- Platform filter -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Platforms</h4>
        <div class="space-y-2">
          <label 
            v-for="platform in platforms" 
            :key="platform"
            class="flex items-center space-x-2"
          >
            <input 
              type="checkbox"
              :value="platform"
              v-model="selectedPlatforms"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ platform }}</span>
          </label>
        </div>
      </div>

      <!-- Followers range filter -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Followers Range</h4>
        <div class="px-2">
          <input 
            type="range" 
            v-model="followerRange[0]" 
            min="0" 
            max="2000000" 
            step="10000"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
          <input 
            type="range" 
            v-model="followerRange[1]" 
            min="0" 
            max="2000000" 
            step="10000"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
          <div class="flex justify-between mt-2">
            <span class="text-sm">0</span>
            <span class="text-sm">{{ formattedFollowerRange }}</span>
            <span class="text-sm">2M</span>
          </div>
        </div>
      </div>

      <!-- Engagement rate filter -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Min Engagement Rate</h4>
        <div class="px-2">
          <input 
            type="range" 
            v-model="minEngagementRate" 
            min="0" 
            max="15" 
            step="0.5"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
          <div class="flex justify-between mt-2">
            <span class="text-sm">0%</span>
            <span class="text-sm">{{ minEngagementRate }}%</span>
            <span class="text-sm">15%</span>
          </div>
        </div>
      </div>
      
      <!-- Verified filter -->
      <div class="mb-6">
        <label class="flex items-center space-x-2">
          <input 
            type="checkbox"
            v-model="verifiedOnly"
            class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
          >
          <span>Verified Creators Only</span>
        </label>
      </div>
      
      <!-- Regions filter -->
      <div class="mb-6">
        <h4 class="font-medium mb-2 flex justify-between">
          <span>Regions</span>
          <span class="text-xs text-gray-500">{{ selectedRegions.length }} selected</span>
        </h4>
        <div class="grid grid-cols-2 gap-2">
          <label 
            v-for="region in availableRegions" 
            :key="region"
            class="flex items-center space-x-2 text-sm"
          >
            <input 
              type="checkbox"
              :value="region"
              v-model="selectedRegions"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ region }}</span>
          </label>
        </div>
      </div>
      
      <!-- Content categories filter -->
      <div class="mb-6">
        <h4 class="font-medium mb-2 flex justify-between">
          <span>Content Categories</span>
          <span class="text-xs text-gray-500">{{ selectedCategories.length }} selected</span>
        </h4>
        <div class="grid grid-cols-2 gap-2">
          <label 
            v-for="category in categories" 
            :key="category"
            class="flex items-center space-x-2 text-sm"
          >
            <input 
              type="checkbox"
              :value="category"
              v-model="selectedCategories"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ category }}</span>
          </label>
        </div>
      </div>
    </div>
    
    <div class="flex items-center p-6 pt-0 justify-between">
      <button
        @click="resetFilters" 
        class="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
        Reset
      </button>
      <button 
        @click="emitFilterChange"
        class="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
        Apply Filters
      </button>
    </div>
  </div>
</template>
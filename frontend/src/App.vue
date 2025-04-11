<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

// Import components
import AppHeader from './components/AppHeader.vue';
import CreatorCard from './components/CreatorCard.vue';
import CreatorDetail from './components/CreatorDetail.vue';
import FilterSidebar from './components/FilterSidebar.vue';
import CampaignSettings from './components/CampaignSettings.vue';

// --- CONSTANTS ---
// State
const creators = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedCreator = ref(null);
const showCreatorDetail = ref(false);
const activeTab = ref('filters'); // 'filters' or 'campaign'
const filters = ref({
  platforms: [],
  categories: [],
  followerRange: [0, 2000000],
  engagementRateMin: 0,
  verifiedOnly: false,
  regions: []
});
const campaignSettings = ref({
  budget: [0, 1000],
  targetGenres: [],
  targetAgeGroups: [],
  targetGenders:[],
  campaignObjective: 'brand_awareness',
  duration: 30
});
const sortBy = ref('matchScore');
const sortDirection = ref('desc');
const matchResults = ref([]);

// Derived data
const availablePlatforms = computed(() => {
  const platforms = new Set();
  creators.value.forEach(creator => platforms.add(creator.platform));
  return Array.from(platforms);
});

const availableCategories = computed(() => {
  const categories = new Set();
  creators.value.forEach(creator => {
    creator.contentCategories.forEach(category => categories.add(category));
  });
  return Array.from(categories);
});

const filteredCreators = computed(() => {
  // Filtering is now handled by the backend API
  if (loading.value) return [];
  let result = [...creators.value];
  return result;
});

const sortedCreators = computed(() => {
  // Sort creators based on the selected sorting criteria
  return [...filteredCreators.value].sort((a, b) => {
    const aValue = a[sortBy.value];
    const bValue = b[sortBy.value];
    
    if (sortDirection.value === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });
});

// For narrow screen view (mobile)
const windowWidth = ref(window.innerWidth);
const showFilterDrawer = ref(false);

function updateWidth() {
  windowWidth.value = window.innerWidth;
  // Auto-hide drawer when resizing to wider viewport
  if (windowWidth.value >= 768) {
    showFilterDrawer.value = false;
  }
}

// --- METHODS ---
function setActiveTab(tab) {
  activeTab.value = tab;
}

async function calculateMatchScores() {
  try {
    const response = await fetch('http://localhost:3000/api/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignSettings.value),
    });

    if (!response.ok) throw new Error('Failed to calculate match scores');

    const data = await response.json();
    matchResults.value = data;
  } catch (error) {
    console.error('Error calculating match scores:', error);
  }
}

async function updateFilters(newFilters) {
  filters.value = { ...filters.value, ...newFilters };
  // Show loading state
  loading.value = true;
  try {
    // call the backend API with the filter parameters
    const response = await axios.get('http://localhost:3000/api/creators/filter', {
      params: {
    platforms: filters.value.platforms,
    categories: filters.value.categories,
    followerRange: filters.value.followerRange.join(','), // Convert to string like "1000,10000"
    engagementRateMin: filters.value.engagementRateMin,
    regions: filters.value.regions,
    verifiedOnly: filters.value.verifiedOnly ? 'true' : 'false'
  },
  paramsSerializer: params => {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
    return searchParams.toString();
  }
});
    creators.value = response.data;
    // If we have active campaign settings, calculate match scores for filtered creators
    if (Object.keys(campaignSettings.value).length > 0) {
      await calculateMatchScores();
    }
    console.log('New filters:', filters.value);
  } catch (error) {
    console.error('Error applying filters:', error);
  } finally {
    // Hide loading state
    loading.value = false;
  }
}

async function updateCampaignSettings(newSettings) {
  campaignSettings.value = { ...campaignSettings.value, ...newSettings };
  try {
    // Call the match API with the updated campaign settings
    const response = await axios.post('http://localhost:3000/api/match', campaignSettings.value);
    creators.value = response.data;
  } catch (error) {
    console.error('Error updating match scores:', error);
  }
}

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
}

function resetFilters() {
  filters.value = {
    platforms: [],
    categories: [],
    followerRange: [0, 2000000],
    engagementRateMin: 0,
    verifiedOnly: false,
    regions: []
  };
}

function openCreatorDetail(creator) {
  selectedCreator.value = creator;
  showCreatorDetail.value = true;
}

function closeCreatorDetail() {
  selectedCreator.value = null;
  showCreatorDetail.value = false;
}

// --- LIFECYCLE ---
// Narrow viewport
onMounted(() => {
  window.addEventListener('resize', updateWidth);
  updateWidth(); // Set initial value
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

onMounted(async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:3000/api/creators');
    creators.value = response.data;
    updateFilters();
    loading.value = false;
  } catch (err) {
    console.error('Error fetching creators:', err);
    error.value = 'Failed to load creators. Please refresh the page.';
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <AppHeader />
    
    <main class="flex-grow container mx-auto p-4">
      <!-- Creator detail modal -->
      <div v-if="showCreatorDetail && selectedCreator" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto p-2 sm:p-4">
        <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="p-4 border-b flex justify-between items-center">
            <h2 class="text-xl font-bold">Creator Details</h2>
            <button @click="closeCreatorDetail" class="text-2xl">&times;</button>
          </div>
          <div class="p-4">
            <CreatorDetail 
              :creator="selectedCreator" 
              :campaignSettings="campaignSettings"
            />
          </div>
        </div>
      </div>
      
      <!-- Narrow viewport filter button -->
      <div class="md:hidden mb-4 flex justify-between items-center">
        <h2 class="text-xl font-bold">Creators ({{ filteredCreators.length }})</h2>
        <div class="flex gap-2">
          <button 
            @click="showFilterDrawer = true" 
            class="px-3 py-2 bg-gray-800 text-white rounded-md"
          >
            Filters
          </button>
          <select 
            v-model="sortBy" 
            class="rounded-md border border-gray-300 px-2 py-2 text-sm"
          >
            <option value="matchScore">Match Score</option>
            <option value="followers">Followers</option>
            <option value="engagementRate">Engagement</option>
            <option value="hourlyRate">Hourly Rate</option>
          </select>
          <button 
            @click="toggleSortDirection" 
            class="px-2 py-2 bg-white border border-gray-300 rounded-md"
          >
            {{ sortDirection === 'desc' ? '↓' : '↑' }}
          </button>
        </div>
      </div>
      
      <!-- Narrow viewport filter drawer -->
      <div v-if="showFilterDrawer" class="fixed inset-0 z-50 md:hidden">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="showFilterDrawer = false"></div>
        <div class="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-lg p-4 overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Filters</h3>
            <button @click="showFilterDrawer = false" class="text-2xl">&times;</button>
          </div>
          
          <!-- Drawer tabs -->
          <div class="flex border-b border-gray-200 mb-4">
            <button 
              @click="setActiveTab('filters'); updateFilterDrawerContent();" 
              class="py-2 px-4 font-medium text-sm transition-colors duration-200 border-b-2 -mb-px"
              :class="activeTab === 'filters' 
                ? 'border-brand-purple text-brand-purple' 
                : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              Filters
            </button>
            <button 
              @click="setActiveTab('campaign'); updateFilterDrawerContent();" 
              class="py-2 px-4 font-medium text-sm transition-colors duration-200 border-b-2 -mb-px"
              :class="activeTab === 'campaign' 
                ? 'border-brand-purple text-brand-purple' 
                : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              Campaign Settings
            </button>
          </div>
          
          <!-- Drawer content -->
          <div v-show="activeTab === 'filters'">
            <FilterSidebar 
              :platforms="availablePlatforms"
              :categories="availableCategories"
              @filter-change="updateFilters"
            />
          </div>
          
          <div v-show="activeTab === 'campaign'">
            <CampaignSettings 
              :settings="campaignSettings"
              @settings-change="updateCampaignSettings; showFilterDrawer = false"
            />
          </div>
        </div>
      </div>
    
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Desktop sidebar (hidden on narrow screens) -->
        <div class="hidden md:block w-full md:w-1/4">
          <!-- Tab navigation -->
          <div class="flex border-b border-gray-200 mb-4">
            <button 
              @click="setActiveTab('filters')" 
              class="py-2 px-4 font-medium text-sm transition-colors duration-200 border-b-2 -mb-px"
              :class="activeTab === 'filters' 
                ? 'border-brand-purple text-brand-purple' 
                : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              Filters
            </button>
            <button 
              @click="setActiveTab('campaign')" 
              class="py-2 px-4 font-medium text-sm transition-colors duration-200 border-b-2 -mb-px"
              :class="activeTab === 'campaign' 
                ? 'border-brand-purple text-brand-purple' 
                : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              Campaign Settings
            </button>
          </div>
          
          <!-- Tab content -->
          <div v-show="activeTab === 'filters'">
            <FilterSidebar 
              :platforms="availablePlatforms"
              :categories="availableCategories"
              @filter-change="updateFilters"
            />
          </div>
          
          <div v-show="activeTab === 'campaign'">
            <CampaignSettings 
              :settings="campaignSettings"
              @settings-change="updateCampaignSettings"
            />
          </div>
        </div>
        
        <!-- Main content area -->
        <div class="w-full md:w-3/4">
          <!-- Desktop sorting controls (hidden on mobile) -->
          <div class="hidden md:flex mb-4 justify-between items-center">
            <h2 class="text-xl font-bold">Creators ({{ filteredCreators.length }})</h2>
            <div class="flex gap-2">
              <select 
                v-model="sortBy" 
                class="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="matchScore">Match Score</option>
                <option value="followers">Followers</option>
                <option value="engagementRate">Engagement</option>
                <option value="hourlyRate">Hourly Rate</option>
              </select>
              <button 
                @click="toggleSortDirection" 
                class="px-3 py-2 bg-white border border-gray-300 rounded-md"
              >
                {{ sortDirection === 'desc' ? '↓' : '↑' }}
              </button>
            </div>
          </div>
          
          <!-- Loading state -->
          <div v-if="loading" class="p-8 sm:p-12 text-center">
            <div class="animate-pulse">
              <div class="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="h-64 bg-gray-200 rounded" v-for="i in 6" :key="i"></div>
              </div>
            </div>
          </div>
          
          <!-- Error state -->
          <div v-else-if="error" class="text-center p-8 sm:p-12 border rounded-lg bg-white">
            <p class="text-red-500 text-lg mb-4">{{ error }}</p>
            <button 
              @click="fetchCreators" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
          
          <!-- Creator cards grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="creator in sortedCreators" 
              :key="creator.id"
              @click="openCreatorDetail(creator)"
              class="cursor-pointer transform hover:scale-102 transition-transform duration-200"
            >
              <CreatorCard :creator="creator" />
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="!loading && !error && sortedCreators.length === 0" class="text-center p-8 sm:p-12 border rounded-lg bg-white">
            <p class="text-lg text-gray-500">No creators match your filters</p>
            <button 
              @click="resetFilters" 
              class="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>Creator Match Dashboard</p>
    </footer>
  </div>
</template>

<style>
:root {
  --brand-purple: 104, 89, 234; /* #6859ea */
  --brand-teal: 34, 211, 238; /* #22d3ee */
}

/* Additional global styles */
.transform:hover {
  transition: all 0.2s ease-in-out;
}

.scale-102 {
  transform: scale(1.02);
}
</style>
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Import components
import AppHeader from './components/AppHeader.vue';
import CreatorCard from './components/CreatorCard.vue';
import FilterSidebar from './components/FilterSidebar.vue';
import CampaignSettings from './components/CampaignSettings.vue';

// State
const creators = ref([]);
const filters = ref({
  platforms: [],
  categories: [],
  followerRange: [0, 2000000],
});
const campaignSettings = ref({
  budget: [0, 1000],
  targetGenres: [],
  duration: 30
});
const sortBy = ref('matchScore');
const sortDirection = ref('desc');

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
  return creators.value;
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

// Methods
async function updateFilters(newFilters) {
  filters.value = { ...filters.value, ...newFilters };
  try {
    // Placeholder for the API call that would use these filters
    // In the completed project, the intern will implement this
    console.log('New filters:', filters.value);
  } catch (error) {
    console.error('Error applying filters:', error);
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
  };
}

// Lifecycle
onMounted(async () => {
  try {
    // Fetch creators from API
    const response = await axios.get('http://localhost:3000/api/creators');
    creators.value = response.data;
  } catch (error) {
    console.error('Error fetching creators:', error);
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    
    <main class="flex-grow container mx-auto p-4">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Sidebar with filters -->
        <div class="w-full md:w-1/4">
          <FilterSidebar 
            :platforms="availablePlatforms"
            :categories="availableCategories"
            @filter-change="updateFilters"
          />
          
          <div class="mt-6">
            <CampaignSettings @settings-change="updateCampaignSettings" />
          </div>
        </div>
        
        <!-- Main content area -->
        <div class="w-full md:w-3/4">
          <div class="mb-4 flex justify-between items-center">
            <h2 class="text-xl font-bold">Creators ({{ filteredCreators.length }})</h2>
            <div class="flex gap-2">
              <select v-model="sortBy" class="select w-40">
                <option value="matchScore">Match Score</option>
                <option value="followers">Followers</option>
                <option value="engagementRate">Engagement</option>
              </select>
              <button @click="toggleSortDirection" class="btn btn-outline">
                {{ sortDirection === 'desc' ? '↓' : '↑' }}
              </button>
            </div>
          </div>
          
          <!-- Creator cards grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CreatorCard 
              v-for="creator in sortedCreators" 
              :key="creator.id" 
              :creator="creator"
            />
          </div>
          
          <!-- Empty state -->
          <div v-if="sortedCreators.length === 0" class="text-center p-12 border rounded-lg">
            <p class="text-lg text-gray-500">No creators match your filters</p>
            <button @click="resetFilters" class="btn btn-secondary mt-4">Reset Filters</button>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>Creator Match Dashboard</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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

// This is now an empty component since the filtering UI will be implemented by the candidate
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 class="text-2xl font-semibold leading-none tracking-tight">Filters</h3>
      <p class="text-sm text-gray-500">Create your filter UI here</p>
    </div>
    
    <div class="p-6 pt-0">
      <!-- Filter UI will be implemented by the candidate -->
      <p class="text-gray-500 italic">Implement filter controls for platforms, followers, categories, etc.</p>
    </div>
    
    <div class="flex items-center p-6 pt-0 justify-between">
      <button 
        class="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
        Reset
      </button>
      <button 
        class="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
        Apply Filters
      </button>
    </div>
  </div>
</template>
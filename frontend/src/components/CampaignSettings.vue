<script setup>
import { ref } from 'vue';

const emit = defineEmits(['settings-change']);

const budgetMin = ref(100);
const budgetMax = ref(500);
const selectedGenres = ref([]);
const targetAgeGroups = ref([]);
const targetGenders = ref([]);
const campaignObjective = ref('brand_awareness');

const gameGenres = [
  'FPS',
  'MOBA',
  'Battle Royale',
  'RPG',
  'Strategy',
  'Platformer',
  'Simulation',
  'Open World',
  'Indie',
  'Mobile'
];

const ageGroups = [
  '18-24',
  '25-34',
  '35+'
];

const genders = [
  'male',
  'female',
  'other'
];

const objectives = [
  { value: 'brand_awareness', label: 'Brand Awareness' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'community_engagement', label: 'Community Engagement' },
  { value: 'conversion', label: 'Conversions & Sales' }
];

function applySettings() {
  emit('settings-change', {
    budget: [budgetMin.value, budgetMax.value],
    targetGenres: selectedGenres.value,
    targetAgeGroups: targetAgeGroups.value,
    targetGenders: targetGenders.value,
    campaignObjective: campaignObjective.value
  });
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 class="text-2xl font-semibold leading-none tracking-tight">Campaign Settings</h3>
      <p class="text-sm text-gray-500">Configure your campaign parameters</p>
    </div>
    
    <div class="p-6 pt-0">
      <!-- Campaign objective -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Campaign Objective</h4>
        <select 
          v-model="campaignObjective"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
        >
          <option 
            v-for="objective in objectives" 
            :key="objective.value"
            :value="objective.value"
          >
            {{ objective.label }}
          </option>
        </select>
      </div>
      
      <!-- Budget range settings -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Budget per Creator ($/hour)</h4>
        <div class="px-2">
          <div class="flex gap-4 mb-2">
            <div class="flex-1">
              <label class="text-sm">Min</label>
              <input 
                type="number" 
                v-model.number="budgetMin"
                min="0"
                max="1000"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
              >
            </div>
            <div class="flex-1">
              <label class="text-sm">Max</label>
              <input 
                type="number" 
                v-model.number="budgetMax"
                min="0"
                max="1000"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
              >
            </div>
          </div>
        </div>
      </div>
      
      <!-- Target audience age -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Age Groups</h4>
        <div class="space-y-2">
          <label 
            v-for="age in ageGroups" 
            :key="age"
            class="flex items-center space-x-2"
          >
            <input 
              type="checkbox"
              :value="age"
              v-model="targetAgeGroups"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ age }}</span>
          </label>
        </div>
      </div>
      
      <!-- Target audience gender -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Gender</h4>
        <div class="space-y-2">
          <label 
            v-for="gender in genders" 
            :key="gender"
            class="flex items-center space-x-2 capitalize"
          >
            <input 
              type="checkbox"
              :value="gender"
              v-model="targetGenders"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ gender }}</span>
          </label>
        </div>
      </div>
      
      <!-- Target game genres -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Game Genres</h4>
        <div class="space-y-2">
          <label 
            v-for="genre in gameGenres" 
            :key="genre"
            class="flex items-center space-x-2"
          >
            <input 
              type="checkbox"
              :value="genre"
              v-model="selectedGenres"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ genre }}</span>
          </label>
        </div>
      </div>
    </div>
    
    <div class="flex items-center p-6 pt-0 justify-end">
      <button 
        @click="applySettings" 
        class="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
        Update Match Scores
      </button>
    </div>
  </div>
</template>
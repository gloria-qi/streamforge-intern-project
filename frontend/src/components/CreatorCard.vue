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

</script>

<template>
  <div class="border rounded-lg shadow bg-white">
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
    <div class="p-4">
      <h3>{{ creator.username }}</h3>
      <p>This is a placeholder. You need to implement the creator card UI!</p>
    </div>
  </div>
</template>
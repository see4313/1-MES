<!-- card-header.vue -->
<script setup>
const props = defineProps({
  title: String,
});
const emit = defineEmits(['btn-click']);
</script>

<template>
  <div class="d-sm-flex align-center justify-space-between py-1 px-1">
    <v-card-title class="text-h5 mb-0">{{ title }}</v-card-title>
  </div>
  <v-divider class="my-2"></v-divider>
</template>
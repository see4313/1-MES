<!-- card-header.vue -->
<script setup>
const props = defineProps({

});

</script>

<template>
  <v-card elevation="10">
    <v-card-item class="py-6 px-6">
      <slot name="content"></slot>
    </v-card-item>
  </v-card>
</template>

<!-- card-header.vue -->
<script setup>
const props = defineProps({
  title: String,
  btnIcon: { type: String, default: undefined },
  btnText: { type: String, default: '버튼 내용 바꾸세요' },
  btnColor: { type: String, default: undefined },
  btnVariant: { type: String, default: undefined }, // e.g. 'outlined', 'tonal', 'flat'
});
const emit = defineEmits(['btn-click']);
</script>

<template>
  <div class="d-sm-flex align-center justify-space-between py-1 px-1">
    <v-card-title class="text-h5 mb-0">{{ title }}</v-card-title>
    <v-btn
      :append-icon="btnIcon"
      :color="btnColor"
      :variant="btnVariant"
      @click="emit('btn-click')"
    >
      {{ btnText }}
    </v-btn>
  </div>
  <v-divider class="my-2"></v-divider>
</template>
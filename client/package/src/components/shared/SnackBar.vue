<script setup>
import { useSnackBar } from '@/composables/useSnackBar.js'

const { snackOpen, snackMessage, snackColor } = useSnackBar()
</script>

<template>
  <v-snackbar
    v-model="snackOpen"
    :color="snackColor"
    timeout="2000"
    location="top right"
    rounded="pill"
  >
    <div class="d-flex justify-space-between align-center" style="width: 100%;">
      <span>{{ snackMessage }}</span>
      <v-btn
        variant="text"
        size="small"
        @click="snackOpen = false"
      >
        닫기
      </v-btn>
    </div>
  </v-snackbar>
</template>

// useSnackBar.js
import { ref } from 'vue'

const snackOpen = ref(false)
const snackMessage = ref('')
const snackColor = ref('success')

function snackBar(message, color = 'success') {
  snackMessage.value = message
  snackColor.value = color
  snackOpen.value = true
}

export function useSnackBar() {
  return {
    snackOpen,
    snackMessage,
    snackColor,
    snackBar
  }
}

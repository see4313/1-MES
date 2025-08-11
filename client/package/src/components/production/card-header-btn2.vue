<!-- card-header.vue -->
<script setup>
const props = defineProps({
    title: String,
    btnIcon1: { type: String, default: undefined },
    btnText1: { type: String, default: '버튼1 내용 바꾸세요' },
    btnColor1: { type: String, default: undefined },
    btnVariant1: { type: String, default: undefined }, // e.g. 'outlined', 'tonal', 'flat'
    btnIcon2: { type: String, default: undefined },
    btnText2: { type: String, default: '버튼2 내용 바꾸세요' },
    btnColor2: { type: String, default: undefined },
    btnVariant2: { type: String, default: undefined } // e.g. 'outlined', 'tonal', 'flat'
});
const emit = defineEmits(['btn-click1', 'btn-click2']);
</script>

<template>
    <div class="d-sm-flex align-center justify-space-between py-1 px-1">
        <v-card-title class="text-h5 mb-0">{{ title }}</v-card-title>
        <div>
            <v-btn class="me-2" :append-icon="btnIcon1" :color="btnColor1" :variant="btnVariant1" @click="emit('btn-click1')">
                {{ btnText1 }}
            </v-btn>
            <v-btn :append-icon="btnIcon2" :color="btnColor2" :variant="btnVariant2" @click="emit('btn-click2')">
                {{ btnText2 }}
            </v-btn>
        </div>
    </div>
    <v-divider class="my-2"></v-divider>
</template>

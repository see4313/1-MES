<!-- card-header-btn3.vue -->
<script setup>
const props = defineProps({
    title: String,
    // 버튼1
    btnIcon1: { type: String, default: undefined },
    btnText1: { type: String, default: '버튼1' },
    btnColor1: { type: String, default: undefined },
    btnVariant1: { type: String, default: undefined },
    btnDisabled1: {
        type: Boolean,
        default: false
    },
    // 버튼2
    btnIcon2: { type: String, default: undefined },
    btnText2: { type: String, default: '버튼2' },
    btnColor2: { type: String, default: undefined },
    btnVariant2: { type: String, default: undefined },
    btnDisabled2: {
        type: Boolean,
        default: false
    },
    // 버튼3
    btnIcon3: { type: String, default: undefined },
    btnText3: { type: String, default: '버튼3' },
    btnColor3: { type: String, default: undefined },
    btnVariant3: { type: String, default: undefined },
    btnDisabled3: {
        // 삭제 버튼 disabled prop 추가
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['btn-click1', 'btn-click2', 'btn-click3']);
</script>

<template>
    <div class="d-sm-flex align-center justify-space-between py-1 px-1">
        <v-card-title class="text-h5 mb-0">{{ title }}</v-card-title>
        <div>
            <!-- 버튼 1 -->
            <v-btn
                class="me-2"
                :append-icon="btnIcon1"
                :color="btnColor1"
                :variant="btnVariant1"
                :disabled="btnDisabled1"
                @click="emit('btn-click1')"
            >
                {{ btnText1 }}
            </v-btn>

            <!-- 버튼 2 -->
            <v-btn
                class="me-2"
                :append-icon="btnIcon2"
                :color="btnColor2"
                :variant="btnVariant2"
                :disabled="btnDisabled2"
                @click="emit('btn-click2')"
            >
                {{ btnText2 }}
            </v-btn>

            <!-- 버튼 3 -->
            <v-btn
                class="me-3"
                :append-icon="btnIcon3"
                :color="btnColor3"
                :variant="btnVariant3"
                :disabled="btnDisabled3"
                @click="emit('btn-click3')"
            >
                {{ btnText3 }}
            </v-btn>
        </div>
    </div>
    <v-divider class="my-2"></v-divider>
</template>

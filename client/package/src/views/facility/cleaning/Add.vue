<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="사원조회">
                <h3>세척이력 등록</h3>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="설비명" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="세척 항목" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="joinMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="joinDate"
                                    label="세척 일자"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedJoinDate"
                                />
                            </template>
                            <v-date-picker v-model="joinDate" @change="joinMenu = false" />
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="담당자" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="세척방법" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="세척결과/비고" />
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
// 향후 API 호출 등 로직 추가
</script>

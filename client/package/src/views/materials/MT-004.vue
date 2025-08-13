<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader1 title="발주 상세" btn-text="입고" btn-variant="flat" btn-color="primary" @btn-click="addRow()" />
            <v-col cols="12" md="8">
                <v-row justify="space-between" dense>
                    <v-col cols="12" sm="5">
                        <v-text-field label="발주번호" v-model="selectVendName" variant="outlined" readonly>
                            <template #append-inner>
                                <v-icon @click="vendModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-col>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader title="입고 등록" />
        </v-card-item>
    </v-card>
</template>

<script setup>
import CardHeader from '@/components/production/card-header.vue';
import CardHeader1 from '@/components/production/card-header-btn.vue';
</script>

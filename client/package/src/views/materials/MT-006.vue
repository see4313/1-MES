<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader title="반품 대상" btn-text="확정" btn-variant="flat" btn-color="primary" @btn-click="" />
            <v-row>
                <v-col cols="12" md="12">
                    <DataTable :value="inventoryList" paginator :rows="10" tableStyle="min-width: 50rem">
                        <Column field="lot_id" sortable header="LOT번호"></Column>
                        <Column field="item_id" sortable header="품목번호"></Column>
                        <Column field="item_name" header="품목명"></Column>
                        <Column field="wh_name" header="위치"></Column>
                        <Column field="vald_date" sortable header="유효기한"></Column>
                        <Column field="spec" header="규격"></Column>
                        <Column field="bnt" sortable header="수량"></Column>
                    </DataTable>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader title="반품 관리" btn-text="확정" btn-variant="flat" btn-color="primary" @btn-click="" />
            <v-row>
                <v-col cols="12" md="12"> </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>

<script setup>
import CardHeader from '@/components/production/card-header-btn.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const inventoryList = ref(); // 조회 목록

onMounted(() => {
    select();
    console.log(inventoryList.value);
});

// 조회
const select = async () => {
    try {
        const params = {
            status: '반품대기'
        };

        const response = await axios.get('/api/inventoryList', { params });
        inventoryList.value = response.data;
    } catch (error) {
        console.error('조회 실패', error);
    }
};
</script>

<!-- 제품조회 -->
<template>
    <v-row>
        <v-card elevation="10">
            <v-card-item class="py-6 px-6">
                <CardHeader title="제품 조회" btn-text="조회" btn-variant="flat" btn-color="primary" @btn-click="Select()" />
            </v-card-item>
            <v-row no-gutters>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-text-field variant="outlined" label="제품코드 검색" v-model="selectedItem">
                            <template #append-inner>
                                <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-sheet>
                </v-col>
            </v-row>

            <DataTable :value="productList" tableStyle="min-width: 50rem" @row-click="onRowClick" class="cursor-pointer">
                <Column field="lot_id" header="LOT"></Column>
                <Column field="item_id" header="제품 코드"></Column>
                <Column field="item_name" header="완제품명"></Column>
                <Column field="crea_date" header="입고 일자">
                    <Column field="item_type" header="제품유형"></Column>
                    <template #body="{ data }">
                        {{ dayjs(data.ordr_date).format('YYYY-MM-DD') }}
                    </template></Column
                >
                <Column field="wh_id" header="창고코드"></Column>
                <Column field="safe_qty" header="안전재고량"></Column>
                <Column field="bnt" header="현수량"></Column>
                <Column field="psafe" header="안전대비 보유율"></Column>
            </DataTable>
        </v-card>
    </v-row>

    <!-- 제품 코드모달 -->
    <ModalSearch
        :visible="showModal"
        title="제품코드"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '제품코드' },
            { key: 'item_type', label: '제품유형' },
            { key: 'item_name', label: '제품명' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal = false"
    />
    <SnackBar />
</template>

<script setup>
import CardHeader from '@/components/production/card-header-btn.vue';
import Column from 'primevue/column';
import ModalSearch from '@/views/commons/CommonModal.vue';
import DataTable from 'primevue/datatable';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

onMounted(() => {});

const { snackBar } = useSnackBar();
const showModal = ref(false); //  주문코드 모달
const selectedItem = ref(null);

const productList = ref(); // 제품목록

// 제품전체조회
const Select = async () => {
    try {
        const params = {
            item_id: selectedItem.value
        };
        const response = await axios.get('/api/productList', { params });
        productList.value = response.data;
    } catch (error) {
        snackBar('조회 실패.', 'error');
    }
};

// 모달조회
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/itemModal1');
        return response.data;
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItem = (item) => {
    selectedItem.value = item.item_id;
};
</script>

<!--완제품 입고처리-->
<template>
    <v-row>
        <v-card elevation="10">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="입고 관리"
                    btn-text1="조회"
                    btn-variant1="flat"
                    btn-color1="primary"
                    @btn-click1="Select()"
                    btn-text2="입고"
                    btn-variant2="flat"
                    btn-color2="warning"
                    @btn-click2="productInsert()"
                />
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

            <DataTable
                :value="insertList"
                tableStyle="min-width: 50rem"
                v-model:selection="selectedProducts"
                class="cursor-pointer"
                paginator
                :rows="5"
            >
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="item_id" header="제품코드"></Column>
                <Column field="item_name" header="제품명"></Column>
                <Column field="item_type" header="제품유형"></Column>
                <Column field="exam_qty" header="수량"></Column>
                <Column header="입고가능수량">
                    <template #body="{ data }">
                        {{ remainQty(data) }}
                    </template>
                </Column>
                <Column header="입고수량" style="width: 120px">
                    <template #body="{ data }">
                        <v-text-field type="number" dense hide-details style="width: 100px" variant="outlined" min="0" v-model="data.qty" />
                    </template>
                </Column>
                <Column header="비고" style="width: 110px">
                    <template #body="{ data }">
                        <v-text-field type="text" dense hide-details style="width: 120px" variant="outlined" min="0" v-model="data.remk" />
                    </template>
                </Column>
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
import CardHeader from '@/components/production/card-header-btn2.vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

onMounted(() => {});

const { snackBar } = useSnackBar();
const showModal = ref(false); // 제품코드모달
const selectedItem = ref(null); // 제품코드선택
const selectedProducts = ref(null);
const insertList = ref([]);

const remainQty = (row) => {
    return row.exam_qty - row.total_qty;
};

// 입고가능수량이 0보다 큰 데이터만 표시
// const filteredList = computed(() => {
//     return insertList.value.filter((row) => remainQty(row) > 0);
// });

// 완제품 입고 목록
const Select = async () => {
    try {
        const params = {
            item_id: selectedItem.value
        };
        const response = await axios.get('/api/insertList', { params });
        insertList.value = response.data;
    } catch (error) {
        snackBar('조회 실패.', 'error');
    }
};

// 제품모달조회
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/itemModal1');
        return response.data;
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

// 입고처리
const productInsert = async () => {
    if (!selectedProducts.value || selectedProducts.value.length === 0) {
        snackBar('입고할 제품을 선택해주세요.', 'warning');
        return;
    }

    for (let item of selectedProducts.value) {
        const availableQty = remainQty(item);
        if (!item.qty || item.qty <= 0) {
            snackBar(`입고수량은 0보다 커야 합니다.`, 'warning');
            return;
        }
        if (item.qty > availableQty) {
            snackBar(`입고수량이 입고가능수량(${availableQty})보다 많습니다.`, 'error');
            return;
        }
    }

    if (!confirm('입고하시겠습니까?')) return;
    try {
        let payload = selectedProducts.value.map((item) => ({
            item_id: item.item_id,
            qty: item.qty,
            remk: item.remk,
            exam_id: item.exam_id
        }));
        const response = await axios.post('/api/productInsert', payload);

        if (response.data.result) {
            snackBar('입고 완료', 'success');
            selectedProducts.value = null;
            Select();
        } else {
            snackBar('등록 실패.', 'error');
        }
    } catch (err) {
        console.log(err);
        snackBar('에러', 'error');
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItem = (item) => {
    selectedItem.value = item.item_id;
};
</script>

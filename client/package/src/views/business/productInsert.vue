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
                    btn-color2="error"
                    @btn-click2=""
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
                @row-click="onRowClick"
                class="cursor-pointer"
            >
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="item_id" header="제품코드"></Column>
                <Column field="item_name" header="제품명"></Column>
                <Column field="item_type" header="제품유형"></Column>
                <Column field="pass_qty" header="수량"></Column>
                <Column header="입고수량" style="width: 120px">
                    <template #body="slotProps">
                        <v-text-field type="number" dense hide-details style="width: 100px" variant="outlined" min="0" />
                    </template>
                </Column>
                <Column header="비고" style="width: 110px">
                    <template #body="slotProps">
                        <v-text-field type="text" dense hide-details style="width: 120px" variant="outlined" min="0" />
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
</template>
<script setup>
import CardHeader from '@/components/production/card-header-btn2.vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import { ProductService } from '@/service/ProductService';
import dayjs from 'dayjs';
import axios from 'axios';

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const showModal = ref(false); // 제품코드모달
const selectedItem = ref(null); // 제품코드선택
const selectedProducts = ref([]);
const insertList = ref();

// 완제품 입고 목록
const Select = async () => {
    try {
        const params = {
            item_id: selectedItem.value
        };
        const response = await axios.get('/api/insertList', { params });
        insertList.value = response.data;
    } catch (error) {
        console.log('조회실패', error);
    }
};

// 제품모달조회
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/itemModal1');
        return response.data;
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItem = (item) => {
    selectedItem.value = item.item_id;
};
</script>

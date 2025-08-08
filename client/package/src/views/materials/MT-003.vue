<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader title="재고 조회" btn-text="조회" btn-variant="flat" btn-color="primary" @btn-click="planLoad" />
            <v-row>
                <v-col cols="12" md="12">
                    <v-row justify="space-between">
                        <v-col cols="12" sm="2">
                            <v-text-field label="품목 번호" v-model="selectedItem" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-text-field label="LOT 번호" v-model="selectedItem2" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal2 = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-text-field label="품목 구분" v-model="selectedItem3" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-text-field label="보관 조건" v-model="selectedItem3" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-text-field label="창고 코드" v-model="selectedItem3" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div class="card">
                        <DataTable :value="products" tableStyle="min-width: 50rem">
                            <Column field="code" header="Code"></Column>
                            <Column field="name" header="Name"></Column>
                            <Column field="category" header="Category"></Column>
                            <Column field="quantity" header="Quantity"></Column>
                        </DataTable>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
    <!-- 사원 모달 -->
    <ModalSearch
        :visible="showModal"
        title="사원 검색"
        idField="emp_id"
        :columns="[
            { key: 'emp_id', label: '사원번호' },
            { key: 'emp_name', label: '사원명' },
            { key: 'status', label: '상태' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal = false"
    />

    <!-- 주문 모달 -->
    <ModalSearch
        :visible="showModal2"
        title="주문 검색"
        idField="order_id"
        :columns="[
            { key: 'order_id', label: '주문번호' },
            { key: 'vend_id', label: '거래처번호' },
            { key: 'ordr', label: '주문명' }
        ]"
        :fetchData="fetchItems2"
        :pageSize="5"
        @select="onSelectItem2"
        @close="showModal2 = false"
    />
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import { ProductService } from '@/service/ProductService';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader from '@/components/production/card-header-btn.vue';

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const products = ref();

const showModal = ref(false);
const showModal2 = ref(false);
const selectedItem = ref(null);
const selectedItem2 = ref(null);
const selectedItem3 = ref(null);

// DB에서 리스트 가져오기
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/boards');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItems2 = async () => {
    try {
        const response = await axios.get('/api/orderList');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 선택한 값 처리
const onSelectItem = (item) => {
    selectedItem.value = item.emp_name;
};

const onSelectItem2 = (item) => {
    selectedItem2.value = item.order_id;
};
</script>

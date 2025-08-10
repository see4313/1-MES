<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader title="재고 조회" btn-text="조회" btn-variant="flat" btn-color="primary" @btn-click="select()" />
            <v-row>
                <v-col cols="12" md="12">
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="4">
                            <v-text-field label="품목 번호" v-model="selectedItem" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="LOT 번호" v-model="selectedItem2" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal2 = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="품목 구분" v-model="selectedItem3" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal3 = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="보관 조건" v-model="selectedItem4" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal4 = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="창고 코드" v-model="selectedItem5" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal5 = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-menu
                                v-model="expMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-bind="props"
                                        v-model="expDate"
                                        label="유효기간"
                                        append-inner-icon="mdi-calendar"
                                        readonly
                                        variant="outlined"
                                        :model-value="formattedexpDate"
                                    />
                                </template>
                                <v-date-picker v-model="expDate" @update:model-value="expMenu = false" />
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div class="card">
                        <DataTable :value="inventoryList" tableStyle="min-width: 50rem">
                            <Column field="lot_id" header="LOT번호"></Column>
                            <Column field="item_id" header="품목번호"></Column>
                            <Column field="wh_id" header="창고번호"></Column>
                            <Column field="crea_date" header="생성일"></Column>
                            <Column field="vald_date" header="종료일"></Column>
                            <Column field="bnt" header="잔량"></Column>
                            <Column field="status" header="상태"></Column>
                        </DataTable>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 품목번호 모달 -->
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

    <!-- LOT번호 모달 -->
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

    <!-- 품목구분 모달 -->
    <ModalSearch
        :visible="showModal3"
        title="주문 검색"
        idField="order_id"
        :columns="[
            { key: 'order_id', label: '주문번호' },
            { key: 'vend_id', label: '거래처번호' },
            { key: 'ordr', label: '주문명' }
        ]"
        :fetchData="fetchItems3"
        :pageSize="5"
        @select="onSelectItem3"
        @close="showModal3 = false"
    />

    <!-- 보관조건 모달 -->
    <ModalSearch
        :visible="showModal4"
        title="주문 검색"
        idField="order_id"
        :columns="[
            { key: 'order_id', label: '주문번호' },
            { key: 'vend_id', label: '거래처번호' },
            { key: 'ordr', label: '주문명' }
        ]"
        :fetchData="fetchItems4"
        :pageSize="5"
        @select="onSelectItem4"
        @close="showModal4 = false"
    />

    <!-- 창고코드 모달 -->
    <ModalSearch
        :visible="showModal5"
        title="주문 검색"
        idField="order_id"
        :columns="[
            { key: 'order_id', label: '주문번호' },
            { key: 'vend_id', label: '거래처번호' },
            { key: 'ordr', label: '주문명' }
        ]"
        :fetchData="fetchItems5"
        :pageSize="5"
        @select="onSelectItem5"
        @close="showModal5 = false"
    />
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader from '@/components/production/card-header-btn.vue';
import dayjs from 'dayjs';

onMounted(() => {});

const inventoryList = ref(); // 조회 목록
const showModal = ref(false); // 품목번호 모달
const showModal2 = ref(false); // LOT번호 모달
const showModal3 = ref(false); // 품목구분 모달
const showModal4 = ref(false); // 보관조건 모달
const showModal5 = ref(false); // 창고코드 모달
const selectedItem = ref(null); // 품목번호 선택
const selectedItem2 = ref(null); // LOT번호 선택
const selectedItem3 = ref(null); // 품목구분 선택
const selectedItem4 = ref(null); // 보관조건 선택
const selectedItem5 = ref(null); // 창고코드 선택
const expMenu = ref(false); // 유효기간
const expDate = ref(null); // 유효기간

const formattedexpDate = computed(() => {
    return expDate.value ? dayjs(expDate.value).format('YYYY-MM-DD') : '';
});

// 조회
const select = async () => {
    try {
        const params = {
            item_id: selectedItem.value,
            lot_id: selectedItem2.value,
            type: selectedItem3.value,
            storage: selectedItem4.value,
            wh_id: selectedItem5.value,
            exp_date: formattedexpDate.value
        };

        const response = await axios.get('/api/inventoryList', { params });
        inventoryList.value = response.data;
    } catch (error) {
        console.error('조회 실패', error);
    }
};

// 모달조회 fetchItems
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

const fetchItems3 = async () => {
    try {
        const response = await axios.get('/api/orderList');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItems4 = async () => {
    try {
        const response = await axios.get('/api/orderList');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItems5 = async () => {
    try {
        const response = await axios.get('/api/orderList');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItem = (item) => {
    selectedItem.value = item.emp_name; // 품목번호
};

const onSelectItem2 = (item) => {
    selectedItem2.value = item.order_id; // LOT번호
};

const onSelectItem3 = (item) => {
    selectedItem3.value = item; // 품목구분
};

const onSelectItem4 = (item) => {
    selectedItem4.value = item; // 보관조건
};

const onSelectItem5 = (item) => {
    selectedItem5.value = item; // 창고코드
};
</script>

<!-- 주문목록 -->
<template>
    <v-row>
        <v-card elevation="10">
            <v-card-item class="py-6 px-6">
                <CardHeader title="주문 조회" btn-text="조회" btn-variant="flat" btn-color="primary" @btn-click="Select()" />
            </v-card-item>

            <v-row no-gutters>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-text-field variant="outlined" label="담당자 검색" v-model="selectemp" readonly>
                            <template #append-inner>
                                <v-icon @click="showModal1 = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-text-field variant="outlined" label="주문 검색" v-model="selectorder" readonly>
                            <template #append-inner>
                                <v-icon @click="showModal2 = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-menu v-model="leavMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="leavDate"
                                    label="주문일자"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedLeavDate"
                                />
                            </template>
                            <v-date-picker v-model="leavDate" @update:model-value="leavMenu = false" />
                        </v-menu>
                    </v-sheet>
                </v-col>
            </v-row>
            <DataTable :value="orderList" tableStyle="min-width: 50rem" @row-click="onRowClick" class="cursor-pointer">
                <Column field="order_id" header="주문코드"></Column>
                <Column field="ordr" header="주문명"></Column>
                <Column field="ordr_date" header="주문일자"></Column>
                <Column field="emp_name" header="담당자"></Column>
                <Column field="vend_name" header="업체명"></Column>
                <Column field="st" header="상태"></Column>
                <Column field="remk" header="비고"></Column>
            </DataTable>
        </v-card>

        <v-card elevation="10" class="mt-10">
            <div class="d-sm-flex align-center justify-space-between">
                <v-card-title class="text-h5 mb-0">상세 주문조회</v-card-title>
            </div>

            <DataTable :value="detailOrder" tableStyle="min-width: 50rem">
                <Column field="detail_id" header="주문상세코드"></Column>
                <Column field="order_id" header="주문코드"></Column>
                <Column field="item_id" header="제품코드"></Column>
                <Column field="qty" header="수량"></Column>
                <Column field="amt" header="금액"></Column>
                <Column field="tamt" header="총금액"></Column>
            </DataTable>
        </v-card>
    </v-row>

    <!-- 담당자 모달-->
    <ModalSearch
        :visible="showModal1"
        title="담당자 검색"
        idField="emp_id"
        :columns="[
            { key: 'emp_id', label: '사원번호' },
            { key: 'emp_name', label: '사원명' },
            { key: 'dept_id', label: '부서' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal1 = false"
    />
    <!-- 주문 모달 -->
    <ModalSearch
        :visible="showModal2"
        title="주문 검색"
        idField="order_id"
        :columns="[
            { key: 'order_id', label: '주문번호' },
            { key: 'vend_name', label: '업체명' },
            { key: 'emp_name', label: '담당자' },
            { key: 'ordr_date', label: '주문일자' }
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
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader from '@/components/production/card-header-btn.vue';
import dayjs from 'dayjs';

onMounted(() => {});

const orderList = ref(); // 조회목록
const detailOrder = ref(); // 조회목록
const showModal1 = ref(false); // 담당자모달
const showModal2 = ref(false); // 주문모달
const selectemp = ref(null); // 담당자 선택
const selectorder = ref(null); // 주문선택
const joinDate = ref(null);
const leavMenu = ref(false);
const leavDate = ref(null);

const formattedLeavDate = computed(() => {
    return leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : '';
});

// 조회
const Select = async () => {
    try {
        const params = {
            emp_id: selectemp.value,
            order_id: selectorder.value,
            ordr_date: formattedLeavDate.value
        };
        const response = await axios.get('/api/orderList', { params });
        orderList.value = response.data;
    } catch (error) {
        console.error('조회 실패', error);
    }
};

// 상세주문 조회
const onRowClick = async (event) => {
    try {
        const response = await axios.get('/api/detailOrder', {
            params: { order_id: event.data.order_id }
        });
        detailOrder.value = response.data;
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 모달조회
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/empModal');
        return response.data;
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItems2 = async () => {
    try {
        const response = await axios.get('/api/orderModal');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItem = (item) => {
    selectemp.value = item.emp_id;
};

const onSelectItem2 = (item) => {
    selectorder.value = item.order_id;
};
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

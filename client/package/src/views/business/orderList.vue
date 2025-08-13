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
            <DataTable
                v-model:selection="selectOrder"
                :value="orderList"
                tableStyle="min-width: 50rem"
                @row-click="onRowClick"
                class="cursor-pointer"
                selectionMode="single"
                :metaKeySelection="false"
                dataKey="order_id"
                paginator
                :rows="5"
            >
                <Column field="order_id" header="주문코드"></Column>
                <Column field="ordr" header="주문명"></Column>
                <Column field="ordr_date" header="주문일자">
                    <template #body="{ data }">
                        {{ dayjs(data.ordr_date).format('YYYY-MM-DD') }}
                    </template></Column
                >
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

            <DataTable :value="detailOrder" tableStyle="min-width: 50rem" paginator :rows="5">
                <Column field="detail_id" header="주문상세코드"></Column>
                <Column field="order_id" header="주문코드"></Column>
                <Column field="item_id" header="제품코드"></Column>
                <Column field="qty" header="수량"></Column>
                <Column field="spec" header="규격"></Column>
                <Column field="unit" header="단위"></Column>
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

const selectOrder = ref(null); // 선택된 행
const orderList = ref(); // 조회목록
const detailOrder = ref(); // 조회목록
const showModal1 = ref(false); // 담당자모달
const selectemp = ref(null); // 담당자 선택
const selectempId = ref(null);
const selectorder = ref(null); // 주문선택
const leavMenu = ref(false);
const leavDate = ref(null);

const formattedLeavDate = computed(() => {
    return leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : '';
});

// 조회
const Select = async () => {
    try {
        const params = {
            emp_id: selectempId.value,
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

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItem = (item) => {
    selectemp.value = item.emp_name;
    selectempId.value = item.emp_id;
};
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

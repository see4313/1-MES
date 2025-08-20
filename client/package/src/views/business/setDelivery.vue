<!-- 출고관리 -->
<template>
    <v-row>
        <v-card elevation="10">
            <v-card-item class="py-6 px-6">
                <CardHeader2
                    title="출고관리 목록"
                    btn-text1="조회"
                    btn-variant1="flat"
                    btn-color1="primary"
                    @btn-click1="Select()"
                    btn-text2="출고"
                    btn-variant2="flat"
                    btn-color2="primary"
                    @btn-click2="delUpdate()"
                />
            </v-card-item>
            <v-row no-gutters>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-text-field variant="outlined" label="주문코드" v-model="selectedItem" readonly>
                            <template #append-inner>
                                <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-text-field variant="outlined" label="업체명" v-model="selectedItem3" readonly>
                            <template #append-inner>
                                <v-icon @click="showModal3 = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-sheet>
                </v-col>
            </v-row>

            <DataTable
                :value="setDelivery"
                tableStyle="min-width: 50rem"
                class="cursor-pointer"
                v-model:selection="setorderId"
                selectionMode="single"
                :metaKeySelection="false"
                dataKey="item_id"
            >
                <Column field="detail_id" header="주문상세코드"></Column>
                <Column field="item_id" header="제품 코드"></Column>
                <Column field="item_name" header="제품명"></Column>
                <Column field="oust_date" header="출고일자">
                    <template #body="{ data }">
                        {{ dayjs(data.ordr_date).format('YYYY-MM-DD') }}
                    </template></Column
                >
                <Column field="vend_name" header="업체명"></Column>
                <Column field="" header="기납기량"></Column>
                <Column field="" header="미납기량"></Column>
            </DataTable>
        </v-card>

        <v-card elevation="10">
            <v-card-item class="py-6 px-6">
                <CardHeader title="출고 관리" />
            </v-card-item>

            <DataTable
                :value="deliveryList"
                tableStyle="min-width: 50rem"
                v-model:selection="selectItemList"
                selectionMode="multiple"
                dataKey="lot_id"
            >
                <Column selectionMode="multiple" headerStyle="width: 3em" />
                <Column field="lot_id" header="LOT번호"></Column>
                <Column field="item_id" header="제품코드"></Column>
                <Column field="item_name" header="제품명"></Column>
                <Column field="vald_date" header="유통기한"
                    ><template #body="{ data }">
                        {{ dayjs(data.ordr_date).format('YYYY-MM-DD') }}
                    </template></Column
                >
                <Column field="bnt" header="출고가능수량"></Column>
                <Column field="dlivy_qty" header="출고수량"
                    ><template #body="{ data }">
                        <v-text-field
                            type="number"
                            dense
                            hide-details
                            style="width: 100px"
                            variant="outlined"
                            min="0"
                            :max="data.bnt"
                            v-model="data.qty"
                        /> </template
                ></Column>
            </DataTable>
        </v-card>
    </v-row>

    <ModalSearch
        :visible="showModal"
        title="주문 검색"
        idField="order_id"
        :columns="[
            { key: 'order_id', label: '주문번호' },
            { key: 'vend_name', label: '업체명' },
            { key: 'emp_name', label: '담당자' },
            { key: 'ordr_date', label: '주문일자' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal = false"
    />

    <ModalSearch
        :visible="showModal3"
        title="업체명"
        idField="vend_id"
        :columns="[
            { key: 'vend_id', label: '업체번호' },
            { key: 'biz_number', label: '사업자번호' },
            { key: 'vend_name', label: '거래처명' }
        ]"
        :fetchData="fetchItems3"
        :pageSize="5"
        @select="onSelectItem3"
        @close="showModal3 = false"
    />
    <SnackBar />
</template>

<script setup>
import CardHeader from '@/components/production/card-header.vue';
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import Column from 'primevue/column';
import ModalSearch from '@/views/commons/CommonModal.vue';
import DataTable from 'primevue/datatable';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';

import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackBar } = useSnackBar();
const showModal = ref(false); //주문코드모달
const showModal3 = ref(false); //업체명명모달

const selectedItem = ref(null);
const selectedItem3 = ref(null);
const orderId = ref(null);
const vendId = ref(null);
const setDelivery = ref(null);
const deliveryList = ref(null);
const itemId = ref(null);
const setorderId = ref(null);

const selectItemList = ref(null);
onMounted(() => {});

// 출고 업데이트
const delUpdate = async () => {
    try {
        let obj = selectItemList.value.map((item) => ({
            lot_id: item.lot_id,
            dlivy_qty: item.qty
        }));

        let response = await axios.post('/api/productUpdate', obj);

        if (!confirm('출고하시겠습니까?')) return;

        if (response.data.result) {
            snackBar('출고완료', 'success');
            Select();
        } else {
            snackBar('출고실패.', 'error');
        }
    } catch (error) {
        snackBar('에러', 'error');
    }
};

// 행 선택
watch(setorderId, async (newVal) => {
    if (!newVal) {
        itemId.value = null;
    } else {
        itemId.value = newVal.item_id;

        try {
            const params = {
                item_id: itemId.value
            };
            const response = await axios.get('/api/deliveryList', { params });
            deliveryList.value = response.data;
        } catch (error) {
            snackBar('조회실패', 'error');
        }
    }
});

// 제품전체조회
const Select = async () => {
    try {
        const params = {
            item_id: selectedItem.value,
            vend_id: selectedItem3.value
        };
        const response = await axios.get('/api/setDelivery', { params });
        setDelivery.value = response.data;
    } catch (error) {
        snackBar('조회실패', 'error');
    }
};

// 주문코드 모달
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/orderModal');
        return response.data;
    } catch (error) {
        snackBar('조회실패', 'error');
        return [];
    }
};

// 업체명모달
const fetchItems3 = async () => {
    try {
        const response = await axios.get('/api/vend');
        return response.data;
    } catch (error) {
        snackBar('조회실패', 'error');
        return [];
    }
};

const onSelectItem = (item) => {
    selectedItem.value = item.order_id;
    orderId.value = item.order_id;
};

const onSelectItem3 = (item) => {
    selectedItem3.value = item.vend_name;
    vendId.value = item.vend_id;
};
</script>

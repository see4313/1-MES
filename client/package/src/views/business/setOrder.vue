<!-- 제품 관리-->
<template>
    <v-card elevation="10">
        <v-col cols="12" md="12">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="주문 관리"
                    btn-text1="수정"
                    btn-variant1="flat"
                    btn-color1="warning"
                    @btn-click1="setOrder()"
                    btn-text2="삭제"
                    btn-variant2="flat"
                    btn-color2="error"
                    @btn-click2="deleteOrderId()"
                />
            </v-card-item>
        </v-col>
        <v-row dense>
            <v-col cols="12" sm="3">
                <v-text-field
                    variant="outlined"
                    label="주문코드"
                    append-inner-icon="mdi-magnify"
                    @click:append-inner="showModal = true"
                    v-model="selectOrder"
                    readonly
                />
            </v-col>
            <v-col cols="12" sm="3">
                <v-text-field variant="outlined" label="주문명" v-model="orderName" />
            </v-col>
            <v-col cols="12" sm="3">
                <v-text-field
                    variant="outlined"
                    label="담당자"
                    append-inner-icon="mdi-magnify"
                    @click:append-inner="showModal2 = true"
                    v-model="selectedItem2"
                    readonly
                />
            </v-col>
            <v-col cols="12" sm="3" :rowspan="2" class="merged-cell">
                <v-text-field variant="outlined" label="비고" v-model="remk" />
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" sm="3">
                <v-text-field
                    variant="outlined"
                    label="업체명"
                    append-inner-icon="mdi-magnify"
                    @click:append-inner="showModal3 = true"
                    v-model="selectedItem3"
                    readonly
                />
            </v-col>

            <v-col cols="12" sm="3">
                <v-menu v-model="joinMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                    <template #activator="{ props }">
                        <v-text-field
                            v-bind="props"
                            v-model="joinDate"
                            label="주문일자"
                            append-inner-icon="mdi-calendar"
                            variant="outlined"
                            :model-value="formattedJoinDate"
                            readonly
                        />
                    </template>
                    <v-date-picker v-model="joinDate" @change="joinMenu = false" />
                </v-menu>
            </v-col>
            <v-col cols="12" sm="3">
                <v-menu v-model="leavMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                    <template #activator="{ props }">
                        <v-text-field
                            v-bind="props"
                            v-model="leavDate"
                            label="납기일자"
                            append-inner-icon="mdi-calendar"
                            variant="outlined"
                            :model-value="formattedLeavDate"
                            readonly
                        />
                    </template>
                    <v-date-picker v-model="leavDate" @change="leavMenu = false" />
                </v-menu>
            </v-col>
        </v-row>
    </v-card>

    <v-row class="mt-10">
        <v-card elevation="10">
            <v-col cols="12">
                <div class="card">
                    <h3>상세주문관리</h3>
                    <DataTable
                        v-model:editingRows="editingRows"
                        :value="orderDetails"
                        editMode="cell"
                        dataKey="item_id"
                        @cell-edit-complete="onCellEditComplete"
                        tableStyle="min-width: 50rem"
                        paginator
                        :rows="5"
                    >
                        <Column field="item_id" header="제품코드" style="width: 600px"></Column>
                        <!-- 수량 (직접 입력) -->
                        <Column field="qty" header="수량" style="width: 500px"
                            ><template #body="slotProps">
                                <v-text-field
                                    v-model.number="orderDetails[slotProps.index].qty"
                                    type="number"
                                    dense
                                    hide-details
                                    style="width: 100px"
                                    variant="outlined"
                                    min="0"
                                /> </template
                        ></Column>
                        <Column field="amt" header="금액" style="width: 500px"
                            ><template #body="slotProps">
                                <v-text-field
                                    v-model.number="orderDetails[slotProps.index].amt"
                                    type="number"
                                    dense
                                    hide-details
                                    style="width: 100px"
                                    variant="outlined"
                                    min="0"
                                /> </template
                        ></Column>
                        <Column field="tamt" header="총 금액(원)" style="width: 500px">
                            <template #body="slotProps">
                                {{ (slotProps.data.qty * slotProps.data.amt).toLocaleString() }}
                            </template></Column
                        >
                        <!-- 삭제 버튼 -->
                        <Column :rowEditor="true" style="width: 400px" />
                        <Column header="삭제" style="width: 80px; text-align: center">
                            <template #body="{ data }">
                                <v-btn icon color="error" @click="deleteOrderDetail(data.detail_id)">
                                    <v-icon size="20">mdi-delete</v-icon>
                                </v-btn>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </v-col>
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
        :visible="showModal2"
        title="사원 검색"
        idField="emp_id"
        :columns="[
            { key: 'emp_id', label: '사원번호' },
            { key: 'dept_id', label: '부서' },
            { key: 'emp_name', label: '사원명' }
        ]"
        :fetchData="fetchItems2"
        :pageSize="5"
        @select="onSelectItem2"
        @close="showModal2 = false"
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
import CardHeader from '@/components/production/card-header-btn2.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import { ProductService } from '@/service/ProductService';
import dayjs from 'dayjs';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import { watch } from 'vue';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const { snackBar } = useSnackBar();
const products = ref([]);
const orderDetails = ref([]);
const joinMenu = ref(false);
const joinDate = ref(null);
const leavMenu = ref(false);
const leavDate = ref(null);

const orderName = ref(null);

const remk = ref(null);

const showModal = ref(false); // 주문모달
const selectOrder = ref(null); // 주문선택
const showModal2 = ref(false); // 업체모달
const selectedItem2 = ref(null);
const showModal3 = ref(false); // 담당자모달
const selectedItem3 = ref(null);
const editingRows = ref([]);
const vendId = ref(null);
const empId = ref(null);
const order_Id = ref(null);

const formattedJoinDate = computed(() => {
    return joinDate.value ? dayjs(joinDate.value).format('YYYY-MM-DD') : '';
});

const formattedLeavDate = computed(() => {
    return leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : '';
});

watch(selectOrder, async (newOrderId) => {
    if (newOrderId) {
        try {
            const params = {
                order_id: newOrderId
            };
            const response = await axios.get(`/api/detailOrder`, { params });
            orderDetails.value = response.data;
            console.log(orderDetails.value);
        } catch (error) {
            console.error('주문상세 불러오기 실패', error);
            orderDetails.value = [];
        }
    } else {
        orderDetails.value = [];
    }
});

const fetchItems = async () => {
    try {
        const response = await axios.get('/api/orderModal');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItems2 = async () => {
    try {
        const response = await axios.get('/api/empModal');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItems3 = async () => {
    try {
        const response = await axios.get('/api/vend');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const onSelectItem = (item) => {
    console.log(item);
    selectOrder.value = item.order_id;
    orderName.value = item.ordr;
    selectedItem2.value = item.emp_name;
    empId.value = item.emp_id;
    selectedItem3.value = item.vend_name;
    vendId.value = item.vend_id;
    //joinDate.value = dayjs(item.ordr_date).format('YYYY-MM-DD');
    //leavDate.value = dayjs(item.paprd_date).format('YYYY-MM-DD');
    joinDate.value = new Date(item.ordr_date);
    leavDate.value = new Date(item.paprd_date);
    remk.value = item.remk;
};

// 담당자 모달
const onSelectItem2 = (item) => {
    selectedItem2.value = item.emp_name;
    empId.value = item.emp_id;
};

// 업체모달
const onSelectItem3 = (item) => {
    selectedItem3.value = item.vend_name;
    vendId.value = item.vend_id;
};

// 주문 삭제
const deleteOrderId = async () => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
        snackBar('삭제성공', 'success');
        await axios.delete('/api/deleteOrderId', { data: { order_id: selectOrder.value } });
    } catch (error) {
        snackBar('삭제실패', 'error');
    }
};

// 상세 삭제
const deleteOrderDetail = async (itemId) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
        snackBar('삭제성공', 'success');
        await axios.delete('/api/deleteOrder', { data: { detail_id: itemId } });
        orderDetails.value = orderDetails.value.filter((item) => item.detail_id !== itemId);
    } catch (error) {
        snackBar('삭제실패', 'error');
    }
};

// 업데이트
const setOrder = async () => {
    if (joinDate.value && leavDate.value && new Date(leavDate.value) < new Date(joinDate.value)) {
        snackBar('납기일자는 주문일자보다 빠를 수 없습니다.', 'error');
        return;
    }
    try {
        let obj = {
            order_id: selectOrder.value,
            ordr: orderName.value,
            vend_id: vendId.value,
            emp_id: empId.value,
            ordr_date: joinDate.value,
            paprd_date: leavDate.value,
            remk: remk.value,
            details: orderDetails.value.map((item) => ({
                detail_id: item.detail_id,
                item_id: item.item_id,
                qty: item.qty,
                amt: item.amt
            }))
        };

        let response = await axios.put('/api/setOrder', obj);

        if (response.data.result) {
            if (!confirm('수정하시겠습니까?')) return;
            snackBar('수정성공', 'success');
            // select();
            dataReset();
        } else {
            snackBar('수정실패', 'error');
        }
    } catch (error) {
        snackBar('에러', 'error');
    }
};

// 상세입력 초기화
function dataReset() {
    selectOrder.value = null;
    orderName.value = null;
    vendId.value = null;
    empId.value = null;
    joinDate.value = null;
    leavDate.value = null;
    remk.value = null;
    orderDetails.value = null;
}
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

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
                    @btn-click1=""
                    btn-text2="삭제"
                    btn-variant2="flat"
                    btn-color2="error"
                    @btn-click2=""
                />
            </v-card-item>
            <v-row dense>
                <v-col cols="12" sm="3">
                    <v-text-field
                        variant="outlined"
                        label="주문코드"
                        append-inner-icon="mdi-magnify"
                        @click:append-inner="showModal = true"
                        v-model="selectOrder"
                    />
                </v-col>
                <v-col cols="12" sm="3">
                    <v-text-field variant="outlined" label="주문명" v-model="orderName" readonly />
                </v-col>
                <v-col cols="12" sm="3">
                    <v-text-field variant="outlined" label="담당자" v-model="empName" readonly />
                </v-col>
                <v-col cols="12" sm="3" :rowspan="2" class="merged-cell">
                    <v-text-field variant="outlined" label="비고" v-model="remk" readonly />
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12" sm="3">
                    <v-text-field variant="outlined" label="업체명" v-model="vendName" readonly />
                </v-col>

                <v-col cols="12" sm="3">
                    <v-text-field variant="outlined" v-model="joinDate" label="주문일자" readonly />
                </v-col>
                <v-col cols="12" sm="3">
                    <v-text-field variant="outlined" v-model="leavDate" label="납기일자" readonly />
                </v-col>
            </v-row>
        </v-col>
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
                        <Column field="item_id" header="제품코드"></Column>
                        <Column field="qty" header="수량"
                            ><template #editor="{ data, field }">
                                <input
                                    type="number"
                                    v-model.number="data.qty"
                                    @input="data.tamt = data.qty * data.amt"
                                    class="p-inputtext p-component"
                                    style="width: 100px; padding: 4px 8px; box-sizing: border-box"
                                /> </template
                        ></Column>
                        <Column field="amt" header="금액"
                            ><template #editor="{ data, field }">
                                <input
                                    type="number"
                                    v-model.number="data[field]"
                                    @input="data.tamt = data.qty * data.amt"
                                    class="p-inputtext p-component"
                                    style="width: 100px; padding: 4px 8px; box-sizing: border-box"
                                /> </template
                        ></Column>
                        <Column field="tamt" header="총금액"></Column>
                        <Column :rowEditor="true" style="width: 100px" />
                        <Column header="삭제" style="width: 80px; text-align: center">
                            <template #body="{ data }">
                                <button
                                    style="color: red; border: none; background: none; cursor: pointer"
                                    @click="deleteOrderDetail(data.detail_id)"
                                >
                                    삭제
                                </button>
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

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const products = ref([]);
const orderDetails = ref([]);
const joinMenu = ref(false);
const joinDate = ref(null);
const leavMenu = ref(false);
const leavDate = ref(null);
const vendName = ref(null);
const empName = ref(null);
const orderName = ref(null);
const remk = ref(null);

const showModal = ref(false); // 주문모달
const selectOrder = ref(null); // 주문선택

const editingRows = ref([]);

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

const onSelectItem = (item) => {
    selectOrder.value = item.order_id;
    orderName.value = item.ordr;
    empName.value = item.emp_name;
    vendName.value = item.vend_id;
    joinDate.value = dayjs(item.ordr_date).format('YYYY-MM-DD');
    leavDate.value = dayjs(item.paprd_date).format('YYYY-MM-DD');
    remk.value = item.remk;
};

const formattedJoinDate = computed(() => {
    return joinDate.value ? dayjs(joinDate.value).format('YYYY-MM-DD') : '';
});

const formattedLeavDate = computed(() => {
    return leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : '';
});

const onCellEditComplete = (e) => {
    const { data, newValue, field } = e;

    if (field === 'qty' || field === 'amt') {
        data.tamt = data.qty * data.amt;
    }
};

const deleteOrderDetail = async (itemId) => {
    console.log(itemId);
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
        await axios.delete('/api/deleteOrder', { data: { detail_id: itemId } });
        orderDetails.value = orderDetails.value.filter((item) => item.detail_id !== itemId);
    } catch (error) {
        console.error('삭제 실패', error);
    }
};
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

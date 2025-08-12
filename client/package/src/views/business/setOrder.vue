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
                    <v-menu v-model="joinMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                        <template #activator="{ props }">
                            <v-text-field v-bind="props" v-model="joinDate" label="주문일자" readonly />
                        </template>
                        <v-date-picker v-model="joinDate" @change="joinMenu = false" />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                    <v-menu v-model="leavMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                        <template #activator="{ props }">
                            <v-text-field v-bind="props" v-model="leavDate" label="납기일자" readonly />
                        </template>
                        <v-date-picker v-model="leavDate" @change="leavMenu = false" />
                    </v-menu>
                </v-col>
            </v-row>
        </v-col>
    </v-card>
    <v-row class="mt-10">
        <v-card elevation="10">
            <v-col cols="12">
                <div class="card">
                    <h3>상세주문관리</h3>
                    <DataTable :value="products" tableStyle="min-width: 50rem">
                        <Column field="productId" header="제품번호"></Column>
                        <Column field="itemName" header="제품명"></Column>
                        <Column field="qty" header="수량"></Column>
                        <Column field="amt" header="금액"></Column>
                        <Column field="allamt" header="총금액"></Column>
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

watch(selectOrder, async (newOrderId) => {
    if (newOrderId) {
        try {
            const response = await axios.get(`/api/orderDetails/${newOrderId}`);
            products.value = response.data;
        } catch (error) {
            console.error('주문상세 불러오기 실 패', error);
            products.value = [];
        }
    } else {
        products.value = [];
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
    joinDate.value = item.ordr_date;
    leavDate.value = item.paprd_date;
    remk.value = item.remk;
};

const formattedJoinDate = computed(() => {
    return joinDate.value ? dayjs(joinDate.value).format('YYYY-MM-DD') : '';
});

const formattedLeavDate = computed(() => {
    return leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : '';
});
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

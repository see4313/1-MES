<!-- 주문등록 -->
<template>
    <v-row>
        <v-card elevation="10">
            <v-col cols="12" md="12">
                <v-card-item class="py-6 px-6">
                    <CardHeader title="주문 등록" btn-text="등록" btn-variant="flat" btn-color="primary" @btn-click="orderInsert()" />
                </v-card-item>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="주문명" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="담당자"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="showModal = true"
                            v-model="selectedItem"
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="업체명"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="showModal2 = true"
                            v-model="selectedItem2"
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="joinMenu" :close-on-content-click="true" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="joinDate"
                                    label="주문일자"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedJoinDate"
                                />
                            </template>
                            <v-date-picker v-model="joinDate" @change="joinMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="leavMenu" :close-on-content-click="true" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="leavDate"
                                    label="납기일자"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedLeavDate"
                                />
                            </template>
                            <v-date-picker v-model="leavDate" @change="leavMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="비고" />
                    </v-col>
                </v-row>
            </v-col>
        </v-card>
    </v-row>
    <v-row class="mt-10">
        <v-card elevation="10">
            <v-col cols="12">
                <div class="order">
                    <v-card-item class="py-6 px-6">
                        <CardHeader
                            title="상세 주문등록"
                            btn-icon="mdi-plus-circle"
                            btn-text="행추가"
                            btn-variant="flat"
                            btn-color="primary"
                            @btn-click="planLoad"
                    /></v-card-item>

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
        title="사원 검색"
        idField="emp_id"
        :columns="[
            { key: 'emp_id', label: '사원번호' },
            { key: 'dept_id', label: '부서' },
            { key: 'emp_name', label: '사원명' },
            { key: 'status', label: '상태' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal = false"
    />

    <ModalSearch
        :visible="showModal2"
        title="업체명"
        idField="vend_id"
        :columns="[
            { key: 'vend_id', label: '업체번호' },
            { key: 'biz_number', label: '사업자번호' },
            { key: 'vend_name', label: '거래처명' }
        ]"
        :fetchData="fetchItems2"
        :pageSize="5"
        @select="onSelectItem2"
        @close="showModal2 = false"
    />
</template>
<script setup>
import CardHeader from '@/components/production/card-header-btn.vue';
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

const products = ref();
const joinMenu = ref(false);
const joinDate = ref(null);
const leavMenu = ref(false);
const leavDate = ref(null);

const formattedJoinDate = computed(() => {
    return joinDate.value ? dayjs(joinDate.value).format('YYYY-MM-DD') : '';
});

const formattedLeavDate = computed(() => {
    return leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : '';
});

// 모달
const showModal = ref(false);
const showModal2 = ref(false);
const selectedItem = ref(null);
const selectedItem2 = ref(null);
const empId = ref(null);
const vendId = ref(null);

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
        const response = await axios.get('/api/vend');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 선택한 값 처리
const onSelectItem = (item) => {
    selectedItem.value = item.emp_name;
    empId.value = item.emp_id;
};

const onSelectItem2 = (item) => {
    selectedItem2.value = item.vend_name;
    vendId.value = item.vend_id;
};

let orderinfo = ref({
    order_id: '',
    emp_id: '',
    vend_id: '',
    ordr_date: '',
    paprd_date: '',
    remk: ''
});
const isUpdated = ref(false);

const orderInsert = async () => {
    let obj = {
        order_id: orderinfo.value.order_id,
        emp_id: empId.value,
        vend_id: vendId.value,
        emp_id: empId.value,
        vend_id: vendId.value,
        order_date: orderinfo.value.ordr_date,
        paprd_date: orderinfo.value.paprd_date,
        remk: orderinfo.value.remk
    };

    try {
        const resDate = await axios.post('/api/orderInsert', obj);
        if (resDate.data.result) {
            alert('등록');
        } else {
            alert('등록실패 ㅗㅗㅗ');
        }
    } catch (err) {
        console.error('에러', err);
    }
};
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

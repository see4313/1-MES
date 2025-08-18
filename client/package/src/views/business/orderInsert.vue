<!-- 주문등록 -->
<template>
    <v-row>
        <v-card elevation="10">
            <v-col cols="12" md="12">
                <v-card-item class="py-6 px-6">
                    <CardHeader2
                        title="주문 등록"
                        btn-text1="등록"
                        btn-variant1="flat"
                        btn-color1="primary"
                        @btn-click1="orderInsert()"
                        btn-text2="초기화"
                        btn-variant2="flat"
                        btn-color2="error"
                        @btn-click2="dataReset()"
                    />
                </v-card-item>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="주문명" v-model="orderinfo.ordr" />
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
                        <v-text-field variant="outlined" label="비고" v-model="orderinfo.remk" />
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
                        <CardHeader1
                            title="상세 주문등록"
                            btn-icon="mdi-plus-circle"
                            btn-text="행추가"
                            btn-variant="flat"
                            btn-color="primary"
                            @btn-click="addRow"
                    /></v-card-item>

                    <DataTable :value="productsDetail" tableStyle="min-width: 50rem" editMode="cell" @cell-edit-complete="allamt">
                        <Column field="item_id" sortable header="제품번호">
                            <template #body="slotProps">
                                <v-icon class="cursor-pointer" @click="openProductModal(slotProps.index)" style="margin-left: 8px">
                                    mdi-magnify
                                </v-icon>
                                {{ slotProps.data.item_id }}
                            </template>
                        </Column>
                        <Column field="item_name" header="제품명"></Column>
                        <Column field="qty" header="수량">
                            <template #editor="{ data, field }">
                                <input type="number" v-model.number="data[field]" class="custom-input" style="width: 80px" /> </template
                        ></Column>
                        <Column field="amt" header="금액">
                            <template #editor="{ data, field }">
                                <input type="number" v-model.number="data[field]" class="custom-input" style="width: 80px" /> </template
                        ></Column>
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
            { key: 'emp_name', label: '사원명' }
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

    <ModalSearch
        :visible="showModal3"
        title="제품코드"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '제품코드' },
            { key: 'item_name', label: '제품명' }
        ]"
        :fetchData="fetchItems3"
        :pageSize="5"
        @select="onSelectItem3"
        @close="showModal3 = false"
    />
</template>
<script setup>
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import CardHeader1 from '@/components/production/card-header-btn.vue';
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
const productsDetail = ref([]);
const joinMenu = ref(false);
const joinDate = ref(null);
const leavMenu = ref(false);
const leavDate = ref(null);

const selectedRowIndex = ref(null);

const openProductModal = (index) => {
    selectedRowIndex.value = index;
    showModal3.value = true;
};

const formattedJoinDate = computed(() => {
    return joinDate.value ? dayjs(joinDate.value).format('YYYY-MM-DD') : '';
});

const formattedLeavDate = computed(() => {
    return leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : '';
});

// 모달
const showModal = ref(false); // 사원모달
const showModal2 = ref(false); // 업체모달
const showModal3 = ref(false); // 제품코드모달
const selectedItem = ref(null);
const selectedItem2 = ref(null);
const selectedItem3 = ref(null);
const empId = ref(null);
const vendId = ref(null);

// DB에서 리스트 가져오기
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/empModal');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

//업체명모달
const fetchItems2 = async () => {
    try {
        const response = await axios.get('/api/vend');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

//제품모달
const fetchItems3 = async () => {
    try {
        const response = await axios.get('/api/itemModal1');
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

const onSelectItem3 = (item) => {
    if (selectedRowIndex.value !== null) {
        const row = productsDetail.value[selectedRowIndex.value];
        row.item_id = item.item_id;
        row.item_name = item.item_name;
    }
    showModal3.value = false;
};

let orderinfo = ref({
    order_id: '',
    ordr: '',
    emp_id: '',
    vend_id: '',
    ordr_date: '',
    paprd_date: '',
    remk: ''
});
const isUpdated = ref(false);

const orderInsert = async () => {
    try {
        const payload = {
            ordr: orderinfo.value.ordr,
            emp_id: empId.value,
            vend_id: vendId.value,
            ordr_date: formattedJoinDate.value,
            paprd_date: formattedLeavDate.value,
            remk: orderinfo.value.remk,
            details: productsDetail.value.map((item) => ({
                item_id: item.item_id,
                qty: item.qty,
                amt: item.amt
            }))
        };

        const response = await axios.post('/api/orderInsert', payload);
        if (response.data.result) {
            alert('등록 성공');
            dataReset();
            productsDetail.value = [];
        } else {
            alert('등록 실패');
        }
    } catch (err) {
        console.error(err);
        alert('에러 발생');
    }
};
// 상세주문
const addRow = () => {
    productsDetail.value.push({
        item_id: '',
        item_name: '',
        qty: 0,
        amt: 0,
        allamt: 0
    });
};

//합산금액
const allamt = (event) => {
    const { data, field, newValue } = event;

    if (data[field] !== newValue) {
        // 기존값과 입력한 값이 다르면
        data[field] = newValue; // 바뀐 값으로 변경.

        if (field === 'qty' || field === 'amt') {
            data.allamt = data.qty * data.amt;
        }
    }
};

// 상세 입력 초기화
function dataReset() {
    orderinfo.value.ordr = null;
    selectedItem.value = null;
    selectedItem2.value = null;
    joinDate.value = null;
    leavDate.value = null;
    orderinfo.value.remk = null;
}
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}

.custom-input {
    width: 80px;
    padding: 4px;
}
</style>

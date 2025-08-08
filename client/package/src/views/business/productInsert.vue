<template>
    <v-card elevation="10">
        <v-col cols="12" md="12">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="제품 등록"
                    btn-text1="등록"
                    btn-variant1="flat"
                    btn-color1="primary"
                    @btn-click1=""
                    btn-text2="초기화"
                    btn-variant2="flat"
                    btn-color2="warning"
                    @btn-click2=""
                />
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
                        @click:append-inner="showModal = true"
                        v-model="selectItem2"
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
    <v-row class="mt-10">
        <v-card elevation="10">
            <v-col cols="12">
                <div class="order">
                    <v-card-item class="py-6 px-6">
                        <CardHeader
                            title="주문등록"
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
        idField=""
        :columns="[
            { key: 'emp_id', label: '업체번호' },
            { key: 'dept_id', label: '사업자번호' },
            { key: 'emp_name', label: '거래처명' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal = false"
    />
</template>
<script setup>
import CardHeader from '@/components/production/card-header-btn2.vue';
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

function onSearchEmployee() {
    console.log('담당자 검색 클릭!');
}

function onSearchCompany() {
    console.log('업체명 검색 클릭!');
}

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

// 선택한 값 처리
const onSelectItem = (item) => {
    selectedItem.value = item.emp_name;
};
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

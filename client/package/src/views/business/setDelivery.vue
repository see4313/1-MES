<!-- 출고관리 -->
<template>
    <v-row>
        <v-card elevation="10">
            <v-card-item class="py-6 px-6">
                <CardHeader title="출고 관리" />
            </v-card-item>
            <v-row no-gutters>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-text-field variant="outlined" label="주문코드" v-model="selectemp" readonly>
                            <template #append-inner>
                                <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-text-field variant="outlined" label="제품명" v-model="selectorder" readonly>
                            <template #append-inner>
                                <v-icon @click="showModal2 = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-text-field variant="outlined" label="업체명" v-model="selectemp" readonly>
                            <template #append-inner>
                                <v-icon @click="showModal3 = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-sheet>
                </v-col>
            </v-row>

            <DataTable :value="orderList" tableStyle="min-width: 50rem" @row-click="onRowClick" class="cursor-pointer">
                <Column field="order_id" header="주문상세코드"></Column>
                <Column field="ordr" header="제품 코드"></Column>
                <Column field="ordr_date" header="제품명"></Column>
                <Column field="emp_name" header="출고일자자"></Column>
                <Column field="vend_name" header="제품코드"></Column>
                <Column field="st" header="업체명"></Column>
                <Column field="remk" header="기납기량"></Column>
                <Column field="remk" header="미납기량"></Column>
            </DataTable>
        </v-card>

        <v-card elevation="10">
            <v-card-item class="py-6 px-6">
                <CardHeader title="출고 관리" btn-text="출고" btn-variant="flat" btn-color="primary" @btn-click="Select()" />
            </v-card-item>

            <DataTable :value="detailOrder" tableStyle="min-width: 50rem">
                <Column field="item_id" header="제품코드"></Column>
                <Column field="qty" header="제품명"></Column>
                <Column field="amt" header="출고가능수량"></Column>
                <Column field="tamt" header="출고수량"></Column>
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
        :visible="showModal2"
        title="제품코드"
        idField="product_id"
        :columns="[
            { key: 'emp_id', label: '제품코드' },
            { key: 'dept_id', label: '제품명' }
        ]"
        :fetchData="fetchItems2"
        :pageSize="5"
        @select="onSelectItem2"
        @close="showModal2 = false"
    />

    <ModalSearch
        :visible="showModal3"
        title="업체명"
        idField="vend_name"
        :columns="[
            { key: 'emp_id', label: '업체번호' },
            { key: 'dept_id', label: '사업자번호' },
            { key: 'emp_name', label: '거래처명' }
        ]"
        :fetchData="fetchItems3"
        :pageSize="5"
        @select="onSelectItem3"
        @close="showModal3 = false"
    />
</template>

<script setup>
import CardHeader from '@/components/production/card-header-btn.vue';
import Column from 'primevue/column';
import ModalSearch from '@/views/commons/CommonModal.vue';
import DataTable from 'primevue/datatable';
import { ref } from 'vue';

const productList = ref();
const showModal = ref(false); //주문코드모달
const showModal2 = ref(false); //제품품코드모달
const showModal3 = ref(false); //업체명명모달

const selectOrder = ref(null);
const selectProduct = ref(null);
const selectVend = ref(null);
</script>

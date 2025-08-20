<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader3
                title="제품관리"
                btn-text1="조회"
                btn-variant1="flat"
                btn-color1="primary"
                @btn-click1="Select()"
                btn-text2="수정"
                btn-variant2="flat"
                btn-color2="warning"
                @btn-click2=""
                btn-text3="삭제"
                btn-variant3="flat"
                btn-color3="error"
                @btn-click3=""
            />
            <v-col cols="12" sm="4">
                <v-sheet class="pa-2 ma-2">
                    <v-text-field variant="outlined" label="제품코드 검색" v-model="selectedItem" readonly>
                        <template #append-inner>
                            <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-sheet>
            </v-col>
            <v-chip-group v-model="selectProductType" mandatory selected-class="active">
                <v-chip v-for="type in productType" :key="type.value" :value="type.value" label pill variant="tonal" size="small">{{
                    type.key
                }}</v-chip>
            </v-chip-group>

            <DataTable
                :value="productList"
                tableStyle="min-width: 50rem"
                @row-click="onRowClick"
                class="cursor-pointer"
                v-model:selection="setLotId"
                selectionMode="single"
                :metaKeySelection="false"
                dataKey="lot_id"
            >
                <Column field="lot_id" header="LOT"></Column>
                <Column field="item_id" header="제품 코드"></Column>
                <Column field="item_name" header="완제품명"></Column>
                <Column field="crea_date" header="입고 일자"
                    ><template #body="{ data }">
                        {{ dayjs(data.ordr_date).format('YYYY-MM-DD') }}
                    </template></Column
                >
                <Column field="wh_id" header="창고코드"></Column>
                <Column field="safe_qty" header="안전재고량"></Column>
                <Column field="bnt" header="현수량"></Column>
                <Column field="psafe" header="안전대비 보유율"></Column>
            </DataTable>
        </v-card-item>
    </v-card>
    <v-row class="mt-10">
        <v-card elevation="10">
            <v-col cols="12">
                <div class="order">
                    <v-card-item class="py-6 px-6"> <CardHeader title="완제품관리" /></v-card-item>
                    <v-row dense>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" label="LOT번호" v-model="lot_id" readonly density="compact" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" label="제품코드" v-model="item_id" readonly density="compact" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" v-model="crea_date" label="입고일자" readonly density="compact" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" v-model="vald_date" label="유통기한" readonly density="compact" />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" v-model="bnt" label="현수량" readonly density="compact" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" v-model="selectWhId" label="창고코드" density="compact"
                                ><template #append-inner>
                                    <v-icon @click="whIdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template></v-text-field
                            >
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-card>
    </v-row>

    <!-- 제품 코드모달 -->
    <ModalSearch
        :visible="showModal"
        title="제품코드"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '제품코드' },
            { key: 'item_type', label: '제품유형' },
            { key: 'item_name', label: '제품명' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal = false"
    />

    <!-- 창고코드 모달 -->
    <ModalSearch
        :visible="whIdModal"
        title="창고번호 검색"
        idField="wh_id"
        :columns="[
            { key: 'wh_id', label: '창고번호' },
            { key: 'wh_name', label: '창고이름' },
            { key: 'wh_type', label: '창고유형' },
            { key: 'loca', label: '소재지' }
        ]"
        :fetchData="fetchWhId"
        :pageSize="5"
        @select="onSelectWhId"
        @close="whIdModal = false"
    />
    <SnackBar />
</template>

<script setup>
import CardHeader from '@/components/production/card-header.vue';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, watch } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import dayjs from 'dayjs';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackBar } = useSnackBar();
const showModal = ref(false); //  주문코드 모달
const selectedItem = ref(null);
const whIdModal = ref(false); // 창고코드 모달
const selectWhId = ref(null); // 창고코드 선택

const productList = ref(); // 제품목록

const setLotId = ref(null);
const lotId = ref(null);
const itemId = ref(null);
const creaDate = ref(null);
const valdDate = ref(null);
const bnt = ref(null);
const whId = ref(null);

// 제품전체조회
const Select = async () => {
    try {
        const params = {
            item_id: selectedItem.value
        };
        const response = await axios.get('/api/productList', { params });
        productList.value = response.data;
    } catch (error) {
        snackBar('조회 실패.', 'error');
    }
};

// 행 선택
watch(setLotId, async (newVal) => {
    if (!newVal) {
        lotId.value = null;
    } else {
        lotId.value = newVal.lot_id;

        try {
            const params = {
                lot_id: lotId.value
            };
            const response = await axios.get('/api/deliveryList', { params });
        } catch (error) {
            snackBar('조회 실패.', 'error');
        }
    }
});

// 행 선택 시 값 불러오기
watch(productList, (newVal) => {
    if (!newVal) {
        lotId.value = null;
        dataReset();
    } else {
        lotId.value = newVal.lot_id;
        itemId.value = newVal.item_id;
        creaDate.value = newVal.crea_date;
        valdDate.value = newVal.vald_date;
        bnt.value = newVal.bnt;
        whId.value = newVal.wh_id;
    }
});

// 제품 모달
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/itemModal1');
        return response.data;
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

//창고모달
const fetchWhId = async () => {
    try {
        const response = await axios.get('/api/whId');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItem = (item) => {
    selectedItem.value = item.item_id;
};

const onSelectWhId = (item) => {
    selectWhId.value = item.wh_id; // 창고코드
};
</script>

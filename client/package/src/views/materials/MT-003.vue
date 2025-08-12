<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader
                title="재고조회"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="selectReset()"
                btn-text2="조회"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="select()"
            />
            <v-row>
                <v-col cols="12" md="12">
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="4">
                            <v-text-field label="품목 번호" v-model="selectItemId" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemIdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="LOT 번호" v-model="selectLotId" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="lotIdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="품목 구분" v-model="selectItemType" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="보관 조건" v-model="selectCutd" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="cutdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="창고 코드" v-model="selectWhId" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="whIdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-menu
                                v-model="expMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-bind="props"
                                        v-model="expDate"
                                        label="유효기간"
                                        append-inner-icon="mdi-calendar"
                                        readonly
                                        variant="outlined"
                                        :model-value="formattedexpDate"
                                    />
                                </template>
                                <v-date-picker v-model="expDate" @update:model-value="expMenu = false" />
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div class="card">
                        <DataTable :value="inventoryList" paginator :rows="10" tableStyle="min-width: 50rem">
                            <Column field="lot_id" sortable header="LOT번호"></Column>
                            <Column field="item_id" sortable header="품목번호"></Column>
                            <Column field="item_name" header="품목명"></Column>
                            <Column field="item_type" header="품목구분"></Column>
                            <Column field="wh_name" header="위치"></Column>
                            <Column field="cutd_cond" header="보관조건"></Column>
                            <Column field="qty" header="수량"></Column>
                            <Column field="vald_date" sortable header="유효기한"></Column>
                        </DataTable>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 품목번호 모달 -->
    <ModalSearch
        :visible="itemIdModal"
        title="품목 검색"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'item_type', label: '품목구분' }
        ]"
        :fetchData="fetchItemId"
        :pageSize="5"
        @select="onSelectItemId"
        @close="itemIdModal = false"
    />

    <!-- LOT번호 모달 -->
    <ModalSearch
        :visible="lotIdModal"
        title="LOT 검색"
        idField="lot_id"
        :columns="[
            { key: 'lot_id', label: 'LOT번호' },
            { key: 'item_id', label: '품목번호' },
            { key: 'wh_id', label: '창고번호' }
        ]"
        :fetchData="fetchLotId"
        :pageSize="5"
        @select="onSelectLotId"
        @close="lotIdModal = false"
    />

    <!-- 품목구분 모달 -->
    <ModalSearch
        :visible="itemTypeModal"
        title="품목구분 검색"
        idField="order_id"
        :columns="[
            { key: 'order_id', label: '주문번호' },
            { key: 'vend_id', label: '거래처번호' },
            { key: 'ordr', label: '주문명' }
        ]"
        :fetchData="fetchItemType"
        :pageSize="5"
        @select="onSelectItemType"
        @close="itemTypeModal = false"
    />

    <!-- 보관조건 모달 -->
    <ModalSearch
        :visible="cutdModal"
        title="주문 검색"
        idField="order_id"
        :columns="[
            { key: 'order_id', label: '주문번호' },
            { key: 'vend_id', label: '거래처번호' },
            { key: 'ordr', label: '주문명' }
        ]"
        :fetchData="fetchCutd"
        :pageSize="5"
        @select="onSelectCutd"
        @close="cutdModal = false"
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
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader from '@/components/production/card-header-btn2.vue';
import dayjs from 'dayjs';

onMounted(() => {});

const inventoryList = ref(); // 조회 목록
const itemIdModal = ref(false); // 품목번호 모달
const lotIdModal = ref(false); // LOT번호 모달
const itemTypeModal = ref(false); // 품목구분 모달
const cutdModal = ref(false); // 보관조건 모달
const whIdModal = ref(false); // 창고코드 모달
const selectItemId = ref(null); // 품목번호 선택
const selectLotId = ref(null); // LOT번호 선택
const selectItemType = ref(null); // 품목구분 선택
const selectCutd = ref(null); // 보관조건 선택
const selectWhId = ref(null); // 창고코드 선택
const expMenu = ref(false); // 유효기간
const expDate = ref(null); // 유효기간

const formattedexpDate = computed(() => {
    return expDate.value ? dayjs(expDate.value).format('YYYY-MM-DD') : '';
});

// 조회조건 초기화
function selectReset() {
    selectItemId.value = null;
    selectLotId.value = null;
    selectItemType.value = null;
    selectCutd.value = null;
    selectWhId.value = null;
    formattedexpDate.value = null;
}

// 조회
const select = async () => {
    try {
        const params = {
            item_id: selectItemId.value, // 품목번호
            lot_id: selectLotId.value, // LOT번호
            item_type: selectItemType.value, // 품목구분
            cutd_cond: selectCutd.value, // 보관조건
            wh_id: selectWhId.value, // 창고번호
            vald_date: formattedexpDate.value // 유효기간
        };

        const response = await axios.get('/api/inventoryList', { params });
        inventoryList.value = response.data;
    } catch (error) {
        console.error('조회 실패', error);
    }
};

// 모달조회 fetchItems
const fetchItemId = async () => {
    try {
        const response = await axios.get('/api/itemId');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchLotId = async () => {
    try {
        const response = await axios.get('/api/lotId');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItemType = async () => {
    try {
        const response = await axios.get('/api/itemType');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchCutd = async () => {
    try {
        const response = await axios.get('/api/cutdCond');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchWhId = async () => {
    try {
        const response = await axios.get('/api/whId');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItemId = (item) => {
    selectItemId.value = item.item_id; // 품목번호
};

const onSelectLotId = (item) => {
    selectLotId.value = item.lot_id; // LOT번호
};

const onSelectItemType = (item) => {
    selectItemType.value = item.type; // 품목구분
};

const onSelectCutd = (item) => {
    selectCutd.value = item.cutd_cond; // 보관조건
};

const onSelectWhId = (item) => {
    selectWhId.value = item.wh_id; // 창고코드
};
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader3
                title="제품관리"
                btn-text1="조회"
                btn-variant1="flat"
                btn-color1="primary"
                @btn-click1=""
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
                    <v-text-field variant="outlined" label="제품코드 검색" v-model="selectemp" readonly>
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

            <DataTable :value="orderList" tableStyle="min-width: 50rem" @row-click="onRowClick" class="cursor-pointer">
                <Column field="order_id" header="LOT"></Column>
                <Column field="ordr" header="제품 코드"></Column>
                <Column field="ordr_date" header="입고 일자"></Column>
                <Column field="emp_name" header="완제품명"></Column>
                <Column field="vend_name" header="창고코드"></Column>
                <Column field="st" header="안전재고량"></Column>
                <Column field="remk" header="현수량"></Column>
                <Column field="remk" header="안전대비 보유율"></Column>
            </DataTable>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-3">
        <v-row dense>
            <v-col cols="12" sm="6">
                <v-text-field variant="outlined" label="생산지시번호" v-model="orderName" readonly />
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field variant="outlined" label="제품코드" v-model="empName" readonly />
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field variant="outlined" v-model="joinDate" label="입고일자" readonly />
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field variant="outlined" v-model="joinDate" label="유통기한" readonly />
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field variant="outlined" v-model="joinDate" label="입고수량" readonly />
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field variant="outlined" v-model="joinDate" label="입고수량" readonly />
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field variant="outlined" v-model="whId" label="창고코드" />
            </v-col>
        </v-row>
    </v-card>

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
</template>

<script setup>
import CardHeader from '@/components/production/card-header.vue';
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed, watch } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';

const showModal = ref(false); //  주문코드 모달
const selectedItem = ref(null);

const fetchItems = async () => {
    try {
        const response = await axios.get('/api/itemModal');
        return response.data;
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItem = (item) => {
    selectedItem.value = item.item_id;
    selectItemName.value = item.item_name;
};

// 상품 유형
const productType = ref([
    { key: '반제품', value: 'semi' },
    { key: '완제품', value: 'finish' }
]);
</script>

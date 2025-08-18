<!--완제품 입고처리-->
<template>
    <v-row>
        <v-card elevation="10">
            <v-col cols="12" md="12">
                <v-card-item class="py-6 px-6">
                    <CardHeader2
                        title="제품입고처리"
                        btn-text1="등록"
                        btn-variant1="flat"
                        btn-color1="primary"
                        @btn-click1=""
                        btn-text2="초기화"
                        btn-variant2="flat"
                        btn-color2="error"
                        @btn-click2=""
                    />
                </v-card-item>
            </v-col>
            <v-row dense>
                <v-col cols="12" sm="11">
                    <v-text-field
                        variant="outlined"
                        label="생산지시번호"
                        append-inner-icon="mdi-magnify"
                        @click:append-inner="show01Modal = true"
                        v-model="selectedItem"
                    />
                </v-col>
                <v-col cols="12" sm="11">
                    <v-text-field variant="outlined" label="제품코드" v-model="orderName" readonly />
                </v-col>
                <v-col cols="12" sm="11">
                    <v-text-field variant="outlined" label="입고일자" v-model="empName" readonly />
                </v-col>
                <v-col cols="12" sm="11">
                    <v-text-field variant="outlined" label="유통기한" v-model="vendName" readonly />
                </v-col>

                <v-col cols="12" sm="11">
                    <v-text-field variant="outlined" v-model="joinDate" label="입고수량" readonly />
                </v-col>
                <v-col cols="12" sm="11">
                    <v-text-field label="창고코드" v-model="selectCutd" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="showModal2 = true" class="cursor-pointer" v-model="selectedItem2">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </v-row>

    <ModalSearch
        :visible="showModal"
        title="생산지시검색"
        idField="instruct_no"
        :columns="[
            { key: 'instruct_no', label: '생산지시번호' },
            { key: 'item_name', label: '제품명' },
            { key: 'item_id', label: '제품코드' },
            { key: 'instruct_datetime', label: '지시일자' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal = false"
    />

    <!-- 창고 모달 -->
    <ModalSearch
        :visible="showModal2"
        title="창고코드"
        idField="wh_id"
        :columns="[
            { key: 'wh_id', label: '창고코드' },
            { key: 'wh_name', label: '창고명' },
            { key: 'wh_type', label: '창고유형' },
            { key: 'loca', label: '창고위치' },
            { key: 'uon', label: '사용여부' }
        ]"
        :fetchData="fetchItems2"
        :pageSize="5"
        @select="onSelectItem2"
        @close="showModal2 = false"
    />
</template>
<script setup>
import CardHeader2 from '@/components/production/card-header-btn2.vue';
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

const showModal = ref(false); // 생산지시모달
const selectedItem = ref(null); // 생산지시선택
const showModal2 = ref(false); // 창고모달
const selectedItem2 = ref(null); // 창고선택
const selectWhId = ref(null);
const selectInstuctId = ref(null);

//생산지시
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/prodModal');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItems2 = async () => {
    try {
        const response = await axios.get('/api/whModal');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 생산지시 선택값
const onSelectItem = (item) => {
    selectedItem.value = item.instruct_id;
    selectInstuctId.value = item.instruct_id;
};

// 창고 선택값
const onSelectItem2 = (item) => {
    selectedItem2.value = item.wh_id;
    selectWhId.value = item.wh_id;
};
</script>

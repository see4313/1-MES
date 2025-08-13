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
                        @click:append-inner="showModal = true"
                        v-model="selectOrder"
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
                    <v-text-field variant="outlined" v-model="joinDate" label="창고코드" readonly />
                </v-col>
            </v-row>
        </v-card>
    </v-row>

    <ModalSearch
        :visible="showModal"
        title="생산지시검색"
        idField="instruct_id"
        :columns="[
            { key: 'instruct_id', label: '생산지시번호' },
            { key: 'item_name', label: '제품명' },
            { key: 'item_id', label: '제품코드' },
            { key: 'instruct_datetime', label: '지시일자' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal = false"
    />
</template>
<script setup>
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import ModalSearch from '@/views/commons/CommonModal.vue';

const showModal = ref(false); // 생산지시모달
const selectOrder = ref(null); // 주문선택

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
    // 수정해야됨 들어오는 값들.
    selectOrder.value = item.order_id;
    orderName.value = item.ordr;
    empName.value = item.emp_name;
    vendName.value = item.vend_id;
    instruct_datetime.value = dayjs(item.ordr_date).format('YYYY-MM-DD');
};
</script>

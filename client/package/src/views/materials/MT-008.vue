<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader
                title="출고이력"
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
                <v-col cols="12" md="10">
                    <v-row dense>
                        <v-col cols="12" sm="4">
                            <v-text-field label="품목" v-model="selectItemName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemModal = true" class="cursor-pointer">mdi-magnify</v-icon>
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
                                        label="일자"
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
                        <DataTable :value="historyList" paginator :rows="10" tableStyle="min-width: 50rem">
                            <Column field="history_id" sortable header="이력번호" style="width: 130px"></Column>
                            <Column field="rsrt_id" header="실적번호" style="width: 130px"></Column>
                            <Column field="lot_id" header="LOT번호" style="width: 130px"></Column>
                            <Column field="item_name" header="품목명" style="width: 80px"></Column>
                            <Column field="item_type" header="품목구분" style="width: 100px"></Column>
                            <Column field="use_qty" header="출고수량" style="width: 80px"></Column>
                            <Column field="use_date" header="출고일자" style="width: 80px">
                                <template #body="{ data }">
                                    {{ formatDate(data.use_date) }}
                                </template></Column
                            >
                            <Column field="remk" header="비고" style="width: 100px"> </Column>
                        </DataTable>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 품목번호 모달 -->
    <ModalSearch
        :visible="itemModal"
        title="품목 검색"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'item_type', label: '품목구분' }
        ]"
        :fetchData="fetchItem"
        :pageSize="5"
        @select="onSelectItemName"
        @close="itemModal = false"
    />

    <SnackBar />
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader from '@/components/production/card-header-btn2.vue';
import dayjs from 'dayjs';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackBar } = useSnackBar();
const itemModal = ref(false); // 품목 모달
const selectItemName = ref(null); // 사원 이름
const expDate = ref(null);
const expMenu = ref(false);
const selectItemId = ref(null); // 품목 번호
const historyList = ref(null);

const selectReset = () => {
    selectItemId.value = null;
    selectItemName.value = null;
    expDate.value = null;
};

const fetchItem = async () => {
    try {
        const params = {
            uon: 'Y' // 사용여부
        };
        const response = await axios.get('/api/itemList', { params });
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

const onSelectItemName = (item) => {
    selectItemName.value = item.item_name; // 품목번호
    selectItemId.value = item.item_id;
};

const formattedexpDate = computed(() => {
    return expDate.value ? dayjs(expDate.value).format('YYYY-MM-DD') : '';
});

// 출력 날짜 포맷
const formatDate = (date) => {
    return date ? dayjs(date).format('YYYY-MM-DD') : '';
};

const select = async () => {
    try {
        const params = {
            item_id: selectItemId.value, // 품목명
            use_date: formattedexpDate.value // 일자
        };

        const response = await axios.get('/api/historyList', { params });
        historyList.value = response.data;
    } catch (error) {
        snackBar('조회 실패.', 'error');
    }
};
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader title="반품 대상" btn-text="확정" btn-variant="flat" btn-color="primary" @btn-click="returnItem()" />
            <v-row>
                <v-col cols="12" md="12">
                    <DataTable
                        v-model:selection="selectItemList"
                        :value="inventoryList"
                        selectionMode="multiple"
                        dataKey="lot_id"
                        paginator
                        :rows="5"
                        tableStyle="min-width: 50rem"
                        class="cursor-pointer"
                    >
                        <Column selectionMode="multiple" headerStyle="width: 3em" />
                        <Column field="lot_id" sortable header="LOT번호"></Column>
                        <Column field="item_id" sortable header="품목번호"></Column>
                        <Column field="item_name" header="품목명"></Column>
                        <Column field="item_type" header="품목유형"></Column>
                        <Column field="wh_name" header="위치"></Column>
                        <Column field="vald_date" sortable header="유효기한">
                            <template #body="{ data }">
                                {{ formatDate(data.vald_date) }}
                            </template>
                        </Column>
                        <Column field="spec" header="규격"></Column>
                        <Column field="bnt" header="수량"></Column>
                        <Column header="반품수량">
                            <template #body="{ data }">
                                <InputNumber v-model="data.use_qty" :min="1" />
                            </template>
                        </Column>
                        <Column header="반품사유">
                            <template #body="{ data }">
                                <input v-model="data.remk" type="text" placeholder="반품 사유" class="p-inputtext p-component" />
                            </template>
                        </Column>
                    </DataTable>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <SnackBar />
</template>

<script setup>
import CardHeader from '@/components/production/card-header-btn.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed, watch } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import dayjs from 'dayjs';
import InputNumber from 'primevue/inputnumber';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackBar } = useSnackBar();
const selectItemList = ref(null); // 선택한 품목
const inventoryList = ref(); // 조회 목록
const lotId = ref(null);

onMounted(() => {
    select();
});

// 행 선택
watch(selectItemList, (newVal) => {
    if (!newVal) {
        dataReset();
    } else {
        lotId.value = newVal.lot_id;
    }
});

function dataReset() {
    selectItemList.value = null;
    lotId.value = null;
}

// 조회
const select = async () => {
    try {
        const params = {
            status: '반품대기'
        };

        const response = await axios.get('/api/inventoryList', { params });
        inventoryList.value = response.data;
    } catch (error) {
        snackBar('조회 실패.', 'error');
    }
};

// 반품 처리
const returnItem = async () => {
    if (!selectItemList.value || selectItemList.value.length === 0) {
        snackBar('반품할 항목을 선택하세요.', 'warning');
        return;
    }

    // 수량, 사유 입력 확인
    for (let item of selectItemList.value) {
        if (!item.use_qty || item.use_qty <= 0) {
            snackBar('반품 수량을 입력하세요.', 'warning');
            return;
        }
        if (!item.remk || item.remk.trim() === '') {
            snackBar('반품 사유를 입력하세요.', 'warning');
            return;
        }
    }

    // 선택된 항목의 반품수량, 사유까지 모아서 전송
    let objList = selectItemList.value.map((item) => ({
        lot_id: item.lot_id,
        use_qty: item.use_qty,
        remk: item.remk
    }));

    try {
        let response = await axios.post('/api/itemReturn', objList).catch((err) => console.log(err));

        if (response.data.result) {
            snackBar('처리되었습니다', 'success');
            select();
            dataReset();
        }
    } catch (error) {
        snackBar('처리 실패.', 'error');
    }
};

// 출력 날짜 포맷
const formatDate = (date) => {
    return date ? dayjs(date).format('YYYY-MM-DD') : '';
};
</script>

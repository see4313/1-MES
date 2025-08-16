<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader1 title="발주 상세" btn-text="입고" btn-variant="flat" btn-color="primary" @btn-click="handleReceive()" />
            <v-col cols="12" md="8">
                <v-row justify="space-between" dense>
                    <v-col cols="12" sm="5">
                        <v-menu v-model="regMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="regDate"
                                    label="발주일자"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedregDate"
                                />
                            </template>
                            <v-date-picker v-model="regDate" @update:model-value="onSelectDate" />
                        </v-menu>
                    </v-col>
                </v-row>
            </v-col>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader title="입고 등록" />
            <v-row>
                <v-col cols="12" md="12">
                    <DataTable
                        v-model:expandedRows="expandedRows"
                        :value="procList"
                        dataKey="procument_id"
                        @rowExpand="onRowExpand"
                        @rowCollapse="onRowCollapse"
                        tableStyle="min-width: 60rem"
                    >
                        <Column expander style="width: 5rem" />
                        <Column field="procument_id" header="발주번호"></Column>
                        <Column field="vend_name" header="거래처명"> </Column>
                        <Column field="emp_name" header="담당자"></Column>
                        <Column field="regist_date" header="등록일">
                            <template #body="{ data }">
                                {{ formatDate(data.regist_date) }}
                            </template>
                        </Column>
                        <Column field="paprd_date" header="납기일">
                            <template #body="{ data }">
                                {{ formatDate(data.paprd_date) }}
                            </template>
                        </Column>
                        <template #expansion="{ data }">
                            <div class="p-4">
                                <DataTable
                                    :value="procDetailList[data.procument_id] || []"
                                    dataKey="pcmt_detail_id"
                                    selectionMode="multiple"
                                    :selection="checkedDetails[data.procument_id] || []"
                                    @update:selection="(val) => onSelectDetail(data.procument_id, val)"
                                >
                                    <Column selectionMode="multiple" headerStyle="width: 3em" />
                                    <Column field="item_id" header="품목번호" sortable style="width: 100px"> </Column>
                                    <Column field="item_name" header="품목명" style="width: 100px"> </Column>
                                    <Column field="spec" header="규격" style="width: 100px"> </Column>
                                    <Column field="unit" header="단위" style="width: 100px"> </Column>
                                    <Column field="qty" header="수량" style="width: 100px">
                                        <template #body="data">
                                            {{ Number(data.data.qty).toLocaleString() }}
                                        </template></Column
                                    >
                                    <Column field="untpc" header="단가" style="width: 100px">
                                        <template #body="data">
                                            {{ Number(data.data.untpc).toLocaleString() }}
                                        </template></Column
                                    >
                                    <Column field="totpc" header="금액" style="width: 100px">
                                        <template #body="data">
                                            {{ Number(data.data.totpc).toLocaleString() }}
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </template>
                    </DataTable>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>

<script setup>
import CardHeader from '@/components/production/card-header.vue';
import CardHeader1 from '@/components/production/card-header-btn.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';
import dayjs from 'dayjs';
import { ref, onMounted, computed } from 'vue';

const expandedRows = ref({}); // 펼친 행
const procDetailList = ref({}); // 발주상세 목록
const procList = ref(); // 발주 목록
const regMenu = ref(false);
const regDate = ref(null); // 발주일자
const checkedDetails = ref({}); // 체크 항목

onMounted(() => {});

// 행 펼치기
const onRowExpand = async (event) => {
    const procId = event.data.procument_id;
    if (!procDetailList.value[procId]) {
        const res = await axios.get(`/api/selectProcDetail`, { params: { procId } });
        procDetailList.value[procId] = res.data;
    }
};

// 행 닫기
const onRowCollapse = (event) => {};

// 체크박스 선택
const onSelectDetail = (procId, selected) => {
    checkedDetails.value[procId] = selected;
};

// 입력 날짜 포맷
const formattedregDate = computed(() => {
    return regDate.value ? dayjs(regDate.value).format('YYYY-MM-DD') : '';
});

// 출력 날짜 포맷
const formatDate = (date) => {
    return date ? dayjs(date).format('YYYY-MM-DD') : '';
};

// 날짜 선택 시 조회
const onSelectDate = async (date) => {
    regMenu.value = false; // 달력 닫기

    const params = {
        regist_date: formattedregDate.value
    };

    try {
        const response = await axios.get('/api/selectProc', { params });
        procList.value = response.data;
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 입고
const handleReceive = async () => {
    const payload = [];

    Object.keys(checkedDetails.value).forEach((procId) => {
        const selectedItems = checkedDetails.value[procId];
        if (selectedItems && selectedItems.length > 0) {
            payload.push(...selectedItems); // 선택된 상세 항목 추가
        }
    });

    if (payload.length === 0) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    if (confirm('등록하시겠습니까?')) {
        try {
            await axios.post('/api/receive', payload);
            alert('입고 처리 완료');
            // 필요 시 화면 리로드 또는 상세 초기화
        } catch (error) {
            console.error(error);
            alert('입고 처리 실패');
        }
    }
};
</script>

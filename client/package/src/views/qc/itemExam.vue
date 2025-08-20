<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="제품 품질검사"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="dataReset()"
                btn-text2="등록"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="addExam()"
            />
            <v-row>
                <v-col cols="12" md="12">
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="4">
                            <v-text-field label="생산실적" v-model="selectRsrtId" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="prodModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="품목" v-model="selectItemName" variant="outlined" readonly> </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="수량" v-model="selectItemQty" variant="outlined" readonly> </v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                    <v-row dense>
                        <v-col cols="12" sm="4">
                            <v-text-field label="담당자" v-model="selectEmpName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="empModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="비고" v-model="remk" variant="outlined"> </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="결과" v-model="detail_sttus" variant="outlined" readonly :style="{ fontWeight: 'bold' }" />
                        </v-col>
                    </v-row> </v-col
            ></v-row>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader1 title="검사 목록" />
            <v-row>
                <v-col cols="12" md="12">
                    <div class="card">
                        <DataTable :value="examDetailList" paginator :rows="10" tableStyle="min-width: 50rem; table-layout: fixed;">
                            <Column field="insp_id" header="검사번호" style="width: 180px"> </Column>
                            <Column field="insp_nm" header="검사명" style="width: 200px" />
                            <Column field="insp_mthd" header="검사방식" style="width: 150px" />
                            <Column field="insp_typ" header="검사유형" style="width: 100px" />
                            <Column field="basi_val" header="기준값" style="width: 100px" />
                            <Column header="측정값" style="width: 100px">
                                <template #body="slotProps">
                                    <v-text-field
                                        v-model.number="examDetailList[slotProps.index].judt_val"
                                        type="number"
                                        dense
                                        hide-details
                                        style="width: 120px"
                                        variant="outlined"
                                        @input="checkResult(slotProps.index)"
                                    /> </template
                            ></Column>
                            <Column field="detail_sttus" header="결과" style="width: 100px">
                                <template #body="slotProps">
                                    <span
                                        :style="{
                                            color:
                                                examDetailList[slotProps.index].detail_sttus === '합격'
                                                    ? 'green'
                                                    : examDetailList[slotProps.index].detail_sttus === '불합격'
                                                      ? 'red'
                                                      : 'black',
                                            fontWeight: 'bold'
                                        }"
                                    >
                                        {{ examDetailList[slotProps.index].detail_sttus }}
                                    </span>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 담당자 모달 -->
    <ModalSearch
        :visible="empModal"
        title="사원"
        idField="emd_id"
        :columns="[
            { key: 'emp_id', label: '사원번호' },
            { key: 'emp_name', label: '사원이름' }
        ]"
        :fetchData="fetchEmp"
        :pageSize="5"
        @select="onSelectEmp"
        @close="empModal = false"
    />

    <!-- 생산실적 모달 -->
    <ModalSearch
        :visible="prodModal"
        title="생산실적"
        idField="rsrt_id"
        :columns="[
            { key: 'rsrt_id', label: '실적번호' },
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'prod_qty', label: '생산 수량' }
        ]"
        :fetchData="fetchProd"
        :pageSize="5"
        @select="onSelectProd"
        @close="prodModal = false"
    />
    <SnackBar />
</template>

<script setup>
import CardHeader1 from '@/components/production/card-header.vue';
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed, reactive } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import dayjs from 'dayjs';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackBar } = useSnackBar();
const examDetailList = ref([]);
const empModal = ref(false); // LOT번호 모달
const selectItemId = ref(null);
const selectItemName = ref(null);
const selectItemQty = ref(null);
const selectEmpId = ref(null); // 사원 번호
const selectEmpName = ref(null); // 사원 이름
const remk = ref(null); // 비고
const selectRsrtId = ref(null);
const prodModal = ref(null);
const detail_sttus = ref(null);

onMounted(() => {});

const fetchEmp = async () => {
    try {
        const response = await axios.get('/api/selectEmp');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

const fetchProd = async () => {
    try {
        const response = await axios.get('/api/prodList');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectProd = async (item) => {
    selectRsrtId.value = item.rsrt_id; // 실적번호
    selectItemName.value = item.item_name;
    selectItemId.value = item.item_id; // 품목번호
    selectEmpId.value = item.emp_id; // 사원번호
    selectItemQty.value = item.prod_qty;
    detail_sttus.value = '불합격'; // 결과

    try {
        const params = {
            detail_sttus: '검수대기', // 사용여부
            item_id: item.item_id
        };
        const response = await axios.get('/api/examDetail', { params });
        examDetailList.value = response.data;
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

const onSelectEmp = (item) => {
    selectEmpId.value = item.emp_id; // 사원번호
    selectEmpName.value = item.emp_name; // 사원명
};

// 입력 값 초기화
const dataReset = () => {
    if (confirm('초기화하시겠습니까?')) {
        selectRsrtId.value = null;
        selectItemName.value = null;
        selectItemQty.value = null;
        selectEmpName.value = null;
        remk.value = null;
        detail_sttus.value = null;
        examDetailList.value = [];
    }
};

const checkResult = (index) => {
    const item = examDetailList.value[index];

    if (item.judt_val === null || item.judt_val === undefined) {
        item.detail_sttus = '';
    } else {
        item.detail_sttus = item.judt_val >= item.basi_val ? '합격' : '불합격';
    }

    // 모든 항목이 합격인지 확인
    const allPass = examDetailList.value.every((e) => e.detail_sttus === '합격');

    // 상단 결과 업데이트
    detail_sttus.value = allPass ? '합격' : '불합격';
};

// 등록 실행
const addExam = async () => {
    if (confirm('등록하시겠습니까?')) {
        try {
            const payload = {
                rsrt_id: selectRsrtId.value, // 생산실적 번호
                item_id: selectItemId.value,
                emp_id: selectEmpId.value,
                sttus: detail_sttus.value,
                exam_qty: selectItemQty.value,
                remk: remk.value,
                details: examDetailList.value.map((item) => ({
                    insp_id: item.insp_id,
                    basi_val: item.basi_val,
                    judt_val: item.judt_val,
                    sttus: item.detail_sttus
                }))
            };

            const response = await axios.post('/api/examHisInsert', payload);
            if (response.data.result) {
                snackBar('등록 성공', 'success');
                dataReset();
                examDetailList.value = [];
            } else {
                snackBar('등록 실패.', 'error');
            }
        } catch (err) {
            snackBar('에러', 'error');
        }
    }
};
</script>

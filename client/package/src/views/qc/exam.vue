<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="검사서 등록"
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
                            <v-text-field label="품목" v-model="selectItemName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
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
                    </v-row>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader title="검사 상세" btn-text="행 추가" btn-variant="flat" btn-color="#424242" @btn-click="addRow()" />
            <v-row>
                <v-col cols="12" md="12">
                    <div class="card">
                        <DataTable :value="examDetailList" paginator :rows="10" tableStyle="min-width: 50rem; table-layout: fixed;">
                            <Column header="검사번호" style="width: 180px">
                                <template #body="slotProps">
                                    {{ slotProps.data.insp_id }}
                                    <v-icon small class="ml-2 cursor-pointer" @click="openExamModal(slotProps.index)">mdi-magnify</v-icon>
                                </template>
                            </Column>
                            <Column field="insp_nm" header="검사명" style="width: 200px" />
                            <Column field="insp_mthd" header="검사방식" style="width: 150px" />
                            <Column field="insp_typ" header="검사유형" style="width: 100px" />
                            <Column field="basi_val" header="기준값" style="width: 100px" />

                            <!-- 삭제 버튼 -->
                            <Column style="width: 80px; text-align: center">
                                <template #body="slotProps">
                                    <v-btn icon color="error" @click="deleteRow(slotProps.index)">
                                        <v-icon size="20">mdi-delete</v-icon>
                                    </v-btn>
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

    <!-- 품목번호 모달 -->
    <ModalSearch
        :visible="itemModal"
        title="품목"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'unit', label: '단위' },
            { key: 'spec', label: '규격' }
        ]"
        :fetchData="fetchItem"
        :pageSize="5"
        @select="onSelectItem"
        @close="itemModal = false"
    />

    <!-- 품목번호 모달 -->
    <ModalSearch
        :visible="examModal"
        title="품목"
        idField="insp_id"
        :columns="[
            { key: 'insp_id', label: '검사번호' },
            { key: 'insp_nm', label: '검사명' },
            { key: 'insp_mthd', label: '검사방식' },
            { key: 'insp_typ', label: '검사유형' },
            { key: 'basi_val', label: '기준값' }
        ]"
        :fetchData="fetchExam"
        :pageSize="5"
        @select="onSelectExam"
        @close="examModal = false"
    />

    <SnackBar />
</template>

<script setup>
import CardHeader from '@/components/production/card-header-btn.vue';
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
const itemModal = ref(false); // 품목 모달
const selectItemId = ref(null); // 거래처 번호
const selectItemName = ref(null); // 거래처 이름
const selectEmpId = ref(null); // 사원 번호
const selectEmpName = ref(null); // 사원 이름
const remk = ref(null); // 비고
const examModal = ref(null);
const examModalIndex = ref(null);

onMounted(() => {});

const formattedregDate = computed(() => {
    return regDate.value ? dayjs(regDate.value).format('YYYY-MM-DD') : '';
});

const formattedpapDate = computed(() => {
    return papDate.value ? dayjs(papDate.value).format('YYYY-MM-DD') : '';
});

const fetchEmp = async () => {
    try {
        const params = {
            dept_id: 'D004'
        };
        const response = await axios.get('/api/selectEmp', { params });
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

const fetchItem = async () => {
    try {
        const params = {
            uon: 'Y', // 사용여부
            item_type: '완제품',
            item_type1: '반제품'
        };
        const response = await axios.get('/api/itemList', { params });
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

const fetchExam = async () => {
    try {
        const params = {
            uon: 'Y' // 사용여부
        };
        const response = await axios.get('/api/inspList', { params });
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        snackBar('조회 실패.', 'error');
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectItem = (item) => {
    selectItemId.value = item.item_id; // 거래처번호
    selectItemName.value = item.item_name; // 거래처명
};

const onSelectEmp = (item) => {
    selectEmpId.value = item.emp_id; // 사원번호
    selectEmpName.value = item.emp_name; // 사원명
};

// 품목번호 모달 열기
const openExamModal = (index) => {
    examModalIndex.value = index;
    examModal.value = true;
};

const onSelectExam = (item) => {
    if (examModalIndex.value != null) {
        const row = examDetailList.value[examModalIndex.value];

        row.insp_id = item.insp_id;
        row.insp_nm = item.insp_nm;
        row.insp_mthd = item.insp_mthd;
        row.insp_typ = item.insp_typ;
        row.basi_val = item.basi_val;

        examModal.value = false;
        examModalIndex.value = null;
    }
};

// 행 추가
const addRow = () => {
    examDetailList.value.push({
        insp_id: '',
        insp_nm: '',
        insp_mthd: '',
        insp_typ: '',
        basi_val: ''
    });
};

// 행 삭제 함수
const deleteRow = (index) => {
    if (confirm('삭제하시겠습니까?')) {
        examDetailList.value.splice(index, 1);
    }
};

// 입력 값 초기화
const dataReset = () => {
    selectItemId.value = null;
    selectItemName.value = null;
    selectEmpId.value = null;
    selectEmpName.value = null;
    remk.value = null;
};

// 등록 실행
const addExam = async () => {
    if (!selectItemId.value) {
        snackBar('품목을 선택해주세요.', 'warning');
        return;
    }
    if (!selectEmpId.value) {
        snackBar('담당자를 선택해주세요.', 'warning');
        return;
    }

    // 상세 항목 존재 여부 체크
    if (!examDetailList.value || examDetailList.value.length === 0) {
        snackBar('상세 항목을 하나 이상 선택해주세요.', 'warning');
        return;
    }

    const invalidRow = examDetailList.value.find((row) => !row.insp_id);
    if (invalidRow) {
        snackBar('검사 번호를 선택하지 않은 행이 있습니다.', 'warning');
        return;
    }

    if (confirm('등록하시겠습니까?')) {
        try {
            const payload = {
                item_id: selectItemId.value,
                emp_id: selectEmpId.value,
                remk: remk.value,
                details: examDetailList.value.map((item) => ({
                    insp_id: item.insp_id
                }))
            };

            const response = await axios.post('/api/examInsert', payload);
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

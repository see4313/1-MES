<template>
    <!-- 조회 영역 -->
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="고장/수리 조회"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="selectReset"
                btn-text2="조회"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="select"
            />
            <v-row>
                <v-col cols="12" md="12">
                    <v-row justify="space-between" dense>
                        <!-- 설비명 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="설비명" v-model="selectItemName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemNameModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 설비유형 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="설비유형" v-model="selectFacilityType" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 고장유형 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="고장유형" v-model="selectFailType" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="failTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 담당자 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="담당자" v-model="selectCutd" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="cutdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 긴급도 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="긴급도" v-model="selectUrgency" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="urgencyModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 목록 영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader title="고장/수리 목록" />
            <DataTable
                v-model:selection="selectfacilityList"
                :value="facilityList"
                selectionMode="single"
                :metaKeySelection="false"
                dataKey="repair_hist_id"
                paginator
                :rows="5"
                tableStyle="min-width: 50rem"
                class="cursor-pointer"
            >
                <Column field="facility_id" header="설비ID" />
                <Column field="facility_nm" header="설비명" />
                <Column field="facility_type_name" header="설비유형" />
                <Column field="failure_type" header="고장 유형" />
                <Column field="urgency_name" header="긴급도" />
                <Column field="fail_dt" header="고장일자" />
                <Column field="repair_dt" header="수리일자" />
                <Column field="repair_end_dt" header="수리완료일자" />
                <Column field="emp_name" header="담당자" />
                <Column field="oper_yn" header="설비 상태" />
                <Column field="remk" header="비고" />
            </DataTable>
        </v-card-item>
    </v-card>

    <!-- 등록/수정 영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader3
                title="고장/수리 관리"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="dataReset"
                btn-text2="삭제"
                btn-variant2="flat"
                btn-color2="error"
                :btn-disabled2="!repairHistId"
                @btn-click2="itemDelete"
                btn-text3="저장"
                btn-variant3="flat"
                btn-color3="primary"
                @btn-click3="itemSave"
            />
            <v-row dense>
                <v-col cols="12" sm="4"><v-text-field label="수리이력ID" v-model="repairHistId" variant="outlined" readonly /></v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비ID" v-model="facilityId" variant="outlined" readonly />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비명" v-model="facilityName" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="itemNameModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비유형" v-model="facilityType" variant="outlined" readonly />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="고장유형" v-model="failType" variant="outlined" readonly />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="긴급도" v-model="urgencyName" variant="outlined" readonly />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field type="date" label="고장일자" v-model="fail_dt" :max="todayStr" variant="outlined" />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field type="date" label="수리일자" v-model="repair_dt" :max="todayStr" variant="outlined" />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field type="date" label="수리완료일자" v-model="repair_end_dt" :max="todayStr" variant="outlined" />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="담당자" v-model="itemCutd" variant="outlined" readonly />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비 상태" v-model="oper_yn" variant="outlined" readonly />
                </v-col>
                <v-col cols="12"><v-textarea label="비고" v-model="itemRemk" outlined rows="5" /></v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackOpen, snackMessage, snackColor } = useSnackBar();
function showSnack(msg, color = 'success') {
    snackMessage.value = msg;
    snackColor.value = color;
    snackOpen.value = true;
}

const todayStr = new Date().toISOString().split('T')[0];

// 조회조건
const selectItemName = ref('');
const selectItemId = ref('');
const selectFacilityType = ref('');
const selectFacilityTypeId = ref('');
const selectFailType = ref('');
const selectFailTypeId = ref('');
const selectCutd = ref('');
const selectCutdId = ref('');
const selectUrgency = ref('');
const selectUrgencyId = ref('');

// 목록
const facilityList = ref([]);
const selectfacilityList = ref(null);

// 등록폼
const repairHistId = ref('');
const facilityId = ref('');
const facilityName = ref('');
const facilityType = ref('');
const failType = ref('');
const urgencyName = ref('');
const urgencyId = ref('');
const fail_dt = ref('');
const repair_dt = ref('');
const repair_end_dt = ref('');
const oper_yn = ref('미수리');
const itemCutd = ref('');
const itemRemk = ref('');

// 모달 상태
const itemNameModal = ref(false);
const itemTypeModal = ref(false);
const failTypeModal = ref(false);
const cutdModal = ref(false);
const urgencyModal = ref(false);

// 조회 초기화
function selectReset() {
    selectItemName.value = '';
    selectItemId.value = '';
    selectFacilityType.value = '';
    selectFacilityTypeId.value = '';
    selectFailType.value = '';
    selectFailTypeId.value = '';
    selectCutd.value = '';
    selectCutdId.value = '';
    selectUrgency.value = '';
    selectUrgencyId.value = '';
}

// 등록폼 초기화
function dataReset() {
    repairHistId.value = '';
    facilityId.value = '';
    facilityName.value = '';
    facilityType.value = '';
    failType.value = '';
    urgencyName.value = '';
    urgencyId.value = '';
    fail_dt.value = '';
    repair_dt.value = '';
    repair_end_dt.value = '';
    oper_yn.value = '미수리';
    itemCutd.value = '';
    itemRemk.value = '';
}

// 목록 조회
async function select() {
    try {
        const params = {
            facility_id: selectItemId.value,
            facility_type: selectFacilityTypeId.value,
            fail_type_cd: selectFailTypeId.value,
            emp_id: selectCutdId.value,
            urgency_id: selectUrgencyId.value
        };

        const response = await axios.get('/api/repairHist', { params });
        facilityList.value = response.data;
        if (!response.data.length) {
            showSnack('조회 결과가 없습니다.', 'warning');
        }
    } catch (error) {
        console.error('조회 실패', error);
        showSnack('조회 중 오류가 발생했습니다.', 'error');
    }
}

// 목록 선택 → 폼 세팅
watch(selectfacilityList, (val) => {
    if (!val) return;
    repairHistId.value = val.repair_hist_id || '';
    facilityId.value = val.facility_id || '';
    facilityName.value = val.facility_name || '';
    facilityType.value = val.facility_type_name || '';
    failType.value = val.failure_type || '';
    urgencyName.value = val.urgency_name || '';
    fail_dt.value = val.fail_dt || '';
    repair_dt.value = val.repair_dt || '';
    repair_end_dt.value = val.repair_end_dt || '';
    oper_yn.value = val.oper_yn === 'Y' ? '가동' : '미수리';
    itemCutd.value = val.emp_name || '';
    itemRemk.value = val.remk || '';
});
</script>

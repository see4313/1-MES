<template>
    <!-- 조회 영역 -->
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="세척이력 조회"
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
                            <v-text-field label="설비명" v-model="filterFacilityName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="facilityModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 담당자 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="담당자" v-model="filterEmpName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="empModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 기간 -->
                        <v-col cols="12" sm="3">
                            <v-text-field type="date" label="시작일" v-model="filterFromDate" :max="todayStr" variant="outlined" />
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-text-field type="date" label="종료일" v-model="filterToDate" :max="todayStr" variant="outlined" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 목록 영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader title="세척이력 목록" />
            <DataTable
                v-model:selection="selectedHist"
                :value="histList"
                selectionMode="single"
                :metaKeySelection="false"
                dataKey="hist_id"
                paginator
                :rows="10"
                tableStyle="min-width: 60rem"
                class="cursor-pointer"
            >
                <Column field="hist_id" header="ID" />
                <Column field="facility_name" header="설비명" />
                <Column field="emp_name" header="담당자" />
                <Column field="clean_start_dt" header="시작일시" />
                <Column field="clean_end_dt" header="종료일시" />
                <Column field="duration_min" header="소요(분)" />
                <Column field="remk" header="비고" />
                <Column field="is_active" header="상태" />
            </DataTable>
            <p v-if="!histList.length" class="text-grey mt-3">조회 결과가 없습니다.</p>
        </v-card-item>
    </v-card>

    <!-- 등록/정정 영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader3
                :title="histId ? '세척이력 정정' : '세척이력 등록'"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="dataReset"
                btn-text2="무효"
                btn-variant2="flat"
                btn-color2="error"
                :btn-disabled2="!histId"
                @btn-click2="voidHist"
                btn-text3="저장"
                btn-variant3="flat"
                btn-color3="primary"
                @btn-click3="saveHist"
            />
            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비명" v-model="facilityName" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="facilityModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="담당자" v-model="empName" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="empModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="이력ID" v-model="histId" variant="outlined" readonly />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="6">
                    <v-text-field type="datetime-local" label="세척 시작일시" v-model="startLocal" :max="nowLocal" variant="outlined" />
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field type="datetime-local" label="세척 종료일시" v-model="endLocal" :max="nowLocal" variant="outlined" />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12">
                    <v-textarea label="비고" v-model="remk" outlined rows="4" />
                </v-col>
            </v-row>

            <v-row dense v-if="histId">
                <v-col cols="12">
                    <v-textarea label="정정 사유" v-model="editReason" outlined rows="3" />
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 모달 공통: 설비/담당자 -->
    <ModalSearch
        :visible="facilityModal"
        title="설비명"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: 'ID' },
            { key: 'item_name', label: '설비명' }
        ]"
        :fetchData="fetchFacilities"
        @select="onSelectFacility"
        @close="facilityModal = false"
    />
    <ModalSearch
        :visible="empModal"
        title="담당자"
        idField="user_id"
        :columns="[
            { key: 'user_id', label: 'ID' },
            { key: 'user_name', label: '이름' }
        ]"
        :fetchData="fetchUsers"
        @select="onSelectEmp"
        @close="empModal = false"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackOpen" :color="snackColor" timeout="2000" location="top right">
        {{ snackMessage }}
    </v-snackbar>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ModalSearch from '@/views/commons/CommonModal.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';
import { useFormatDate } from '@/composables/useFormatDate';

const { formatDate } = useFormatDate();
const { snackOpen, snackMessage, snackColor } = useSnackBar();
const showSnack = (msg, color = 'success') => {
    snackMessage.value = msg;
    snackColor.value = color;
    snackOpen.value = true;
};

// 오늘/현재
const todayStr = new Date().toISOString().split('T')[0];
const nowLocal = computed(() => {
    const n = new Date();
    const p = (x) => String(x).padStart(2, '0');
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
});

// ===== 조회 필터 =====
const filterFacilityId = ref('');
const filterFacilityName = ref('');
const filterEmpId = ref('');
const filterEmpName = ref('');
const filterFromDate = ref('');
const filterToDate = ref('');

// ===== 목록 =====
const histList = ref([]);
const selectedHist = ref(null);

// ===== 폼 =====
const histId = ref('');
const facilityId = ref('');
const facilityName = ref('');
const empId = ref('');
const empName = ref('');
const startLocal = ref(''); // datetime-local
const endLocal = ref('');
const remk = ref('');
const editReason = ref(''); // 정정 사유(정정 시)

// ===== 모달 =====
const facilityModal = ref(false);
const empModal = ref(false);

// 모달 데이터
const fetchFacilities = async () => (await axios.get('/api/itemNames')).data;
const fetchUsers = async () => (await axios.get('/api/users')).data;

// 모달 선택
function onSelectFacility(row) {
    facilityId.value = row.item_id;
    facilityName.value = row.item_name;
    filterFacilityId.value = row.item_id;
    filterFacilityName.value = row.item_name;
    facilityModal.value = false;
}
function onSelectEmp(row) {
    empId.value = row.user_id;
    empName.value = row.user_name;
    filterEmpId.value = row.user_id;
    filterEmpName.value = row.user_name;
    empModal.value = false;
}

// ===== 공통 유틸 =====
function toDateTimeSeconds(localValue) {
    if (!localValue) return null; // 값이 없으면 null
    const [date, timeRaw] = String(localValue).split('T'); // 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DDTHH:mm:ss'
    if (!date || !timeRaw) return null;
    const time = timeRaw.length === 5 ? `${timeRaw}:00` : timeRaw; // 초가 없으면 붙이기
    return `${date} ${time}`; // 'YYYY-MM-DD HH:mm:ss'
}
function minsBetween(a, b) {
    const st = new Date(a),
        ed = new Date(b);
    return Math.max(0, Math.round((ed - st) / 60000));
}

// ===== 조회 =====
async function select() {
    try {
        const params = {
            facility_id: filterFacilityId.value || null,
            emp_id: filterEmpId.value || null,
            from_dt: filterFromDate.value ? formatDate(filterFromDate.value, '-') + ' 00:00:00' : null,
            to_dt: filterToDate.value ? formatDate(filterToDate.value, '-') + ' 23:59:59' : null
        };
        const { data } = await axios.get('/api/cleanHistList', { params });
        // duration 및 표시용 가공
        histList.value = (data || []).map((x) => ({
            ...x,
            duration_min: x.clean_start_dt && x.clean_end_dt ? minsBetween(x.clean_start_dt, x.clean_end_dt) : null,
            is_active: x.is_active ?? 'Y'
        }));
    } catch (e) {
        console.error(e);
        showSnack('이력 조회에 실패했습니다', 'error');
    }
}

// 조회 초기화
function selectReset() {
    filterFacilityId.value = '';
    filterFacilityName.value = '';
    filterEmpId.value = '';
    filterEmpName.value = '';
    filterFromDate.value = '';
    filterToDate.value = '';
    histList.value = [];
    selectedHist.value = null;
}

// ===== 폼 바인딩: 목록 선택 시 =====
watch(selectedHist, (val) => {
    if (!val) return;
    histId.value = val.hist_id || '';
    facilityId.value = val.facility_id || '';
    facilityName.value = val.facility_name || '';
    empId.value = val.emp_id || '';
    empName.value = val.emp_name || '';
    // 서버 DATETIME -> 로컬 datetime-local
    startLocal.value = val.clean_start_dt ? val.clean_start_dt.replace(' ', 'T').slice(0, 16) : '';
    endLocal.value = val.clean_end_dt ? val.clean_end_dt.replace(' ', 'T').slice(0, 16) : '';
    remk.value = val.remk || '';
    editReason.value = '';
});

// 폼 초기화
function dataReset() {
    histId.value = '';
    facilityId.value = '';
    facilityName.value = '';
    empId.value = '';
    empName.value = '';
    startLocal.value = '';
    endLocal.value = '';
    remk.value = '';
    editReason.value = '';
    selectedHist.value = null;
}

// ===== 저장(등록/정정) =====
async function saveHist() {
    // 유효성
    if (!facilityId.value || !empId.value || !startLocal.value || !endLocal.value) {
        showSnack('필수값을 입력하세요', 'error');
        return;
    }
    const st = new Date(startLocal.value);
    const ed = new Date(endLocal.value);
    if (ed < st) {
        showSnack('종료일시는 시작일시 이후여야 합니다', 'error');
        return;
    }

    const payload = {
        hist_id: histId.value || null,
        facility_id: Number(facilityId.value),
        emp_id: empId.value,
        clean_start_dt: toDateTimeSeconds(startLocal.value),
        clean_end_dt: toDateTimeSeconds(endLocal.value),
        remk: remk.value,
        edit_reason: histId.value ? editReason.value || null : null
    };

    const confirmMsg = histId.value ? '정말 정정(수정)하시겠습니까?' : '정말 등록하시겠습니까?';
    if (!confirm(confirmMsg)) return;

    try {
        let res;
        if (!histId.value) {
            res = await axios.post('/api/cleanHistInsert', payload);
        } else {
            res = await axios.put('/api/cleanHistUpdate', payload);
        }
        console.log(res);
        if (res.data?.success) {
            showSnack(histId.value ? '정정되었습니다' : '등록되었습니다', histId.value ? 'warning' : 'success');
            await select();
            dataReset();
        } else {
            showSnack(res.data?.error || '저장 실패', 'error');
        }
    } catch (e) {
        console.error(e);
        showSnack('저장 실패', 'error');
    }
}

// ===== 무효 처리(선택) =====
async function voidHist() {
    if (!histId.value) return showSnack('무효 처리할 이력을 선택하세요', 'warning');
    if (!confirm('정말 이 이력을 무효 처리하시겠습니까?')) return;

    try {
        const { data } = await axios.patch('/api/cleanHistVoid', { hist_id: histId.value, edit_reason: editReason.value || null });
        if (data?.success) {
            showSnack('무효 처리되었습니다', 'error');
            await select();
            dataReset();
        } else {
            showSnack(data?.error || '무효 처리 실패', 'error');
        }
    } catch (e) {
        console.error(e);
        showSnack('무효 처리 실패', 'error');
    }
}
</script>

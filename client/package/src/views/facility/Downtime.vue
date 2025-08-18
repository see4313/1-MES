<template>
    <!-- 조회 영역 -->
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="비가동 조회"
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
                        <v-col cols="12" sm="3">
                            <v-text-field label="설비명" v-model="filterFacilityName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon class="cursor-pointer" @click="facilityModal = true">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-text-field label="담당자" v-model="filterEmpName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon class="cursor-pointer" @click="empModal = true">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-text-field label="비가동 유형" v-model="filterDownTypeName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon class="cursor-pointer" @click="downTypeModal = true">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
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
            <CardHeader title="비가동 목록" />
            <DataTable
                v-model:selection="selectedRow"
                :value="rows"
                selectionMode="single"
                :metaKeySelection="false"
                dataKey="down_id"
                paginator
                :rows="10"
                :loading="listLoading"
                tableStyle="min-width: 64rem"
                class="cursor-pointer"
                @row-dblclick="
                    ({ data }) => {
                        selectedRow = data;
                    }
                "
            >
                <Column field="down_id" header="ID" />
                <Column field="facility_name" header="설비명" />
                <Column field="emp_name" header="담당자" />
                <Column field="down_type_name" header="비가동 유형" />
                <Column field="down_start_dt" header="시작일시" />
                <Column field="down_end_dt" header="종료일시" />
                <Column field="duration_min" header="소요(분)" />
                <Column header="상태">
                    <template #body="{ data }">
                        <v-chip size="small" :color="data.oper_yn === 'Y' ? 'primary' : 'grey'" variant="flat">
                            {{ data.oper_yn === 'Y' ? '가동' : '비가동' }}
                        </v-chip>
                    </template>
                </Column>
                <Column field="remk" header="비고" />
            </DataTable>
            <p v-if="!rows.length && !listLoading" class="text-grey mt-3">조회 결과가 없습니다.</p>
        </v-card-item>
    </v-card>

    <!-- 등록/정정 영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader3
                :title="downId ? '비가동 정정' : '비가동 등록'"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="formReset"
                btn-text2="무효"
                btn-variant2="flat"
                btn-color2="error"
                :btn-disabled2="!downId || voiding"
                @btn-click2="voidRow"
                btn-text3="저장"
                btn-variant3="flat"
                btn-color3="primary"
                :btn-disabled3="saving"
                @btn-click3="saveRow"
            />
            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비명" v-model="facilityName" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon class="cursor-pointer" @click="facilityModal = true">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="담당자" v-model="empName" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon class="cursor-pointer" @click="empModal = true">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="비가동 유형" v-model="downTypeName" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon class="cursor-pointer" @click="downTypeModal = true">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="이력ID" v-model="downId" variant="outlined" readonly />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field type="datetime-local" label="비가동 시작" v-model="startLocal" :max="nowLocal" variant="outlined" />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field type="datetime-local" label="비가동 종료" v-model="endLocal" :max="nowLocal" variant="outlined" />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="6">
                    <v-radio-group v-model="operYn" inline>
                        <v-radio label="비가동" value="N" />
                        <v-radio label="가동" value="Y" />
                    </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-textarea label="비고" v-model="remk" rows="2" variant="outlined" />
                </v-col>
            </v-row>

            <v-row dense v-if="downId">
                <v-col cols="12">
                    <v-textarea label="정정 사유" v-model="editReason" rows="3" variant="outlined" />
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 모달: 설비/담당자/비가동유형 -->
    <ModalSearch
        :visible="facilityModal"
        title="설비명"
        idField="facility_id"
        :columns="[
            { key: 'facility_id', label: 'ID' },
            { key: 'facility_name', label: '설비명' }
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
    <ModalSearch
        :visible="downTypeModal"
        title="비가동 유형"
        idField="down_type_id"
        :columns="[
            { key: 'down_type_id', label: 'ID' },
            { key: 'down_type_name', label: '유형명' }
        ]"
        :fetchData="fetchDownTypes"
        @select="onSelectDownType"
        @close="downTypeModal = false"
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
const showSnack = (m, c = 'success') => {
    snackMessage.value = m;
    snackColor.value = c;
    snackOpen.value = true;
};

// 오늘/현재
const todayStr = new Date().toISOString().split('T')[0];
const nowLocal = computed(() => {
    const n = new Date(),
        p = (x) => String(x).padStart(2, '0');
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
});

// ===== 상태 플래그 =====
const listLoading = ref(false);
const saving = ref(false);
const voiding = ref(false);

// ===== 조회 필터 =====
const filterFacilityId = ref('');
const filterFacilityName = ref('');
const filterEmpId = ref('');
const filterEmpName = ref('');
const filterDownTypeId = ref('');
const filterDownTypeName = ref('');
const filterFromDate = ref(todayStr);
const filterToDate = ref(todayStr);

// ===== 목록/선택 =====
const rows = ref([]);
const selectedRow = ref(null);

// ===== 폼 =====
const downId = ref('');
const facilityId = ref('');
const facilityName = ref('');
const empId = ref('');
const empName = ref('');
const downTypeId = ref('');
const downTypeName = ref('');
const startLocal = ref(''); // datetime-local
const endLocal = ref('');
const operYn = ref('N'); // N=비가동, Y=가동
const remk = ref('');
const editReason = ref('');

// ===== 모달 =====
const facilityModal = ref(false);
const empModal = ref(false);
const downTypeModal = ref(false);

// ===== 선택 데이터 로드 =====
const fetchFacilities = async () => (await axios.get('/api/facilities')).data;
const fetchUsers = async () => (await axios.get('/api/users')).data;
const fetchDownTypes = async () => (await axios.get('/api/downTypes')).data;

// ===== 모달 선택 =====
function onSelectFacility(row) {
    facilityId.value = row.facility_id;
    facilityName.value = row.facility_name;
    filterFacilityId.value = row.facility_id;
    filterFacilityName.value = row.facility_name;
    facilityModal.value = false;
}
function onSelectEmp(row) {
    empId.value = row.user_id;
    empName.value = row.user_name;
    filterEmpId.value = row.user_id;
    filterEmpName.value = row.user_name;
    empModal.value = false;
}
function onSelectDownType(row) {
    downTypeId.value = row.down_type_id;
    downTypeName.value = row.down_type_name;
    filterDownTypeId.value = row.down_type_id;
    filterDownTypeName.value = row.down_type_name;
    downTypeModal.value = false;
}

// ===== 유틸 =====
function toDateTimeSeconds(local) {
    if (!local) return '';
    const d = new Date(local),
        p = (x) => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function minsBetween(a, b) {
    const st = new Date(a),
        ed = new Date(b);
    return Math.max(0, Math.round((ed - st) / 60000));
}

// ===== 조회 =====
async function select() {
    try {
        if (filterFromDate.value && filterToDate.value && filterFromDate.value > filterToDate.value) {
            showSnack('시작일이 종료일보다 클 수 없습니다', 'error');
            return;
        }
        listLoading.value = true;
        const params = {
            facility_id: filterFacilityId.value || null,
            emp_id: filterEmpId.value || null,
            down_type_id: filterDownTypeId.value || null,
            from_dt: filterFromDate.value ? `${formatDate(filterFromDate.value, '-')} 00:00:00` : null,
            to_dt: filterToDate.value ? `${formatDate(filterToDate.value, '-')} 23:59:59` : null
        };
        const { data } = await axios.get('/api/downtimeList', { params });
        rows.value = (data || []).map((x) => ({
            ...x,
            duration_min: x.down_start_dt && x.down_end_dt ? minsBetween(x.down_start_dt, x.down_end_dt) : null,
            oper_yn: x.oper_yn ?? 'N'
        }));
    } catch (e) {
        console.error(e);
        showSnack('비가동 조회 실패', 'error');
    } finally {
        listLoading.value = false;
    }
}

// ===== 조회 초기화 =====
function selectReset() {
    filterFacilityId.value = '';
    filterFacilityName.value = '';
    filterEmpId.value = '';
    filterEmpName.value = '';
    filterDownTypeId.value = '';
    filterDownTypeName.value = '';
    filterFromDate.value = todayStr;
    filterToDate.value = todayStr;
    rows.value = [];
    selectedRow.value = null;
}

// ===== 선택 → 폼 바인딩 =====
watch(selectedRow, (val) => {
    if (!val) return;
    downId.value = val.down_id || '';
    facilityId.value = val.facility_id || '';
    facilityName.value = val.facility_name || '';
    empId.value = val.emp_id || '';
    empName.value = val.emp_name || '';
    downTypeId.value = val.down_type_id || '';
    downTypeName.value = val.down_type_name || '';
    startLocal.value = val.down_start_dt ? val.down_start_dt.replace(' ', 'T').slice(0, 16) : '';
    endLocal.value = val.down_end_dt ? val.down_end_dt.replace(' ', 'T').slice(0, 16) : '';
    operYn.value = val.oper_yn ?? 'N';
    remk.value = val.remk || '';
    editReason.value = '';
});

// ===== 폼 초기화 =====
function formReset() {
    downId.value = '';
    // 필터 프리필
    facilityId.value = filterFacilityId.value;
    facilityName.value = filterFacilityName.value;
    empId.value = filterEmpId.value;
    empName.value = filterEmpName.value;
    downTypeId.value = filterDownTypeId.value;
    downTypeName.value = filterDownTypeName.value;
    const n = new Date(),
        p = (x) => String(x).padStart(2, '0');
    const base = `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
    startLocal.value = base;
    endLocal.value = base;
    operYn.value = 'N';
    remk.value = '';
    editReason.value = '';
    selectedRow.value = null;
}

// ===== 저장(등록/정정) =====
async function saveRow() {
    if (!facilityId.value || !empId.value || !downTypeId.value || !startLocal.value || !endLocal.value) {
        showSnack('필수값을 입력하세요', 'error');
        return;
    }
    const st = new Date(startLocal.value),
        ed = new Date(endLocal.value);
    if (ed < st) return showSnack('종료일시는 시작일시 이후여야 합니다', 'error');

    const payload = {
        down_id: downId.value || null,
        facility_id: facilityId.value,
        emp_id: empId.value,
        down_type_id: downTypeId.value,
        down_start_dt: toDateTimeSeconds(startLocal.value),
        down_end_dt: toDateTimeSeconds(endLocal.value),
        oper_yn: operYn.value,
        remk: remk.value,
        edit_reason: downId.value ? editReason.value || null : null
    };

    if (!confirm(downId.value ? '정말 정정(수정)하시겠습니까?' : '정말 등록하시겠습니까?')) return;

    if (saving.value) return;
    saving.value = true;
    try {
        const res = downId.value ? await axios.put('/api/downtimeUpdate', payload) : await axios.post('/api/downtimeInsert', payload);
        if (res.data?.success) {
            showSnack(downId.value ? '정정되었습니다' : '등록되었습니다', downId.value ? 'warning' : 'success');
            await select();
            formReset();
        } else {
            showSnack(res.data?.error || '저장 실패', 'error');
        }
    } catch (e) {
        console.error(e);
        showSnack('저장 실패', 'error');
    } finally {
        saving.value = false;
    }
}

// ===== 무효 처리 =====
async function voidRow() {
    if (!downId.value) return showSnack('무효 처리할 건을 선택하세요', 'warning');
    if (!confirm('정말 무효 처리하시겠습니까?')) return;
    if (voiding.value) return;
    voiding.value = true;
    try {
        const { data } = await axios.patch('/api/downtimeVoid', { down_id: downId.value, edit_reason: editReason.value || null });
        if (data?.success) {
            showSnack('무효 처리되었습니다', 'error');
            await select();
            formReset();
        } else {
            showSnack(data?.error || '무효 처리 실패', 'error');
        }
    } catch (e) {
        console.error(e);
        showSnack('무효 처리 실패', 'error');
    } finally {
        voiding.value = false;
    }
}
</script>

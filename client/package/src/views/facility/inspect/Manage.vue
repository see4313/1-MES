<template>
    <!-- 조회 영역 -->
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="점검 이력 조회"
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
                            <v-text-field label="점검 항목" v-model="filterItemName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon class="cursor-pointer" @click="itemModal = true">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-select
                                label="판정"
                                v-model="filterResult"
                                :items="[
                                    { title: '전체', value: '' },
                                    { title: '적합(OK)', value: 'OK' },
                                    { title: '부적합(NG)', value: 'NG' }
                                ]"
                                variant="outlined"
                            />
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
            <CardHeader title="점검 이력 목록" />
            <DataTable
                v-model:selection="selectedRow"
                :value="rows"
                selectionMode="single"
                :metaKeySelection="false"
                dataKey="inspect_id"
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
                <Column field="inspect_id" header="ID" />
                <Column field="facility_name" header="설비명" />
                <Column field="emp_name" header="담당자" />
                <Column field="inspect_item_name" header="점검 항목" />
                <Column field="measure_val" header="측정값" />
                <Column field="unit_name" header="단위" />
                <Column header="판정">
                    <template #body="{ data }">
                        <v-chip size="small" :color="data.result === 'OK' ? 'primary' : 'error'" variant="flat">
                            {{ data.result }}
                        </v-chip>
                    </template>
                </Column>
                <Column field="inspect_dt" header="점검일시" />
                <Column field="remk" header="비고" />
            </DataTable>
            <p v-if="!rows.length && !listLoading" class="text-grey mt-3">조회 결과가 없습니다.</p>
        </v-card-item>
    </v-card>

    <!-- 등록/수정/삭제 영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader3
                :title="inspectId ? '점검 이력 수정' : '점검 이력 등록'"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="formReset"
                btn-text2="삭제"
                btn-variant2="flat"
                btn-color2="error"
                :btn-disabled2="!inspectId || deleting"
                @btn-click2="deleteRow"
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
                    <v-text-field label="점검 항목" v-model="inspectItemName" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon class="cursor-pointer" @click="itemModal = true">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="이력ID" v-model="inspectId" variant="outlined" readonly />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field type="datetime-local" label="점검일시" v-model="inspectLocal" :max="nowLocal" variant="outlined" />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="측정값" v-model="measureVal" variant="outlined" @update:model-value="autoJudge" />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="단위" v-model="unitName" variant="outlined" readonly />
                </v-col>
                <v-col cols="12" sm="8">
                    <v-text-field label="표준(하한 ~ 상한 / 또는 기준값)" :model-value="stdText" variant="outlined" readonly />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="6">
                    <v-radio-group v-model="result" inline>
                        <v-radio label="적합(OK)" value="OK" />
                        <v-radio label="부적합(NG)" value="NG" />
                    </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-textarea label="비고" v-model="remk" rows="2" variant="outlined" />
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 모달: 설비/담당자/점검항목 -->
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
        :visible="itemModal"
        title="점검 항목"
        idField="inspect_item_id"
        :columns="[
            { key: 'inspect_item_id', label: 'ID' },
            { key: 'inspect_item_name', label: '항목' },
            { key: 'unit_name', label: '단위' },
            { key: 'std_lower', label: '하한' },
            { key: 'std_upper', label: '상한' },
            { key: 'std_val', label: '기준값' }
        ]"
        :fetchData="fetchInspectItems"
        @select="onSelectItem"
        @close="itemModal = false"
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

// 상태 플래그
const listLoading = ref(false);
const saving = ref(false);
const deleting = ref(false);

// ===== 조회 필터 =====
const filterFacilityId = ref('');
const filterFacilityName = ref('');
const filterEmpId = ref('');
const filterEmpName = ref('');
const filterItemId = ref('');
const filterItemName = ref('');
const filterResult = ref(''); // '', 'OK', 'NG'
const filterFromDate = ref(todayStr);
const filterToDate = ref(todayStr);

// ===== 목록 =====
const rows = ref([]);
const selectedRow = ref(null);

// ===== 폼 =====
const inspectId = ref('');
const facilityId = ref('');
const facilityName = ref('');
const empId = ref('');
const empName = ref('');
const inspectItemId = ref('');
const inspectItemName = ref('');
const unitName = ref('');
const stdLower = ref(null); // 숫자 or null
const stdUpper = ref(null);
const stdVal = ref(''); // 문자열(예: '청결 육안 확인')
const measureVal = ref('');
const result = ref('OK'); // 'OK' | 'NG'
const inspectLocal = ref(''); // datetime-local
const remk = ref('');

// 표준 텍스트 표시용
const stdText = computed(() => {
    if (stdLower.value != null || stdUpper.value != null) {
        const low = stdLower.value ?? '-';
        const up = stdUpper.value ?? '-';
        return `${low} ~ ${up}`;
    }
    return stdVal.value || '';
});

// ===== 모달 =====
const facilityModal = ref(false);
const empModal = ref(false);
const itemModal = ref(false);

// ===== 선택 데이터 로드 =====
const fetchFacilities = async () => (await axios.get('/api/facilities')).data;
const fetchUsers = async () => (await axios.get('/api/users')).data;
const fetchInspectItems = async () => (await axios.get('/api/inspectItems')).data;

// ===== 유틸 =====
function toDateTimeSeconds(local) {
    if (!local) return '';
    const d = new Date(local),
        p = (x) => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

// 자동 판정: 표준 범위가 있으면 범위 체크, 없고 std_val만 있으면 수기 판정 유지
function autoJudge() {
    if (measureVal.value === '' || measureVal.value === null) return;
    const num = Number(measureVal.value);
    if (!isNaN(num) && (stdLower.value != null || stdUpper.value != null)) {
        if ((stdLower.value != null && num < Number(stdLower.value)) || (stdUpper.value != null && num > Number(stdUpper.value))) {
            result.value = 'NG';
        } else {
            result.value = 'OK';
        }
    }
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
            inspect_item_id: filterItemId.value || null,
            result: filterResult.value || null,
            from_dt: filterFromDate.value ? `${formatDate(filterFromDate.value, '-')} 00:00:00` : null,
            to_dt: filterToDate.value ? `${formatDate(filterToDate.value, '-')} 23:59:59` : null
        };
        const { data } = await axios.get('/api/inspectList', { params });
        rows.value = data || [];
    } catch (e) {
        console.error(e);
        showSnack('점검 이력 조회 실패', 'error');
    } finally {
        listLoading.value = false;
    }
}

// 조회 초기화
function selectReset() {
    filterFacilityId.value = '';
    filterFacilityName.value = '';
    filterEmpId.value = '';
    filterEmpName.value = '';
    filterItemId.value = '';
    filterItemName.value = '';
    filterResult.value = '';
    filterFromDate.value = todayStr;
    filterToDate.value = todayStr;
    rows.value = [];
    selectedRow.value = null;
}

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
function onSelectItem(row) {
    inspectItemId.value = row.inspect_item_id;
    inspectItemName.value = row.inspect_item_name;
    unitName.value = row.unit_name || '';
    stdLower.value = row.std_lower ?? null;
    stdUpper.value = row.std_upper ?? null;
    stdVal.value = row.std_val || '';
    itemModal.value = false;
    // 항목 바뀌면 측정값 기반 자동 판정 갱신
    autoJudge();
}

// ===== 선택 → 폼 바인딩 =====
watch(selectedRow, (val) => {
    if (!val) return;
    inspectId.value = val.inspect_id || '';
    facilityId.value = val.facility_id || '';
    facilityName.value = val.facility_name || '';
    empId.value = val.emp_id || '';
    empName.value = val.emp_name || '';
    inspectItemId.value = val.inspect_item_id || '';
    inspectItemName.value = val.inspect_item_name || '';
    unitName.value = val.unit_name || '';
    stdLower.value = val.std_lower ?? null;
    stdUpper.value = val.std_upper ?? null;
    stdVal.value = val.std_val || '';
    inspectLocal.value = val.inspect_dt ? val.inspect_dt.replace(' ', 'T').slice(0, 16) : '';
    measureVal.value = val.measure_val ?? '';
    result.value = val.result || 'OK';
    remk.value = val.remk || '';
});

// ===== 폼 초기화 =====
function formReset() {
    inspectId.value = '';
    // 필터 프리필
    facilityId.value = filterFacilityId.value;
    facilityName.value = filterFacilityName.value;
    empId.value = filterEmpId.value;
    empName.value = filterEmpName.value;
    inspectItemId.value = filterItemId.value;
    inspectItemName.value = filterItemName.value;
    unitName.value = '';
    stdLower.value = null;
    stdUpper.value = null;
    stdVal.value = '';
    const n = new Date(),
        p = (x) => String(x).padStart(2, '0');
    inspectLocal.value = `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
    measureVal.value = '';
    result.value = 'OK';
    remk.value = '';
    selectedRow.value = null;
}

// ===== 저장(등록/수정) =====
async function saveRow() {
    if (!facilityId.value || !empId.value || !inspectItemId.value || !inspectLocal.value) {
        showSnack('필수값을 입력하세요', 'error');
        return;
    }
    if (saving.value) return;
    saving.value = true;

    const payload = {
        inspect_id: inspectId.value || null,
        facility_id: facilityId.value,
        emp_id: empId.value,
        inspect_item_id: inspectItemId.value,
        inspect_dt: toDateTimeSeconds(inspectLocal.value),
        measure_val: measureVal.value,
        unit_name: unitName.value || null,
        result: result.value, // 'OK' | 'NG'
        remk: remk.value
    };

    try {
        const res = inspectId.value ? await axios.put('/api/inspectUpdate', payload) : await axios.post('/api/inspectInsert', payload);
        if (res.data?.success) {
            showSnack(inspectId.value ? '수정되었습니다' : '등록되었습니다', inspectId.value ? 'warning' : 'success');
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

// ===== 삭제 =====
async function deleteRow() {
    if (!inspectId.value) return showSnack('삭제할 건을 선택하세요', 'warning');
    if (!confirm('정말 삭제하시겠습니까?')) return;
    if (deleting.value) return;
    deleting.value = true;
    try {
        const { data } = await axios.delete('/api/inspectDelete', { data: { inspect_id: inspectId.value } });
        if (data?.success) {
            showSnack('삭제되었습니다', 'error');
            await select();
            formReset();
        } else {
            showSnack(data?.error || '삭제 실패', 'error');
        }
    } catch (e) {
        console.error(e);
        showSnack('삭제 실패', 'error');
    } finally {
        deleting.value = false;
    }
}
</script>

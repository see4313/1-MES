<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader
                title="세척이력 등록"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="grey"
                @btn-click1="onReset"
                btn-text2="등록"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="onSubmit"
                :loading="loading"
            />
        </v-card-item>

        <v-card-item class="py-6 px-6">
            <v-form ref="formRef" @submit.prevent="onSubmit">
                <v-row dense>
                    <!-- 설비 -->
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="설비"
                            v-model="form.facilityName"
                            :rules="[required]"
                            variant="outlined"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="openFacility()"
                        />
                    </v-col>

                    <!-- 세척 시작일시 -->
                    <v-col cols="12" sm="3">
                        <v-menu v-model="menu.start" :close-on-content-click="false" location="bottom start" contained>
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="세척 시작일"
                                    :rules="[required]"
                                    :model-value="displayStart"
                                    variant="outlined"
                                    readonly
                                    clearable
                                    append-inner-icon="mdi-calendar-clock"
                                    @click:clear="clearStart"
                                />
                            </template>
                            <v-card>
                                <v-date-picker v-model="startDate" :max="today" locale="ko-KR" />
                                <v-time-picker v-model="startTime" format="24hr" use-seconds scrollable />
                                <v-card-actions class="justify-end">
                                    <v-btn text color="primary" @click="applyStart">확인</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </v-col>

                    <!-- 세척 종료일시 -->
                    <v-col cols="12" sm="3">
                        <v-menu v-model="menu.end" :close-on-content-click="false" location="bottom start" contained>
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="세척 종료일"
                                    :rules="[required, endAfterStart]"
                                    :model-value="displayEnd"
                                    variant="outlined"
                                    readonly
                                    clearable
                                    append-inner-icon="mdi-calendar-clock"
                                    @click:clear="clearEnd"
                                />
                            </template>
                            <v-card>
                                <v-date-picker v-model="endDate" :max="today" :min="startDate || undefined" locale="ko-KR" />
                                <v-time-picker v-model="endTime" format="24hr" use-seconds scrollable />
                                <v-card-actions class="justify-end">
                                    <v-btn text color="primary" @click="applyEnd">확인</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </v-col>

                    <!-- 세척담당자 -->
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="세척담당자"
                            v-model="form.reporterName"
                            :rules="[required]"
                            variant="outlined"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="openEmployee()"
                        />
                    </v-col>

                    <!-- 비고 -->
                    <v-col cols="12">
                        <v-textarea label="비고" v-model="form.remark" variant="outlined" rows="3" auto-grow />
                    </v-col>
                </v-row>

                <div class="d-flex ga-2 mt-4"></div>
            </v-form>
        </v-card-item>
    </v-card>

    <!-- ========== 설비 모달 ========== -->
    <v-dialog v-model="dlg.facility" max-width="900">
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                설비 검색
                <v-spacer />
                <v-btn icon @click="dlg.facility = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="q.fac" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-3" />
                <v-table density="comfortable">
                    <thead>
                        <tr>
                            <th>설비ID</th>
                            <th>설비명</th>
                            <th>유형</th>
                            <th>담당자</th>
                            <th class="text-center">선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in fil.facilities" :key="row.facility_id">
                            <td>{{ row.facility_id }}</td>
                            <td>{{ row.facility_nm }}</td>
                            <td>{{ row.facility_type }}</td>
                            <td>{{ row.manager_name }}</td>
                            <td class="text-center">
                                <v-btn size="small" color="primary" variant="tonal" @click="pickFacility(row)">선택</v-btn>
                            </td>
                        </tr>
                        <tr v-if="!fil.facilities.length">
                            <td colspan="5" class="text-center py-6">자료가 없습니다</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- ========== 사원(발견자) 모달 ========== -->
    <v-dialog v-model="dlg.employee" max-width="800">
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                사원 검색
                <v-spacer /><v-btn icon @click="dlg.employee = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="q.emp" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-3" />
                <v-table density="comfortable">
                    <thead>
                        <tr>
                            <th>사번</th>
                            <th>이름</th>
                            <th>부서</th>
                            <th class="text-center">선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in fil.employees" :key="row.emp_id">
                            <td>{{ row.emp_id }}</td>
                            <td>{{ row.emp_name }}</td>
                            <td>{{ row.dept_name }}</td>
                            <td class="text-center">
                                <v-btn size="small" color="primary" variant="tonal" @click="pickEmployee(row)">선택</v-btn>
                            </td>
                        </tr>
                        <tr v-if="!fil.employees.length">
                            <td colspan="4" class="text-center py-6">자료가 없습니다</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- ========== 고장유형/긴급도 모달 (현재 화면에 꼭 필요 없다면 제거 가능) ========== -->
    <v-dialog v-model="dlg.faultType" max-width="700">
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                고장 유형
                <v-spacer /><v-btn icon @click="dlg.faultType = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="q.ft" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-3" />
                <v-table density="comfortable">
                    <thead>
                        <tr>
                            <th>코드</th>
                            <th>유형명</th>
                            <th>설명</th>
                            <th class="text-center">선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in fil.faultTypes" :key="row.code">
                            <td>{{ row.code }}</td>
                            <td>{{ row.name }}</td>
                            <td>{{ row.descr }}</td>
                            <td class="text-center">
                                <v-btn size="small" color="primary" variant="tonal" @click="pickFaultType(row)">선택</v-btn>
                            </td>
                        </tr>
                        <tr v-if="!fil.faultTypes.length">
                            <td colspan="4" class="text-center py-6">자료가 없습니다</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dlg.urgency" max-width="600">
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                긴급도
                <v-spacer /><v-btn icon @click="dlg.urgency = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="q.urg" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-3" />
                <v-table density="comfortable">
                    <thead>
                        <tr>
                            <th>코드</th>
                            <th>긴급도</th>
                            <th class="text-center">선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in fil.urgencies" :key="row.value">
                            <td>{{ row.value }}</td>
                            <td>{{ row.label }}</td>
                            <td class="text-center">
                                <v-btn size="small" color="primary" variant="tonal" @click="pickUrgency(row)">선택</v-btn>
                            </td>
                        </tr>
                        <tr v-if="!fil.urgencies.length">
                            <td colspan="3" class="text-center py-6">자료가 없습니다</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import CardHeader from '@/components/production/card-header-btn2.vue';

type CleaningForm = {
    facilityId: number | null;
    facilityName: string;
    startDttm: string;
    endDttm: string;
    empId: string;
    reporterName: string;
    remark: string;

    // 아래는 기존 모달들과 호환을 위해 유지(불필요하면 제거 가능)
    failureType?: string;
    failureTypeName?: string;
    urgencyLevel?: string;
    urgencyLabel?: string;
};

const formRef = ref();
const loading = ref(false);

const initialForm: CleaningForm = {
    facilityId: null,
    facilityName: '',
    startDttm: '',
    endDttm: '',
    empId: '',
    reporterName: '',
    remark: '',
    failureType: '',
    failureTypeName: '',
    urgencyLevel: '',
    urgencyLabel: ''
};

const form = ref<CleaningForm>({ ...initialForm });

// 날짜/시간 상태 분리
const today = new Date();

const menu = ref({ start: false, end: false });

const startDate = ref<Date | null>(new Date());
const startTime = ref<string>('09:00:00');
const endDate = ref<Date | null>(new Date());
const endTime = ref<string>('09:30:00');

const displayStart = computed(() => (form.value.startDttm ? dayjs(form.value.startDttm).format('YYYY-MM-DD HH:mm:ss') : ''));
const displayEnd = computed(() => (form.value.endDttm ? dayjs(form.value.endDttm).format('YYYY-MM-DD HH:mm:ss') : ''));

function toDttm(d: Date | null, t: string | null) {
    if (!d || !t) return '';
    const [h = '00', m = '00', s = '00'] = t.split(':');
    const copy = new Date(d);
    copy.setHours(+h || 0, +m || 0, +s || 0, 0);
    return dayjs(copy).format('YYYY-MM-DD HH:mm:ss');
}

function applyStart() {
    form.value.startDttm = toDttm(startDate.value, startTime.value);
    menu.value.start = false;
    // 종료일시 자동 보정(선택)
    if (form.value.endDttm && dayjs(form.value.endDttm).isBefore(form.value.startDttm)) {
        form.value.endDttm = form.value.startDttm;
        endDate.value = startDate.value ? new Date(startDate.value) : new Date();
        endTime.value = startTime.value || '00:00:00';
    }
}
function clearStart() {
    form.value.startDttm = '';
    startDate.value = new Date();
    startTime.value = '09:00:00';
}

function applyEnd() {
    form.value.endDttm = toDttm(endDate.value, endTime.value);
    menu.value.end = false;
}
function clearEnd() {
    form.value.endDttm = '';
    endDate.value = new Date();
    endTime.value = '09:30:00';
}

// 검증
const required = (v: unknown) => (!!v && String(v).trim().length > 0) || '필수 항목입니다.';
const endAfterStart = () => {
    if (!form.value.startDttm || !form.value.endDttm) return true;
    return (
        dayjs(form.value.endDttm).isAfter(form.value.startDttm) ||
        dayjs(form.value.endDttm).isSame(form.value.startDttm) ||
        '종료일시는 시작일시 이후여야 합니다.'
    );
};

// 모달 상태 + 검색 + 데이터
const dlg = ref({ facility: false, employee: false, faultType: false, urgency: false });
const q = ref({ fac: '', emp: '', ft: '', urg: '' });
const fil = ref({
    facilities: [] as any[],
    employees: [] as any[],
    faultTypes: [] as any[],
    urgencies: [] as any[]
});

// 열기 시점 로드
function openFacility() {
    dlg.value.facility = true;
    loadFacilities();
}
function openEmployee() {
    dlg.value.employee = true;
    loadEmployees();
}
function openFaultType() {
    dlg.value.faultType = true;
    loadFaultTypes();
}
function openUrgency() {
    dlg.value.urgency = true;
    loadUrgencies();
}

async function loadFacilities() {
    const { data } = await axios.get('/api/facilities', { params: { page: 1, pageSize: 1000, q: q.value.fac } });
    fil.value.facilities = data?.rows ?? data?.items ?? [];
}
async function loadEmployees() {
    const { data } = await axios.get('/api/employees', { params: { page: 1, pageSize: 1000, q: q.value.emp } });
    fil.value.employees = (data?.rows ?? data?.items ?? []).map((r: any) => ({
        emp_id: r.emp_id ?? r.EMP_ID,
        emp_name: r.emp_name ?? r.EMP_NM,
        dept_name: r.dept_name ?? r.DEPT_NAME
    }));
}
async function loadFaultTypes() {
    const { data } = await axios.get('/api/fault-types', { params: { page: 1, pageSize: 1000, q: q.value.ft } });
    fil.value.faultTypes = data?.rows ?? data?.items ?? [];
}
async function loadUrgencies() {
    const { data } = await axios.get('/api/urgencies', { params: { page: 1, pageSize: 1000, q: q.value.urg } });
    fil.value.urgencies = data?.rows ?? data?.items ?? [];
}

// 선택
function pickFacility(row: any) {
    form.value.facilityId = row.facility_id;
    form.value.facilityName = row.facility_nm;
    dlg.value.facility = false;
}
function pickEmployee(row: any) {
    form.value.empId = row.emp_id;
    form.value.reporterName = row.emp_name + (row.dept_name ? ` / ${row.dept_name}` : '');
    dlg.value.employee = false;
}
function pickFaultType(row: any) {
    form.value.failureType = row.code;
    form.value.failureTypeName = row.name;
    dlg.value.faultType = false;
}
function pickUrgency(row: any) {
    form.value.urgencyLevel = row.value;
    form.value.urgencyLabel = row.label;
    dlg.value.urgency = false;
}

// 등록
async function onSubmit() {
    const ok = await formRef.value?.validate();
    if (!ok?.valid) return;
    if (!form.value.facilityId) return alert('설비를 선택해 주세요.');
    if (!form.value.empId) return alert('세척담당자를 선택해 주세요.');
    if (!endAfterStart(true)) return alert('종료일시는 시작일시 이후여야 합니다.');

    loading.value = true;
    try {
        // 실제 API에 맞게 엔드포인트/필드명 조정하세요.
        const payload = {
            facilityId: form.value.facilityId,
            startDttm: form.value.startDttm,
            endDttm: form.value.endDttm,
            empId: form.value.empId,
            remark: form.value.remark,
            // 필요시 아래 필드 사용
            failureType: form.value.failureType,
            urgencyLevel: form.value.urgencyLevel
        };
        const { data } = await axios.post('/api/clean-hist', payload);
        alert(`등록 완료! ID: ${data?.insertedId ?? ''}`);
        onReset();
    } catch (e: any) {
        alert(e?.response?.data?.message || e?.message || '등록 실패');
    } finally {
        loading.value = false;
    }
}

function onReset() {
    Object.assign(form.value, initialForm);
    clearStart();
    clearEnd();
}

// 검색어 변경 시 재조회(디바운스가 필요하면 추가)
watch(() => q.value.fac, loadFacilities);
watch(() => q.value.emp, loadEmployees);
watch(() => q.value.ft, loadFaultTypes);
watch(() => q.value.urg, loadUrgencies);

// 라우트 이동/언마운트 시 열린 메뉴 닫기(안정성)
onBeforeRouteLeave(() => {
    menu.value.start = menu.value.end = false;
});
onBeforeUnmount(() => {
    menu.value.start = menu.value.end = false;
});
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

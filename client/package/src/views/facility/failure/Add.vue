<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader
                title="고장 등록"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="grey"
                @btn-click1="onReset"
                btn-text2="등록"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="onSubmit"
                loading="loading"
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

                    <!-- 발생 일시 -->
                    <v-col cols="12" sm="3">
                        <v-menu v-model="menu.datetime" :close-on-content-click="false" location="bottom start">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="고장 발생 일시"
                                    :rules="[required]"
                                    :model-value="displayDateTime"
                                    variant="outlined"
                                    readonly
                                    clearable
                                    append-inner-icon="mdi-calendar-clock"
                                    @click:clear="clearDateTime"
                                />
                            </template>
                            <v-card>
                                <v-date-picker v-model="datePart" :max="today" locale="ko-KR" />
                                <v-time-picker v-model="timePart" format="24hr" use-seconds scrollable />
                                <v-card-actions class="justify-end">
                                    <v-btn text color="primary" @click="applyDateTime">확인</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </v-col>

                    <!-- 발견자 -->
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="고장 발견자"
                            v-model="form.reporterName"
                            :rules="[required]"
                            variant="outlined"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="openEmployee()"
                        />
                    </v-col>

                    <!-- 고장 유형 -->
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="고장 유형"
                            v-model="form.failureTypeName"
                            :rules="[required]"
                            variant="outlined"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="openFaultType()"
                        />
                    </v-col>

                    <!-- 긴급도 -->
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="긴급도"
                            v-model="form.urgencyLabel"
                            :rules="[required]"
                            variant="outlined"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="openUrgency()"
                        />
                    </v-col>

                    <!-- 비고 (고장내용 + 조치 통합) -->
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

    <!-- ========== 고장유형 모달 ========== -->
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

    <!-- ========== 긴급도 모달 ========== -->
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
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import CardHeader from '@/components/production/card-header-btn2.vue';

type FailureForm = {
    facilityId: number | null;
    facilityName: string;
    occDttm: string;
    empId: string;
    reporterName: string;
    failureType: string;
    failureTypeName: string;
    urgencyLevel: string;
    urgencyLabel: string;
    remark: string;
};

const formRef = ref();
const loading = ref(false);

const form = ref<FailureForm>({
    facilityId: null,
    facilityName: '',
    occDttm: '',
    empId: '',
    reporterName: '',
    failureType: '',
    failureTypeName: '',
    urgencyLevel: '',
    urgencyLabel: '',
    remark: ''
});

// 날짜/시간
const today = new Date();
const menu = ref({ datetime: false });
const datePart = ref<Date | null>(new Date());
const timePart = ref<string>('09:00:00');
const displayDateTime = computed(() => (form.value.occDttm ? dayjs(form.value.occDttm).format('YYYY-MM-DD HH:mm:ss') : ''));
function applyDateTime() {
    if (!datePart.value || !timePart.value) return;
    const [h = '00', m = '00', s = '00'] = timePart.value.split(':');
    const d = new Date(datePart.value);
    d.setHours(+h || 0, +m || 0, +s || 0, 0);
    form.value.occDttm = dayjs(d).format('YYYY-MM-DD HH:mm:ss');
    menu.value.datetime = false;
}
function clearDateTime() {
    form.value.occDttm = '';
    datePart.value = new Date();
    timePart.value = '09:00:00';
}

// 검증
const required = (v: unknown) => (!!v && String(v).trim().length > 0) || '필수 항목입니다.';

// 모달 상태 + 검색 + 데이터
const dlg = ref({ facility: false, employee: false, faultType: false, urgency: false });
const q = ref({ fac: '', emp: '', ft: '', urg: '' });
const fil = ref({
    facilities: [] as any[],
    employees: [] as any[],
    faultTypes: [] as any[],
    urgencies: [] as any[]
});

// 열기 시점에 로드 (간단히 pageSize=1000)
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
    fil.value.facilities = data?.rows ?? [];
}
async function loadEmployees() {
    const { data } = await axios.get('/api/employees', { params: { page: 1, pageSize: 1000, q: q.value.emp } });
    fil.value.employees = (data?.rows ?? []).map((r: any) => ({
        emp_id: r.emp_id ?? r.EMP_ID,
        emp_name: r.emp_name ?? r.EMP_NM,
        dept_name: r.dept_name ?? r.DEPT_NAME
    }));
}
async function loadFaultTypes() {
    const { data } = await axios.get('/api/fault-types', { params: { page: 1, pageSize: 1000, q: q.value.ft } });
    fil.value.faultTypes = data?.rows ?? [];
}
async function loadUrgencies() {
    const { data } = await axios.get('/api/urgencies', { params: { page: 1, pageSize: 1000, q: q.value.urg } });
    fil.value.urgencies = data?.rows ?? [];
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
    if (!form.value.empId) return alert('발견자를 선택해 주세요.');

    loading.value = true;
    try {
        const payload = {
            operationLogId: null,
            occDttm: form.value.occDttm,
            empId: form.value.empId,
            failureType: form.value.failureType,
            failureDetail: form.value.remark, // 비고 → 두 컬럼에 동일 전송
            actionReqDesc: form.value.remark,
            urgencyLevel: form.value.urgencyLevel,
            facilityId: form.value.facilityId
        };
        const { data } = await axios.post('/api/failure', payload);
        alert(`등록 완료! ID: ${data.insertedId}`);
        onReset();
    } catch (e: any) {
        alert(e?.response?.data?.message || e?.message || '등록 실패');
    } finally {
        loading.value = false;
    }
}

function onReset() {
    form.value = {
        facilityId: null,
        facilityName: '',
        occDttm: '',
        empId: '',
        reporterName: '',
        failureType: '',
        failureTypeName: '',
        urgencyLevel: '',
        urgencyLabel: '',
        remark: ''
    };
    clearDateTime();
}

// 검색어가 바뀔 때 다시 로드(간단 재조회)
watch(() => q.value.fac, loadFacilities);
watch(() => q.value.emp, loadEmployees);
watch(() => q.value.ft, loadFaultTypes);
watch(() => q.value.urg, loadUrgencies);
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

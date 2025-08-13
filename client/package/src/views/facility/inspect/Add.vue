<template>
    <v-card elevation="10">
        <!-- 헤더 -->
        <v-card-item class="py-6 px-6">
            <CardHeader
                title="점검이력 등록"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="grey"
                @btn-click1="onReset"
                btn-text2="등록"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="onSubmit"
            />
        </v-card-item>

        <!-- 본문 -->
        <v-card-item class="py-6 px-6">
            <v-form ref="formRef" @submit.prevent="onSubmit">
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            label="설비"
                            v-model="form.facilityName"
                            variant="outlined"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="openFacility"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            label="점검일자"
                            :model-value="form.inspectDate"
                            variant="outlined"
                            readonly
                            append-inner-icon="mdi-calendar"
                            @click:append-inner="menu.date = true"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            label="점검자"
                            v-model="form.inspectorName"
                            variant="outlined"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="openEmployee"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-textarea label="비고" v-model="form.remark" variant="outlined" rows="3" auto-grow />
                    </v-col>
                </v-row>
            </v-form>
        </v-card-item>
    </v-card>

    <!-- 설비 선택 모달 -->
    <v-dialog v-model="dlg.facility" max-width="900">
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                설비 선택
                <v-spacer />
                <v-btn icon @click="dlg.facility = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="fac.q"
                    variant="outlined"
                    density="comfortable"
                    placeholder="설비명/코드 검색"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="mb-3"
                    @update:model-value="debouncedFac"
                />
                <v-data-table
                    :headers="facilityHeaders"
                    :items="fac.rows"
                    :items-length="fac.total"
                    :loading="fac.loading"
                    :page="fac.page"
                    :items-per-page="fac.size"
                    @update:page="
                        (p) => {
                            fac.page = p;
                            loadFacilities();
                        }
                    "
                    @update:items-per-page="
                        (s) => {
                            fac.size = s;
                            fac.page = 1;
                            loadFacilities();
                        }
                    "
                >
                    <template #item.actions="{ item }">
                        <v-btn size="small" color="primary" variant="tonal" @click="pickFacility(item)">선택</v-btn>
                    </template>
                    <template #loading><div class="pa-6 text-center">불러오는 중…</div></template>
                    <template #no-data><div class="pa-6 text-center">자료가 없습니다</div></template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- 점검일자 선택 (메뉴 + 픽커) -->
    <v-menu v-model="menu.date" :close-on-content-click="false" location="bottom start" contained>
        <template #activator="{ props }">
            <!-- activator는 위의 점검일자 필드 append 아이콘 클릭으로 열리므로, 별도 input은 안 보이게 -->
            <div v-bind="props" style="display: none" />
        </template>
        <v-card>
            <v-date-picker v-model="datePart" :max="today" locale="ko-KR" />
            <v-card-actions class="justify-end">
                <v-btn text color="primary" @click="applyDate">확인</v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>

    <!-- 사원 선택 모달 -->
    <v-dialog v-model="dlg.employee" max-width="800">
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                사원 선택
                <v-spacer />
                <v-btn icon @click="dlg.employee = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="emp.q"
                    variant="outlined"
                    density="comfortable"
                    placeholder="이름/사번 검색"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    class="mb-3"
                    @update:model-value="debouncedEmp"
                />
                <v-data-table
                    :headers="empHeaders"
                    :items="emp.rows"
                    :items-length="emp.total"
                    :loading="emp.loading"
                    :page="emp.page"
                    :items-per-page="emp.size"
                    @update:page="
                        (p) => {
                            emp.page = p;
                            loadEmployees();
                        }
                    "
                    @update:items-per-page="
                        (s) => {
                            emp.size = s;
                            emp.page = 1;
                            loadEmployees();
                        }
                    "
                >
                    <template #item.actions="{ item }">
                        <v-btn size="small" color="primary" variant="tonal" @click="pickEmployee(item)">선택</v-btn>
                    </template>
                    <template #loading><div class="pa-6 text-center">불러오는 중…</div></template>
                    <template #no-data><div class="pa-6 text-center">자료가 없습니다</div></template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import CardHeader from '@/components/production/card-header-btn2.vue';

type InspectForm = {
    facilityId: number | null;
    facilityName: string;
    inspectDate: string;
    inspectorId: string;
    inspectorName: string;
    remark: string;
};

const formRef = ref();
const today = new Date();

/* 폼 */
const form = ref<InspectForm>({
    facilityId: null,
    facilityName: '',
    inspectDate: '',
    inspectorId: '',
    inspectorName: '',
    remark: ''
});

/* 모달/메뉴 상태 */
const dlg = ref({ facility: false, employee: false });
const menu = ref({ date: false });

/* 날짜 */
const datePart = ref<Date | null>(new Date());
function applyDate() {
    if (!datePart.value) return;
    form.value.inspectDate = dayjs(datePart.value).format('YYYY-MM-DD');
    menu.value.date = false;
}

/* 설비 모달 */
const fac = ref({ q: '', page: 1, size: 10, total: 0, loading: false, rows: [] as any[] });
const facilityHeaders = [
    { title: 'ID', key: 'facility_id', width: 80 },
    { title: '설비명', key: 'facility_nm' },
    { title: '코드', key: 'facility_code' },
    { title: '유형', key: 'facility_type', width: 120 },
    { title: '담당자', key: 'manager_name', width: 140 },
    { title: '작업', key: 'actions', width: 100 }
];
async function loadFacilities() {
    fac.value.loading = true;
    try {
        const { data } = await axios.get('/api/facilities', { params: { page: fac.value.page, pageSize: fac.value.size, q: fac.value.q } });
        fac.value.rows = data?.rows ?? data?.items ?? [];
        fac.value.total = data?.total ?? fac.value.rows.length;
    } finally {
        fac.value.loading = false;
    }
}
let tFac: number | undefined;
function debouncedFac() {
    clearTimeout(tFac);
    /* @ts-ignore */ tFac = setTimeout(() => {
        fac.value.page = 1;
        loadFacilities();
    }, 300);
}
function openFacility() {
    dlg.value.facility = true;
    loadFacilities();
}
function pickFacility(row: any) {
    form.value.facilityId = row.facility_id;
    form.value.facilityName = row.facility_nm || row.facility_name;
    dlg.value.facility = false;
}

/* 직원 모달 */
const emp = ref({ q: '', page: 1, size: 10, total: 0, loading: false, rows: [] as any[] });
const empHeaders = [
    { title: '사번', key: 'emp_id', width: 120 },
    { title: '이름', key: 'emp_name' },
    { title: '부서', key: 'dept_name' },
    { title: '작업', key: 'actions', width: 100 }
];
async function loadEmployees() {
    emp.value.loading = true;
    try {
        const { data } = await axios.get('/api/employees', { params: { page: emp.value.page, pageSize: emp.value.size, q: emp.value.q } });
        const rows = (data?.rows ?? data?.items ?? []).map((r: any) => ({
            emp_id: r.emp_id ?? r.EMP_ID,
            emp_name: r.emp_name ?? r.EMP_NM,
            dept_name: r.dept_name ?? r.DEPT_NAME
        }));
        emp.value.rows = rows;
        emp.value.total = data?.total ?? rows.length;
    } finally {
        emp.value.loading = false;
    }
}
let tEmp: number | undefined;
function debouncedEmp() {
    clearTimeout(tEmp);
    /* @ts-ignore */ tEmp = setTimeout(() => {
        emp.value.page = 1;
        loadEmployees();
    }, 300);
}
function openEmployee() {
    dlg.value.employee = true;
    loadEmployees();
}
function pickEmployee(row: any) {
    form.value.inspectorId = row.emp_id;
    form.value.inspectorName = row.emp_name;
    dlg.value.employee = false;
}

/* 액션 */
async function onSubmit() {
    const ok = await formRef.value?.validate?.();
    if (ok && ok.valid === false) return;

    if (!form.value.facilityId) return alert('설비를 선택해 주세요.');
    if (!form.value.inspectDate) return alert('점검일자를 선택해 주세요.');
    if (!form.value.inspectorId) return alert('점검자를 선택해 주세요.');

    try {
        const payload = {
            facilityId: form.value.facilityId,
            inspectDate: form.value.inspectDate,
            inspectorId: form.value.inspectorId,
            remark: form.value.remark
        };
        await axios.post('/api/inspect-hist', payload);
        alert('등록 완료');
        onReset();
    } catch (e: any) {
        alert(e?.response?.data?.message || e?.message || '등록 실패');
    }
}
function onReset() {
    form.value = { facilityId: null, facilityName: '', inspectDate: '', inspectorId: '', inspectorName: '', remark: '' };
}
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

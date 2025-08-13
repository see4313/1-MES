<!-- src/views/facility/FacilityList.vue -->
<template>
    <v-card elevation="10">
        <!-- 헤더 -->
        <v-toolbar color="transparent" flat class="px-6 pt-4">
            <v-toolbar-title class="text-h6">설비목록 조회</v-toolbar-title>
            <v-spacer />
            <v-btn variant="flat" color="grey" class="mr-2" @click="onReset" :disabled="loading">초기화</v-btn>
            <v-btn variant="flat" color="primary" @click="onSearch" :loading="loading">조회</v-btn>
        </v-toolbar>

        <v-divider />

        <!-- 검색 영역 -->
        <v-card-text class="pt-6">
            <v-form @submit.prevent="onSearch">
                <v-row dense>
                    <!-- 설비 (모달) -->
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="설비명/코드"
                            variant="outlined"
                            readonly
                            :value="filters.facilityName"
                            placeholder="설비 선택"
                            prepend-inner-icon="mdi-magnify"
                            append-inner-icon="mdi-menu-down"
                            @click="openFacility()"
                            @click:prepend-inner="openFacility()"
                            @click:append-inner="openFacility()"
                            clearable
                            @click:clear="clearFacility"
                        />
                    </v-col>

                    <!-- 설비유형 (모달) -->
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="설비유형"
                            variant="outlined"
                            readonly
                            :value="filters.typeLabel || '전체'"
                            placeholder="전체"
                            append-inner-icon="mdi-menu-down"
                            @click="openType()"
                            clearable
                            @click:clear="clearType"
                        />
                    </v-col>

                    <!-- 담당자 (모달) -->
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="담당자"
                            variant="outlined"
                            readonly
                            :value="filters.managerName"
                            placeholder="담당자 선택"
                            prepend-inner-icon="mdi-magnify"
                            append-inner-icon="mdi-menu-down"
                            @click="openManager()"
                            @click:prepend-inner="openManager()"
                            @click:append-inner="openManager()"
                            clearable
                            @click:clear="clearManager"
                        />
                    </v-col>

                    <!-- 사용여부 (모달) -->
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="사용여부"
                            variant="outlined"
                            readonly
                            :value="filters.useYnLabel || '전체'"
                            placeholder="전체"
                            append-inner-icon="mdi-menu-down"
                            @click="openUseYn()"
                            clearable
                            @click:clear="clearUseYn"
                        />
                    </v-col>
                </v-row>
            </v-form>

            <v-alert v-if="errorMsg" type="error" class="mt-3" :text="errorMsg" density="comfortable" border="start" />
        </v-card-text>

        <!-- 목록 -->
        <v-card-text>
            <v-data-table
                :headers="headers"
                :items="rows"
                :items-length="total"
                :loading="loading"
                :page="page"
                :items-per-page="pageSize"
                :sort-by="sortBy"
                :multi-sort="false"
                class="mt-2"
                @update:page="
                    (p) => {
                        page = p;
                        fetchList();
                    }
                "
                @update:items-per-page="
                    (s) => {
                        pageSize = s;
                        page = 1;
                        fetchList();
                    }
                "
                @update:sort-by="
                    (s) => {
                        sortBy = s;
                        page = 1;
                        fetchList();
                    }
                "
            >
                <template #item.facility_name="{ item }">
                    <div class="font-weight-medium">{{ item.facility_name }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.facility_code }}</div>
                </template>

                <template #item.use_yn="{ item }">
                    <v-chip :color="item.use_yn === 'Y' ? 'success' : 'grey'" size="small" variant="flat">
                        {{ item.use_yn === 'Y' ? '사용' : '미사용' }}
                    </v-chip>
                </template>

                <template #item.actions="{ item }">
                    <v-btn size="small" variant="tonal" color="primary" @click="goDetail(item)">상세</v-btn>
                </template>

                <template #loading><div class="pa-6 text-center">불러오는 중…</div></template>
                <template #no-data><div class="pa-6 text-center">데이터가 없습니다.</div></template>
            </v-data-table>
        </v-card-text>
    </v-card>

    <!-- ============== 설비 모달 ============== -->
    <v-dialog v-model="dlg.facility" max-width="900" contained>
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                설비 선택
                <v-spacer /><v-btn icon @click="dlg.facility = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="fac.q"
                    variant="outlined"
                    density="comfortable"
                    placeholder="설비명/코드 검색"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    @update:modelValue="debouncedFac()"
                    class="mb-3"
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
                        <v-btn size="small" color="primary" variant="tonal" @click="selectFacility(item)">선택</v-btn>
                    </template>
                    <template #loading><div class="pa-6 text-center">불러오는 중…</div></template>
                    <template #no-data><div class="pa-6 text-center">자료가 없습니다</div></template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- ============== 설비유형 모달 ============== -->
    <v-dialog v-model="dlg.type" max-width="700" contained>
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                설비유형 선택
                <v-spacer /><v-btn icon @click="dlg.type = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="typ.q"
                    variant="outlined"
                    density="comfortable"
                    placeholder="유형명/코드 검색"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    @update:modelValue="debouncedTyp()"
                    class="mb-3"
                />
                <v-data-table
                    :headers="typeHeaders"
                    :items="typ.rows"
                    :items-length="typ.total"
                    :loading="typ.loading"
                    :page="typ.page"
                    :items-per-page="typ.size"
                    @update:page="
                        (p) => {
                            typ.page = p;
                            loadTypes();
                        }
                    "
                    @update:items-per-page="
                        (s) => {
                            typ.size = s;
                            typ.page = 1;
                            loadTypes();
                        }
                    "
                >
                    <template #item.actions="{ item }">
                        <v-btn size="small" color="primary" variant="tonal" @click="selectType(item)">선택</v-btn>
                    </template>
                    <template #loading><div class="pa-6 text-center">불러오는 중…</div></template>
                    <template #no-data><div class="pa-6 text-center">자료가 없습니다</div></template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- ============== 담당자 모달 ============== -->
    <v-dialog v-model="dlg.manager" max-width="800" contained>
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                담당자 선택
                <v-spacer /><v-btn icon @click="dlg.manager = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="emp.q"
                    variant="outlined"
                    density="comfortable"
                    placeholder="이름/사번 검색"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    @update:modelValue="debouncedEmp()"
                    class="mb-3"
                />
                <v-data-table
                    :headers="empHeaders"
                    :items="emp.rows"
                    :items-length="emp.total"
                    :loading="emp.loading"
                    item-key="emp_id"
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
                        <v-btn size="small" color="primary" variant="tonal" @click="selectManager(item)">선택</v-btn>
                    </template>
                    <template #loading><div class="pa-6 text-center">불러오는 중…</div></template>
                    <template #no-data><div class="pa-6 text-center">자료가 없습니다</div></template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- ============== 사용여부 모달 ============== -->
    <v-dialog v-model="dlg.useYn" max-width="500" contained>
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                사용여부 선택
                <v-spacer /><v-btn icon @click="dlg.useYn = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-data-table
                    :headers="useYnHeaders"
                    :items="uyn.rows"
                    :items-length="uyn.total"
                    :loading="uyn.loading"
                    :page="uyn.page"
                    :items-per-page="uyn.size"
                    @update:page="
                        (p) => {
                            uyn.page = p;
                            loadUseYn();
                        }
                    "
                    @update:items-per-page="
                        (s) => {
                            uyn.size = s;
                            uyn.page = 1;
                            loadUseYn();
                        }
                    "
                >
                    <template #item.actions="{ item }">
                        <v-btn size="small" color="primary" variant="tonal" @click="selectUseYn(item)">선택</v-btn>
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
import { useRouter } from 'vue-router';
import axios from 'axios';

type FacilityRow = {
    facility_id: number;
    facility_code: string;
    facility_name: string;
    facility_type?: string;
    manager_name?: string;
    use_yn?: 'Y' | 'N';
};

const router = useRouter();

/* ========== 필터 상태 ========== */
const filters = ref({
    facilityId: null as number | null,
    facilityName: '',
    type: '' as string | '',
    typeLabel: '',
    managerId: '' as string | '',
    managerName: '',
    useYn: '' as '' | 'Y' | 'N',
    useYnLabel: ''
});

/* ========== 테이블 상태 ========== */
const rows = ref<FacilityRow[]>([]);
const total = ref(0);
const loading = ref(false);
const errorMsg = ref('');

const page = ref(1);
const pageSize = ref(10);
const sortBy = ref([{ key: 'facility_name', order: 'asc' as 'asc' | 'desc' }]);

const headers = [
    { title: '설비', key: 'facility_name', sortable: true },
    { title: '유형', key: 'facility_type', sortable: true, width: 120 },
    { title: '담당자', key: 'manager_name', sortable: true, width: 150 },
    { title: '사용여부', key: 'use_yn', sortable: true, width: 110 },
    { title: '작업', key: 'actions', sortable: false, width: 120 }
];

/* ========== 공통 모달 플래그 ========== */
const dlg = ref({ facility: false, type: false, manager: false, useYn: false });

/* ========== 설비 모달 상태/로딩 ========== */
const facilityHeaders = [
    { title: 'ID', key: 'facility_id', width: 80 },
    { title: '설비명', key: 'facility_nm' },
    { title: '코드', key: 'facility_code' },
    { title: '유형', key: 'facility_type', width: 120 },
    { title: '담당자', key: 'manager_name', width: 140 },
    { title: '작업', key: 'actions', width: 100 }
];
const fac = ref({ q: '', page: 1, size: 10, total: 0, loading: false, rows: [] as any[] });

async function loadFacilities() {
    fac.value.loading = true;
    try {
        const { data } = await axios.get('/api/facilities', {
            params: { page: fac.value.page, pageSize: fac.value.size, q: fac.value.q }
        });
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
function selectFacility(row: any) {
    filters.value.facilityId = row.facility_id;
    filters.value.facilityName = row.facility_nm || row.facility_name;
    dlg.value.facility = false;
}
function clearFacility() {
    filters.value.facilityId = null;
    filters.value.facilityName = '';
}

/* ========== 설비유형 모달 상태/로딩 ========== */
const typeHeaders = [
    { title: '코드', key: 'value', width: 120 },
    { title: '유형명', key: 'label' },
    { title: '작업', key: 'actions', width: 100 }
];
const typ = ref({ q: '', page: 1, size: 10, total: 0, loading: false, rows: [] as any[] });

async function loadTypes() {
    typ.value.loading = true;
    try {
        const { data } = await axios.get('/api/facility-types', {
            params: { page: typ.value.page, pageSize: typ.value.size, q: typ.value.q }
        });
        // 서버 포맷 매핑(value/label)
        const rows = (data?.rows ?? data?.items ?? []).map((x: any) => ({
            value: x.value ?? x.code ?? x.type_code,
            label: x.label ?? x.name ?? x.type_name
        }));
        typ.value.rows = rows;
        typ.value.total = data?.total ?? rows.length;
    } finally {
        typ.value.loading = false;
    }
}
let tTyp: number | undefined;
function debouncedTyp() {
    clearTimeout(tTyp);
    /* @ts-ignore */ tTyp = setTimeout(() => {
        typ.value.page = 1;
        loadTypes();
    }, 300);
}
function openType() {
    dlg.value.type = true;
    loadTypes();
}
function selectType(row: any) {
    filters.value.type = row.value || '';
    filters.value.typeLabel = row.label || '';
    dlg.value.type = false;
}
function clearType() {
    filters.value.type = '';
    filters.value.typeLabel = '';
}

/* ========== 담당자 모달 상태/로딩 ========== */
const empHeaders = [
    { title: '사번', key: 'emp_id', width: 120 },
    { title: '이름', key: 'emp_name' },
    { title: '부서', key: 'dept_name' },
    { title: '작업', key: 'actions', width: 100 }
];
const emp = ref({ q: '', page: 1, size: 10, total: 0, loading: false, rows: [] as any[] });

async function loadEmployees() {
    emp.value.loading = true;
    try {
        const { data } = await axios.get('/api/employees', {
            params: { page: emp.value.page, pageSize: emp.value.size, q: emp.value.q }
        });
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
function openManager() {
    dlg.value.manager = true;
    loadEmployees();
}
function selectManager(row: any) {
    filters.value.managerId = row.emp_id;
    filters.value.managerName = row.emp_name;
    dlg.value.manager = false;
}
function clearManager() {
    filters.value.managerId = '';
    filters.value.managerName = '';
}

/* ========== 사용여부 모달 상태/로딩 ========== */
const useYnHeaders = [
    { title: '값', key: 'value', width: 100 },
    { title: '라벨', key: 'label' },
    { title: '작업', key: 'actions', width: 100 }
];
const uyn = ref({ q: '', page: 1, size: 10, total: 0, loading: false, rows: [] as any[] });

async function loadUseYn() {
    uyn.value.loading = true;
    try {
        const { data } = await axios.get('/api/use-yn', {
            params: { page: uyn.value.page, pageSize: uyn.value.size, q: uyn.value.q }
        });
        // 서버가 다른 키를 준다면 여기서 value/label로 매핑
        const rows = (data?.rows ?? data?.items ?? []).map((x: any) => ({
            value: x.value ?? x.code ?? x.USE_YN,
            label: x.label ?? x.name ?? (x.USE_YN === 'Y' ? '사용' : x.USE_YN === 'N' ? '미사용' : String(x.USE_YN))
        }));
        uyn.value.rows = rows;
        uyn.value.total = data?.total ?? rows.length;
    } finally {
        uyn.value.loading = false;
    }
}
function openUseYn() {
    dlg.value.useYn = true;
    loadUseYn();
}
function selectUseYn(row: any) {
    filters.value.useYn = (row.value ?? '').toString() as any;
    filters.value.useYnLabel = row.label ?? '';
    dlg.value.useYn = false;
}
function clearUseYn() {
    filters.value.useYn = '';
    filters.value.useYnLabel = '';
}

/* ========== 목록 조회 ========== */
async function fetchList() {
    loading.value = true;
    errorMsg.value = '';

    const currentSort = sortBy.value?.[0];
    const params = {
        page: page.value,
        pageSize: pageSize.value,
        facilityId: filters.value.facilityId || '',
        type: filters.value.type || '',
        managerId: filters.value.managerId || '',
        useYn: filters.value.useYn || '',
        sortBy: currentSort?.key || '',
        sortDesc: currentSort?.order === 'desc'
    };

    try {
        const { data } = await axios.get('/api/facilities', { params });
        rows.value = data?.rows ?? data?.items ?? [];
        total.value = data?.total ?? data?.count ?? rows.value.length;
    } catch (e: any) {
        errorMsg.value = e?.response?.data?.message || e?.message || '조회 실패';
        rows.value = [];
        total.value = 0;
    } finally {
        loading.value = false;
    }
}

function onSearch() {
    page.value = 1;
    fetchList();
}
function onReset() {
    filters.value = {
        facilityId: null,
        facilityName: '',
        type: '',
        typeLabel: '',
        managerId: '',
        managerName: '',
        useYn: '',
        useYnLabel: ''
    };
    page.value = 1;
    sortBy.value = [{ key: 'facility_name', order: 'asc' }];
    fetchList();
}

function goDetail(row: FacilityRow) {
    router.push({ name: 'FacilityDetail', params: { id: row.facility_id } });
}

/* 최초 로딩 */
fetchList();
</script>

<style scoped>
/* 필요 시 추가 스타일 */
</style>

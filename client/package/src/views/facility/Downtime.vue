<template>
    <v-card elevation="10" class="pa-4">
        <!-- Header -->
        <div class="d-flex align-center">
            <div class="text-h6 font-weight-bold">비가동 관리</div>
            <v-spacer />
            <v-btn variant="flat" color="grey" class="mr-2" @click="onReset">초기화</v-btn>
            <v-btn color="primary" @click="onSearch">조회</v-btn>
        </div>

        <v-divider class="my-4" />

        <!-- ① 검색 영역 -->
        <v-form ref="searchRef" @submit.prevent="onSearch">
            <v-row dense>
                <!-- 설비명 -->
                <v-col cols="12" sm="3">
                    <v-text-field
                        label="설비명"
                        v-model="search.facilityName"
                        variant="outlined"
                        clearable
                        readonly
                        append-inner-icon="mdi-magnify"
                        @click:append-inner="openFacilityModal"
                    />
                </v-col>

                <!-- 비가동 사유 -->
                <v-col cols="12" sm="3">
                    <v-text-field
                        label="비가동 사유"
                        v-model="search.reasonName"
                        variant="outlined"
                        clearable
                        readonly
                        append-inner-icon="mdi-magnify"
                        @click:append-inner="openReasonModal"
                    />
                </v-col>

                <!-- 시작일자 -->
                <v-col cols="12" sm="3">
                    <v-menu v-model="menu.start" :close-on-content-click="false" location="bottom start">
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="시작 일자"
                                :model-value="formatDate(search.startDate)"
                                variant="outlined"
                                readonly
                                clearable
                                min
                                append-inner-icon="mdi-calendar"
                                @click:clear="search.startDate = null"
                            />
                        </template>
                        <v-date-picker v-model="search.startDate" :max="today" show-adjacent-months />
                    </v-menu>
                </v-col>

                <!-- 종료일자 -->
                <v-col cols="12" sm="3">
                    <v-menu v-model="menu.end" :close-on-content-click="false" location="bottom start">
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="종료 일자"
                                :model-value="formatDate(search.endDate)"
                                variant="outlined"
                                readonly
                                clearable
                                append-inner-icon="mdi-calendar"
                                @click:clear="search.endDate = null"
                            />
                        </template>
                        <v-date-picker v-model="search.endDate" :min="search.startDate || undefined" :max="today" show-adjacent-months />
                    </v-menu>
                </v-col>

                <!-- 상태 -->
                <v-col cols="12" sm="3">
                    <v-select
                        label="상태"
                        :items="statusItems"
                        v-model="search.status"
                        item-title="label"
                        item-value="value"
                        variant="outlined"
                        clearable
                    />
                </v-col>
            </v-row>
        </v-form>
    </v-card>

    <v-divider class="my-4" />

    <!-- ④ 결과 테이블 -->
    <v-card class="mt-6">
        <v-table density="comfortable">
            <thead>
                <tr>
                    <th style="width: 110px">설비 ID</th>
                    <th>설비명</th>
                    <th>비가동 사유</th>
                    <th style="width: 120px">상태</th>
                    <th style="width: 180px">비가동 시작시간</th>
                    <th style="width: 180px">비가동 종료시간</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="row in rows"
                    :key="row.dt_id"
                    :class="['table-row', selected?.dt_id === row.dt_id ? 'active' : '']"
                    @click="onSelectRow(row)"
                >
                    <td>{{ row.facility_id }}</td>
                    <td>{{ row.facility_nm }}</td>
                    <td>{{ row.reason_name }}</td>
                    <td>
                        <v-chip size="small" :color="row.status === 'DOWN' ? 'error' : 'success'" variant="tonal">
                            {{ row.status === 'DOWN' ? '비가동' : '가동' }}
                        </v-chip>
                    </td>
                    <td>{{ fmt(row.start_time) }}</td>
                    <td>{{ row.end_time ? fmt(row.end_time) : '-' }}</td>
                </tr>

                <tr v-if="!rows.length">
                    <td colspan="6" class="text-center py-6">조회 결과가 없습니다</td>
                </tr>
            </tbody>
        </v-table>

        <div class="d-flex align-center justify-end pa-3">
            <v-pagination v-model="page" :length="totalPages" :total-visible="7" size="small" @update:modelValue="onChangePage" />
        </div>
    </v-card>

    <!-- ========== 설비 모달 ========== -->
    <v-dialog v-model="dlg.facility" max-width="900">
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                설비 검색
                <v-spacer /><v-btn icon @click="dlg.facility = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="q.fac" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-3" />
                <v-table density="comfortable">
                    <thead>
                        <tr>
                            <th style="width: 110px">설비ID</th>
                            <th>설비명</th>
                            <th>유형</th>
                            <th>담당자</th>
                            <th class="text-center" style="width: 100px">선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in facRows" :key="row.facility_id">
                            <td>{{ row.facility_id }}</td>
                            <td>{{ row.facility_nm }}</td>
                            <td>{{ row.facility_type }}</td>
                            <td>{{ row.manager_name }}</td>
                            <td class="text-center">
                                <v-btn size="small" color="primary" variant="tonal" @click="pickFacility(row)">선택</v-btn>
                            </td>
                        </tr>
                        <tr v-if="!facRows.length">
                            <td colspan="5" class="text-center py-6">자료가 없습니다</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- ========== 사유 모달 ========== -->
    <v-dialog v-model="dlg.reason" max-width="700">
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold">
                비가동 사유
                <v-spacer /><v-btn icon @click="dlg.reason = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="q.reason" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-3" />
                <v-table density="comfortable">
                    <thead>
                        <tr>
                            <th style="width: 120px">코드</th>
                            <th>사유명</th>
                            <th>설명</th>
                            <th class="text-center" style="width: 100px">선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in reasonRows" :key="row.code">
                            <td>{{ row.code }}</td>
                            <td>{{ row.name }}</td>
                            <td>{{ row.descr }}</td>
                            <td class="text-center">
                                <v-btn size="small" color="primary" variant="tonal" @click="pickReason(row)">선택</v-btn>
                            </td>
                        </tr>
                        <tr v-if="!reasonRows.length">
                            <td colspan="4" class="text-center py-6">자료가 없습니다</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- 미저장 경고 다이얼로그 -->
    <v-dialog v-model="dlg.leaveConfirm" width="420">
        <v-card>
            <v-card-title class="text-subtitle-1">수정사항이 저장되지 않았습니다.</v-card-title>
            <v-card-text>선택을 변경하시겠습니까?</v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="dlg.leaveConfirm = false">취소</v-btn>
                <v-btn color="primary" @click="confirmLeave">변경</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';

type Row = {
    dt_id: number;
    facility_id: number;
    facility_nm: string;
    reason_code: string;
    reason_name: string;
    status: 'RUNNING' | 'DOWN';
    start_time: string; // 'YYYY-MM-DD HH:mm:ss'
    end_time: string | null;
};

type FacilityRow = { facility_id: number; facility_nm: string; facility_type?: string; manager_name?: string };
type ReasonRow = { code: string; name: string; descr?: string };

const today = new Date();

/* --------------------------- 검색/페이징 --------------------------- */
const searchRef = ref();
const search = ref({
    facilityId: null as number | null,
    facilityName: '',
    reasonCode: '',
    reasonName: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    status: 'ALL' as 'ALL' | 'RUNNING' | 'DOWN'
});
const statusItems = [
    { label: '전체', value: 'ALL' },
    { label: '가동', value: 'RUNNING' },
    { label: '비가동', value: 'DOWN' }
];

const page = ref(1);
const size = ref(10);
const total = ref(0);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size.value)));

const rows = ref<Row[]>([]);

/* --------------------------- 테이블 조회 --------------------------- */
async function fetchList() {
    const params: any = {
        page: page.value,
        size: size.value,
        status: search.value.status === 'ALL' ? undefined : search.value.status,
        facilityName: search.value.facilityName || undefined,
        reasonCode: search.value.reasonCode || undefined,
        startDate: search.value.startDate ? dayjs(search.value.startDate).format('YYYY-MM-DD') : undefined,
        endDate: search.value.endDate ? dayjs(search.value.endDate).format('YYYY-MM-DD') : undefined
    };
    const { data } = await axios.get('/api/downtimes', { params });
    rows.value = data?.rows ?? [];
    total.value = data?.total ?? rows.value.length;
}

function onSearch() {
    page.value = 1;
    fetchList();
}

function onReset() {
    search.value = {
        facilityId: null,
        facilityName: '',
        reasonCode: '',
        reasonName: '',
        startDate: null,
        endDate: null,
        status: 'ALL'
    };
    page.value = 1;
    rows.value = [];
    selected.value = null;
    resetEdit();
}

function onChangePage() {
    if (guardDirty(() => fetchList())) return;
    fetchList();
}

/* --------------------------- 선택/수정 --------------------------- */
const selected = ref<Row | null>(null);

function onSelectRow(row: Row) {
    const proceed = !isDirty.value ? true : guardDirty(() => {});
    if (!proceed) return;
    selected.value = { ...row };
    // 바인딩
    setEditFromRow(row);
}

const edit = ref({
    startDate: null as Date | null,
    startTime: '09:00:00',
    endDate: null as Date | null,
    endTime: '09:00:00',
    status: 'DOWN' as 'RUNNING' | 'DOWN',
    displayStart: '',
    displayEnd: ''
});
function resetEdit() {
    edit.value = {
        startDate: null,
        startTime: '09:00:00',
        endDate: null,
        endTime: '09:00:00',
        status: 'DOWN',
        displayStart: '',
        displayEnd: ''
    };
}
function setEditFromRow(row: Row) {
    // start
    const s = dayjs(row.start_time);
    edit.value.startDate = s.toDate();
    edit.value.startTime = s.format('HH:mm:ss');
    edit.value.displayStart = s.format('YYYY-MM-DD HH:mm:ss');
    // end
    if (row.end_time) {
        const e = dayjs(row.end_time);
        edit.value.endDate = e.toDate();
        edit.value.endTime = e.format('HH:mm:ss');
        edit.value.displayEnd = e.format('YYYY-MM-DD HH:mm:ss');
    } else {
        edit.value.endDate = null;
        edit.value.endTime = '09:00:00';
        edit.value.displayEnd = '';
    }
    // status
    edit.value.status = row.status;
}

function assembleDateTime(d: Date | null, t: string | null) {
    if (!d || !t) return '';
    const [hh = '00', mm = '00', ss = '00'] = (t || '').split(':');
    const dt = dayjs(d)
        .hour(+hh || 0)
        .minute(+mm || 0)
        .second(+ss || 0)
        .millisecond(0);
    return dt.format('YYYY-MM-DD HH:mm:ss');
}

const valMsg = ref('');
const canSave = computed(() => {
    valMsg.value = '';
    if (!selected.value) return false;
    const start = assembleDateTime(edit.value.startDate, edit.value.startTime);
    if (!start) {
        valMsg.value = '시작시간은 필수입니다.';
        return false;
    }
    const end = assembleDateTime(edit.value.endDate, edit.value.endTime) || null;
    if (end && dayjs(end).isBefore(dayjs(start))) {
        valMsg.value = '종료시간은 시작시간보다 빠를 수 없습니다.';
        return false;
    }
    return true;
});

// dirty 체크
const isDirty = computed(() => {
    if (!selected.value) return false;
    const s0 = selected.value.start_time;
    const e0 = selected.value.end_time || '';
    const st0 = selected.value.status;
    const s1 = assembleDateTime(edit.value.startDate, edit.value.startTime);
    const e1 = assembleDateTime(edit.value.endDate, edit.value.endTime);
    const st1 = edit.value.status;
    return s0 !== s1 || (e0 || '') !== (e1 || '') || st0 !== st1;
});

const dlg = ref({ facility: false, reason: false, leaveConfirm: false });
let leaveNext: null | (() => void) = null;
function guardDirty(next: () => void) {
    if (isDirty.value) {
        leaveNext = next;
        dlg.value.leaveConfirm = true;
        return true;
    }
    return false;
}
function confirmLeave() {
    dlg.value.leaveConfirm = false;
    leaveNext && leaveNext();
    leaveNext = null;
}

// 저장
async function onSave() {
    if (!selected.value || !canSave.value) return;
    const body = {
        start_time: assembleDateTime(edit.value.startDate, edit.value.startTime),
        end_time: assembleDateTime(edit.value.endDate, edit.value.endTime) || null,
        status: edit.value.status
    };
    try {
        await axios.put(`/api/downtimes/${selected.value.dt_id}`, body);
        // 리스트 갱신 + 선택행 갱신
        await fetchList();
        const fresh = rows.value.find((r) => r.dt_id === selected.value!.dt_id);
        if (fresh) {
            selected.value = { ...fresh };
            setEditFromRow(fresh);
        }
        toast('저장되었습니다.');
    } catch (e: any) {
        alert(e?.response?.data?.message || e?.message || '저장 실패');
    }
}

/* --------------------------- 모달: 설비 --------------------------- */
const facRows = ref<FacilityRow[]>([]);
const q = ref({ fac: '', reason: '' });

function openFacilityModal() {
    dlg.value.facility = true;
    loadFacilities();
}
async function loadFacilities() {
    const { data } = await axios.get('/api/facilities', { params: { page: 1, pageSize: 1000, q: q.value.fac } });
    facRows.value = data?.rows ?? [];
}
function pickFacility(row: FacilityRow) {
    search.value.facilityId = row.facility_id;
    search.value.facilityName = row.facility_nm;
    dlg.value.facility = false;
}

/* --------------------------- 모달: 사유 --------------------------- */
const reasonRows = ref<ReasonRow[]>([]);
function openReasonModal() {
    dlg.value.reason = true;
    loadReasons();
}
async function loadReasons() {
    const { data } = await axios.get('/api/downtime-reasons', { params: { page: 1, size: 1000, q: q.value.reason } });
    reasonRows.value = data?.rows ?? [];
}
function pickReason(row: ReasonRow) {
    search.value.reasonCode = row.code;
    search.value.reasonName = row.name;
    dlg.value.reason = false;
}

/* --------------------------- 공통 유틸/바인딩 --------------------------- */
const menu = ref({ start: false, end: false, editStart: false, editEnd: false });

function formatDate(d: Date | null) {
    return d ? dayjs(d).format('YYYY-MM-DD') : '';
}
function fmt(dt: string) {
    return dayjs(dt).format('YYYY-MM-DD HH:mm:ss');
}
function applyEditStart() {
    const val = assembleDateTime(edit.value.startDate, edit.value.startTime);
    edit.value.displayStart = val;
    menu.value.editStart = false;
}
function applyEditEnd() {
    const val = assembleDateTime(edit.value.endDate, edit.value.endTime);
    edit.value.displayEnd = val;
    menu.value.editEnd = false;
}
function clearEditStart() {
    edit.value.startDate = new Date();
    edit.value.startTime = '09:00:00';
    edit.value.displayStart = '';
}
function clearEditEnd() {
    edit.value.endDate = null;
    edit.value.endTime = '09:00:00';
    edit.value.displayEnd = '';
}
function toast(msg: string) {
    // 프로젝트 공통 스낵바가 있다면 그걸 사용. 임시 alert 대체 가능
    // @ts-ignore
    if (window?.$toast) window.$toast(msg);
    else alert(msg);
}

/* --------------------------- watch/init --------------------------- */
watch(() => q.value.fac, loadFacilities);
watch(() => q.value.reason, loadReasons);

onSearch();
</script>

<style scoped>
.table-row {
    cursor: pointer;
}
.table-row.active {
    background: #eef4ff;
}
</style>

<template>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="세척이력 조회">
                <!-- 검색 필터 -->
                <v-form @submit.prevent="search">
                    <v-row dense>
                        <!-- 설비 선택 (모달) -->
                        <v-col cols="12" sm="3">
                            <v-text-field
                                label="설비명"
                                variant="outlined"
                                readonly
                                :value="filters.facilityName"
                                placeholder="설비 선택"
                                @click="facilityDialog = true"
                                prepend-inner-icon="mdi-magnify"
                            />
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field v-model="filters.cleaningItem" label="세척 항목" variant="outlined" />
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field v-model="filters.manager" label="담당자" variant="outlined" />
                        </v-col>

                        <!-- 시작일 -->
                        <v-col cols="12" sm="3">
                            <v-menu v-model="fromMenu" :close-on-content-click="false" location="bottom start" :offset="8" min-width="auto">
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-bind="props"
                                        :value="formattedFrom"
                                        label="시작일"
                                        append-inner-icon="mdi-calendar"
                                        readonly
                                        variant="outlined"
                                        clearable
                                        @click:clear="filters.dateFrom = null"
                                    />
                                </template>
                                <v-date-picker
                                    v-model="filters.dateFrom"
                                    locale="ko-KR"
                                    :max="today"
                                    @update:model-value="fromMenu = false"
                                />
                            </v-menu>
                        </v-col>

                        <!-- 종료일 -->
                        <v-col cols="12" sm="3">
                            <v-menu v-model="toMenu" :close-on-content-click="false" location="bottom start" :offset="8" min-width="auto">
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-bind="props"
                                        :value="formattedTo"
                                        label="종료일"
                                        append-inner-icon="mdi-calendar"
                                        readonly
                                        variant="outlined"
                                        clearable
                                        @click:clear="filters.dateTo = null"
                                    />
                                </template>
                                <v-date-picker v-model="filters.dateTo" locale="ko-KR" :max="today" @update:model-value="toMenu = false" />
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="3" class="d-flex align-end">
                            <v-btn :loading="loading" color="primary" @click="search">조회</v-btn>
                            <v-btn class="ml-2" variant="outlined" @click="reset">초기화</v-btn>
                        </v-col>
                    </v-row>
                </v-form>

                <!-- 결과 테이블 (슬롯을 쓰므로 여는/닫는 태그로!) -->
                <v-data-table
                    class="mt-6"
                    :headers="headers"
                    :items="rows"
                    :loading="loading"
                    :page="page"
                    :items-per-page="size"
                    :server-items-length="total"
                    @update:page="
                        (p) => {
                            page = p;
                            search();
                        }
                    "
                    @update:items-per-page="
                        (s) => {
                            size = s;
                            page = 1;
                            search();
                        }
                    "
                >
                    <template #item.cleaning_date="{ item }">
                        {{ ymd(item.cleaning_date) }}
                    </template>
                    <template #loading>
                        <div class="pa-6 text-center">불러오는 중…</div>
                    </template>
                    <template #no-data>
                        <div class="pa-6 text-center">데이터가 없습니다.</div>
                    </template>
                </v-data-table>
            </UiParentCard>
        </v-col>
    </v-row>

    <!-- 설비 선택 모달 -->
    <v-dialog v-model="facilityDialog" max-width="800">
        <v-card>
            <v-card-title>설비 선택</v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="facilitySearch"
                    variant="outlined"
                    density="compact"
                    placeholder="설비명/코드 검색"
                    prepend-inner-icon="mdi-magnify"
                    @input="debouncedLoadFacilities()"
                />
                <v-data-table
                    :headers="facilityHeaders"
                    :items="facilities"
                    :loading="facilityLoading"
                    item-key="facility_id"
                    class="mt-2"
                    @click:row="selectFacility"
                />
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn variant="text" @click="facilityDialog = false">닫기</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

type Row = {
    clean_hist_id: number;
    facility_name: string;
    item_name: string;
    cleaning_date: string; // 'YYYY-MM-DD'
    manager_name: string;
    method_desc?: string;
    result_note?: string;
};

const API = import.meta.env.VITE_API_URL || '';
const loading = ref(false);
const today = new Date();

// ===== 필터 (Date | null 로 유지) =====
const filters = ref({
    facilityId: null as number | null,
    facilityName: '',
    cleaningItem: '',
    manager: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null
});

const fromMenu = ref(false);
const toMenu = ref(false);

// YYYY-MM-DD
const toYmd = (d: Date | null) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const formattedFrom = computed(() => toYmd(filters.value.dateFrom));
const formattedTo = computed(() => toYmd(filters.value.dateTo));
const ymd = (s: string) => s?.slice(0, 10);

// ===== 테이블 =====
const headers = [
    { title: '일자', value: 'cleaning_date', width: 120 },
    { title: '설비명', value: 'facility_name', width: 200 },
    { title: '세척 항목', value: 'item_name' },
    { title: '담당자', value: 'manager_name', width: 120 },
    { title: '방법', value: 'method_desc', width: 160 },
    { title: '결과/비고', value: 'result_note' }
];

const rows = ref<Row[]>([]);
const total = ref(0);
const page = ref(1);
const size = ref(10);

// ===== 조회 =====
async function search() {
    loading.value = true;
    try {
        const params = new URLSearchParams({
            page: String(page.value),
            size: String(size.value)
        });
        if (filters.value.facilityId) params.set('facilityId', String(filters.value.facilityId));
        if (filters.value.cleaningItem) params.set('cleaningItem', filters.value.cleaningItem);
        if (filters.value.manager) params.set('manager', filters.value.manager);
        if (formattedFrom.value) params.set('dateFrom', formattedFrom.value);
        if (formattedTo.value) params.set('dateTo', formattedTo.value);

        const res = await fetch(`${API}api/clean-hist?${params.toString()}`);
        const data = await res.json();
        rows.value = data.items || [];
        total.value = data.total || 0;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
}

function reset() {
    filters.value = { facilityId: null, facilityName: '', cleaningItem: '', manager: '', dateFrom: null, dateTo: null };
    page.value = 1;
    search();
}

// ===== 설비 모달 =====
const facilityDialog = ref(false);
const facilitySearch = ref('');
const facilities = ref<Array<{ facility_id: number; facility_code: string; facility_name: string; type?: string }>>([]);
const facilityLoading = ref(false);
const facilityHeaders = [
    { title: '코드', value: 'facility_code', width: 140 },
    { title: '설비명', value: 'facility_name' },
    { title: '유형', value: 'type', width: 120 }
];

async function loadFacilities() {
    try {
        facilityLoading.value = true;
        const q = facilitySearch.value?.trim() || '';
        const res = await fetch(`${API}api/facilities?query=${encodeURIComponent(q)}`);
        const data = await res.json();
        facilities.value = Array.isArray(data) ? data : data.items || [];
    } finally {
        facilityLoading.value = false;
    }
}

let t: number | undefined;
const debouncedLoadFacilities = () => {
    clearTimeout(t);
    // @ts-ignore
    t = setTimeout(loadFacilities, 250);
};

function selectFacility(_: any, row: any) {
    const item = row.item as any;
    filters.value.facilityId = item.facility_id;
    filters.value.facilityName = item.facility_name;
    facilityDialog.value = false;
}

watchEffect(() => {
    if (facilityDialog.value) loadFacilities();
});

// 첫 로딩
search();
</script>

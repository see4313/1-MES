<!-- src/views/iqc-register.vue -->
<template>
    <h1>입고 품질 검사 등록</h1>

    <!-- ========== 검색 카드 ========== -->
    <v-row>
        <v-card elevation="10" class="pa-6">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="검색 조건"
                    btn-text1="조회"
                    btn-color1="primary"
                    btn-variant1="flat"
                    @btn-click1="onClickSearch"
                    btn-text2="초기화"
                    btn-color2="warning"
                    btn-variant2="flat"
                    @btn-click2="onClickSearchReset"
                />
            </v-card-item>

            <v-col cols="12" md="12">
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="입고번호"
                            v-model="searchForm.rcvNo"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openRcvModal('search')"
                            readonly
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="품목명" v-model="searchForm.itemName" readonly />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-select variant="outlined" label="판정" :items="['전체', '합격', '불합격']" v-model="searchForm.result" />
                    </v-col>

                    <!-- 검사일 From -->
                    <v-col cols="12" sm="4">
                        <v-menu v-model="fromMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    variant="outlined"
                                    label="검사일(From)"
                                    append-inner-icon="mdi-calendar"
                                    :model-value="formattedFromDate"
                                    readonly
                                />
                            </template>
                            <v-date-picker
                                v-model="searchFromProxy"
                                @update:model-value="
                                    (v) => {
                                        searchForm.fromDate = asDate(v);
                                        fromMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <!-- 검사일 To -->
                    <v-col cols="12" sm="4">
                        <v-menu v-model="toMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    variant="outlined"
                                    label="검사일(To)"
                                    append-inner-icon="mdi-calendar"
                                    :model-value="formattedToDate"
                                    readonly
                                />
                            </template>
                            <v-date-picker
                                v-model="searchToProxy"
                                @update:model-value="
                                    (v) => {
                                        searchForm.toDate = asDate(v);
                                        toMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>
                </v-row>
            </v-col>
        </v-card>
    </v-row>

    <!-- ========== 조회 결과 ========== -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
            <v-col cols="12">
                <div class="card">
                    <DataTable
                        :value="rows"
                        tableStyle="min-width: 60rem"
                        rowHover
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                        @row-click="onRowClick"
                    >
                        <Column field="inspNo" header="검사번호" />
                        <Column field="rcvNo" header="입고번호" />
                        <Column field="itemId" header="품목번호" />
                        <Column field="itemName" header="품목명" />
                        <Column field="lotNo" header="LOT" />
                        <Column field="qty" header="수량" />
                        <Column field="failQty" header="불량수량" />
                        <Column field="result" header="판정" />
                        <Column field="inspector" header="검사자" />
                        <Column field="inspDate" header="검사일">
                            <template #body="{ data }">
                                {{ data.inspDate ? dayjs(data.inspDate).format('YYYY-MM-DD') : '' }}
                            </template>
                        </Column>
                        <Column field="remark" header="비고" />
                    </DataTable>
                </div>
            </v-col>
        </v-card>
    </v-row>

    <!-- ========== 등록 카드 ========== -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
            <v-card-item class="py-6 px-6">
                <CardHeader3
                    title="입고 품질 검사 등록"
                    btn-text1="등록"
                    btn-color1="primary"
                    btn-variant1="flat"
                    @btn-click1="onClickCreate"
                    btn-text2="수정"
                    btn-color2="success"
                    btn-variant2="flat"
                    @btn-click2="onClickUpdate"
                    btn-text3="신규"
                    btn-color3="warning"
                    btn-variant3="flat"
                    @btn-click3="onClickReset"
                />
            </v-card-item>

            <v-col cols="12" md="12">
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="입고번호"
                            v-model="createForm.rcvNo"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openRcvModal('create')"
                            readonly
                            :rules="[(v) => !!v || '입고번호는 필수입니다.']"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="품목번호" v-model="createForm.itemId" readonly />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="품목명" v-model="createForm.itemName" readonly />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="LOT" v-model="createForm.lotNo" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field type="number" variant="outlined" label="수량" v-model.number="createForm.qty" />
                    </v-col>

                    <!-- 검사일 -->
                    <v-col cols="12" sm="4">
                        <v-menu v-model="inspMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="검사일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedInspDate"
                                    readonly
                                    :rules="[(v) => !!createForm.inspDate || '검사일은 필수입니다.']"
                                />
                            </template>
                            <v-date-picker
                                v-model="createInspProxy"
                                @update:model-value="
                                    (v) => {
                                        createForm.inspDate = asDate(v);
                                        inspMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-select
                            variant="outlined"
                            label="판정"
                            :items="['합격', '불합격']"
                            v-model="createForm.result"
                            :rules="[(v) => !!v || '판정은 필수입니다.']"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="검사자" v-model="createForm.inspector" />
                    </v-col>

                    <!-- 불량 선택 (옵션) -->
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="불량명"
                            v-model="createForm.badnName"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openBadnModal()"
                            readonly
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field type="number" variant="outlined" label="불량수량" v-model.number="createForm.failQty" />
                    </v-col>

                    <v-col cols="12" sm="8">
                        <v-text-field variant="outlined" label="비고" v-model="createForm.remark" />
                    </v-col>
                </v-row>
            </v-col>
        </v-card>
    </v-row>

    <!-- ===== 모달: 입고 선택 ===== -->
    <ModalSearch
        :visible="showRcvModal"
        title="입고번호 선택"
        idField="rcv"
        :columns="[
            { key: 'rcv_no', label: '입고번호' },
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'lot_no', label: 'LOT' },
            { key: 'qty', label: '수량' }
        ]"
        :fetchData="fetchRcvItems"
        :pageSize="10"
        @select="onSelectRcv"
        @close="showRcvModal = false"
    />

    <!-- ===== 모달: 불량 선택 ===== -->
    <ModalSearch
        :visible="showBadnModal"
        title="불량 선택"
        idField="badn"
        :columns="[
            { key: 'BADN_CODE', label: '불량코드' },
            { key: 'BADN_NAME', label: '불량명' },
            { key: 'UON', label: '사용여부' }
        ]"
        :fetchData="fetchBadnItems"
        :pageSize="10"
        @select="onSelectBadn"
        @close="showBadnModal = false"
    />

    <!-- ===== 스낵바 ===== -->
    <v-snackbar v-model="snackOpen" :timeout="1800" :color="snackColor" location="top right" rounded="pill">
        {{ snackMessage }}
        <template #actions>
            <v-btn variant="text" @click="snackOpen = false">닫기</v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import axios from 'axios';
import CardHeader from '@/components/production/card-header-btn2k.vue';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import dayjs from 'dayjs';

/* ===== util ===== */
const asDate = (v) => (!v ? null : v instanceof Date ? v : new Date(v));
const toDateStr = (v) => (v ? dayjs(v).format('YYYY-MM-DD') : null);

/* ===== 검색 상태 ===== */
const rows = ref([]);
const searchForm = ref({
    rcvNo: '',
    itemName: '',
    result: '전체', // 전체/합격/불합격
    fromDate: null,
    toDate: null
});

const fromMenu = ref(false);
const toMenu = ref(false);
const formattedFromDate = computed(() => (searchForm.value.fromDate ? dayjs(searchForm.value.fromDate).format('YYYY-MM-DD') : ''));
const formattedToDate = computed(() => (searchForm.value.toDate ? dayjs(searchForm.value.toDate).format('YYYY-MM-DD') : ''));

const searchFromProxy = computed({
    get: () => searchForm.value.fromDate,
    set: (v) => (searchForm.value.fromDate = asDate(v))
});
const searchToProxy = computed({
    get: () => searchForm.value.toDate,
    set: (v) => (searchForm.value.toDate = asDate(v))
});

/* ===== 등록 상태 ===== */
const createForm = ref({
    id: null,
    rcvNo: '',
    itemId: '',
    itemName: '',
    lotNo: '',
    qty: null,
    inspDate: null,
    result: '',
    inspector: '',
    badnCode: '',
    badnName: '',
    failQty: null,
    remark: ''
});

const inspMenu = ref(false);
const formattedInspDate = computed(() => (createForm.value.inspDate ? dayjs(createForm.value.inspDate).format('YYYY-MM-DD') : ''));
const createInspProxy = computed({
    get: () => createForm.value.inspDate,
    set: (v) => (createForm.value.inspDate = asDate(v))
});

/* ===== 스낵바 ===== */
const snackOpen = ref(false);
const snackMessage = ref('');
const snackColor = ref('success');
const notify = (m, c = 'success') => {
    snackMessage.value = m;
    snackColor.value = c;
    snackOpen.value = true;
};

/* ===== 모달 상태 ===== */
const showRcvModal = ref(false);
const showBadnModal = ref(false);
const modalTarget = ref('search'); // 'search' | 'create'

const openRcvModal = (t = 'search') => {
    modalTarget.value = t;
    showRcvModal.value = true;
};
const openBadnModal = () => {
    showBadnModal.value = true;
};

/* ===== 모달 데이터 fetch ===== */
const fetchRcvItems = async () => {
    try {
        const { data } = await axios.get('/api/rcv'); // ← 입고목록 API
        return Array.isArray(data) ? data : (data.items ?? []);
    } catch (e) {
        console.error('입고 조회 실패', e);
        return [];
    }
};

const fetchBadnItems = async () => {
    try {
        const { data } = await axios.get('/api/badncode'); // ← 불량코드 API
        return Array.isArray(data) ? data : (data.items ?? []);
    } catch (e) {
        console.error('불량 조회 실패', e);
        return [];
    }
};

/* ===== 모달 선택 핸들러 ===== */
const onSelectRcv = (row) => {
    if (modalTarget.value === 'create') {
        createForm.value.rcvNo = row?.rcv_no ?? '';
        createForm.value.itemId = row?.item_id ?? '';
        createForm.value.itemName = row?.item_name ?? '';
        createForm.value.lotNo = row?.lot_no ?? '';
        createForm.value.qty = row?.qty ?? null;
    } else {
        searchForm.value.rcvNo = row?.rcv_no ?? '';
        searchForm.value.itemName = row?.item_name ?? '';
    }
    showRcvModal.value = false;
};

const onSelectBadn = (row) => {
    createForm.value.badnCode = row?.BADN_CODE ?? '';
    createForm.value.badnName = row?.BADN_NAME ?? '';
    showBadnModal.value = false;
};

/* ===== 조회 ===== */
const onClickSearch = async () => {
    const payload = {
        ...searchForm.value,
        fromDate: toDateStr(searchForm.value.fromDate),
        toDate: toDateStr(searchForm.value.toDate)
    };
    const { data } = await axios.post('/api/iqc/search', payload);
    rows.value = Array.isArray(data) ? data : (data.items ?? []);
};

const onClickSearchReset = async () => {
    searchForm.value = { rcvNo: '', itemName: '', result: '전체', fromDate: null, toDate: null };
    await onClickSearch();
};

/* ===== 행 클릭 → 폼 채움 ===== */
const onRowClick = ({ data }) => {
    createForm.value = {
        id: data.inspNo ?? null,
        rcvNo: data.rcvNo ?? '',
        itemId: data.itemId ?? '',
        itemName: data.itemName ?? '',
        lotNo: data.lotNo ?? '',
        qty: data.qty ?? null,
        inspDate: asDate(data.inspDate) ?? null,
        result: data.result ?? '',
        inspector: data.inspector ?? '',
        badnCode: data.badnCode ?? '',
        badnName: data.badnName ?? '',
        failQty: data.failQty ?? null,
        remark: data.remark ?? ''
    };
};

/* ===== 등록/수정/신규 ===== */
const validateRequired = (f) => !!(f.rcvNo && f.inspDate && f.result);

const onClickCreate = async () => {
    if (!validateRequired(createForm.value)) {
        notify('필수 항목을 확인하세요. (입고번호/검사일/판정)', 'warning');
        return;
    }
    const payload = {
        ...createForm.value,
        inspDate: toDateStr(createForm.value.inspDate)
    };
    try {
        await axios.post('/api/iqc', payload);
        notify('등록이 완료되었습니다.', 'success');
        await onClickSearch();
        onClickReset();
    } catch (e) {
        notify(e?.response?.data?.message || '등록 중 오류가 발생했습니다.', 'error');
    }
};

const onClickUpdate = async () => {
    if (!createForm.value.id) {
        notify('수정할 검사건이 선택되지 않았습니다.', 'warning');
        return;
    }
    if (!validateRequired(createForm.value)) {
        notify('필수 항목을 확인하세요. (입고번호/검사일/판정)', 'warning');
        return;
    }
    const payload = {
        ...createForm.value,
        inspDate: toDateStr(createForm.value.inspDate)
    };
    try {
        await axios.put(`/api/iqc/${createForm.value.id}`, payload);
        notify('수정이 완료되었습니다.', 'success');
        await onClickSearch();
        onClickReset();
    } catch (e) {
        notify(e?.response?.data?.message || '수정 중 오류가 발생했습니다.', 'error');
    }
};

const onClickReset = () => {
    createForm.value = {
        id: null,
        rcvNo: '',
        itemId: '',
        itemName: '',
        lotNo: '',
        qty: null,
        inspDate: null,
        result: '',
        inspector: '',
        badnCode: '',
        badnName: '',
        failQty: null,
        remark: ''
    };
};

/* ===== 초기 ===== */
onMounted(onClickSearch);
</script>

<style scoped>
::v-deep(.v-icon) {
    cursor: pointer;
}
</style>

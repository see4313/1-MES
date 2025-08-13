<!-- src/views/bom.vue -->
<template>
    <!-- ===== 검색 영역 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="BOM관리"
                    btn-text2="조회"
                    btn-color2="primary"
                    btn-variant2="flat"
                    @btn-click2="openBomSearchModal"
                    btn-text1="초기화"
                    btn-color1="secondary"
                    btn-variant1="flat"
                    @btn-click1="onClickSearchReset"
                />
            </v-card-item>

            <v-col cols="12" md="12">
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="BOM번호"
                            v-model="searchForm.bomNumber"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openBomSearchModal"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="품목번호"
                            v-model="searchForm.itemId"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openItemModal('search')"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="품목명" v-model="searchForm.itemName" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="버전" v-model="searchForm.ver" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-menu v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="시작일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedStartDate"
                                />
                            </template>
                            <v-date-picker
                                v-model="searchStartProxy"
                                @update:model-value="
                                    (val) => {
                                        searchForm.startDate = asDate(val);
                                        startMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-menu v-model="endMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="종료일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedEndDate"
                                />
                            </template>
                            <v-date-picker
                                v-model="searchEndProxy"
                                @update:model-value="
                                    (val) => {
                                        searchForm.endDate = asDate(val);
                                        endMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-radio-group
                            v-model="searchForm.useYn"
                            label="사용여부"
                            variant="outlined"
                            style="width: 100%; --v-input-gap: 4px"
                        >
                            <div style="display: flex; align-items: center; gap: 16px; margin-top: -16px">
                                <v-radio label="사용" :value="'Y'" />
                                <v-radio label="미사용" :value="'N'" />
                            </div>
                        </v-radio-group>
                    </v-col>
                </v-row>
            </v-col>
        </v-card>
    </v-row>

    <!-- ===== 조회 결과(상세) 테이블 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
            <v-col cols="12" class="pb-2" style="display: flex; justify-content: flex-end">
                <v-btn append-icon="mdi-plus-circle" color="primary" @click="openItemModal('create')"> 품목 추가 </v-btn>
            </v-col>

            <v-col cols="12">
                <div class="card">
                    <DataTable
                        v-model:selection="selectedRow"
                        :value="detailRows"
                        dataKey="bom_detail_no"
                        tableStyle="min-width: 50rem"
                        selectionMode="single"
                        rowHover
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                    >
                        <Column field="item_id" header="품목번호" sortable />
                        <Column field="item_name" header="품목명" />
                        <Column field="usage" header="사용량" />
                        <Column field="unit" header="단위" />
                        <Column field="loss" header="손실률" />
                    </DataTable>
                </div>
            </v-col>
        </v-card>
    </v-row>

    <!-- ===== 등록/수정 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
            <v-card-item class="py-6 px-6">
                <CardHeader3
                    title="BOM등록"
                    btn-text3="저장"
                    btn-color3="primary"
                    btn-variant3="flat"
                    @btn-click3="onClickCreate"
                    btn-text2="수정"
                    btn-color2="warning"
                    btn-variant2="flat"
                    @btn-click2="onClickUpdate"
                    btn-text1="초기화"
                    btn-color1="secondary"
                    btn-variant1="flat"
                    @btn-click1="onClickReset"
                />
            </v-card-item>

            <v-col cols="12" md="12">
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="품목번호"
                            v-model="createForm.itemId"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openItemModal('create')"
                            :rules="[(v) => !!v || '품목번호는 필수입니다.']"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="품목명"
                            v-model="createForm.itemName"
                            :rules="[(v) => !!v || '품목명은 필수입니다.']"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="버전" v-model="createForm.ver" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-menu
                            v-model="startMenu1"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="시작일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedStartDate1"
                                    :rules="[(v) => !!createForm.startDate || '시작일은 필수입니다.']"
                                />
                            </template>
                            <v-date-picker
                                v-model="createStartProxy"
                                @update:model-value="
                                    (val) => {
                                        createForm.startDate = asDate(val);
                                        startMenu1 = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-menu v-model="endMenu1" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="종료일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedEndDate1"
                                />
                            </template>
                            <v-date-picker
                                v-model="createEndProxy"
                                @update:model-value="
                                    (val) => {
                                        createForm.endDate = asDate(val);
                                        endMenu1 = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-radio-group
                            v-model="createForm.useYn"
                            label="사용여부"
                            variant="outlined"
                            style="width: 100%; --v-input-gap: 4px"
                        >
                            <div style="display: flex; align-items: center; gap: 16px; margin-top: -16px">
                                <v-radio label="사용" :value="'Y'" />
                                <v-radio label="미사용" :value="'N'" />
                            </div>
                        </v-radio-group>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="비고" v-model="createForm.remark" />
                    </v-col>
                </v-row>
            </v-col>
        </v-card>
    </v-row>

    <!-- ===== 스낵바 ===== -->
    <v-snackbar v-model="snackOpen" :timeout="2000" :color="snackColor" location="top right" rounded="pill">
        {{ snackMessage }}
        <template #actions><v-btn variant="text" @click="snackOpen = false">닫기</v-btn></template>
    </v-snackbar>

    <!-- ===== 공통 모달 ===== -->
    <!-- BOM 검색-->
    <ModalSearch
        v-model:visible="showBomModal"
        max-width="1100px"
        title="BOM검색"
        idField="bom_number"
        :columns="[
            { key: 'bom_number', label: 'BOM번호' },
            { key: 'ver', label: '버전' },
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'start_date', label: '시작일' },
            { key: 'end_date', label: '종료일' },
            { key: 'use_yn', label: '사용여부' },
            { key: 'remark', label: '비고' }
        ]"
        :fetchData="fetchBomList"
        :pageSize="10"
        @select="onSelectBom"
    />
    <!--bom 번호-->
    <!-- <ModalSearch
        v-model:visible="showBomModal1"
        title="BOM번호 검색"
        idField="bom_number1"
        :columns="[
            { key: 'bom_number', label: 'BOM번호' },
            { key: 'item_name', label: '품목명' }
        ]"
        :fetchData="fetchBomList1"
        :pageSize="10"
        @select="onSelectBom1"
    /> -->
    <!-- 품목 검색(단일) -->
    <ModalSearch
        v-model:visible="showItemModal"
        title="품목검색"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '품목번호' },
            { key: 'item_type', label: '품목유형' },
            { key: 'item_name', label: '품목명' }
        ]"
        :fetchData="fetchItemList"
        :pageSize="5"
        @select="onSelectItem"
    />
</template>

<script setup>
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import CardHeader from '@/components/production/card-header-btn2k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, computed, nextTick, watch } from 'vue';
import dayjs from 'dayjs';

/* ===== 유틸 ===== */
const asDate = (v) => (!v ? null : v instanceof Date ? v : new Date(v));
const toDateStr = (v) => (v ? dayjs(v).format('YYYY-MM-DD') : null);
const unwrap = (data) => (Array.isArray(data) ? data : (data?.items ?? data?.rows ?? []));

/* ===== 폼 ===== */
const searchForm = ref({
    bomNumber: '',
    itemId: '',
    itemName: '',
    ver: '',
    startDate: null,
    endDate: null,
    useYn: ''
});

const createForm = ref({
    id: null,
    itemId: '',
    itemName: '',
    ver: '',
    startDate: null,
    endDate: null,
    useYn: '',
    remark: ''
});

/* ===== 날짜 표시/프록시 ===== */
const formattedStartDate = computed(() => (searchForm.value.startDate ? dayjs(searchForm.value.startDate).format('YYYY-MM-DD') : ''));
const formattedEndDate = computed(() => (searchForm.value.endDate ? dayjs(searchForm.value.endDate).format('YYYY-MM-DD') : ''));
const searchStartProxy = computed({
    get: () => searchForm.value.startDate,
    set: (v) => (searchForm.value.startDate = asDate(v))
});
const searchEndProxy = computed({
    get: () => searchForm.value.endDate,
    set: (v) => (searchForm.value.endDate = asDate(v))
});

const formattedStartDate1 = computed(() => (createForm.value.startDate ? dayjs(createForm.value.startDate).format('YYYY-MM-DD') : ''));
const formattedEndDate1 = computed(() => (createForm.value.endDate ? dayjs(createForm.value.endDate).format('YYYY-MM-DD') : ''));
const createStartProxy = computed({
    get: () => createForm.value.startDate,
    set: (v) => (createForm.value.startDate = asDate(v))
});
const createEndProxy = computed({
    get: () => createForm.value.endDate,
    set: (v) => (createForm.value.endDate = asDate(v))
});

/* ===== 오버레이/모달 ===== */
const startMenu = ref(false);
const endMenu = ref(false);
const startMenu1 = ref(false);
const endMenu1 = ref(false);

const showBomModal1 = ref(false);
const showBomModal = ref(false);
const showItemModal = ref(false);
const itemModalTarget = ref('search'); // 'search' | 'create'

const closeAllOverlays = async () => {
    startMenu.value = endMenu.value = false;
    startMenu1.value = endMenu1.value = false;
    showBomModal.value = showItemModal.value = false;
    await nextTick();
    document.activeElement?.blur?.();
};

const openBomSearchModal = async () => {
    await closeAllOverlays();
    showBomModal.value = true;
};
const openItemModal = async (t = 'search') => {
    await closeAllOverlays();
    itemModalTarget.value = t;
    showItemModal.value = true;
};

/* ===== 목록/모달 데이터 ===== */

// BOM 검색 모달 데이터 로딩

const cacheBomAll = ref(null);

// keyword(q)로 BOM번호/품목명 동시에 LIKE 검색, 나머지 필터도 옵션
const fetchBomList = async (q = '') => {
    const { data } = await axios.get('/api/bom', {
        params: {
            bom_number: q || undefined,
            item_name: q || undefined
            // 필요 시 추가 필터
            // item_id: 'ITM001',
            // ver: 'A1',
            // use_yn: 'Y',
        }
    });
    return Array.isArray(data) ? data : (data?.rows ?? data?.items ?? []);
};

// 상세

/* ===== 디테일 테이블 ===== */
const detailRows = ref([]);
const detailsLoading = ref(false);

const fetchBomDetails = async (bomNumber) => {
    const { data } = await axios.get(`/api/bom/${encodeURIComponent(bomNumber)}/details`);
    return Array.isArray(data) ? data : (data?.rows ?? data?.items ?? []);
};

/* ===== 모달 선택 ===== */
async function onSelectBom(row) {
    if (!row) {
        showBomModal.value = false;
        return;
    }

    const bomNumber = row.bom_number ?? row.bomNumber ?? '';
    searchForm.value.bomNumber = bomNumber;
    searchForm.value.itemId = row.item_id ?? row.itemId ?? '';
    searchForm.value.itemName = row.item_name ?? row.itemName ?? '';
    searchForm.value.ver = row.ver ?? '';
    searchForm.value.useYn = row.use_yn ?? row.useYn ?? '';
    searchForm.value.startDate = row.start_date ? asDate(row.start_date) : null;
    searchForm.value.endDate = row.end_date ? asDate(row.end_date) : null;

    showBomModal.value = false;
    await fetchBomDetails(bomNumber);
}

const onSelectItem = (row) => {
    const id = row?.item_id ?? '';
    const name = row?.item_name ?? '';
    if (!id) {
        showItemModal.value = false;
        return;
    }
    if (itemModalTarget.value === 'create') {
        createForm.value.itemId = id;
        createForm.value.itemName = name;
    } else {
        searchForm.value.itemId = id;
        searchForm.value.itemName = name;
    }
    showItemModal.value = false;
};

/* ===== 등록/수정 ===== */
const snackOpen = ref(false);
const snackMessage = ref('');
const snackColor = ref('success');
const notify = (message, color = 'success') => {
    snackMessage.value = message;
    snackColor.value = color;
    snackOpen.value = true;
};

const validateRequired = (f) => !!(f.itemId && f.itemName && f.startDate);

const onClickCreate = async () => {
    if (!validateRequired(createForm.value)) return notify('필수 항목을 확인하세요.', 'warning');
    const payload = { ...createForm.value, startDate: toDateStr(createForm.value.startDate), endDate: toDateStr(createForm.value.endDate) };
    try {
        await axios.post('/api/bom', payload);
        notify('등록이 완료되었습니다.');
    } catch (e) {
        notify(e?.response?.data?.message || '등록 중 오류가 발생했습니다.', 'error');
    }
};

const onClickUpdate = async () => {
    if (!createForm.value.id) return notify('수정할 항목이 선택되지 않았습니다.', 'warning');
    if (!validateRequired(createForm.value)) return notify('필수 항목을 확인하세요.', 'warning');
    const payload = { ...createForm.value, startDate: toDateStr(createForm.value.startDate), endDate: toDateStr(createForm.value.endDate) };
    try {
        await axios.put(`/api/bom/${createForm.value.id}`, payload);
        notify('수정이 완료되었습니다.');
    } catch (e) {
        notify('수정 중 오류가 발생했습니다.', 'error');
    }
};

/* ===== 행 선택 → 폼 채우기 ===== */
const selectedRow = ref(null);
watch(selectedRow, (row) => {
    if (!row) return resetCreateForm();
    createForm.value = {
        id: row?.bom_detail_no ?? null,
        itemId: row?.item_id ?? '',
        itemName: row?.item_name ?? '',
        usage: row?.usage ?? '',
        unit: row?.unit ?? '',
        loss: row?.loss ?? '',
        ver: row?.ver ?? '',
        startDate: row?.start_date ? asDate(row.start_date) : null,
        endDate: row?.end_date ? asDate(row.end_date) : null,
        useYn: row?.use_yn ?? '',
        remark: row?.remark ?? row?.remk ?? ''
    };
});

/* ===== 초기화 ===== */
function resetCreateForm() {
    createForm.value = {
        id: null,
        itemId: '',
        itemName: '',
        usage: '',
        unit: '',
        loss: '',
        ver: '',
        startDate: null,
        endDate: null,
        useYn: '',
        remark: ''
    };
}

const onClickReset = () => {
    resetCreateForm();
    closeAllOverlays();
};

const onClickSearchReset = async () => {
    searchForm.value = { bomNumber: '', itemId: '', itemName: '', ver: '', startDate: null, endDate: null, useYn: '' };
    startMenu.value = endMenu.value = false;
    detailRows.value = [];
};
</script>

<style scoped>
::v-deep(.v-icon) {
    cursor: pointer;
}
::v-deep(.v-list-item) {
    display: flex;
    justify-content: center;
}
</style>

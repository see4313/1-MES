<!-- src/views/bom.vue -->
<template>
    <!-- ===== 검색 영역 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6">
            <v-card-item class="py-6 px-6"></v-card-item>
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

            <v-col cols="12" md="12">
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="BOM번호" v-model="searchForm.bomNumber" />
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
                        <v-menu
                            v-model="menus.searchStart"
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
                                    :model-value="formatDate(searchForm.startDate)"
                                />
                            </template>
                            <v-date-picker v-model="searchForm.startDate" @update:model-value="menus.searchStart = false" />
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-menu
                            v-model="menus.searchEnd"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="종료일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formatDate(searchForm.endDate)"
                                />
                            </template>
                            <v-date-picker v-model="searchForm.endDate" @update:model-value="menus.searchEnd = false" />
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
            <v-col cols="12">
                <div class="detail">
                    <v-card-item class="py-6 px-6">
                        <CardHeader
                            title="BOM 상세정보"
                            btn-icon2="mdi-plus-circle"
                            btn-text2="행추가"
                            btn-variant2="flat"
                            btn-color2="primary"
                            @btn-click2="addRow"
                            btn-text1="등록"
                            btn-color1="primary"
                            btn-variant1="flat"
                            @btn-click1="onClickDetailInsert"
                        />
                    </v-card-item>

                    <DataTable
                        v-model:selection="selectedRow"
                        :value="detailRows"
                        :loading="detailsLoading"
                        tableStyle="min-width: 50rem"
                        rowHover
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                    >
                        <Column field="item_id" sortable header="품목번호">
                            <template #body="slotProps">
                                <v-icon class="cursor-pointer" @click="openItemModal('detail', slotProps.data)" style="margin-left: 8px">
                                    mdi-magnify
                                </v-icon>
                                {{ slotProps.data.item_id }}
                            </template>
                        </Column>

                        <Column field="item_name" header="품목명" />

                        <Column field="spec" header="규격" />

                        <Column field="unit" header="단위" />

                        <Column field="loss" header="투입량">
                            <template #body="slotProps">
                                <v-text-field
                                    v-model.number="detailRows[slotProps.index].loss"
                                    type="number"
                                    dense
                                    hide-details
                                    style="width: 100px"
                                    variant="outlined"
                                    min="0"
                                />
                            </template>
                        </Column>

                        <!-- 삭제 버튼 -->
                        <Column style="width: 80px; text-align: center">
                            <template #body="slotProps">
                                <v-btn icon color="error" @click="deleteRow(slotProps.index)">
                                    <v-icon size="20">mdi-delete</v-icon>
                                </v-btn>
                            </template>
                        </Column>
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
                            :rules="[requiredRule(createForm.itemId, '품목번호는 필수입니다.')]"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="품목명"
                            v-model="createForm.itemName"
                            :rules="[requiredRule(createForm.itemName, '품목명은 필수입니다.')]"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="버전" v-model="createForm.ver" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-menu
                            v-model="menus.createStart"
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
                                    :model-value="formatDate(createForm.startDate)"
                                    :rules="[requiredRule(createForm.startDate, '시작일은 필수입니다.')]"
                                />
                            </template>
                            <v-date-picker v-model="createForm.startDate" @update:model-value="menus.createStart = false" />
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-menu
                            v-model="menus.createEnd"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="종료일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formatDate(createForm.endDate)"
                                />
                            </template>
                            <v-date-picker v-model="createForm.endDate" @update:model-value="menus.createEnd = false" />
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
    <v-snackbar v-model="snack.open" :timeout="2000" :color="snack.color" location="top right" rounded="pill">
        {{ snack.message }}
        <template #actions>
            <v-btn variant="text" @click="snack.open = false">닫기</v-btn>
        </template>
    </v-snackbar>

    <!-- ===== 공통 모달 ===== -->
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
            { key: 'remk', label: '비고' }
        ]"
        :fetchData="fetchBomList"
        :pageSize="10"
        @select="onSelectBom"
    />

    <ModalSearch
        v-model:visible="showItemModal"
        title="품목검색"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'spec', label: '규격' },
            { key: 'unit', label: '단위' }
        ]"
        :fetchData="fetchItemList"
        :pageSize="5"
        @select="onSelectItem"
    />

    <ModalSearch
        :visible="itemUnitModal"
        title="단위"
        idField="cmmn_id"
        :columns="[
            { key: 'cmmn_id', label: '공통코드 번호' },
            { key: 'cmmn_name', label: '공통코드명' }
        ]"
        :fetchData="fetchUnit"
        :pageSize="5"
        @select="onSelectUnit"
    />
</template>

<script setup>
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import CardHeader from '@/components/production/card-header-btn2k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, nextTick } from 'vue';
import dayjs from 'dayjs';

/* ===== 유틸 ===== */
const asDate = (v) => (!v ? null : v instanceof Date ? v : new Date(v));
const formatDate = (v) => (v ? dayjs(v).format('YYYY-MM-DD') : '');
const toDateStr = (v) => (v ? dayjs(v).format('YYYY-MM-DD') : null);
const unwrap = (data) => (Array.isArray(data) ? data : (data?.items ?? data?.rows ?? []));

const requiredRule = (v, msg) => () => (!!v ? true : msg);

/* ===== 상태 ===== */
const menus = ref({
    searchStart: false,
    searchEnd: false,
    createStart: false,
    createEnd: false
});

const itemTargetRow = ref(null);
const showBomModal = ref(false);
const showItemModal = ref(false);
const itemUnitModal = ref(false); //단위모달
const itemModalTarget = ref('search'); // 'search' | 'create' | 'detail'
const unitModalTarget = ref('detail');
const unitTargetRow = ref(null);

/* 폼 */
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
    ver: 1, // 버전 기본값을 1로 설정
    startDate: new Date(), // 시작일 기본값을 오늘 날짜로 설정
    endDate: null,
    useYn: 'Y', // 사용여부 기본값을 'Y'로 설정
    remark: ''
});

/* 상세 */
const detailRows = ref([]);
const detailsLoading = ref(false);
const selectedRow = ref(null);

/* 스낵바 */
const snack = ref({ open: false, message: '', color: 'success' });
const notify = (message, color = 'success') => {
    snack.value = { open: true, message, color };
};

/* ===== 모달 오픈/클로즈 ===== */
const closeAllOverlays = async () => {
    menus.value.searchStart = menus.value.searchEnd = false;
    menus.value.createStart = menus.value.createEnd = false;
    showBomModal.value = showItemModal.value = false;
    await nextTick();
    document.activeElement?.blur?.();
};
//조회모달
const openBomSearchModal = async () => {
    await closeAllOverlays();
    showBomModal.value = true;
};
//품목모달
const openItemModal = async (t = 'search', row = null) => {
    await closeAllOverlays();
    itemModalTarget.value = t;
    itemTargetRow.value = row;
    showItemModal.value = true;
};
//단위모달
const openUnitModal = async (t = 'detail', row = null) => {
    await closeAllOverlays();
    unitModalTarget.value = t;
    unitTargetRow.value = row; // 행 객체 저장
    itemUnitModal.value = true;
};
/* ===== API ===== */
const fetchBomList = async (q = '') => {
    try {
        const { data } = await axios.get('/api/bom', {
            params: {
                bom_number: q || searchForm.value.bomNumber || undefined,
                item_name: q || searchForm.value.itemName || undefined,
                item_id: searchForm.value.itemId || undefined,
                ver: searchForm.value.ver || undefined,
                use_yn: searchForm.value.useYn || undefined,
                start_date_from: toDateStr(searchForm.value.startDate) || undefined,
                end_date_to: toDateStr(searchForm.value.endDate) || undefined
            }
        });
        return unwrap(data);
    } catch (e) {
        console.error('BOM 목록 오류:', e);
        notify(e?.response?.data?.message || 'BOM 목록을 불러오는 중 오류가 발생했습니다.', 'error');
        return [];
    }
};

const fetchBomDetails = async (bomNumber) => {
    const { data } = await axios.get(`/api/bom/${encodeURIComponent(bomNumber)}/details`);
    return unwrap(data);
};

const fetchItemList = async (q = '') => {
    try {
        const { data } = await axios.get('/api/item', { params: { item_name: q || undefined } });
        return unwrap(data);
    } catch (e) {
        console.warn('[fetchItemList] API 조정 필요', e?.message || e);
        return [];
    }
};

const fetchUnit = async (q = '') => {
    try {
        const { data } = await axios.get('/api/unit', { params: { keyword: q || undefined } });
        return Array.isArray(data) ? data : (data?.rows ?? data?.items ?? []);
    } catch (e) {
        notify('단위 목록 조회 중 오류가 발생했습니다.', 'error');
        return [];
    }
};

/* ===== 모달 선택 핸들러 ===== */
const onSelectBom = async (row) => {
    if (!row) return (showBomModal.value = false);

    const bomNumber = row.bom_number ?? row.bomNumber ?? '';
    // 등록/수정 폼 채우기
    createForm.value = {
        id: row.id ?? null,
        itemId: row.item_id ?? row.itemId ?? '',
        itemName: row.item_name ?? row.itemName ?? '',
        ver: row.ver ?? '',
        startDate: row.start_date ? asDate(row.start_date) : null,
        endDate: row.end_date ? asDate(row.end_date) : null,
        useYn: row.use_yn ?? row.useYn ?? '',
        remark: row.remk ?? row.remark ?? ''
    };

    showBomModal.value = false;

    // 상세 조회
    detailsLoading.value = true;
    try {
        const rows = await fetchBomDetails(bomNumber);
        detailRows.value = rows;
    } catch (e) {
        notify(e?.response?.data?.message || '상세 조회 중 오류가 발생했습니다.', 'error');
    } finally {
        detailsLoading.value = false;
    }
};

const onSelectItem = (row) => {
    const id = row?.item_id ?? '';
    const name = row?.item_name ?? '';
    const spec = row?.spec ?? '';
    const unit = row?.unit ?? '';
    if (!id) return (showItemModal.value = false);
    // 등록/수정 폼 채우기
    if (itemModalTarget.value === 'create') {
        createForm.value.itemId = id;
        createForm.value.itemName = name;
    } else if (itemModalTarget.value === 'detail') {
        // 상세내역 특정 행 채우기
        const i = itemTargetRow.value;
        if (itemTargetRow.value) {
            itemTargetRow.value.item_id = id;
            itemTargetRow.value.item_name = name;
            itemTargetRow.value.spec = spec;
            itemTargetRow.value.unit = unit;
        }
    } else {
        searchForm.value.itemId = id;
        searchForm.value.itemName = name;
    }
    showItemModal.value = false;
};

//단위 필드 채우기
const onSelectUnit = (row) => {
    if (!row) {
        itemUnitModal.value = false;
        return;
    }
    if (unitTargetRow.value) {
        unitTargetRow.value.unit = row.cmmn_name;
    }
    itemUnitModal.value = false;
};
/* ===== 등록/수정/초기화 ===== */
const validateRequired = (f) => !!(f.itemId && f.itemName && f.startDate);
//등록
// src/views/bom.vue의 <script setup> 부분

const onClickCreate = async () => {
    if (!validateRequired(createForm.value)) {
        return notify('필수 항목을 확인하세요.', 'warning');
    }

    const payload = {
        itemId: createForm.value.itemId,
        ver: createForm.value.ver,
        startDate: toDateStr(createForm.value.startDate),
        endDate: toDateStr(createForm.value.endDate),
        use: createForm.value.useYn, // 'useYn'을 'use'로 매핑
        remk: createForm.value.remark // 'remark'를 'remk'로 매핑
    };

    console.log('Final payload before sending:', payload);

    try {
        await axios.post('/api/bomInsert', payload);
        notify('BOM 등록이 완료되었습니다.');
        resetCreateForm(); // 등록 성공 시 폼 초기화
    } catch (e) {
        notify(e?.response?.data?.message || '등록 중 오류가 발생했습니다.', 'error');
    }
};
//수정
const onClickUpdate = async () => {
    if (!validateRequired(createForm.value)) return notify('필수 항목을 확인하세요.', 'warning');

    const payload = {
        ...createForm.value,
        startDate: toDateStr(createForm.value.startDate),
        endDate: toDateStr(createForm.value.endDate)
    };
    try {
        await axios.put(`/api/bom/${createForm.value.id}`, payload);
        notify('수정이 완료되었습니다.');
    } catch (e) {
        notify(e?.response?.data?.message || '수정 중 오류가 발생했습니다.', 'error');
    }
};
//초기화
const resetCreateForm = () => {
    createForm.value = {
        id: null,
        itemId: '',
        itemName: '',
        ver: 1,
        startDate: new Date(),
        endDate: null,
        useYn: 'Y',
        remark: ''
    };
};

const onClickReset = () => {
    resetCreateForm();
    closeAllOverlays();
};

const onClickSearchReset = () => {
    searchForm.value = { bomNumber: '', itemId: '', itemName: '', ver: '', startDate: null, endDate: null, useYn: '' };
    menus.value.searchStart = menus.value.searchEnd = false;
    detailRows.value = [];
};

/* ===== 상세내역 ===== */
const addRow = () => {
    detailRows.value.push({
        item_id: '',
        item_name: '',
        spec: '',
        unit: '',
        loss: 0
    });
};

const deleteRow = (index) => {
    detailRows.value.splice(index, 1);
};

/* ===== 상세 등록 버튼 핸들러 ===== */
const onClickDetailInsert = () => {
    notify('상세 등록 로직을 구현.', 'warning');
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

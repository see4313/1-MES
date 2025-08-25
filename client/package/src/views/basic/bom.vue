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
                            btn-color2="#424242"
                            @btn-click2="addRow"
                            btn-text1="등록"
                            btn-color1="warning"
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

                        <Column field="usage" header="투입량">
                            <template #body="slotProps">
                                <v-text-field
                                    v-model.number="slotProps.data.usage"
                                    type="number"
                                    dense
                                    hide-details
                                    style="width: 100px"
                                    variant="outlined"
                                    min="0"
                                    class="right-align-input"
                                />
                            </template>
                        </Column>

                        <Column field="loss" header="손실률">
                            <template #body="slotProps">
                                <v-text-field
                                    v-model.number="slotProps.data.loss"
                                    type="number"
                                    dense
                                    hide-details
                                    style="width: 100px"
                                    variant="outlined"
                                    min="0"
                                    class="right-align-input"
                                />
                            </template>
                        </Column>

                        <!-- 삭제 버튼 -->
                        <Column style="width: 80px; text-align: center">
                            <template #body="slotProps">
                                <v-btn icon color="error" @click="deleteRow(slotProps.data)">
                                    <v-icon size="20">mdi-delete</v-icon>
                                </v-btn>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </v-col>
        </v-card>
    </v-row>
    <!---->
    <!-- ===== 등록/수정 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
            <v-card-item class="py-6 px-6">
                <CardHeader3
                    title="BOM등록"
                    btn-text3="저장"
                    btn-color3="warning"
                    btn-variant3="flat"
                    @btn-click3="onClickCreate"
                    btn-text2="삭제"
                    btn-variant2="flat"
                    btn-color2="error"
                    :btn-disabled2="!createForm.id"
                    @btn-click2="onClickDel"
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
                            readonly
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="품목명" v-model="createForm.itemName" readonly />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="버전" v-model="createForm.ver" readonly />
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
        :pageSize="5"
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
const enc = encodeURIComponent;

/* ===== 상태 ===== */
const menus = ref({ searchStart: false, searchEnd: false, createStart: false, createEnd: false });
const itemTargetRow = ref(null);
const showBomModal = ref(false);
const showItemModal = ref(false);
const itemModalTarget = ref('search'); // 'search' | 'create' | 'detail'

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
    id: null, // BOM 번호(선택됨/생성됨)
    itemId: '',
    itemName: '',
    ver: '',
    startDate: null,
    endDate: null,
    useYn: '',
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
const openBomSearchModal = async () => {
    await closeAllOverlays();
    showBomModal.value = true;
};
const openItemModal = async (t = 'search', row = null) => {
    await closeAllOverlays();
    itemModalTarget.value = t;
    itemTargetRow.value = row;
    showItemModal.value = true;
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
    const { data } = await axios.get(`/api/bom/${enc(bomNumber)}/details`);
    return unwrap(data);
};

const fetchItemList = async (q = '') => {
    try {
        const { data } = await axios.get('/api/item', { params: { keyword: q || undefined } });
        return unwrap(data);
    } catch (e) {
        console.warn('[fetchItemList] API 조정 필요', e?.message || e);
        return [];
    }
};

// 다음 버전 라벨("verN")
const fetchNextVerByItem = async (itemId) => {
    if (!itemId) return '';
    try {
        const { data } = await axios.get('/api/bom/maxVersion', { params: { itemId } });
        return String(data?.ver ?? '').trim();
    } catch (e) {
        console.warn('fetchNextVerByItem error:', e?.message || e);
        return '';
    }
};
const setNextVerLabel = async (itemId) => {
    createForm.value.ver = await fetchNextVerByItem(itemId);
};

//수정시에도 행추가
const isExistingDetail = (r) => !!r?.bom_detail_no;

const pickNewDetails = (rows = detailRows.value) =>
    (Array.isArray(rows) ? rows : [])
        .filter((r) => !isExistingDetail(r))
        .map((r) => ({
            item_id: r.item_id,
            unit: r.unit,
            usage: Number(r.usage) || 0,
            loss: Number(r.loss ?? 0) || 0
        }));

/* ===== 모달 선택 핸들러 ===== */
const onSelectBom = async (row) => {
    if (!row) return (showBomModal.value = false);

    const bomNumber = row.bom_number ?? row.bomNumber ?? '';
    createForm.value = {
        id: bomNumber,
        itemId: row.item_id ?? row.itemId ?? '',
        itemName: row.item_name ?? row.itemName ?? '',
        ver: row.ver ?? '',
        startDate: row.start_date ? asDate(row.start_date) : null,
        endDate: row.end_date ? asDate(row.end_date) : null,
        useYn: row.use_yn ?? row.useYn ?? 'Y',
        remark: row.remk ?? row.remark ?? ''
    };

    showBomModal.value = false;

    detailsLoading.value = true;
    try {
        detailRows.value = await fetchBomDetails(bomNumber);
    } catch (e) {
        notify(e?.response?.data?.message || '상세 조회 중 오류가 발생했습니다.', 'error');
    } finally {
        detailsLoading.value = false;
    }
};

const onSelectItem = async (row) => {
    const id = row?.item_id ?? '';
    const name = row?.item_name ?? '';
    const spec = row?.spec ?? '';
    const unit = row?.unit ?? '';

    if (!id) {
        showItemModal.value = false;
        return;
    }

    if (itemModalTarget.value === 'create') {
        // 등록 폼에서 품목 교체
        const changed = createForm.value.itemId !== id;
        if (!changed) {
            showItemModal.value = false;
            return;
        }

        // 입력/상세가 존재하면 경고 후 초기화
        const needConfirm =
            !!createForm.value.id ||
            detailRows.value.length > 0 ||
            !!createForm.value.ver ||
            !!createForm.value.startDate ||
            !!createForm.value.endDate ||
            !!createForm.value.remark;

        if (needConfirm) {
            const ok = window.confirm('품목을 변경하면 현재 입력값과 상세내역이 모두 초기화됩니다. 계속할까요?');
            if (!ok) {
                showItemModal.value = false;
                return;
            }
        }

        // 품목 반영 + 강제 초기화(편집모드→신규 전환)
        createForm.value.itemId = id;
        createForm.value.itemName = name;
        resetForNewItem({ hard: true });
        await setNextVerLabel(id); // 새 품목의 verN 즉시 반영
    } else if (itemModalTarget.value === 'detail') {
        // 상세 행에서 품목 선택
        if (itemTargetRow.value) {
            const keyId = id;
            const keyUnit = unit || '';
            const hasDup = detailRows.value.some(
                (r) => r !== itemTargetRow.value && (r?.item_id ?? '') === keyId && (r?.unit ?? '') === keyUnit
            );
            if (hasDup) {
                notify('같은 품목/단위가 이미 있습니다.', 'warning');
                showItemModal.value = false;
                return;
            }
            itemTargetRow.value.item_id = id;
            itemTargetRow.value.item_name = name;
            itemTargetRow.value.spec = spec;
            itemTargetRow.value.unit = unit;
        }
    } else {
        // 검색 폼
        searchForm.value.itemId = id;
        searchForm.value.itemName = name;
    }

    showItemModal.value = false;
};

/* ===== 등록/수정/초기화 ===== */
const validateRequired = (f) => !!(f.itemId && f.itemName && f.startDate);

// 업서트/버전업 성공 후 초기화
const resetBomEditor = async () => {
    createForm.value = {
        id: null,
        itemId: '',
        itemName: '',
        ver: '',
        startDate: null,
        endDate: null,
        useYn: '',
        remark: ''
    };
    detailRows.value = [];
    selectedRow.value = null;
    await nextTick();
};

// 저장 버튼
const onClickSave = async () => {
    if (!validateRequired(createForm.value)) {
        return notify('필수 항목을 확인하세요.', 'warning');
    }

    const isUpdate = !!createForm.value.id;

    try {
        if (isUpdate) {
            // ===== 기존 BOM 헤더 수정 (버전은 유지) =====
            const payload = {
                itemId: createForm.value.itemId,
                use: createForm.value.useYn || 'Y',
                ver: createForm.value.ver,
                startDate: toDateStr(createForm.value.startDate),
                endDate: toDateStr(createForm.value.endDate),
                remk: createForm.value.remark || null
            };

            await axios.put(`/api/bom/${enc(createForm.value.id)}`, payload);

            // 🔹 신규로 "행추가"한 상세만 골라 저장
            const newDetails = pickNewDetails();

            if (newDetails.length > 0) {
                // 신규 상세 유효성 검사(필요한 필드만 검사)
                const err = validateDetailRows(newDetails);
                if (err) {
                    notify(err, 'warning');
                    return;
                }

                await axios.post(`/api/bom/${enc(createForm.value.id)}/details`, { details: newDetails });
                notify('BOM 헤더 및 신규 상세가 저장되었습니다.');
                await reloadDetailsIfNeeded(); // 테이블 싱크
            } else {
                notify('BOM 헤더가 수정되었습니다.');
            }

            return;
        }

        const header = {
            item_id: createForm.value.itemId,
            use_yn: createForm.value.useYn || 'Y',
            start_date: toDateStr(createForm.value.startDate),
            end_date: toDateStr(createForm.value.endDate),
            remk: createForm.value.remark || null
        };

        const details = Array.isArray(detailRows.value)
            ? detailRows.value.map((r) => ({
                  item_id: r.item_id,
                  unit: r.unit,
                  usage: Number(r.usage) || 0,
                  loss: Number(r.loss ?? 0) || 0
              }))
            : [];

        await axios.post('/api/bom', { header, details });
        notify('BOM 등록이 완료되었습니다.');
        resetCreateForm();
        detailRows.value = [];
    } catch (e) {
        notify(e?.response?.data?.message || (isUpdate ? '수정 중 오류가 발생했습니다.' : '등록 중 오류가 발생했습니다.'), 'error');
    }
};

const onClickCreate = onClickSave;

const resetCreateForm = () => {
    createForm.value = {
        id: null,
        itemId: '',
        itemName: '',
        ver: '',
        startDate: null,
        endDate: null,
        useYn: '',
        remark: ''
    };
};

const onClickReset = async () => {
    resetCreateForm();
    detailRows.value = [];
    selectedRow.value = null;
    await closeAllOverlays();
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
        usage: '',
        loss: ''
    });
};

const deleteRow = async (row) => {
    if (!row) return;
    const idx = detailRows.value.findIndex((r) => r === row || (r.bom_detail_no && r.bom_detail_no === row.bom_detail_no));
    if (idx < 0) return notify('행을 찾을 수 없습니다.', 'warning');

    const target = detailRows.value[idx];

    if (!target?.bom_detail_no || !createForm.value.id) {
        detailRows.value.splice(idx, 1);
        return;
    }

    const detailCode = String(target.bom_detail_no).trim();
    if (!detailCode) return notify('상세번호가 올바르지 않습니다.', 'warning');

    if (!window.confirm(`행 ${detailCode} 를 삭제할까요?`)) return;

    try {
        const bomNumber = encodeURIComponent(createForm.value.id);
        const detailParam = encodeURIComponent(detailCode);
        await axios.delete(`/api/bom/${bomNumber}/details/${detailParam}`);
        detailRows.value.splice(idx, 1);
        notify('삭제되었습니다.');
    } catch (e) {
        notify(e?.response?.data?.message || '삭제 중 오류가 발생했습니다.', 'error');
    }
};

/* ===== 상세 등록(저장) ===== */
const validateDetailRows = (rows = detailRows.value) => {
    const list = Array.isArray(rows) ? rows : [];
    for (let i = 0; i < list.length; i++) {
        const r = list[i] ?? {};
        if (!r.item_id) return `${i + 1}행: 품목번호를 선택하세요.`;
        if (!r.unit) return `${i + 1}행: 단위를 선택하세요.`;
        if (r.usage == null || Number(r.usage) < 0) {
            return `${i + 1}행: 투입량은 0 이상이어야 합니다.`;
        }
    }
    return '';
};

const onClickDetailInsert = async () => {
    if (!detailRows.value.length) return notify('추가된 상세 행이 없습니다.', 'warning');

    const err = validateDetailRows(detailRows.value);
    if (err) return notify(err, 'warning');

    try {
        if (createForm.value.id) {
            // ===== 기존 BOM: 버전 변경 없이 상세만 저장 =====
            const body = {
                details: detailRows.value.map((r) => ({
                    item_id: r.item_id,
                    unit: r.unit,
                    usage: Number(r.usage) || 0,
                    loss: Number(r.loss ?? 0) || 0
                }))
            };

            await axios.post(`/api/bom/${enc(createForm.value.id)}/details`, body);
            notify('상세 저장이 완료되었습니다.');
            await reloadDetailsIfNeeded(); // 저장 후 테이블만 새로고침
        } else {
            // ===== 신규 BOM: 헤더+상세 동시 저장(서버가 verN 자동 지정)
            if (!validateRequired(createForm.value)) {
                return notify('BOM을 먼저 선택하세요.', 'warning');
            }

            const header = {
                item_id: createForm.value.itemId,
                use_yn: createForm.value.useYn || 'Y',
                start_date: toDateStr(createForm.value.startDate),
                end_date: toDateStr(createForm.value.endDate),
                remk: createForm.value.remark || null
            };

            const details = detailRows.value.map((r) => ({
                item_id: r.item_id,
                unit: r.unit,
                usage: Number(r.usage) || 0,
                loss: Number(r.loss ?? 0) || 0
            }));

            await axios.post('/api/bom', { header, details });
            notify('저장 완료 (신규 생성)');
            await resetBomEditor(); // 신규 저장 후엔 초기화 유지
        }
    } catch (e) {
        const msg = e?.response?.data?.message || e?.message || '저장 중 오류가 발생했습니다.';
        notify(msg, 'error');
    }
};

/* ===== 품목 변경 시 폼/상세 초기화 ===== */
function resetForNewItem(opts = { hard: false }) {
    const hard = opts?.hard === true;
    if (hard) {
        createForm.value.id = null;
    }
    // itemId, itemName은 유지하고 나머지 초기화
    createForm.value.ver = '';
    createForm.value.startDate = null;
    createForm.value.endDate = null;
    createForm.value.useYn = '';
    createForm.value.remark = '';
    detailRows.value = [];
    selectedRow.value = null;
}

// 상세 재조회 헬퍼
const reloadDetailsIfNeeded = async (id = createForm.value.id) => {
    if (!id) return;
    detailsLoading.value = true;
    try {
        const rows = await fetchBomDetails(id);
        detailRows.value = rows;
    } catch (e) {
        notify(e?.response?.data?.message || '상세 재조회 중 오류가 발생했습니다.', 'error');
    } finally {
        detailsLoading.value = false;
    }
};

//삭제
// 헤더(전체 BOM) 삭제
const onClickDel = async () => {
    if (!createForm.value.id) return notify('삭제할 BOM이 없습니다.', 'warning');

    const id = String(createForm.value.id).trim();
    const ok = window.confirm(`BOM ${id} 를 삭제하시겠습니까?`);
    if (!ok) return;

    try {
        await axios.delete(`/api/bom/${enc(id)}`);
        notify('BOM이 삭제되었습니다.');
        await resetBomEditor();
    } catch (e) {
        notify(e?.response?.data?.message || '삭제 중 오류가 발생했습니다.', 'error');
    }
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
.right-align-input ::v-deep(input) {
    text-align: right;
}
</style>

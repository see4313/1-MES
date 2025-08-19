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

                        <Column field="usage" header="투입량">
                            <template #body="slotProps">
                                <v-text-field
                                    v-model.number="detailRows[slotProps.index].usage"
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
    <!--조회-->
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
const requiredRule = (v, msg) => () => (!!v ? true : msg);
const enc = encodeURIComponent;

/* ===== 상태 ===== */
const menus = ref({ searchStart: false, searchEnd: false, createStart: false, createEnd: false });
const itemTargetRow = ref(null);
const showBomModal = ref(false);
const showItemModal = ref(false);
const itemModalTarget = ref('search'); // 'search' | 'create' | 'detail'
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
// 조회모달
const openBomSearchModal = async () => {
    await closeAllOverlays();
    showBomModal.value = true;
};
// 품목모달
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

// 품목 검색(API는 /api/item?keyword=... 로 맞춤)
const fetchItemList = async (q = '') => {
    try {
        const { data } = await axios.get('/api/item', { params: { keyword: q || undefined } });
        return unwrap(data);
    } catch (e) {
        console.warn('[fetchItemList] API 조정 필요', e?.message || e);
        return [];
    }
};

/* ===== 모달 선택 핸들러 ===== */
const onSelectBom = async (row) => {
    if (!row) return (showBomModal.value = false);

    const bomNumber = row.bom_number ?? row.bomNumber ?? '';
    // 등록/수정 폼 채우기
    createForm.value = {
        id: bomNumber, // 여기 BOM 번호 저장
        itemId: row.item_id ?? row.itemId ?? '',
        itemName: row.item_name ?? row.itemName ?? '',
        ver: row.ver ?? 1,
        startDate: row.start_date ? asDate(row.start_date) : null,
        endDate: row.end_date ? asDate(row.end_date) : null,
        useYn: row.use_yn ?? row.useYn ?? 'Y',
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

    if (itemModalTarget.value === 'create') {
        createForm.value.itemId = id;
        createForm.value.itemName = name;
    } else if (itemModalTarget.value === 'detail') {
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

/* ===== 등록/수정/초기화 ===== */
const validateRequired = (f) => !!(f.itemId && f.itemName && f.startDate);

const onClickCreate = async () => {
    if (!validateRequired(createForm.value)) {
        return notify('필수 항목을 확인하세요.', 'warning');
    }
    const payload = {
        itemId: createForm.value.itemId,
        ver: createForm.value.ver,
        startDate: toDateStr(createForm.value.startDate),
        endDate: toDateStr(createForm.value.endDate),
        use: createForm.value.useYn,
        remk: createForm.value.remark
    };
    console.log('Final payload before sending:', payload);
    try {
        await axios.post('/api/bomInsert', payload); //  헤더 단건 API
        notify('BOM 등록이 완료되었습니다.');
        resetCreateForm();
    } catch (e) {
        notify(e?.response?.data?.message || '등록 중 오류가 발생했습니다.', 'error');
    }
};

const onClickUpdate = async () => {
    if (!validateRequired(createForm.value)) return notify('필수 항목을 확인하세요.', 'warning');

    const payload = {
        ...createForm.value,
        startDate: toDateStr(createForm.value.startDate),
        endDate: toDateStr(createForm.value.endDate)
    };
    try {
        await axios.put(`/api/bom/${createForm.value.id}`, payload); // (선택) 필요 시 유지
        notify('수정이 완료되었습니다.');
    } catch (e) {
        notify(e?.response?.data?.message || '수정 중 오류가 발생했습니다.', 'error');
    }
};

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
        usage: 0
    });
};

const deleteRow = async (index) => {
    const row = detailRows.value[index];
    // 아직 DB에 없는 임시 행이면 그냥 제거
    if (!row?.bom_detail_no || !createForm.value.id) {
        detailRows.value.splice(index, 1);
        return;
    }

    // 확인 다이얼로그(간단 confirm)
    const ok = window.confirm(`행 ${row.bom_detail_no} 를 삭제할까요?`);
    if (!ok) return;

    try {
        const bomNumber = createForm.value.id;
        // BOM 상세 내역 삭제를 위한 DELETE 요청
        await axios.delete(`/api/bom/${bomNumber}/details/${row.bom_detail_no}`);

        // 프런트 목록에서도 제거
        detailRows.value.splice(index, 1);
        notify('삭제되었습니다.');
    } catch (e) {
        notify(e?.response?.data?.message || '삭제 중 오류가 발생했습니다.', 'error');
    }
};

/* ===== 상세 등록(저장) =====
 * - 신규(BOM 없음): /api/bom  (header + details)
 * - 기존(BOM 있음): /api/bom/:bomNumber/details  (details)
 */
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

const reloadDetailsIfNeeded = async () => {
    if (!createForm.value.id) return;
    detailsLoading.value = true;
    try {
        const rows = await fetchBomDetails(createForm.value.id);
        detailRows.value = rows;
    } finally {
        detailsLoading.value = false;
    }
};

const onClickDetailInsert = async () => {
    if (!detailRows.value.length) return notify('추가된 상세 행이 없습니다.', 'warning');
    try {
        if (createForm.value.id) {
            // ===== 기존 BOM =====

            // (A) 신규 행
            const newRows = detailRows.value.filter((r) => !r.bom_detail_no);

            // (B) 수정된 기존 행(원본과 달라진 항목만)
            const editedRows = detailRows.value.filter(
                (r) =>
                    !!r.bom_detail_no &&
                    (r.item_id !== (r._origItemId ?? r.item_id) ||
                        r.unit !== (r._origUnit ?? r.unit) ||
                        Number(r.usage ?? 0) !== Number(r._origUsage ?? 0) ||
                        Number(r.loss ?? 0) !== Number(r._origLoss ?? 0))
            );

            // 전송 대상 통합
            const sendRows = [...newRows, ...editedRows];
            if (sendRows.length === 0) {
                return notify('변경할 내용이 없습니다.', 'info');
            }

            // 유효성 검사(전송 대상만)
            const err = validateDetailRows(sendRows);
            if (err) return notify(err, 'warning');

            // 서버 전송 (UPSERT 프로시저가 처리)
            const body = {
                details: sendRows.map((r) => ({
                    item_id: r.item_id,
                    unit: r.unit,
                    usage: Number(r.usage) || 0,
                    loss: Number(r.loss ?? 0) || 0
                }))
            };
            await axios.post(`/api/bom/${enc(createForm.value.id)}/details`, body);

            // 재조회 및 안내
            await reloadDetailsIfNeeded();
            notify(
                `저장 완료, ${newRows.length ? `추가 ${newRows.length}행` : ''}${newRows.length && editedRows.length ? ', ' : ''}${editedRows.length ? `수정 ${editedRows.length}행` : ''}`
                    .trim()
                    .replace(/,\s*$/, '')
            );
        } else {
            // ===== 신규 BOM: 헤더 + 상세 =====
            if (!validateRequired(createForm.value)) {
                return notify('헤더(품목번호, 품목명, 시작일)를 먼저 입력하세요.', 'warning');
            }
            const err = validateDetailRows(); // 전체 검사
            if (err) return notify(err, 'warning');

            const header = {
                item_id: createForm.value.itemId,
                use_yn: createForm.value.useYn || 'Y',
                ver: Number(createForm.value.ver) || 1,
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
            const { data } = await axios.post('/api/bom', { header, details });
            if (data?.bom_number) createForm.value.id = data.bom_number;

            await reloadDetailsIfNeeded();
            notify(`저장 완료, 등록 ${detailRows.value.length}행`);
        }
    } catch (e) {
        const msg = e?.response?.data?.message || e?.message || '상세 저장 중 오류가 발생했습니다.';
        notify(msg, 'error');
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
</style>

<!-- src/views/bom.vue -->
<template>
    <!-- ================= 사원 조회 ================= -->
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
                            @click:append-inner.stop="openBomNumberModal('search')"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="품목번호"
                            v-model="searchForm.itemId"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openItemIdModal('search')"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="품목명" v-model="searchForm.itemName" />
                    </v-col>

                    <!-- 버전(조회) -->
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="버전" v-model="searchForm.ver" />
                    </v-col>

                    <!-- 시작일(조회) -->
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
                                        startDate = asDate(val);
                                        searchForm.startDate = startDate;
                                        startMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <!-- 종료일(조회) -->
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
                                        endDate = asDate(val);
                                        searchForm.endDate = endDate;
                                        endMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <!-- 사용여부(조회) -->
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

    <!-- ================= 조회 결과 테이블 ================= -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
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

    <!-- ================= 사원 등록/수정 ================= -->
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
                            @click:append-inner.stop="openItemIdModal('create')"
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
                    <!-- 버전(등록) -->
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="버전" v-model="createForm.ver" />
                    </v-col>

                    <!-- 시작일(등록/수정) -->
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

                    <!-- 종료일(등록/수정) -->
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

                    <!-- 사용여부(등록) -->
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
                    <!--비고-->
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="비고" v-model="createForm.remark" />
                    </v-col>
                </v-row>
            </v-col>
        </v-card>
    </v-row>

    <!-- ================= 알림창(스낵바) ================= -->
    <v-snackbar v-model="snackOpen" :timeout="2000" :color="snackColor" location="top right" rounded="pill">
        {{ snackMessage }}
        <template #actions>
            <v-btn variant="text" @click="snackOpen = false">닫기</v-btn>
        </template>
    </v-snackbar>

    <!-- ================= 공통 모달 ================= -->
    <ModalSearch
        :visible="showBomNumberModal"
        title="BOM번호 검색"
        idField="bom_no"
        :columns="[
            { key: 'bom_number', label: 'BOM번호' },
            { key: 'item_name', label: '품목명' }
        ]"
        :fetchData="fetchBomNumbeItems"
        :pageSize="5"
        @select="onSelectBomNumber"
        @close="showBomNumbeModal = false"
    />

    <ModalSearch
        :visible="showItemModal"
        title="품목검색"
        idField="bom_item"
        :columns="[
            { key: 'item_id', label: '품목번호' },
            { key: 'item_type', label: '품목유형' },
            { key: 'itme_name', label: '품목명' }
        ]"
        :fetchData="fetchItemItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showItemModal = false"
    />

    <ModalSearch
        :visible="showBomModal"
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
        :fetchData="fetchBomItems"
        :pageSize="10"
        @select="onSelectBom"
        @close="showBomModal = false"
        max-width="1100px"
    />
    <!-- 품목 선택 모달 -->
    <ModalSearch
        v-model:visible="showItemModal"
        title="품목 검색"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'usage', label: '사용량' },
            { key: 'unit', label: '단위' },
            { key: 'loss', label: '손실률' }
        ]"
        :pageSize="10"
        :fetchData="fetchItemsForModal"
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

/* ===== 날짜 표시/프록시 (검색) ===== */
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

/* ===== 날짜 표시/프록시 (등록/수정) ===== */
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

/* ===== 메뉴/모달 ===== */
const startMenu = ref(false);
const endMenu = ref(false);
const startMenu1 = ref(false);
const endMenu1 = ref(false);

const showBomModal = ref(false);
const showBomNumberModal = ref(false);
const showItemModal = ref(false);

const closeAllOverlays = async () => {
    startMenu.value = endMenu.value = false;
    startMenu1.value = endMenu1.value = false;
    showBomModal.value = showBomNumberModal.value = showItemModal.value = false;
    await nextTick();
    document.activeElement?.blur?.();
};

const openBomNumberModal = async (t = 'search') => {
    await closeAllOverlays();
    showBomNumberModal.value = true;
};
const openItemIdModal = async (t = 'search') => {
    await closeAllOverlays();
    showItemModal.value = true;
};
const openBomSearchModal = async () => {
    await closeAllOverlays();
    showBomModal.value = true;
};

/* ===== 모달 데이터 로딩 ===== */
const fetchBomItems = async (page = 1, size = 10, keyword = '') => {
    const { data } = await axios.get('/api/bom', {
        params: { q: keyword, page, pageSize: size }
    });
    return Array.isArray(data) ? data : (data?.items ?? []);
};

/* ===== 디테일 테이블 ===== */
const detailRows = ref([]);
const detailsLoading = ref(false);

const fetchBomDetails = async (bomNumber) => {
    try {
        detailsLoading.value = true;
        const { data } = await axios.get(`/api/bom/${encodeURIComponent(bomNumber)}/details`, {
            params: { t: Date.now() } // 우회
        });
        detailRows.value = Array.isArray(data) ? data : (data.items ?? []);
    } catch (e) {
        console.error('BOM_DETAIL 조회 실패', e);
        detailRows.value = [];
    } finally {
        detailsLoading.value = false;
    }
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

/* ===== 스낵바 ===== */
const snackOpen = ref(false);
const snackMessage = ref('');
const snackColor = ref('success');
const notify = (message, color = 'success') => {
    snackMessage.value = message;
    snackColor.value = color;
    snackOpen.value = true;
};

const validateRequired = (f) => !!(f.itemId && f.itemName && f.startDate);

/* ===== 등록/수정 ===== */
const onClickCreate = async () => {
    if (!validateRequired(createForm.value)) {
        notify('필수 항목을 확인하세요.', 'warning');
        return;
    }
    const payload = {
        ...createForm.value,
        startDate: toDateStr(createForm.value.startDate),
        endDate: toDateStr(createForm.value.endDate)
    };
    try {
        await axios.post('/api/bom', payload);
        notify('등록이 완료되었습니다.');
    } catch (e) {
        notify(e?.response?.data?.message || '등록 중 오류가 발생했습니다.', 'error');
    }
};

const onClickUpdate = async () => {
    if (!createForm.value.id) {
        notify('수정할 항목이 선택되지 않았습니다.', 'warning');
        return;
    }
    if (!validateRequired(createForm.value)) {
        notify('필수 항목을 확인하세요.', 'warning');
        return;
    }
    const payload = {
        ...createForm.value,
        startDate: toDateStr(createForm.value.startDate),
        endDate: toDateStr(createForm.value.endDate)
    };
    try {
        await axios.put(`/api/bom/${createForm.value.id}`, payload);
        notify('수정이 완료되었습니다.');
    } catch (e) {
        notify('수정 중 오류가 발생했습니다.', 'error');
    }
};
// 선택 변경 → 폼 채우기

const selectedRow = ref(null);
watch(selectedRow, (row) => {
    if (!row) return resetCreateForm();
    createForm.value = {
        id: row?.bom_detail_no ?? null, // BOM 디테일 번호
        itemId: row?.item_id ?? '', // 품목번호
        itemName: row?.item_name ?? '', // 품목명
        usage: row?.usage ?? '', // 사용량
        unit: row?.unit ?? '', // 단위
        loss: row?.loss ?? '', // 손실률
        ver: row?.ver ?? '', // 버전 (detailRows에 없으면 상위 데이터에서 가져와야 함)
        startDate: row?.start_date ? asDate(row.start_date) : null,
        endDate: row?.end_date ? asDate(row.end_date) : null,
        useYn: row?.use_yn ?? '',
        remark: row?.remark ?? row?.remk ?? ''
    };
});
// 2) 등록/수정 폼 초기화 함수
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
/* ===== 초기화 ===== */
const onClickReset = () => {
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
    closeAllOverlays();
};

const onClickSearchReset = async () => {
    searchForm.value = {
        bomNumber: '',
        itemId: '',
        itemName: '',
        ver: '',
        startDate: null,
        endDate: null,
        useYn: ''
    };
    startMenu.value = endMenu.value = false;
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

<template>
    <!-- ===== 창고 조회 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="창고관리"
                    btn-text2="조회"
                    btn-color2="primary"
                    btn-variant2="flat"
                    @btn-click2="onClickSearch"
                    btn-text1="초기화"
                    btn-color1="secondary"
                    btn-variant1="flat"
                    @btn-click1="onClickSearchReset"
                />
            </v-card-item>
            <v-col cols="12" md="12">
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="창고번호" v-model="searchForm.warehouseId" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="창고유형"
                            v-model="searchForm.warehouseType"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openItemModal('warehouseType', 'search')"
                        />
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
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="창고명" v-model="searchForm.warehouseName" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="온도" v-model="searchForm.temp" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="습도" v-model="searchForm.rh" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="창고위치" v-model="searchForm.warehouseLoca" />
                    </v-col>
                </v-row>
            </v-col>
        </v-card>
    </v-row>
    <!-- ===== 조회 결과 테이블 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
            <v-col cols="12">
                <div class="card">
                    <DataTable
                        :value="rows"
                        v-model:selection="selectedRow"
                        selectionMode="single"
                        dataKey="warehouseId"
                        tableStyle="min-width: 50rem"
                        rowHover
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                    >
                        <Column field="warehouseId" header="창고번호" />
                        <Column field="warehouseName" header="창고명" />
                        <Column field="useYn" header="사용여부" />
                        <Column field="temp" header="온도" />
                        <Column field="rh" header="습도" />
                        <Column field="warehouseLoca" header="창고위치" />
                        <Column field="remark" header="비고" />
                    </DataTable>
                </div>
            </v-col>
        </v-card>
    </v-row>
    <!-- ===== 창고 등록/수정 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
            <v-card-item class="py-6 px-6">
                <CardHeader3
                    title="창고등록"
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
                            label="창고유형"
                            v-model="createForm.warehouseType"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openItemModal('warehouseType', 'create')"
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="창고명" v-model="createForm.warehouseName" />
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
                        <v-text-field variant="outlined" label="창고위치" v-model="createForm.warehouseLoca" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="온도" v-model="createForm.temp" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="습도" v-model="createForm.rh" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="비고" v-model="createForm.remark" :rules="[req]" />
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
    <ModalSearch
        v-model:visible="showWhTypeModal"
        title="창고유형"
        idField="warehouse_type"
        :columns="[
            { key: 'cmmn_id', label: '공통코드 번호' },
            { key: 'cmmn_name', label: '공통코드명' }
        ]"
        :fetchData="fetchWhTypes"
        :pageSize="5"
        @select="onSelectWhType"
    />

    <!-- <ModalSearch
        v-model:visible="showWhLocaModal"
        title="창고위치"
        idField="wh_id"
        :columns="[
            { key: 'warehouse_id', label: '창고코드' },
            { key: 'warehouse_loca', label: '창고위치' }
        ]"
        :fetchData="fetchWhLoca"
        :pageSize="5"
        @select="onSelectWhLoca"
    /> -->
</template>
<script setup>
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import CardHeader from '@/components/production/card-header-btn2k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, nextTick, watch } from 'vue';

/* ===== 테이블 데이터 ===== */
const rows = ref([]);
const selectedRow = ref(null);

// 첫 진입 시 서버 조회가 필요하면 주석 해제
// onMounted(() => {
//   onClickSearch();
// });

/* ===== 검색 폼 ===== */
const searchForm = ref({
    warehouseId: '', // 창고번호
    warehouseType: '', // 창고유형 (표시명)
    useYn: '', // 사용여부 Y/N
    warehouseName: '', // 창고명
    warehouseLoca: '', // 창고위치 (표시명)
    temp: '',
    rh: ''
});

/* ===== 등록/수정 폼 ===== */
const createForm = ref({
    warehouseId: '', // 창고번호(식별자)
    warehouseType: '', // 창고유형 (표시명)
    useYn: '', // 사용여부 Y/N
    warehouseName: '', // 창고명
    warehouseLoca: '', // 창고위치 (표시명)
    remark: '', // 비고
    temp: '',
    rh: ''
});

/* ===== 스낵바 ===== */
const snackOpen = ref(false);
const snackMessage = ref('');
const snackColor = ref('success');
const notify = (message, color = 'success') => {
    snackMessage.value = message;
    snackColor.value = color;
    snackOpen.value = true;
};

/* ===== 공통: 오버레이(모달) 제어 ===== */
const showWhTypeModal = ref(false);
// const showWhLocaModal = ref(false);
const modalTarget = ref('search'); // 'search' | 'create'
const modalField = ref(null);

const closeAllOverlays = async () => {
    showWhTypeModal.value = false;
    // showWhLocaModal.value = false;
    await nextTick();
    document.activeElement?.blur?.();
};

/* ===== 모달 열기/선택 ===== */
const openItemModal = async (field = 'warehouseType', target = 'search') => {
    await closeAllOverlays();
    modalTarget.value = target;
    modalField.value = field;
    await nextTick();
    if (field === 'warehouseType') showWhTypeModal.value = true;
    else if (field === 'warehouseLoca') showWhLocaModal.value = true;
};

const onSelectWhType = (row) => {
    // 예시 스키마: { cmmn_id, cmmn_name }
    const label = row?.cmmn_name ?? '';
    const id = row?.cmmn_id ?? '';
    const targetForm = modalTarget.value === 'create' ? createForm : searchForm;

    // 표시값 주입
    targetForm.value.warehouseType = label;
    // targetForm.value.warehouseTypeId = id;

    showWhTypeModal.value = false;
    setFieldAndFocus();
};
// const onSelectWhLoca = (row) => {
//     const label = row?.warehouse_loca ?? '';
//     const targetForm = modalTarget.value === 'create' ? createForm : searchForm;
//     targetForm.value.warehouseLoca = label;
//     showWhLocaModal.value = false;
// };

/* ===== 모달 데이터 로딩 함수 ===== */
const fetchWhTypes = async ({ page = 1, pageSize = 5, keyword = '' } = {}) => {
    try {
        const { data } = await axios.get('/api/whTypes', {
            params: { page, pageSize, keyword }
        });
        // 반환 값은 반드시 배열 형태여야 합니다.
        return Array.isArray(data) ? data : (data.items ?? []);
    } catch (error) {
        console.error('창고유형 조회 실패', error);
        return [];
    }
};

// const fetchWhLoca = async ({ page = 1, pageSize = 5, keyword = '' } = {}) => {
//     try {
//         const { data } = await axios.get('/api/whLocations', {
//             params: { page, pageSize, keyword }
//         });
//         return Array.isArray(data) ? data : (data.items ?? []);
//     } catch (error) {
//         console.error('창고위치 조회 실패', error);
//         return [];
//     }
// };

/* ===== 조회 ===== */
const onClickSearch = async () => {
    try {
        const { data } = await axios.get('/api/warehouseList', {
            params: { ...searchForm.value }
        });
        rows.value = Array.isArray(data) ? data : (data.items ?? []);
    } catch (error) {
        console.error('조회 실패', error);
        notify('조회 중 오류가 발생했습니다.', 'error');
    }
};

/* ===== 행 선택 -> 등록/수정 폼 매핑 ===== */
watch(selectedRow, (row) => {
    if (!row) return resetCreateForm();
    createForm.value = {
        warehouseId: row.warehouseId ?? '',
        warehouseType: row.warehouseType ?? '',
        useYn: row.useYn ?? '',
        warehouseName: row.warehouseName ?? '',
        warehouseLoca: row.warehouseLoca ?? '',
        temp: row.temp ?? '',
        rh: row.rh ?? '',
        remark: row.remark ?? ''
    };
});

/* ===== 필수값 검사 ===== */
const validateRequired = (f) => !!(f.warehouseName && f.useYn && f.warehouseLoca);

/* ===== 등록 ===== */
const onClickCreate = async () => {
    if (!validateRequired(createForm.value)) {
        notify('필수 항목을 확인하세요.', 'warning');
        return;
    }
    try {
        const payload = { ...createForm.value };
        await axios.post('/api/warehouses', payload);
        notify('등록이 완료되었습니다.', 'success');
        await onClickSearch();
        // 선택행/폼 초기화
        selectedRow.value = null;
        resetCreateForm();
    } catch (e) {
        const status = e?.response?.status;
        const msg = e?.response?.data?.message;
        if (status === 409) notify(msg || '이미 등록된 창고입니다!', 'warning');
        else if (status === 400) notify(msg || '입력값을 확인하세요.', 'warning');
        else notify(msg || '등록 중 오류가 발생했습니다.', 'error');
    }
};

/* ===== 수정 ===== */
const onClickUpdate = async () => {
    if (!validateRequired(createForm.value)) {
        notify('필수 항목을 확인하세요.', 'warning');
        return;
    }
    if (!createForm.value.warehouseId) {
        notify('수정할 창고번호가 없습니다. 행을 선택하세요.', 'warning');
        return;
    }
    try {
        const payload = { ...createForm.value };
        // 보통 창고번호(warehouseId)를 식별자로 사용
        await axios.put(`/api/warehouses/${encodeURIComponent(createForm.value.warehouseId)}`, payload);
        notify('수정이 완료되었습니다.', 'success');
        await onClickSearch();
    } catch (e) {
        console.error(e);
        notify('수정 중 오류가 발생했습니다.', 'error');
    }
};

/* ===== 폼 초기화 ===== */
function resetCreateForm() {
    createForm.value = {
        warehouseId: '',
        warehouseType: '',
        useYn: '',
        warehouseName: '',
        warehouseLoca: '',
        remark: '',
        temp: '',
        rh: ''
    };
}

const onClickReset = async () => {
    resetCreateForm();
    selectedRow.value = null;
    await closeAllOverlays();
};

const onClickSearchReset = async () => {
    searchForm.value = {
        warehouseId: '',
        warehouseType: '',
        useYn: '',
        warehouseName: '',
        warehouseLoca: '',
        temp: '',
        rh: ''
    };
    await nextTick();
    await onClickSearch();
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

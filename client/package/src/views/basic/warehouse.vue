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
                        <v-text-field variant="outlined" label="온도(℃)" v-model="searchForm.temp" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="습도(%)" v-model="searchForm.rh" />
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
                        <Column field="warehouseId" sortable header="창고번호" />
                        <Column field="warehouseType" header="창고유형" />
                        <Column field="warehouseName" header="창고명" />
                        <Column field="useYn" header="사용여부" />
                        <Column field="temp" header="온도(℃)" />
                        <Column field="rh" header="습도(%)" />
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
                    btn-color3="warning"
                    btn-variant3="flat"
                    @btn-click3="onClickSave"
                    btn-text2="삭제"
                    btn-variant2="flat"
                    btn-color2="error"
                    :btn-disabled2="!createForm.warehouseId"
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
                            label="창고유형"
                            v-model="createForm.warehouseType"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openItemModal('warehouseType', 'create')"
                            readonly
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
                        <v-text-field
                            variant="outlined"
                            label="창고위치"
                            v-model="createForm.warehouseLoca"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openAddressModal"
                            readonly
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="온도(℃)" v-model="createForm.temp" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="습도(%)" v-model="createForm.rh" />
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

// 첫 진입 시 서버 조회
onMounted(() => {
    onClickSearch();
});

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

/*----주소 모달 ----*/
async function openAddressModal() {
    // 스크립트 없으면 로드
    if (!window.daum?.Postcode) {
        await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            s.onload = resolve;
            document.head.appendChild(s);
        });
    }

    // 주소 검색
    new window.daum.Postcode({
        oncomplete: (data) => {
            const baseAddr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
            const detail = prompt('상세주소를 입력하세요', '') || '';
            createForm.value.warehouseLoca = detail ? `${baseAddr} ${detail}` : baseAddr;
        }
    }).open();
}

const onSelectWhType = (row) => {
    const label = row?.cmmn_name ?? '';
    const id = row?.cmmn_id ?? '';
    const targetForm = modalTarget.value === 'create' ? createForm : searchForm;

    // 표시값
    targetForm.value.warehouseType = label;

    showWhTypeModal.value = false;
};

/* ===== 모달 데이터 로딩 함수 ===== */
const fetchWhTypes = async ({ page = 1, pageSize = 5, keyword = '' } = {}) => {
    try {
        const { data } = await axios.get('/api/whTypes', {
            params: { page, pageSize, keyword }
        });
        // 반환 값은 반드시 배열 형태
        return Array.isArray(data) ? data : (data.items ?? []);
    } catch (error) {
        console.error('창고유형 조회 실패', error);
        return [];
    }
};
//
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

const isSaving = ref(false);
const enc = encodeURIComponent;
//등록 수정
const onClickSave = async () => {
    // 공통 유효성 검사
    if (!validateRequired(createForm.value)) {
        notify('필수 항목을 확인하세요.', 'warning');
        return;
    }

    const isUpdate = !!createForm.value.warehouseId; // 있으면 수정
    const payload = { ...createForm.value };

    if (!isUpdate) {
        const ok = window.confirm('등록하시겠습니까?');
        if (!ok) return; // 취소하면 요청 중단
    }

    try {
        isSaving.value = true;

        if (isUpdate) {
            await axios.put(`/api/warehouses/${enc(createForm.value.warehouseId)}`, payload);
            notify('수정이 완료되었습니다.', 'success');
        } else {
            await axios.post('/api/warehouses', payload);
            notify('등록이 완료되었습니다.', 'success');
            selectedRow.value = null; // 신규 후 초기화가 필요하면 유지
            resetCreateForm();
        }

        await onClickSearch(); // 목록 갱신
    } catch (e) {
        const status = e?.response?.status;
        const msg = e?.response?.data?.message;

        if (!isUpdate) {
            // 등록 에러 처리
            if (status === 409) notify(msg || '이미 등록된 창고입니다!', 'warning');
            else if (status === 400) notify(msg || '입력값을 확인하세요.', 'warning');
            else notify(msg || '등록 중 오류가 발생했습니다.', 'error');
        } else {
            // 수정 에러 처리
            notify(msg || '수정 중 오류가 발생했습니다.', 'error');
        }
    } finally {
        isSaving.value = false;
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

//삭제
const onClickDel = async () => {
    const id = selectedRow.value?.warehouseId;
    console.log('삭제 시도 ID:', id, selectedRow.value);
    if (!id) return notify('삭제할 창고를 선택해주세요.', 'warning');
    if (!confirm('삭제하시겠습니까?')) return;

    try {
        const { data } = await axios.delete('/api/warehouseDelete', { data: { whId: id } });
        if (!data?.result) return notify(data?.message || '삭제에 실패했습니다.', 'warning');

        notify('삭제되었습니다.', 'success');
        await onClickSearch();
        onClickReset();
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
</style>

<template>
    <!-- ===== 공정 조회 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="공정정보 관리"
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
                        <v-text-field variant="outlined" label="공정번호" v-model="searchForm.prcsNo" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="공정명"
                            v-model="searchForm.prcsName"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openItemModal('processType', 'search')"
                            readonly
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
                        dataKey="prscNo"
                        tableStyle="min-width: 50rem"
                        rowHover
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                    >
                        <Column field="prscNo" sortable header="공정번호" />
                        <Column field="prcsName" header="공정명" />
                        <Column field="useYn" header="사용여부" />
                        <Column field="remark" header="비고" />
                    </DataTable>
                </div>
            </v-col>
        </v-card>
    </v-row>
    <!-- ===== 공정정보 등록/수정 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
            <v-card-item class="py-6 px-6">
                <CardHeader3
                    title="공정정보 등록"
                    btn-text3="저장"
                    btn-color3="primary"
                    btn-variant3="flat"
                    @btn-click3="onClickSave"
                    btn-text2="삭제"
                    btn-variant2="flat"
                    btn-color2="error"
                    :btn-disabled2="!createForm.prscNo"
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
                            label="공정명"
                            v-model="createForm.prcsName"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openItemModal('processType', 'create')"
                        />
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
    <ModalSearch
        v-model:visible="showProcessTypeModal"
        title="공정 검색"
        idField="process_type"
        :columns="[
            { key: '', label: '' },
            { key: 'type_name', label: '공정명' }
        ]"
        :fetchData="fetchProcessTypes"
        :pageSize="10"
        @select="onSelectProcessType"
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

onMounted(() => {
    onClickSearch(); // 첫 진입 시 서버에서 조회
});

/* ===== 검색 폼 ===== */
const searchForm = ref({
    prscNo: '', // 공정번호
    prcsName: '', // 공정명
    useYn: '' // Y/N
});

/* ===== 등록/수정 폼 ===== */
const createForm = ref({
    prscNo: '', // 공정번호
    prcsName: '', // 공정명
    useYn: '', //
    remark: '' // 비고
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

/* ===== 공통: 오버레이 닫기 ===== */
const showProcessTypeModal = ref(false);
const modalTarget = ref('search'); // 'search' | 'create'

const closeAllOverlays = async () => {
    showProcessTypeModal.value = false;
    await nextTick();
    document.activeElement?.blur?.();
};

/* ===== 모달 열기/선택 ===== */
const openItemModal = async (_q = '', target = 'search') => {
    await closeAllOverlays();
    modalTarget.value = target;
    await nextTick();
    showProcessTypeModal.value = true;
};

const onSelectProcessType = (row) => {
    const targetForm = modalTarget.value === 'create' ? createForm : searchForm;
    targetForm.value.prcsName = row?.type_name ?? '';
    showProcessTypeModal.value = false;
};

const fetchProcessTypes = async () => {
    try {
        const response = await axios.get('/api/processTypes');
        return response.data; // 반드시 배열 형태
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

/* ===== 조회 버튼 ===== */

const onClickSearch = async () => {
    try {
        const { data } = await axios.get('/api/processList', {
            params: { ...searchForm.value } // 공백/빈값 그대로 전달
        });
        rows.value = Array.isArray(data) ? data : (data.items ?? []);
    } catch (error) {
        console.error('조회 실패', error);
        notify('조회 중 오류가 발생했습니다.', 'error');
    }
};
/* ===== 행 선택 -> 수정 모드 세팅 ===== */
watch(selectedRow, (row) => {
    if (!row) return resetCreateForm();
    createForm.value = {
        prscNo: row.prscNo ?? '',
        prcsName: row.prcsName ?? '',
        useYn: row.useYn ?? '',
        remark: row.remark ?? ''
    };
});

/* ===== 필수값 검사 ===== */
const validateRequired = (f) => !!(f.prcsName && f.useYn);

const isSaving = ref(false);
const enc = encodeURIComponent;

const onClickSave = async () => {
    // 공통 유효성 검사
    if (!validateRequired(createForm.value)) {
        notify('필수 항목(공정번호/공정명/사용여부)을 확인하세요.', 'warning');
        return;
    }

    const isUpdate = !!createForm.value.prscNo;
    const payload = { ...createForm.value };

    if (!isUpdate) {
        const ok = window.confirm('정말 등록하시겠습니까?');
        if (!ok) return; // 취소하면 요청 중단
    }

    try {
        isSaving.value = true;

        if (isUpdate) {
            await axios.put(`/api/process/${enc(createForm.value.prscNo)}`, payload);
            notify('수정이 완료되었습니다.', 'success');
        } else {
            await axios.post('/api/process', payload);
            notify('등록이 완료되었습니다.', 'success');
        }

        await onClickSearch(); // 갱신
    } catch (e) {
        const status = e?.response?.status;
        const msg = e?.response?.data?.message;

        if (!isUpdate) {
            // 등록 에러 처리
            if (status === 409) notify(msg || '이미 등록된 공정입니다!', 'warning');
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

/* ===== 초기화 ===== */
function resetCreateForm() {
    createForm.value = {
        prscNo: '',
        prcsName: '',
        useYn: '',
        procsSeq: '',
        remark: ''
    };
}

const onClickReset = async () => {
    resetCreateForm();
    await closeAllOverlays();
};

const onClickSearchReset = async () => {
    searchForm.value = {
        prscNo: '',
        prcsName: '',
        useYn: '',
        procsSeq: ''
    };
    await nextTick();
    await onClickSearch();
};

//공정삭제
const onClickDel = async () => {
    const id = selectedRow.value?.prscNo;
    console.log('삭제 시도 ID:', id, selectedRow.value);
    if (!id) return notify('삭제할 공정을 선택해주세요.', 'warning');
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        const { data } = await axios.delete('/api/processDelete', { data: { prscNo: id } });
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

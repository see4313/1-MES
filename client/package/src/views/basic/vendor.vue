<template>
    <!-- ===== 거래처 조회 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="거래처 관리"
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
                            label="거래처번호"
                            v-model="searchForm.vendId"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openVendIdModal('search')"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="거래처명" v-model="searchForm.vendName" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="거래처유형"
                            v-model="searchForm.vendType"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openVendTypeModal('search')"
                        />
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
                        tableStyle="min-width: 50rem"
                        rowHover
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                        @row-click="onRowClick"
                    >
                        <Column field="vendId" header="거래처번호" />
                        <Column field="vendName" header="거래처명" />
                        <Column field="bizNumber" header="사업자번호" />
                        <Column field="cntinfo" header="연락처" />
                        <Column field="vendType" header="거래처유형" />
                        <Column field="useYn" header="사용여부" />
                        <Column field="address" header="주소" />
                        <Column field="psch" header="담당자" />
                        <Column field="remark" header="비고" />
                    </DataTable>
                </div>
            </v-col>
        </v-card>
    </v-row>

    <!-- ===== 거래처 등록/수정 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6 mt-2">
            <v-card-item class="py-6 px-6">
                <CardHeader3
                    title="거래처 등록"
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
                            label="거래처명"
                            v-model="createForm.vendName"
                            :rules="[(v) => !!v || '거래처명은 필수입니다.']"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="사업자번호"
                            v-model="createForm.bizNumber"
                            :rules="[(v) => !!v || '사업자번호는 필수입니다.']"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="연락처"
                            v-model="createForm.cntinfo"
                            :rules="[(v) => !!v || '연락처는 필수입니다.']"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="거래처유형"
                            v-model="createForm.vendType"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openVendTypeModal('create')"
                            :rules="[(v) => !!v || '거래처유형은 필수입니다.']"
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-radio-group
                            v-radio-group
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
                            label="주소"
                            v-model="createForm.address"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openAddressModal('create')"
                            :rules="[(v) => !!v || '주소는 필수입니다.']"
                        />
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
        <template #actions>
            <v-btn variant="text" @click="snackOpen = false">닫기</v-btn>
        </template>
    </v-snackbar>

    <!-- ===== 공통 모달 ===== -->
    <ModalSearch
        v-model:visible="showVendTypeModal"
        title="거래처유형 검색"
        idField="vend_type"
        :columns="[
            { key: 'type_id', label: '유형번호' },
            { key: 'vend_type', label: '거래처유형' }
        ]"
        :fetchData="fetchVendTypeItems"
        :pageSize="10"
        @select="onSelectVendType"
    />

    <ModalSearch
        v-model:visible="showVendIdModal"
        title="거래처번호 검색"
        idField="vend_id"
        :columns="[
            { key: 'vend_id', label: '거래처번호' },
            { key: 'vend_name', label: '거래처명' }
        ]"
        :fetchData="fetchVendIdItems"
        :pageSize="10"
        @select="onSelectVendId"
    />
</template>

<script setup>
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import CardHeader from '@/components/production/card-header-btn2k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, nextTick } from 'vue';

// ===== 목록 데이터
const rows = ref([]);
onMounted(async () => {});

const useYn = ref('Y');

//==== 폼 상태
const searchForm = ref({
    vendId: '',
    vendName: '',
    vendType: ''
});

const createForm = ref({
    id: null,
    vendName: '',
    bizNumber: '',
    cntinfo: '',
    vendType: '',
    useYn: 'Y',
    address: '',
    remark: ''
});

// ===== 모달
const showVendIdModal = ref(false);
const showVendTypeModal = ref(false);
const modalTarget = ref('search');

const closeAllOverlays = async () => {
    showVendIdModal.value = false;
    showVendTypeModal.value = false;
    await nextTick();
    document.activeElement?.blur?.();
};

const openVendIdModal = async (t) => {
    await closeAllOverlays();
    modalTarget.value = t;
    showVendIdModal.value = true;
};
const openVendTypeModal = async (t) => {
    await closeAllOverlays();
    modalTarget.value = t;
    showVendTypeModal.value = true;
};

const openAddressModal = async (t) => {
    // TODO: 주소 검색 모달 열기
    console.log('openAddressModal', t);
};

// ===== 모달 선택 핸들러
const onSelectVendType = (row) => {
    const val = row?.vend_type || row?.vendType || '';
    if (modalTarget.value === 'create') createForm.value.vendType = val;
    else searchForm.value.vendType = val;
    showVendTypeModal.value = false;
};

const onSelectVendId = (row) => {
    const val = row?.vend_id || row?.vendId || '';
    if (modalTarget.value === 'create') {
    } else {
        searchForm.value.vendId = val;
    }
    showVendIdModal.value = false;
};

/* ===== 모달 API ===== */
const fetchVendTypeItems = async (q, page, size) => {
    try {
        const { data } = await axios.get('/api/vendorType', { params: { q, page, size } });
        return Array.isArray(data) ? data : (data.items ?? []);
    } catch (error) {
        console.error('유형 조회 실패', error);
        return [];
    }
};

const fetchVendIdItems = async (q, page, size) => {
    try {
        const { data } = await axios.get('/api/vendorId', { params: { q, page, size } });
        return Array.isArray(data) ? data : (data.items ?? []);
    } catch (error) {
        console.error('번호 조회 실패', error);
        return [];
    }
};

/* ===== 조회 버튼 ===== */
const onClickSearch = async () => {
    const payload = { ...searchForm.value };
    const { data } = await axios.post('/api/vendor/search', payload);
    rows.value = Array.isArray(data) ? data : (data.items ?? []);
};

// 검색폼 초기화
const onClickSearchReset = async () => {
    // 폼 값 초기화
    searchForm.value = {
        vendId: '',
        vendName: '',
        vendType: ''
    };

    await nextTick();
    // 필요하면 즉시 조회 갱신
    await onClickSearch();
};

/* ===== 행 클릭 -> 수정모드 세팅 ===== */
const onRowClick = ({ data }) => {
    createForm.value = {
        id: data?.vendId ?? null,
        vendName: data?.vendName ?? '',
        bizNumber: data?.bizNumber ?? '',
        cntinfo: data?.cntinfo ?? '',
        vendType: data?.vendType ?? '',
        useYn: data?.useYn ?? 'Y',
        address: data?.address ?? '',
        psch: data?.psch ?? '',
        remark: data?.remark ?? data?.remk ?? ''
    };
    if (typeof useYn !== 'undefined' && useYn?.value !== undefined) {
        useYn.value = createForm.value.useYn || 'Y';
    }
};

// 공용
const validateRequired = (f) => !!(f.vendName && f.bizNumber && f.cntinfo && f.vendType && f.address);

/* ===== 등록 ===== */
const snackOpen = ref(false);
const snackMessage = ref('');
const snackColor = ref('success');
const notify = (message, color = 'success') => {
    snackMessage.value = message;
    snackColor.value = color;
    snackOpen.value = true;
};

const onClickCreate = async () => {
    if (!validateRequired(createForm.value)) {
        notify('필수 값을 확인하세요.', 'warning');
        return;
    }
    const payload = {
        ...createForm.value,
        useYn: useYn?.value ?? createForm.value.useYn ?? 'Y'
    };
    try {
        await axios.post('/api/vendor', payload);
        notify('등록이 완료되었습니다.', 'success');
        await onClickSearch();
        await onClickReset();
    } catch (e) {
        console.error(e);
        notify('등록 중 오류가 발생했습니다.', 'error');
    } finally {
        await closeAllOverlays();
    }
};

/* ===== 수정 ===== */
const onClickUpdate = async () => {
    if (!createForm.value.id) {
        notify('수정할 항목이 선택되지 않았습니다.', 'warning');
        return;
    }
    if (!validateRequired(createForm.value)) {
        notify('필수 값을 확인하세요.', 'warning');
        return;
    }
    const payload = {
        ...createForm.value,
        useYn: useYn?.value ?? createForm.value.useYn ?? 'Y'
    };
    try {
        await axios.put(`/api/vendor/${createForm.value.id}`, payload);
        notify('수정이 완료되었습니다.', 'success');
        await onClickSearch();
        await onClickReset();
    } catch (e) {
        console.error(e);
        notify('수정 중 오류가 발생했습니다.', 'error');
    } finally {
        await closeAllOverlays();
    }
};
//--------초기화-------------
const onClickReset = async () => {
    createForm.value = {
        id: null,
        vendName: '',
        bizNumber: '',
        cntinfo: '',
        vendType: '',
        useYn: 'Y',
        address: '',
        remark: ''
    };
    useYn.value = 'Y'; // 라디오 값도 초기화
    await closeAllOverlays();
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

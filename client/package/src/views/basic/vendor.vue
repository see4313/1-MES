<template>
    <!-- ===== 거래처 조회 ===== -->
    <v-row>
        <v-card elevation="10" class="pa-6">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="사원 관리"
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
                        <v-text-field
                            variant="outlined"
                            label="거래처번호"
                            v-model="searchForm.vendId"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openModal('vendId', 'search')"
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
                            @click:append-inner.stop="openModal('vendType', 'search')"
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
                        v-model:selection="selectedRow"
                        selectionMode="single"
                        dataKey="vendId"
                        tableStyle="min-width: 50rem"
                        rowHover
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                    >
                        <Column field="vendId" sortable header="거래처번호" />
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
                        <v-text-field variant="outlined" label="거래처명" v-model="createForm.vendName" :rules="[req]" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="사업자번호" v-model="createForm.bizNumber" :rules="[req]" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="연락처" v-model="createForm.cntinfo" :rules="[req]" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="거래처유형"
                            v-model="createForm.vendType"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openModal('vendType', 'create')"
                            :rules="[req]"
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

                    <!-- 주소 -->
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="주소"
                            v-model="createForm.address"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openAddressModal"
                            :rules="[(v) => !!v || '필수 입력입니다.']"
                            readonly
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
        <template #actions><v-btn variant="text" @click="snackOpen = false">닫기</v-btn></template>
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
        :fetchData="(q, p, s) => fetchModal('/api/vendorType', q, p, s)"
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
        :fetchData="(q, p, s) => fetchModal('/api/vendorId', q, p, s)"
        :pageSize="10"
        @select="onSelectVendId"
    />

    <ModalSearch
        v-model:visible="showVendPschModal"
        title="사원 검색"
        idField="emp_id"
        :columns="[
            { key: 'emp_id', label: '사원번호' },
            { key: 'emp_name', label: '사원명' }
        ]"
        :fetchData="(q, p, s) => fetchModal('/api/vendorPsch', q, p, s)"
        :pageSize="10"
        @select="onSelectVendPsch"
    />
</template>

<script setup>
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import CardHeader from '@/components/production/card-header-btn2k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, nextTick, onMounted, watch } from 'vue';

const rows = ref([]);
onMounted(() => {
    onClickSearch();
}); // 첫 진입 시 서버에서 목록 조회

/* ===== 상태 ===== */

const searchForm = ref({ vendId: '', vendName: '', vendType: '' });

const createForm = ref({
    id: null,
    vendName: '',
    bizNumber: '',
    cntinfo: '',
    vendType: '',
    useYn: '',
    address: '', // 최종 주소(기본주소 + 상세주소)
    psch: '', // 담당자
    remark: ''
});

/* ===== 모달 상태 & 툴 ===== */
const showVendIdModal = ref(false);
const showVendTypeModal = ref(false);
const showVendPschModal = ref(false);
const modalTarget = ref('search');

const closeAll = async () => {
    showVendIdModal.value = false;
    showVendTypeModal.value = false;
    showVendPschModal.value = false;
    await nextTick();
    document.activeElement?.blur?.();
};

const openModal = async (type, target) => {
    await closeAll();
    modalTarget.value = target;
    if (type === 'vendId') showVendIdModal.value = true;
    else if (type === 'vendType') showVendTypeModal.value = true;
    else if (type === 'psch') showVendPschModal.value = true;
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
            createForm.value.address = detail ? `${baseAddr} ${detail}` : baseAddr;
        }
    }).open();
}
/* ===== 모달 선택 ===== */
const onSelectVendType = (row) => {
    const val = row?.vend_type || row?.vendType || '';
    if (modalTarget.value === 'create') createForm.value.vendType = val;
    else searchForm.value.vendType = val;
    showVendTypeModal.value = false;
};

const onSelectVendId = (row) => {
    const val = row?.vend_id || row?.vendId || '';
    if (modalTarget.value !== 'create') searchForm.value.vendId = val;
    showVendIdModal.value = false;
};

const onSelectVendPsch = (row) => {
    const name = row?.emp_name || row?.empName || '';
    if (modalTarget.value === 'create') createForm.value.psch = name;
    showVendPschModal.value = false;
};

/* ===== 모달 API 공통 헬퍼 ===== */
const fetchModal = async (url, q, page, size) => {
    try {
        const { data } = await axios.get(url, { params: { q, page, size } });
        return Array.isArray(data) ? data : (data.items ?? []);
    } catch (e) {
        console.error('모달 조회 실패', url, e);
        return [];
    }
};

/* ===== 조회 ===== */
const onClickSearch = async () => {
    const { data } = await axios.post('/api/vendor/search', { ...searchForm.value });
    rows.value = Array.isArray(data) ? data : (data.items ?? []);
};

const onClickSearchReset = async () => {
    searchForm.value = { vendId: '', vendName: '', vendType: '' };
    await nextTick();
    await onClickSearch();
};

/* ===== 테이블 행 클릭 -> 수정 폼 세팅 ===== */
const selectedRow = ref(null);
//폼 초기화
function resetVendorForm() {
    createForm.value = {
        id: null,
        vendName: '',
        bizNumber: '',
        cntinfo: '',
        vendType: '',
        useYn: '',
        address: '',
        psch: '',
        remark: ''
    };
}

// 선택 변경 → 폼 채우기
watch(selectedRow, (row) => {
    if (!row) return resetVendorForm();
    createForm.value = {
        id: row?.vendId ?? null,
        vendName: row?.vendName ?? '',
        bizNumber: row?.bizNumber ?? '',
        cntinfo: row?.cntinfo ?? '',
        vendType: row?.vendType ?? '',
        useYn: row?.useYn ?? '',
        address: row?.address ?? '',
        psch: row?.psch ?? '',
        remark: row?.remark ?? row?.remk ?? ''
    };
});

/* ===== 공용 ===== */
const req = (v) => !!v || '필수 값입니다.';
const isValid = (f) => !!(f.vendName && f.bizNumber && f.cntinfo && f.vendType && f.address);

/* ===== 스낵바 ===== */
const snackOpen = ref(false);
const snackMessage = ref('');
const snackColor = ref('success');
const notify = (message, color = 'success') => {
    snackMessage.value = message;
    snackColor.value = color;
    snackOpen.value = true;
};

/* ===== payload 빌더 ===== */
const buildPayload = () => ({
    vendName: createForm.value.vendName,
    bizNumber: createForm.value.bizNumber,
    cntinfo: createForm.value.cntinfo,
    vendType: createForm.value.vendType, // 코드명/코드ID 둘 다 가능
    useYn: createForm.value.useYn ?? 'Y',
    address: createForm.value.address,
    psch: createForm.value.psch,
    remark: createForm.value.remark ?? null
});

/* ===== 등록 ===== */
const onClickCreate = async () => {
    if (!isValid(createForm.value)) return notify('필수 값을 확인하세요.', 'warning');
    const payload = buildPayload();
    try {
        await axios.post('/api/vendor', payload);
        notify('등록이 완료되었습니다.', 'success');
        await onClickSearch();
        await onClickReset();
    } catch (e) {
        const msg =
            e?.response?.status === 409
                ? e?.response?.data?.message || '이미 등록된 거래처입니다!'
                : e?.response?.data?.message || '등록 중 오류가 발생했습니다.';
        notify(msg, 'warning');
    }
};

/* ===== 수정 ===== */
const onClickUpdate = async () => {
    if (!createForm.value.id) return notify('수정할 항목이 선택되지 않았습니다.', 'warning');
    if (!isValid(createForm.value)) return notify('필수 값을 확인하세요.', 'warning');

    try {
        await axios.put(`/api/vendor/${createForm.value.id}`, { ...buildPayload() });
        notify('수정이 완료되었습니다.', 'success');
        await onClickSearch();
        await onClickReset();
    } catch (e) {
        notify(e?.response?.data?.message || '수정 중 오류가 발생했습니다.', 'error');
    }
};

/* ===== 신규(폼 리셋) ===== */
const onClickReset = async () => {
    createForm.value = {
        id: null,
        vendName: '',
        bizNumber: '',
        cntinfo: '',
        vendType: '',
        useYn: '',
        address: '',
        psch: '',
        remark: ''
    };
    await closeAll();
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

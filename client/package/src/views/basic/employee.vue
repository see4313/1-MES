<!-- src/views/employee.vue -->
<template>
    <!-- ================= 사원 조회 ================= -->
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
                        <v-text-field variant="outlined" label="사원명" v-model="searchForm.name" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="부서명"
                            v-model="searchForm.dept"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openDeptModal('search')"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="연락처" v-model="searchForm.phone" />
                    </v-col>

                    <!-- 입사일(조회) -->
                    <v-col cols="12" sm="4">
                        <v-menu v-model="joinMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="입사일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedJoinDate"
                                />
                            </template>
                            <v-date-picker
                                v-model="searchJoinProxy"
                                @update:model-value="
                                    (val) => {
                                        joinDate = asDate(val);
                                        searchForm.joinDate = joinDate;
                                        joinMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <!-- 퇴사일(조회) -->
                    <v-col cols="12" sm="4">
                        <v-menu v-model="leavMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="퇴사일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedLeavDate"
                                />
                            </template>
                            <v-date-picker
                                v-model="searchLeavProxy"
                                @update:model-value="
                                    (val) => {
                                        leavDate = asDate(val);
                                        searchForm.leavDate = leavDate;
                                        leavMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <!-- 사원상태(조회) -->
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="사원상태"
                            v-model="searchForm.status"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openStatusModal('search')"
                        />
                    </v-col>

                    <!-- 권한(조회) -->
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="권한"
                            v-model="searchForm.permName"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openPermModal('search')"
                        />
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
                        :value="rows"
                        v-model:selection="selectedRow"
                        selectionMode="single"
                        dataKey="empId"
                        tableStyle="min-width: 50rem"
                        rowHover
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                    >
                        <Column field="empId" sortable header="사원번호" />
                        <Column field="empName" header="사원명" />
                        <Column field="deptName" header="소속부서" />
                        <Column field="phone" header="연락처" />
                        <Column field="join" header="입사일" />
                        <Column field="leav" header="퇴사일" />
                        <Column field="status" header="사원상태" />
                        <Column field="perm" header="사원권한" />
                        <Column field="remk" header="비고" />
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
                    title="사원 등록"
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
                            label="사원명"
                            v-model="createForm.name"
                            :rules="[(v) => !!v || '사원명은 필수입니다.']"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="부서명"
                            v-model="createForm.dept"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openDeptModal('create')"
                            :rules="[(v) => !!v || '부서명은 필수입니다.']"
                        />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="연락처"
                            v-model="createForm.phone"
                            :rules="[(v) => !!v || '연락처는 필수입니다.']"
                        />
                    </v-col>

                    <!-- 입사일(등록/수정) -->
                    <v-col cols="12" sm="4">
                        <v-menu v-model="joinMenu1" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="입사일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedJoinDate1"
                                    :rules="[(v) => !!createForm.joinDate || '입사일은 필수입니다.']"
                                />
                            </template>
                            <v-date-picker
                                v-model="createJoinProxy"
                                @update:model-value="
                                    (val) => {
                                        createForm.joinDate = asDate(val);
                                        joinMenu1 = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <!-- 퇴사일(등록/수정) -->
                    <v-col cols="12" sm="4">
                        <v-menu v-model="leavMenu1" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    label="퇴사일"
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedLeavDate1"
                                />
                            </template>
                            <v-date-picker
                                v-model="createLeavProxy"
                                @update:model-value="
                                    (val) => {
                                        createForm.leavDate = asDate(val);
                                        leavMenu1 = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>

                    <!-- 사원상태 -->
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="사원상태"
                            v-model="createForm.status"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openStatusModal('create')"
                            :rules="[(v) => !!v || '사원상태는 필수입니다.']"
                        />
                    </v-col>

                    <!-- 권한 -->
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="권한"
                            v-model="createForm.permName"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner.stop="openPermModal('create')"
                            :rules="[(v) => !!v || '권한은 필수입니다.']"
                        />
                    </v-col>

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
        :visible="showStatusModal"
        title="상태검색"
        idField="emp_status"
        :columns="[
            { key: 'status_id', label: '상태코드' },
            { key: 'status', label: '상태명' }
        ]"
        :fetchData="fetchStatusItems"
        :pageSize="5"
        @select="onSelectStatus"
        @close="showStatusModal = false"
    />

    <ModalSearch
        :visible="showPermModal"
        title="권한검색"
        idField="emp_perm"
        :columns="[
            { key: 'perm_id', label: '권한코드' },
            { key: 'perm_name', label: '권한명' }
        ]"
        :fetchData="fetchPermItems"
        :pageSize="5"
        @select="onSelectPerm"
        @close="showPermModal = false"
    />

    <ModalSearch
        :visible="showDeptModal"
        title="부서검색"
        idField="dept"
        :columns="[
            { key: 'dept_id', label: '부서코드' },
            { key: 'dept_name', label: '부서명' }
        ]"
        :fetchData="fetchDeptItems"
        :pageSize="10"
        @select="onSelectDept"
        @close="showDeptModal = false"
    />
</template>

<script setup>
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import CardHeader from '@/components/production/card-header-btn2k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import dayjs from 'dayjs';

/* ===== 유틸 ===== */
const asDate = (v) => (!v ? null : v instanceof Date ? v : new Date(v));
const toDateStr = (v) => (v ? dayjs(v).format('YYYY-MM-DD') : null);

const rows = ref([]);
onMounted(() => {
    onClickSearch(); // 첫 진입 시 서버에서 조회
});

/* ===== 날짜(조회 폼) ===== */
const joinMenu = ref(false);
const leavMenu = ref(false);
const joinDate = ref(null); // Date
const leavDate = ref(null); // Date

const formattedJoinDate = computed(() => (joinDate.value ? dayjs(joinDate.value).format('YYYY-MM-DD') : ''));
const formattedLeavDate = computed(() => (leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : ''));

// vuetify v-date-picker가 내부적으로 문자열로 세팅하는 경우를 대비한 프록시
const searchJoinProxy = computed({
    get: () => joinDate.value,
    set: (v) => (joinDate.value = asDate(v))
});
const searchLeavProxy = computed({
    get: () => leavDate.value,
    set: (v) => (leavDate.value = asDate(v))
});

/* ===== 날짜(등록/수정 폼) ===== */
const joinMenu1 = ref(false);
const leavMenu1 = ref(false);
const formattedJoinDate1 = computed(() => (createForm.value.joinDate ? dayjs(createForm.value.joinDate).format('YYYY-MM-DD') : ''));
const formattedLeavDate1 = computed(() => (createForm.value.leavDate ? dayjs(createForm.value.leavDate).format('YYYY-MM-DD') : ''));

const createJoinProxy = computed({
    get: () => createForm.value.joinDate,
    set: (v) => (createForm.value.joinDate = asDate(v))
});
const createLeavProxy = computed({
    get: () => createForm.value.leavDate,
    set: (v) => (createForm.value.leavDate = asDate(v))
});

/* ===== 폼 상태 ===== */
const searchForm = ref({
    name: '',
    dept: '',
    phone: '',
    joinDate: null,
    leavDate: null,
    status: '',
    permName: ''
});

const createForm = ref({
    id: null,
    name: '',
    dept: '',
    phone: '',
    joinDate: null, // Date
    leavDate: null, // Date
    status: '',
    permName: '',
    remark: ''
});

/* ===== 모달 ===== */
const showStatusModal = ref(false);
const showPermModal = ref(false);
const showDeptModal = ref(false);
const modalTarget = ref('search');

const closeAllOverlays = async () => {
    joinMenu.value = false;
    leavMenu.value = false;
    joinMenu1.value = false;
    leavMenu1.value = false;
    showStatusModal.value = false;
    showPermModal.value = false;
    showDeptModal.value = false;
    await nextTick();
    document.activeElement?.blur?.();
};

const openDeptModal = async (t) => {
    await closeAllOverlays();
    modalTarget.value = t;
    await nextTick();
    showDeptModal.value = true;
};
const openPermModal = async (t) => {
    await closeAllOverlays();
    modalTarget.value = t;
    await nextTick();
    showPermModal.value = true;
};
const openStatusModal = async (t) => {
    await closeAllOverlays();
    modalTarget.value = t;
    await nextTick();
    showStatusModal.value = true;
};

const onSelectStatus = (row) => {
    const val = row?.status || '';
    if (modalTarget.value === 'create') createForm.value.status = val;
    else searchForm.value.status = val;
    showStatusModal.value = false;
};
const onSelectPerm = (row) => {
    const val = row?.perm_name || '';
    if (modalTarget.value === 'create') createForm.value.permName = val;
    else searchForm.value.permName = val;
    showPermModal.value = false;
};
const onSelectDept = (row) => {
    const val = row?.dept_name || '';
    if (modalTarget.value === 'create') createForm.value.dept = val;
    else searchForm.value.dept = val;
    showDeptModal.value = false;
};

/* ===== 모달 API ===== */
const fetchStatusItems = async () => {
    try {
        const response = await axios.get('/api/status');
        return Array.isArray(response.data) ? response.data : (response.data.items ?? []);
    } catch (error) {
        console.error('상태 조회 실패', error);
        return [];
    }
};

const fetchPermItems = async () => {
    try {
        const response = await axios.get('/api/perm');
        return Array.isArray(response.data) ? response.data : (response.data.items ?? []);
    } catch (error) {
        console.error('권한 조회 실패', error);
        return [];
    }
};

const fetchDeptItems = async () => {
    try {
        const response = await axios.get('/api/dept');
        return Array.isArray(response.data) ? response.data : (response.data.items ?? []);
    } catch (error) {
        console.error('부서 조회 실패', error);
        return [];
    }
};

/* ===== 조회 버튼 ===== */
const onClickSearch = async () => {
    const payload = { ...searchForm.value };
    const { data } = await axios.post('/api/emp/search', payload);
    rows.value = Array.isArray(data) ? data : (data.items ?? []);
};

/* ===== 행 클릭 -> 수정모드 세팅 ===== */
const selectedRow = ref(null);

// 폼 초기화 함수
function resetForm() {
    createForm.value = {
        id: null,
        name: '',
        dept: '',
        phone: '',
        joinDate: null,
        leavDate: null,
        status: '',
        permName: '',
        remark: ''
    };
}

// 선택된 행 감시 -> 폼 채우기
watch(selectedRow, (row) => {
    if (!row) return resetForm();
    createForm.value = {
        id: row.empId ?? null,
        name: row.empName ?? '',
        dept: row.deptName ?? '',
        phone: row.phone ?? '',
        joinDate: asDate(row.join) ?? null,
        leavDate: asDate(row.leav) ?? null,
        status: row.status ?? '',
        permName: row.perm ?? '',
        remark: row.remk ?? ''
    };
});
/* ===== 공용 ===== */
const validateRequired = (f) => !!(f.name && f.dept && f.phone && f.joinDate && f.status && f.permName);

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
        notify('필수 항목을 확인하세요.', 'warning');
        return;
    }
    const payload = {
        ...createForm.value,
        joinDate: toDateStr(createForm.value.joinDate),
        leavDate: toDateStr(createForm.value.leavDate)
    };
    try {
        await axios.post('/api/emp', payload);
        notify('등록이 완료되었습니다.', 'success');
        await onClickSearch();
    } catch (e) {
        const status = e?.response?.status;
        const msg = e?.response?.data?.message;
        if (status === 409) notify(msg || '이미 등록된 사원입니다!', 'warning');
        else if (status === 400) notify(msg || '입력값을 확인하세요.', 'warning');
        else notify(msg || '등록 중 오류가 발생했습니다.', 'error');
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
        notify('필수 항목을 확인하세요.', 'warning');
        return;
    }
    const payload = {
        ...createForm.value,
        joinDate: toDateStr(createForm.value.joinDate),
        leavDate: toDateStr(createForm.value.leavDate)
    };
    try {
        await axios.put(`/api/emp/${createForm.value.id}`, payload);
        notify('수정이 완료되었습니다.', 'success');
        await onClickSearch();
    } catch (e) {
        console.error(e);
        notify('수정 중 오류가 발생했습니다.', 'error');
    } finally {
        await closeAllOverlays();
    }
};

/* ===== 초기화 ===== */
const onClickReset = async () => {
    createForm.value = {
        id: null,
        name: '',
        dept: '',
        phone: '',
        joinDate: null,
        leavDate: null,
        status: '',
        permName: '',
        remark: ''
    };
    await closeAllOverlays();
};

// 검색폼 초기화
const onClickSearchReset = async () => {
    // 폼 값 초기화
    searchForm.value = {
        name: '',
        dept: '',
        phone: '',
        joinDate: null,
        leavDate: null,
        status: '',
        permName: ''
    };
    // 달력 v-menu도 닫고 값 비우기
    joinDate.value = null;
    leavDate.value = null;
    joinMenu.value = false;
    leavMenu.value = false;

    await nextTick();
    // 필요하면 즉시 조회 갱신
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

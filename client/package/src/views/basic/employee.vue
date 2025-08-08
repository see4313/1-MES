<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="사원조회">
                <h3>사원조회</h3>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="사원명" v-model="searchForm.name" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="부서명" v-model="searchForm.dept" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="연락처" v-model="searchForm.phone" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="joinMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="joinDate"
                                    label="입사일"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedJoinDate"
                                />
                            </template>
                            <v-date-picker
                                v-model="joinDate"
                                @update:model-value="
                                    (val) => {
                                        joinDate = val;
                                        searchForm.joinDate = val;
                                        joinMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="leavMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="leavDate"
                                    label="퇴사일"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedLeavDate"
                                />
                            </template>
                            <v-date-picker
                                v-model="leavDate"
                                @update:model-value="
                                    (val) => {
                                        leavDate = val;
                                        searchForm.leavDate = val;
                                        leavMenu = false;
                                    }
                                "
                            />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <!-- 조회 폼: 상태 -->
                        <v-text-field
                            v-model="searchSelectStatus"
                            label="사원상태"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="
                                statusTarget = 'search';
                                showStatusModal = true;
                            "
                        />
                    </v-col>
                    <v-row class="d-flex justify-space-between align-center mb-4">
                        <v-col cols="12" sm="4">
                            <!-- 조회 폼: 권한 -->
                            <v-text-field
                                v-model="searchSelectPermName"
                                label="권한"
                                readonly
                                append-inner-icon="mdi-magnify"
                                @click:append-inner="
                                    permTarget = 'search';
                                    showPermModal = true;
                                "
                            />
                        </v-col>

                        <!-- 오른쪽: 버튼 -->
                        <div class="d-flex">
                            <v-col cols="12" class="d-flex justify-end ga-2">
                                <v-btn color="primary" @click="onClickSearch">조회</v-btn>
                            </v-col>
                        </div>
                    </v-row>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <div class="card">
                <DataTable :value="products" tableStyle="min-width: 50rem">
                    <Column field="empId" header="사원번호"></Column>
                    <Column field="empName" header="사원명"></Column>
                    <Column field="deptId" header="소속부서"></Column>
                    <Column field="phone" header="연락처"></Column>
                    <Column field="join" header="입사일"></Column>
                    <Column field="leav" header="퇴사일"></Column>
                    <Column field="status" header="사원상태"></Column>
                    <Column field="perm" header="사원권한"></Column>
                    <Column field="remk" header="비고"></Column>
                </DataTable>
            </div>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="사원등록">
                <v-row class="d-flex justify-space-between align-center mb-4">
                    <!-- 왼쪽: 제목 -->
                    <div>
                        <h3>사원등록</h3>
                    </div>

                    <!-- 오른쪽: 버튼 -->
                    <div class="d-flex">
                        <v-btn color="primary">등록</v-btn>
                        <v-btn color="secondary" class="ml-2">취소</v-btn>
                    </div>
                </v-row>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="사원명" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="부서명" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="연락처" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="joinMenu1" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="joinDate1"
                                    label="입사일"
                                    readonly
                                    append-inner-icon="mdi-calendar"
                                    variant="outlined"
                                    :model-value="formattedJoinDate1"
                                />
                            </template>
                            <v-date-picker v-model="joinDate1" @update:model-value="joinMenu1 = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="leavMenu1" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="leavDate1"
                                    label="퇴사일"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedLeavDate1"
                                />
                            </template>
                            <v-date-picker v-model="leavDate1" @update:model-value="leavMenu1 = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <!-- 등록 폼: 상태 -->
                        <v-text-field
                            v-model="searchSelectStatus2"
                            label="사원상태"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="
                                statusTarget = 'register';
                                showStatusModal = true;
                            "
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            v-model="searchSelectPermName2"
                            label="권한"
                            readonly
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="
                                permTarget = 'register';
                                showPermModal = true;
                            "
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="비고" />
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>

    <!-- 상태 모달 1개만 -->
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

    <!-- 권한 모달 1개만 -->
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
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import { ProductService } from '@/service/ProductService';
import dayjs from 'dayjs';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';

// 날짜 포맷 함수
const formatDate = (dateRef) => computed(() => (dateRef.value ? dayjs(dateRef.value).format('YYYY-MM-DD') : ''));

const products = ref([]);
const joinMenu = ref(false);
const leavMenu = ref(false);
const joinMenu1 = ref(false);
const leavMenu1 = ref(false);
const joinDate = ref(null);
const leavDate = ref(null);
const joinDate1 = ref(null);
const leavDate1 = ref(null);

const formattedJoinDate = formatDate(joinDate);
const formattedLeavDate = formatDate(leavDate);
const formattedJoinDate1 = formatDate(joinDate1);
const formattedLeavDate1 = formatDate(leavDate1);

// 검색 폼
const searchForm = ref({
    name: '',
    department: '',
    phone: '',
    joinDate: null,
    leavDate: null,
    status: '',
    permName: ''
});

// 조회용 입력란
const searchSelectStatus = ref(null);
const searchSelectPermName = ref(null);

// 등록용 입력란
const searchSelectStatus2 = ref(null);
const searchSelectPermName2 = ref(null);

// 모달 제어
const showStatusModal = ref(false);
const showPermModal = ref(false);
const statusTarget = ref(null); // 'search' | 'register'
const permTarget = ref(null); // 'search' | 'register'

// 상태 데이터
const fetchStatusItems = async (page, search) => {
    const statusList = [
        { status_id: 'S001', status: '재직' },
        { status_id: 'S002', status: '휴직' },
        { status_id: 'S003', status: '퇴직' }
    ];
    return search ? statusList.filter((item) => item.status.includes(search)) : statusList;
};

// 권한 데이터
const fetchPermItems = async (page, search) => {
    const permList = [
        { perm_id: 'AD001', perm_name: '전체 관리자' },
        { perm_id: 'AD002', perm_name: '부서 관리자' },
        { perm_id: 'AD003', perm_name: '일반 사용자' }
    ];
    return search ? permList.filter((item) => item.perm_name.includes(search)) : permList;
};

// 상태 선택
const onSelectStatus = (item) => {
    if (statusTarget.value === 'search') {
        searchSelectStatus.value = item.status;
        searchForm.value.status = item.status;
    } else if (statusTarget.value === 'register') {
        searchSelectStatus2.value = item.status;
    }
    showStatusModal.value = false;
    statusTarget.value = null;
};

// 권한 선택
const onSelectPerm = (item) => {
    if (permTarget.value === 'search') {
        searchSelectPermName.value = item.perm_name;
        searchForm.value.permName = item.perm_name;
    } else if (permTarget.value === 'register') {
        searchSelectPermName2.value = item.perm_name;
    }
    showPermModal.value = false;
    permTarget.value = null;
};

// 검색 버튼
// 조회 버튼 클릭
const onClickSearch = async () => {
    try {
        const res = await axios.post('http://localhost:3000/emp/search', searchForm.value);
        products.value = res.data;
    } catch (err) {
        console.error(err);
    }
};

// 초기 데이터 로드
onMounted(async () => {
    const data = await ProductService.getProductsMini();
    products.value = data;
});
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

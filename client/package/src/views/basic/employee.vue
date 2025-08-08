<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="사원조회">
                <h3>사원조회</h3>
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
                            <v-date-picker v-model="joinDate" @update:model-value="joinMenu = false" />
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
                            <v-date-picker v-model="leavDate" @update:model-value="leavMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="사원상태"
                            required
                            append-inner-icon="mdi-magnify"
                            v-model="selectedStatus"
                            @click:append-inner="(searchStatus, (isStatusDialogOpen = true))"
                        />
                    </v-col>
                    <v-row class="d-flex justify-space-between align-center mb-4">
                        <v-col cols="12" sm="4">
                            <v-text-field
                                variant="outlined"
                                label="권한"
                                required
                                append-inner-icon="mdi-magnify"
                                v-model="selectedPermName"
                                @click:append-inner="(searchPerm, (isPermDialogOpen = true))"
                            />
                        </v-col>

                        <!-- 오른쪽: 버튼 -->
                        <div class="d-flex">
                            <v-col cols="12" class="d-flex justify-end ga-2">
                                <v-btn color="primary">등록</v-btn>
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
                    <Column field="code" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="category" header="Category"></Column>
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
                                    append-inner-icon="mdi-calendar"
                                    readonly
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
                        <v-text-field
                            variant="outlined"
                            label="사원상태"
                            required
                            append-inner-icon="mdi-magnify"
                            v-model="selectedStatus"
                            @click:append-inner="(searchStatus, (isStatusDialogOpen = true))"
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="권한"
                            required
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="searchPerm"
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="비고" />
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>

    <v-dialog v-model="isStatusDialogOpen" max-width="400">
        <v-card>
            <v-card-title class="text-h6">사원상태 선택</v-card-title>
            <v-list>
                <v-list-item @click="selectStatus('재직')">
                    <v-list-item-title>재직</v-list-item-title>
                </v-list-item>
                <v-list-item @click="selectStatus('휴직')">
                    <v-list-item-title>휴직</v-list-item-title>
                </v-list-item>
                <v-list-item @click="selectStatus('퇴사')">
                    <v-list-item-title>퇴사</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
    </v-dialog>
    <!-- 모달 다이얼로그 -->
    <v-dialog v-model="isPermDialogOpen" max-width="600" persistent>
        <v-card class="rounded-lg">
            <v-card-title class="text-h6 font-weight-bold"> 권한 검색 </v-card-title>

            <v-card-text>
                <v-table dense>
                    <thead>
                        <tr>
                            <th class="text-left">권한 코드</th>
                            <th class="text-left">권한명</th>
                            <th class="text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in perm" :key="item.code">
                            <td>{{ item.code }}</td>
                            <td>{{ item.name }}</td>
                            <td class="text-center">
                                <v-btn color="primary" size="small" variant="tonal" @click="selectPerm(item)"> 선택 </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import { ProductService } from '@/service/ProductService';
import dayjs from 'dayjs';

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const products = ref();
const joinMenu = ref(false);
const joinDate = ref(null);
const leavMenu = ref(false);
const leavDate = ref(null);
const joinMenu1 = ref(false);
const joinDate1 = ref(null);
const leavMenu1 = ref(false);
const leavDate1 = ref(null);

// 공통 날짜 포맷 함수
const formatDate = (dateRef) => computed(() => (dateRef.value ? dayjs(dateRef.value).format('YYYY-MM-DD') : ''));

const formattedJoinDate = formatDate(joinDate);
const formattedLeavDate = formatDate(leavDate);
const formattedJoinDate1 = formatDate(joinDate1);
const formattedLeavDate1 = formatDate(leavDate1);

const selectedStatus = ref(''); // 입력 필드에 바인딩
const isStatusDialogOpen = ref(false); // 모달 열림 여부

const selectStatus = (status) => {
    selectedStatus.value = status; // 필드에 값 입력
    isStatusDialogOpen.value = false; // 모달 닫기
};

// 모달 상태
const isPermDialogOpen = ref(false);

// 권한 목록 데이터
const perm = ref([
    { code: 'AD001', name: '전체 관리자' },
    { code: 'AD002', name: '부서 관리자' },
    { code: 'AD003', name: '일반 사용자' }
]);

// 선택된 값
const selectedPermnCode = ref('');
const selectedPermName = ref('');

// 선택 시 처리
const selectPerm = (item) => {
    selectedPermnCode.value = item.code;
    selectedPermName.value = item.name;
    isPermDialogOpen.value = false;
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

<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="사원조회">
                <h3>사원조회</h3>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field label="사원명" v-model="selectedItem" readonly>
                            <template #append-inner>
                                <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
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
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedJoinDate"
                                />
                            </template>
                            <v-date-picker v-model="joinDate" @change="joinMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="leavMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="leavDate"
                                    label="퇴사일"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedLeavDate"
                                />
                            </template>
                            <v-date-picker v-model="leavDate" @change="leavMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="사원상태" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="권한" />
                    </v-col>
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
                </DataTable>
            </div>
        </v-col>
    </v-row>

    <!-- 사원 모달 -->
    <ModalSearch
        :visible="showModal"
        title="사원 검색"
        idField="emp_id"
        :columns="[
            { key: 'emp_id', label: '사원번호' },
            { key: 'emp_name', label: '사원명' },
            { key: 'status', label: '상태' }
        ]"
        :fetchData="fetchItems"
        :pageSize="5"
        @select="onSelectItem"
        @close="showModal = false"
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

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const products = ref();
const joinMenu = ref(false);
const joinDate = ref(null);
const leavMenu = ref(false);
const leavDate = ref(null);

const formattedJoinDate = computed(() => {
    return joinDate.value ? dayjs(joinDate.value).format('YYYY-MM-DD') : '';
});

const formattedLeavDate = computed(() => {
    return leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : '';
});

const showModal = ref(false);
const selectedItem = ref(null);

// DB에서 리스트 가져오기
const fetchItems = async () => {
    try {
        const response = await axios.get('/api/boards');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 선택한 값 처리
const onSelectItem = (item) => {
    selectedItem.value = item.emp_name;
};
</script>

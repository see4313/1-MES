<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="발주 등록"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="dataReset()"
                btn-text2="등록"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="addProc()"
            />
            <v-row>
                <v-col cols="12" md="8">
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="6">
                            <v-text-field label="업체명" v-model="selectVendName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="vendModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field label="담당자" v-model="selectEmpName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="empModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="6">
                            <v-menu
                                v-model="regMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-bind="props"
                                        v-model="regDate"
                                        label="발주일자"
                                        append-inner-icon="mdi-calendar"
                                        readonly
                                        variant="outlined"
                                        :model-value="formattedregDate"
                                    />
                                </template>
                                <v-date-picker v-model="regDate" @update:model-value="regMenu = false" />
                            </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-menu
                                v-model="papMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-bind="props"
                                        v-model="papDate"
                                        label="납기일자"
                                        append-inner-icon="mdi-calendar"
                                        readonly
                                        variant="outlined"
                                        :model-value="formattedpapDate"
                                    />
                                </template>
                                <v-date-picker v-model="papDate" :min="today" @update:model-value="papMenu = false" />
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" md="4">
                    <v-row>
                        <v-col cols="12">
                            <v-textarea label="비고" v-model="itemRemk" outlined rows="5"> </v-textarea>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader title="발주 상세" btn-text="행 추가" btn-variant="flat" btn-color="#424242" @btn-click="addRow()" />
            <v-row>
                <v-col cols="12" md="12">
                    <div class="card">
                        <DataTable :value="procDetailList" paginator :rows="10" tableStyle="min-width: 50rem; table-layout: fixed;">
                            <!-- 품목번호 (돋보기 아이콘 클릭하면 모달 열림) -->
                            <Column header="품목번호" style="width: 180px">
                                <template #body="slotProps">
                                    {{ slotProps.data.item_id }}
                                    <v-icon small class="ml-2 cursor-pointer" @click="openItemModal(slotProps.index)">mdi-magnify</v-icon>
                                </template>
                            </Column>

                            <!-- 품목명 -->
                            <Column field="item_name" header="품목명" style="width: 200px" />

                            <!-- 규격 -->
                            <Column field="spec" header="규격" style="width: 150px" />

                            <!-- 단위 -->
                            <Column field="unit" header="단위" style="width: 100px" />

                            <!-- 수량 (직접 입력) -->
                            <Column header="수량" style="width: 100px">
                                <template #body="slotProps">
                                    <v-text-field
                                        v-model.number="procDetailList[slotProps.index].qty"
                                        type="number"
                                        dense
                                        hide-details
                                        style="width: 100px"
                                        variant="outlined"
                                        min="0"
                                    />
                                </template>
                            </Column>

                            <!-- 단가 (직접 입력) -->
                            <Column header="단가" style="width: 120px">
                                <template #body="slotProps">
                                    <v-text-field
                                        v-model.number="procDetailList[slotProps.index].untpc"
                                        type="number"
                                        dense
                                        hide-details
                                        style="width: 120px"
                                        variant="outlined"
                                        min="0"
                                    />
                                </template>
                            </Column>

                            <!-- 금액 (수량 * 단가 자동 계산) -->
                            <Column header="금액(원)" style="width: 150px">
                                <template #body="slotProps">
                                    {{ (slotProps.data.qty * slotProps.data.untpc).toLocaleString() }}
                                </template>
                            </Column>

                            <!-- 삭제 버튼 -->
                            <Column style="width: 80px; text-align: center">
                                <template #body="slotProps">
                                    <v-btn icon color="error" @click="deleteRow(slotProps.index)">
                                        <v-icon size="20">mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 거래처 모달 -->
    <ModalSearch
        :visible="vendModal"
        title="거래처"
        idField="vend_id"
        :columns="[
            { key: 'vend_id', label: '거래처번호' },
            { key: 'vend_name', label: '거래처명' }
        ]"
        :fetchData="fetchVend"
        :pageSize="5"
        @select="onSelectVend"
        @close="vendModal = false"
    />

    <!-- 담당자 모달 -->
    <ModalSearch
        :visible="empModal"
        title="사원"
        idField="emd_id"
        :columns="[
            { key: 'emp_id', label: '사원번호' },
            { key: 'emp_name', label: '사원이름' }
        ]"
        :fetchData="fetchEmp"
        :pageSize="5"
        @select="onSelectEmp"
        @close="empModal = false"
    />

    <!-- 품목번호 모달 -->
    <ModalSearch
        :visible="itemModal"
        title="품목"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'unit', label: '단위' },
            { key: 'spec', label: '규격' }
        ]"
        :fetchData="fetchItem"
        :pageSize="5"
        @select="onSelectItem"
        @close="itemModal = false"
    />
</template>

<script setup>
import CardHeader from '@/components/production/card-header-btn.vue';
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed, reactive } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';
import dayjs from 'dayjs';

const procDetailList = ref([]);
const today = dayjs().format('YYYY-MM-DD');
const regMenu = ref(false);
const regDate = ref(null); // 발주일자
const papMenu = ref(false);
const papDate = ref(null); // 납기일자
const vendModal = ref(false); // 품목번호 모달
const empModal = ref(false); // LOT번호 모달
const itemModal = ref(false); // 품목 모달
const selectVendId = ref(null); // 거래처 번호
const selectVendName = ref(null); // 거래처 이름
const selectEmpId = ref(null); // 사원 번호
const selectEmpName = ref(null); // 사원 이름
const itemModalIndex = ref(null);
const itemRemk = ref(null); // 비고

onMounted(() => {});

const formattedregDate = computed(() => {
    return regDate.value ? dayjs(regDate.value).format('YYYY-MM-DD') : '';
});

const formattedpapDate = computed(() => {
    return papDate.value ? dayjs(papDate.value).format('YYYY-MM-DD') : '';
});

// 모달 호출
const fetchVend = async () => {
    try {
        const response = await axios.get('/api/selectVend');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchEmp = async () => {
    try {
        const response = await axios.get('/api/selectEmp');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItem = async () => {
    try {
        const response = await axios.get('/api/itemId');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

// 모달에서 선택한 값 처리 onSelectItem
const onSelectVend = (item) => {
    selectVendId.value = item.vend_id; // 거래처번호
    selectVendName.value = item.vend_name; // 거래처명
};

const onSelectEmp = (item) => {
    selectEmpId.value = item.emp_id; // 사원번호
    selectEmpName.value = item.emp_name; // 사원명
};

const onSelectItem = (item) => {
    if (itemModalIndex.value != null) {
        const row = procDetailList.value[itemModalIndex.value];
        row.item_id = item.item_id;
        row.item_name = item.item_name;
        row.unit = item.unit;
        row.spec = item.spec;
        itemModal.value = false;
        itemModalIndex.value = null;
    }
};

// 행 추가
const addRow = () => {
    procDetailList.value.push({
        item_id: '',
        item_name: '',
        unit: '',
        spec: '',
        qty: 0,
        untpc: 0,
        totpc: 0
    });
};

// 품목번호 모달 열기
const openItemModal = (index) => {
    itemModalIndex.value = index;
    itemModal.value = true;
};

// 행 삭제 함수
const deleteRow = (index) => {
    procDetailList.value.splice(index, 1);
};

// 입력 값 초기화
const dataReset = () => {
    selectVendId.value = null;
    selectVendName.value = null;
    selectEmpId.value = null;
    selectEmpName.value = null;
    regDate.value = null;
    papDate.value = null;
};

// 등록 실행
const addProc = async () => {
    try {
        const payload = {
            vend_id: selectVendId.value,
            emp_id: selectEmpId.value,
            reg_date: formattedregDate.value,
            pap_date: formattedpapDate.value,
            remark: itemRemk.value,
            details: procDetailList.value.map((item) => ({
                item_id: item.item_id,
                qty: item.qty,
                untpc: item.untpc
            }))
        };

        const response = await axios.post('/api/procInsert', payload);
        if (response.data.result) {
            alert('등록 성공');
            dataReset();
            procDetailList.value = [];
        } else {
            alert('등록 실패');
        }
    } catch (err) {
        console.error(err);
        alert('에러 발생');
    }
};
</script>

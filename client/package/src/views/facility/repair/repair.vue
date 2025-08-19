<template>
    <!-- 조회 영역 -->
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="고장/수리 조회"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="selectReset"
                btn-text2="조회"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="select"
            />
            <v-row>
                <v-col cols="12" md="12">
                    <v-row justify="space-between" dense>
                        <!-- 설비명 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="설비명" v-model="selectItemName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemNameModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 설비유형 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="설비유형" v-model="selectFacilityType" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 고장유형 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="고장유형" v-model="selectFailType" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="failTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 담당자 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="담당자" v-model="selectCutd" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="cutdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- 긴급도 -->
                        <v-col cols="12" sm="3">
                            <v-text-field label="긴급도" v-model="selectUrgency" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="urgencyModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 목록 영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader title="설비목록" />
            <DataTable
                v-model:selection="selectfacilityList"
                :value="facilityList"
                selectionMode="single"
                :metaKeySelection="false"
                dataKey="facility_id"
                paginator
                :rows="5"
                tableStyle="min-width: 50rem"
                class="cursor-pointer"
            >
                <Column field="facility_id" header="설비ID" />
                <Column field="facility_nm" header="설비명" />
                <Column field="facility_type_name" header="설비유형" />
                <Column field="failure_type" header="고장 유형" />
                <Column field="urgency_level" header="긴급도" />
                <Column field="failDt" header="고장일자" />
                <Column field="repairDt" header="수리일자" />
                <Column field="emp_name" header="담당자" />
                <Column field="repair_status" header="설비 상태" />
                <Column field="remk" header="비고" />
            </DataTable>
        </v-card-item>
    </v-card>

    <!-- 등록/수정 영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader3
                title="고장/수리 관리 "
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="dataReset"
                btn-text2="삭제"
                btn-variant2="flat"
                btn-color2="error"
                :btn-disabled2="!itemId"
                @btn-click2="itemDelete"
                btn-text3="저장"
                btn-variant3="flat"
                btn-color3="primary"
                @btn-click3="itemSave"
            />
            <v-row dense>
                <v-col cols="12" sm="4"><v-text-field label="설비ID" v-model="itemId" variant="outlined" readonly /></v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비명" v-model="itemName" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="itemNameModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비유형" v-model="facilityType" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="itemTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="고장유형" v-model="failType" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="failTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="긴급도" v-model="urgencyLevel" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="urgencyModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field type="date" label="고장일자" v-model="failDt" :max="todayStr" variant="outlined" />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field type="date" label="수리일자" v-model="repairDt" :max="todayStr" variant="outlined" />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="담당자" v-model="itemCutd" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="cutdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비 상태" v-model="repair_status" variant="outlined" readonly />
                </v-col>
                <v-col cols="12"><v-textarea label="비고" v-model="itemRemk" outlined rows="5" /></v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 모달 공통 -->
    <ModalSearch
        :visible="itemNameModal"
        title="설비명"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: 'ID' },
            { key: 'item_name', label: '명' }
        ]"
        :fetchData="fetchItemNames"
        @select="onSelectItemName"
        @close="itemNameModal = false"
    />

    <ModalSearch
        :visible="itemTypeModal"
        title="설비유형"
        idField="type_id"
        :columns="[{ key: 'type_name', label: '유형' }]"
        :fetchData="fetchItemTypes"
        @select="onSelectItemType"
        @close="itemTypeModal = false"
    />

    <ModalSearch
        :visible="failTypeModal"
        title="고장유형"
        idField="fail_type_cd"
        :columns="[
            { key: 'fail_type_cd', label: '코드' },
            { key: 'fail_type_nm', label: '명' }
        ]"
        :fetchData="fetchFailureTypes"
        @select="onSelectFailureType"
        @close="failTypeModal = false"
    />

    <ModalSearch
        :visible="cutdModal"
        title="담당자"
        idField="user_id"
        :columns="[
            { key: 'user_id', label: 'ID' },
            { key: 'user_name', label: '이름' }
        ]"
        :fetchData="fetchUsers"
        @select="onSelectCutd"
        @close="cutdModal = false"
    />

    <ModalSearch
        :visible="urgencyModal"
        title="긴급도"
        idField="urgency_id"
        :columns="[
            { key: 'urgency_id', label: 'ID' },
            { key: 'urgency_name', label: '긴급도' }
        ]"
        :fetchData="fetchUrgencyLevels"
        @select="onSelectUrgency"
        @close="urgencyModal = false"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackOpen" :color="snackColor" timeout="2000" location="top right">
        {{ snackMessage }}
    </v-snackbar>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ModalSearch from '@/views/commons/CommonModal.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackOpen, snackMessage, snackColor } = useSnackBar();
function showSnack(msg, color = 'success') {
    snackMessage.value = msg;
    snackColor.value = color;
    snackOpen.value = true;
}

// 날짜
const todayStr = new Date().toISOString().split('T')[0];

// 조회조건
const selectItemName = ref('');
const selectItemId = ref('');
const selectFacilityType = ref('');
const selectFacilityTypeId = ref('');
const selectFailType = ref('');
const selectFailTypeId = ref('');
const selectCutd = ref('');
const selectCutdId = ref('');
const selectUrgency = ref('');
const selectUrgencyId = ref('');

// 목록
const facilityList = ref([]);
const selectfacilityList = ref(null);

// 등록폼
const itemId = ref('');
const itemName = ref('');
const facilityType = ref('');
const failType = ref('');
const urgencyLevel = ref('');
const urgencyId = ref('');
const failDt = ref('');
const repairDt = ref('');
const repair_status = ref('미수리');
const itemCutd = ref('');
const itemRemk = ref('');

// 모달 상태
const itemNameModal = ref(false);
const itemTypeModal = ref(false);
const failTypeModal = ref(false);
const cutdModal = ref(false);
const urgencyModal = ref(false);

// 조회 초기화
function selectReset() {
    selectItemName.value = '';
    selectItemId.value = '';
    selectFacilityType.value = '';
    selectFacilityTypeId.value = '';
    selectFailType.value = '';
    selectFailTypeId.value = '';
    selectCutd.value = '';
    selectCutdId.value = '';
    selectUrgency.value = '';
    selectUrgencyId.value = '';
}

// 등록폼 초기화
function dataReset() {
    itemId.value = '';
    itemName.value = '';
    facilityType.value = '';
    failType.value = '';
    urgencyLevel.value = '';
    urgencyId.value = '';
    failDt.value = '';
    repairDt.value = '';
    repair_status.value = '미수리';
    itemCutd.value = '';
    itemRemk.value = '';
}

// 목록 조회
async function select() {
    try {
        const params = {
            facility_id: selectItemId.value,
            facility_type: selectFacilityTypeId.value,
            fail_type_cd: selectFailTypeId.value,
            emp_id: selectCutdId.value,
            urgency_id: selectUrgencyId.value
        };
        const response = await axios.get('/api/facilityList', { params });
        facilityList.value = response.data;
    } catch (error) {
        console.error('조회 실패', error);
    }
}

// 목록 선택 → 폼 세팅
watch(selectfacilityList, (val) => {
    if (!val) return;
    itemId.value = val.facility_id || '';
    itemName.value = val.facility_nm || '';
    facilityType.value = val.facility_type_name || '';
    failType.value = val.failure_type || '';
    urgencyLevel.value = val.urgency_level || '';
    itemCutd.value = val.emp_name || '';
    itemRemk.value = val.remk || '';
});

// 모달 데이터
const fetchItemNames = async () => (await axios.get('/api/itemNames')).data;
const fetchItemTypes = async () => (await axios.get('/api/itemTypes')).data;
const fetchFailureTypes = async () => (await axios.get('/api/failureTypes')).data;
const fetchUsers = async () => (await axios.get('/api/users')).data;
const fetchUrgencyLevels = async () => (await axios.get('/api/urgencyLevels')).data;

// 모달 선택
function onSelectItemName(row) {
    selectItemName.value = row.item_name;
    selectItemId.value = row.item_id;
    itemName.value = row.item_name;
}
function onSelectItemType(row) {
    selectFacilityType.value = row.type_name;
    selectFacilityTypeId.value = row.type_id;
    facilityType.value = row.type_name;
}
function onSelectFailureType(row) {
    selectFailType.value = row.fail_type_nm;
    selectFailTypeId.value = row.fail_type_cd;
    failType.value = row.fail_type_nm;
}
function onSelectCutd(row) {
    selectCutd.value = row.user_name;
    selectCutdId.value = row.user_id;
    itemCutd.value = row.user_name;
}
function onSelectUrgency(row) {
    selectUrgency.value = row.urgency_name;
    selectUrgencyId.value = row.urgency_id;
    urgencyLevel.value = row.urgency_name;
    urgencyId.value = row.urgency_id;
}

// 저장
const itemSave = async () => {
    if (!itemName.value || !selectFacilityTypeId.value || !selectFailTypeId.value || !selectCutdId.value || !urgencyId.value) {
        showSnack('필수 값을 입력하세요', 'error');
        return;
    }

    if (!confirm(itemId.value ? '정말 수정하시겠습니까?' : '정말 저장하시겠습니까?')) return;

    let obj = {
        facility_id: itemId.value || null,
        facility_nm: itemName.value,
        facility_type: selectFacilityTypeId.value,
        fail_type_cd: selectFailTypeId.value,
        emp_id: selectCutdId.value,
        urgency_id: urgencyId.value,
        fail_dt: failDt.value,
        repair_dt: repairDt.value,
        repair_status: repair_status.value,
        remk: itemRemk.value
    };

    try {
        let response;
        if (!itemId.value) {
            response = await axios.post('/api/facilityInsert', obj);
            if (response.data.success) showSnack('저장되었습니다', 'success');
        } else {
            response = await axios.put('/api/facilityUpdate', obj);
            if (response.data.success) showSnack('수정되었습니다', 'warning');
        }
        await select();
        dataReset();
    } catch (err) {
        console.error(err);
        showSnack('저장 실패', 'error');
    }
};

// 삭제
const itemDelete = async () => {
    if (!itemId.value) {
        showSnack('삭제할 데이터를 선택하세요', 'warning');
        return;
    }
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        const response = await axios.delete('/api/facilityDelete', { data: { facility_id: itemId.value } });
        if (response.data.success) {
            showSnack('삭제되었습니다.', 'error');
            await select();
            dataReset();
        }
    } catch (err) {
        console.error(err);
        showSnack('삭제 실패', 'error');
    }
};

const data = ref([
    {
        facility_id: 'FAC250818-0002',
        facility_nm: '냉동기-002',
        facility_type_name: '발효',
        fail_type_nm: '전기 이상',
        urgency_name: '긴급',
        fail_dt: '2025-08-18',
        repair_dt: '',
        emp_name: '김이박',
        repair_status: '미수리',
        remk: '123'
    },
    {
        facility_id: 'FAC250818-0004',
        facility_nm: '냉동기-005',
        facility_type_name: '냉동',
        fail_type_nm: '센서 오류',
        urgency_name: '보통',
        fail_dt: '2025-08-19',
        repair_dt: '2025-08-20',
        emp_name: '김테스트111',
        repair_status: '완료',
        remk: 'ㅋㅋㅋㅋㅋ'
    }
]);
</script>

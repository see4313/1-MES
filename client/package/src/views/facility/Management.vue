<template>
    <!-- 조회 영역 -->
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="설비 조회"
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
                            <v-text-field label="설비유형" v-model="selectItemType" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
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
                <Column field="emp_name" header="담당자" />
                <Column field="purchase_dt" header="구매일자" />
                <Column field="temp_val" header="적정 온도(C)" />
                <Column field="humidity_val" header="적정 습도(%)" />
                <Column field="rpm_val" header="적정 RPM" />
                <Column field="power_val" header="적정 전력량(KW)" />
                <Column field="remk" header="비고" />
            </DataTable>
        </v-card-item>
    </v-card>

    <!-- 등록/수정 영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader3
                title="설비등록"
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
                    <v-text-field label="설비유형" v-model="itemType" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="itemTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
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
                    <v-text-field type="date" label="구매일자" v-model="buyDate" :max="todayStr" variant="outlined" />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="3"><v-text-field label="적정온도" v-model="optimalTemp" variant="outlined" /></v-col>
                <v-col cols="12" sm="3"><v-text-field label="적정습도(%)" v-model="optimalHumidity" variant="outlined" /></v-col>
                <v-col cols="12" sm="3"><v-text-field label="적정RPM" v-model="optimalRpm" variant="outlined" /></v-col>
                <v-col cols="12" sm="3"><v-text-field label="적정 전력량(KW)" v-model="optimalPower" variant="outlined" /></v-col>
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

// Snack Bar
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
const selectItemType = ref('');
const selectItemTypeId = ref('');
const selectCutd = ref('');
const selectCutdId = ref('');

// 목록
const facilityList = ref([]);
const selectfacilityList = ref(null);

// 등록폼
const itemId = ref('');
const itemName = ref('');
const itemType = ref('');
const itemSpec = ref('');
const itemCutd = ref('');
const buyDate = ref('');
const optimalTemp = ref('');
const optimalHumidity = ref('');
const optimalRpm = ref('');
const optimalPower = ref('');
const itemRemk = ref('');

// 모달 상태
const itemNameModal = ref(false);
const itemTypeModal = ref(false);
const cutdModal = ref(false);

// 조회 초기화
function selectReset() {
    selectItemName.value = '';
    selectItemId.value = '';
    selectItemType.value = '';
    selectItemTypeId.value = '';
    selectCutd.value = '';
    selectCutdId.value = '';
}

// 등록폼 초기화
function dataReset() {
    itemId.value = '';
    itemName.value = '';
    itemType.value = '';
    itemSpec.value = '';
    itemCutd.value = '';
    buyDate.value = '';
    optimalTemp.value = '';
    optimalHumidity.value = '';
    optimalRpm.value = '';
    optimalPower.value = '';
    itemRemk.value = '';
    selectItemTypeId.value = '';
    selectCutdId.value = '';
}

// 목록 조회
async function select() {
    try {
        const params = {
            facility_id: selectItemId.value,
            facility_type: selectItemTypeId.value,
            emp_id: selectCutdId.value
        };
        const response = await axios.get('/api/facilityList', { params });
        facilityList.value = response.data;
    } catch (error) {
        console.error('조회 실패', error);
    }
}

// 목록 클릭 → 폼에 반영 + ID 세팅
watch(selectfacilityList, (val) => {
    if (!val) return;
    itemId.value = val.facility_id || '';
    itemName.value = val.facility_nm || '';
    itemType.value = val.facility_type_name || '';
    itemSpec.value = val.facility_cnt || '';
    itemCutd.value = val.emp_name || '';
    buyDate.value = val.purchase_dt || '';
    optimalTemp.value = val.temp_val || '';
    optimalHumidity.value = val.humidity_val || '';
    optimalRpm.value = val.rpm_val || '';
    optimalPower.value = val.power_val || '';
    itemRemk.value = val.remk || '';

    // 값이 없으면 기존 값 유지
    if (val.facility_type) selectItemTypeId.value = val.facility_type;
    if (val.emp_id) selectCutdId.value = val.emp_id;
});

// 모달 데이터
const fetchItemNames = async () => (await axios.get('/api/itemNames')).data;
const fetchItemTypes = async () => (await axios.get('/api/itemTypes')).data;
const fetchUsers = async () => (await axios.get('/api/users')).data;

// 모달 선택
function onSelectItemName(row) {
    selectItemName.value = row.item_name;
    selectItemId.value = row.item_id;
    itemName.value = row.item_name;
}
function onSelectItemType(row) {
    selectItemType.value = row.type_name;
    selectItemTypeId.value = row.type_id;
    itemType.value = row.type_name;
}
function onSelectCutd(row) {
    selectCutd.value = row.user_name;
    selectCutdId.value = row.user_id;
    itemCutd.value = row.user_name;
}

// 설비 저장
const itemSave = async () => {
    if (!itemName.value || !selectItemTypeId.value || !selectCutdId.value) {
        showSnack('필수 값을 입력하세요', 'error');
        return;
    }

    let obj = {
        facility_id: itemId.value || null,
        facility_nm: itemName.value,
        facility_type: selectItemTypeId.value,
        emp_id: selectCutdId.value,
        purchase_dt: buyDate.value,
        temp_val: optimalTemp.value,
        humidity_val: optimalHumidity.value,
        rpm_val: optimalRpm.value,
        power_val: optimalPower.value,
        remk: itemRemk.value
    };

    try {
        let response;
        if (!itemId.value) {
            response = await axios.post('/api/facilityInsert', obj);
            if (response.data.success) showSnack('저장되었습니다', 'success');
        } else {
            response = await axios.put('/api/facilityUpdate', obj);
            if (response.data.success) showSnack('수정되었습니다', 'success');
        }
        await select();
        dataReset();
    } catch (err) {
        console.error(err);
        showSnack('저장 실패', 'error');
    }
};

// 설비 삭제
const itemDelete = async () => {
    if (!itemId.value) {
        showSnack('삭제할 데이터를 선택하세요', 'warning');
        return;
    }
    try {
        const response = await axios.delete('/api/facilityDelete', { data: { facility_id: itemId.value } });
        if (response.data.success) {
            showSnack('삭제되었습니다.', 'success');
            await select();
            dataReset();
        }
    } catch (err) {
        console.error(err);
        showSnack('삭제 실패', 'error');
    }
};
</script>

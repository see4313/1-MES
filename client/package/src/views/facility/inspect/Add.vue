<template>
    <!-- 등록영역 -->
    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="점검이력 등록"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="dataReset"
                btn-text2="등록"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="itemSave"
            />
            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field label="설비명" v-model="itemName" variant="outlined" readonly>
                        <template #append-inner>
                            <v-icon @click="itemNameModal = true" class="cursor-pointer">mdi-magnify</v-icon>
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
                    <v-text-field type="date" label="점검일자" v-model="buyDate" :max="todayStr" variant="outlined" />
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" sm="3"><v-text-field label="온도" v-model="optimalTemp" variant="outlined" /></v-col>
                <v-col cols="12" sm="3"><v-text-field label="습도(%)" v-model="optimalHumidity" variant="outlined" /></v-col>
                <v-col cols="12" sm="3"><v-text-field label="RPM" v-model="optimalRpm" variant="outlined" /></v-col>
                <v-col cols="12" sm="3"><v-text-field label="전력량(KW)" v-model="optimalPower" variant="outlined" /></v-col>
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
import { useFormatDate } from '@/composables/useFormatDate';

const { formatDate } = useFormatDate();

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

    if (!confirm('정말 등록하시겠습니까?')) {
        return;
    }

    let obj = {
        facility_id: null,
        facility_nm: itemName.value,
        facility_type: selectItemTypeId.value,
        emp_id: selectCutdId.value,
        purchase_dt: formatDate(buyDate.value, '-'),
        temp_val: optimalTemp.value,
        humidity_val: optimalHumidity.value,
        rpm_val: optimalRpm.value,
        power_val: optimalPower.value,
        remk: itemRemk.value
    };

    try {
        const response = await axios.post('/api/inspectInsert', obj);
        if (response.data.success) {
            showSnack('등록 되었습니다', 'success');
            await select(); // 목록 갱신
            dataReset(); // 폼 초기화
        }
    } catch (err) {
        console.error(err);
        showSnack('등록 실패', 'error');
    }
};
</script>

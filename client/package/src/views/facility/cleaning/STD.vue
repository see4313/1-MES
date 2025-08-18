<template>
    <v-container>
        <v-row>
            <!-- 등록/수정 폼 -->
            <v-col cols="12" md="6">
                <v-card elevation="10">
                    <v-card-title> 세척 기준정보 {{ form.clean_std_id ? '수정' : '등록' }} </v-card-title>
                    <v-card-text>
                        <!-- 설비명 -->
                        <v-text-field label="설비명" v-model="facilityName" readonly variant="outlined">
                            <template #append-inner>
                                <v-icon @click="facilityModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>

                        <!-- 세척 항목명 -->
                        <v-text-field label="항목명" v-model="form.clean_item_name" readonly variant="outlined">
                            <template #append-inner>
                                <v-icon @click="itemModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>

                        <!-- 기준값 + 단위 -->
                        <v-row>
                            <v-col cols="7">
                                <v-text-field label="기준값" v-model="form.std_val" variant="outlined" />
                            </v-col>
                            <v-col cols="5">
                                <v-text-field label="단위" v-model="form.unit_name" readonly variant="outlined">
                                    <template #append-inner>
                                        <v-icon @click="unitModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <!-- 주기 -->
                        <v-text-field label="주기" v-model="form.cycle" variant="outlined" />

                        <!-- 사용여부: 라디오 버튼 -->
                        <v-radio-group v-model="form.use_yn" row>
                            <v-radio label="사용" value="Y" />
                            <v-radio label="미사용" value="N" />
                        </v-radio-group>

                        <!-- 버튼 -->
                        <v-btn color="primary" class="mr-2" :loading="saving" :disabled="saving" @click="saveStd">
                            {{ form.clean_std_id ? '수정' : '등록' }}
                        </v-btn>
                        <v-btn color="secondary" @click="resetForm">초기화</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- 등록된 기준정보 목록 -->
            <v-col cols="12" md="6">
                <v-card elevation="10">
                    <v-card-title>세척 기준정보 목록</v-card-title>
                    <v-card-text>
                        <v-data-table :headers="headers" :items="cleanStdList" item-key="clean_std_id" dense @click:row="editRow" />
                        <p v-if="!cleanStdList.length" class="text-grey">등록된 기준정보가 없습니다.</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- 설비 선택 모달 -->
        <ModalSearch
            :visible="facilityModal"
            title="설비명"
            idField="facility_id"
            :columns="[
                { key: 'facility_id', label: 'ID' },
                { key: 'facility_name', label: '설비명' }
            ]"
            :fetchData="fetchFacilities"
            @select="onSelectFacility"
            @close="facilityModal = false"
        />

        <!-- 항목 선택 모달 -->
        <ModalSearch
            :visible="itemModal"
            title="세척 항목명"
            idField="item_id"
            :columns="[
                { key: 'item_id', label: 'ID' },
                { key: 'item_name', label: '항목명' }
            ]"
            :fetchData="fetchItems"
            @select="onSelectItem"
            @close="itemModal = false"
        />

        <!-- 단위 선택 모달 -->
        <ModalSearch
            :visible="unitModal"
            title="단위"
            idField="unit_id"
            :columns="[
                { key: 'unit_id', label: 'ID' },
                { key: 'unit_name', label: '단위' }
            ]"
            :fetchData="fetchUnits"
            @select="onSelectUnit"
            @close="unitModal = false"
        />

        <!-- Snackbar -->
        <v-snackbar v-model="snackOpen" :color="snackColor" timeout="2000">
            {{ snackMessage }}
        </v-snackbar>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import ModalSearch from '@/views/commons/CommonModal.vue';
import { useSnackBar } from '@/composables/useSnackBar';

const { snackOpen, snackMessage, snackColor } = useSnackBar();
function showSnack(msg, color = 'success') {
    snackMessage.value = msg;
    snackColor.value = color;
    snackOpen.value = true;
}

const saving = ref(false);

const facilityModal = ref(false);
const itemModal = ref(false);
const unitModal = ref(false);

const facilityId = ref('');
const facilityName = ref('');

const form = ref({
    clean_std_id: '',
    clean_item_id: '',
    clean_item_name: '',
    std_val: '',
    unit_id: '',
    unit_name: '',
    cycle: '',
    use_yn: 'Y'
});

const cleanStdList = ref([]);

const headers = [
    { text: '항목명', value: 'clean_item_name' },
    { text: '기준값', value: 'std_val' },
    { text: '단위', value: 'unit_name' },
    { text: '주기', value: 'cycle' },
    { text: '사용여부', value: 'use_yn' }
];

// fetch data
const fetchFacilities = async () => (await axios.get('/api/facilities')).data;
const fetchItems = async () => (await axios.get('/api/cleanItems')).data;
const fetchUnits = async () => (await axios.get('/api/units')).data;

// 선택
function onSelectFacility(row) {
    facilityId.value = row.facility_id;
    facilityName.value = row.facility_name;
    facilityModal.value = false;
    loadStdList();
}
function onSelectItem(row) {
    form.value.clean_item_id = row.item_id;
    form.value.clean_item_name = row.item_name;
    itemModal.value = false;
}
function onSelectUnit(row) {
    form.value.unit_id = row.unit_id;
    form.value.unit_name = row.unit_name;
    unitModal.value = false;
}

// 리스트 조회
async function loadStdList() {
    if (!facilityId.value) return;
    const res = await axios.get(`/api/cleanStd/${facilityId.value}`);
    cleanStdList.value = res.data;
}

// 초기화
function resetForm() {
    form.value = {
        clean_std_id: '',
        clean_item_id: '',
        clean_item_name: '',
        std_val: '',
        unit_id: '',
        unit_name: '',
        cycle: '',
        use_yn: 'Y'
    };
}

// 행 클릭 → 수정 모드 진입
function editRow(row) {
    form.value = { ...row }; // 기존 데이터 바인딩
}

// 등록/수정
async function saveStd() {
    if (!facilityId.value || !form.value.clean_item_id) {
        showSnack('필수값을 입력하세요', 'error');
        return;
    }

    try {
        saving.value = true;
        if (form.value.clean_std_id) {
            // 수정 모드
            await axios.put('/api/cleanStdUpdate', {
                facility_id: facilityId.value,
                ...form.value
            });
            showSnack('세척 기준정보가 수정되었습니다');
        } else {
            // 등록 모드
            await axios.post('/api/cleanStdInsert', {
                facility_id: facilityId.value,
                ...form.value
            });
            showSnack('세척 기준정보가 등록되었습니다');
        }
        resetForm();
        loadStdList();
    } catch (err) {
        console.error(err);
        showSnack('저장 실패', 'error');
    } finally {
        saving.value = false;
    }
}
</script>

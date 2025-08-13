<template>
    <h1>불량항목 관리</h1>
    <v-card elevation="10" class="mb-6">
        <v-card-title class="px-6 pt-6">불량검색 조건</v-card-title>
        <v-divider />
        <v-card-item class="py-6 px-6">
            <v-form v-model="valid">
                <v-container>
                    <v-row>
                        <v-col cols="12" md="5">
                            <h3>불량명</h3>
                            <v-text-field
                                v-model="qName"
                                readonly
                                placeholder="불량명을 선택하세요"
                                append-inner-icon="mdi-magnify"
                                @click="openNamePicker"
                            />
                        </v-col>
                        <v-col cols="12" md="5">
                            <h3>불량코드</h3>
                            <v-text-field v-model="qCode" readonly placeholder="자동입력" />
                        </v-col>
                    </v-row>
                    <v-row class="mt-4">
                        <v-col cols="12" class="d-flex justify-end">
                            <v-btn color="primary" variant="flat" @click="onSearch">조회</v-btn>
                            <v-btn color="secondary" variant="flat" class="ml-2" @click="onReset">초기화</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-card-item>
    </v-card>
    <v-card elevation="10">
        <v-card-title class="px-6 pt-6">불량항목</v-card-title>
        <v-divider />
        <v-card-item class="px-0 pb-0">
            <div style="max-height: 520px; overflow: auto; padding: 0 24px 24px">
                <DataTable :value="viewRows" tableStyle="font-size:0.85rem;">
                    <Column field="BADN_CODE" header="불량코드" />
                    <Column field="BADN_NAME" header="불량명" />
                    <Column field="BADN_RESN" header="불량사유" />
                    <Column field="REGIST_DE" header="등록일시">
                        <template #body="{ data }">
                            {{ data.REGIST_DE ? dayjs(data.REGIST_DE).format('YYYY-MM-DD') : '' }}
                        </template>
                    </Column>
                    <Column field="UON" header="사용여부" />
                </DataTable>
                <div style="display: flex; justify-content: flex-end; margin-top: 12px; gap: 8px">
                    <v-btn color="primary" variant="flat" @click="onInsert">등록</v-btn>
                    <v-btn color="primary" variant="flat" @click="onModify">수정</v-btn>
                </div>
            </div>
        </v-card-item>
    </v-card>

    <v-dialog v-model="itemTypeModal" max-width="600">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">불량등록</span>
                <v-btn icon @click="itemTypeModal = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-form v-model="formValid">
                    <v-text-field v-model="form.BADN_NAME" label="불량명" variant="outlined" clearable required />
                    <v-text-field v-model="form.BADN_RESN" label="불량사유" variant="outlined" clearable required />
                    <div class="mt-4"></div>
                    <div class="mt-4">
                        <span class="font-weight-medium">사용여부</span>
                        <v-radio-group v-model="form.UON" inline>
                            <v-radio label="사용" value="사용" />
                            <v-radio label="미사용" value="미사용" />
                        </v-radio-group>
                    </div>
                </v-form>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn text @click="itemTypeModal = false">취소</v-btn>
                <v-btn color="primary" @click="saveItem">저장</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="namePickerOpen" max-width="900">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">불량명 선택</span>
                <v-btn icon @click="namePickerOpen = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="nameSearch" label="검색" append-inner-icon="mdi-magnify" clearable variant="outlined" class="mb-4" />
                <DataTable :value="namePickerFiltered" scrollHeight="420px" tableStyle="font-size:0.85rem;">
                    <Column field="BADN_CODE" header="불량코드" />
                    <Column field="BADN_NAME" header="불량명" />
                    <Column field="UON" header="사용여부" />
                    <Column header="선택">
                        <template #body="slotProps">
                            <v-btn size="small" color="primary" @click="selectName(slotProps.data)">선택</v-btn>
                        </template>
                    </Column>
                </DataTable>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs';

const valid = ref(true);
const products = ref([]);
const viewRows = ref([]);
const loading = ref(false);
const error = ref('');
const itemTypeModal = ref(false);
const qName = ref('');
const qCode = ref('');
const qMethod = ref('all');
const formValid = ref(false);
const form = ref({
    BADN_NAME: '',
    BADN_RESN: '',
    INSP_MTHD: '',
    UON: ''
});
// 이름 선택 모달
const namePickerOpen = ref(false);
const nameSearch = ref('');
const namePickerFiltered = computed(() => {
    const kw = (nameSearch.value || '').toString().trim().toLowerCase();
    if (!kw) return products.value;
    return products.value.filter((r) =>
        [r.BADN_NAME, r.BADN_RESN, r.BADN_CODE, r.INSP_MTHD, r.UON].some((v) => (v || '').toString().toLowerCase().includes(kw))
    );
});
function openNamePicker() {
    nameSearch.value = '';
    namePickerOpen.value = true;
}
function selectName(item) {
    qName.value = item?.BADN_NAME || '';
    qCode.value = item?.BADN_CODE || '';
    namePickerOpen.value = false;
}
function onSearch() {
    const codeSel = qCode.value;
    const methodSel = qMethod.value;
    viewRows.value = products.value.filter((r) => {
        const byCode = r.BADN_CODE == codeSel;
        const byMethod = methodSel == 'all' || r.INSP_MTHD === methodSel;
        return byCode && byMethod;
    });
}
// 초기화
function onReset() {
    qName.value = '';
    qCode.value = '';
    qMethod.value = 'all';
    viewRows.value = [...products.value];
}
// 조회
async function fetchData() {
    loading.value = true;
    try {
        const res = await axios.get('/api/badncode');
        const data = Array.isArray(res.data) ? res.data : [];
        products.value = data;
        viewRows.value = [...data];
    } catch (e) {
        console.error('[BADN 조회 실패]', e?.response?.data || e?.message);
        error.value = e?.response?.data?.message || e?.message || '조회 실패';
    } finally {
        loading.value = false;
    }
}
// 등록 버튼
function onInsert() {
    itemTypeModal.value = true;
}
// 수정 버튼
function onModify() {
    itemTypeModal.value = true;
}

// 저장
async function saveItem() {
    if (!formValid.value) {
        alert('필수 항목을 입력하세요.');
        return;
    }
    try {
        await axios.post('/api/badncode', form.value);
        itemTypeModal.value = false;
        form.value = { BADN_NAME: '', BADN_RESN: '', INSP_MTHD: '', UON: '' };
        await fetchData();
    } catch (err) {
        console.error('[BADN 저장 실패]', err);
        alert('저장 실패: ' + (err.response?.data?.message || err.message));
    }
}

onMounted(fetchData);
</script>

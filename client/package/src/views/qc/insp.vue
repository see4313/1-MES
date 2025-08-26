<template>
    <!-- 🔍 검색 카드 (item 폼 구조 적용) -->
    <v-card elevation="10" class="mb-3">
        <v-card-item class="py-6 px-6">
            <CardHeader
                title="검색 조건"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="warning"
                @btn-click1="onClickSearchReset"
                btn-text2="조회"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2="onClickSearch"
            />

            <v-row>
                <v-col cols="12" md="12">
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="3">
                            <v-text-field label="검사명" v-model="qName" variant="outlined" readonly placeholder="검사명을 선택하세요">
                                <template #append-inner>
                                    <v-icon @click="openNamePicker" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <div class="pt-1">
                                <div class="mb-2 text-subtitle-2">검사유형</div>
                                <v-radio-group v-model="qType" inline>
                                    <v-radio label="CCP" value="CCP" class="mr-8" />
                                    <v-radio label="일반검사" value="일반검사" class="mr-6" />
                                </v-radio-group>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <div class="pt-1">
                                <div class="mb-2 text-subtitle-2">검사방식</div>
                                <v-radio-group v-model="qMethod" inline>
                                    <v-radio label="전체" value="all" class="mr-8" />
                                    <v-radio label="전수검사" value="전수검사" class="mr-8" />
                                    <v-radio label="샘플링검사" value="샘플링검사" class="mr-6" />
                                </v-radio-group>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <div class="pt-1">
                                <div class="mb-2 text-subtitle-2">사용여부</div>
                                <v-radio-group v-model="qUseYn" inline>
                                    <v-radio label="전체" value="all" class="mr-8" />
                                    <v-radio label="사용" value="Y" class="mr-8" />
                                    <v-radio label="미사용" value="N" class="mr-6" />
                                </v-radio-group>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 📋 목록 카드 -->
    <v-card elevation="10" class="mb-3">
        <v-card-item class="py-6 px-6">
            <CardHeaderBase title="검사항목 목록" />

            <v-row>
                <v-col cols="12">
                    <div class="card">
                        <DataTable
                            v-model:selection="selectedRow"
                            :value="viewRows"
                            selectionMode="single"
                            :metaKeySelection="false"
                            dataKey="INSP_ID"
                            paginator
                            :rows="10"
                            rowHover
                            tableStyle="min-width: 60rem"
                            class="cursor-pointer"
                        >
                            <Column field="INSP_ID" header="검사코드" sortable />
                            <Column field="INSP_NM" header="검사명" />
                            <Column field="INSP_MTHD" header="검사방식" />
                            <Column field="INSP_TYP" header="검사유형" />
                            <Column field="BASI_VAL" header="기준값" />
                            <Column field="UNIT" header="단위" />
                            <Column field="UON" header="사용" />
                            <Column field="PRCS_FG" header="공정구분" />
                            <Column field="REMK" header="비고" />
                            <Column field="REGIST_DATE" header="등록일">
                                <template #body="{ data }">
                                    {{ data.REGIST_DATE ? dayjs(data.REGIST_DATE).format('YYYY-MM-DD') : '' }}
                                </template>
                            </Column>
                            <Column field="MODI_DATE" header="수정일">
                                <template #body="{ data }">
                                    {{ data.MODI_DATE ? dayjs(data.MODI_DATE).format('YYYY-MM-DD') : '' }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                    <div v-if="loading" class="mt-2" style="color: #666">불러오는 중…</div>
                    <div v-else-if="error" class="mt-2" style="color: red">에러: {{ error }}</div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- ✏️ 상세 카드 (저장/삭제/초기화 버튼 포함) -->
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader3
                title="검사항목 관리"
                btn-text1="초기화"
                btn-variant1="flat"
                btn-color1="secondary"
                @btn-click1="onFormReset"
                btn-text2="삭제"
                btn-variant2="flat"
                btn-color2="error"
                :btn-disabled2="!fId"
                @btn-click2="onDelete"
                btn-text3="저장"
                btn-variant3="flat"
                btn-color3="primary"
                :btn-disabled3="!canSave"
                @btn-click3="onSave"
            />

            <v-row>
                <v-col cols="12" md="8">
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="4">
                            <v-text-field label="검사코드" v-model="fId" variant="outlined" readonly />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="검사명" v-model="fName" variant="outlined" />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="공정구분" v-model="fProcessFg" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="processDialog = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="4">
                            <div class="pt-1">
                                <div class="mb-2 text-subtitle-2">검사유형</div>
                                <v-radio-group v-model="fType" inline>
                                    <v-radio label="CCP" value="CCP" class="mr-8" />
                                    <v-radio label="일반검사" value="일반검사" />
                                </v-radio-group>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <div class="pt-1">
                                <div class="mb-2 text-subtitle-2">검사방식</div>
                                <v-radio-group v-model="fMethod" inline>
                                    <v-radio label="전수검사" value="전수검사" class="mr-8" />
                                    <v-radio label="샘플링검사" value="샘플링검사" />
                                </v-radio-group>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <div class="pt-1">
                                <div class="mb-2 text-subtitle-2">사용여부</div>
                                <v-radio-group v-model="fUseYn" inline>
                                    <v-radio label="사용" value="Y" class="mr-8" />
                                    <v-radio label="미사용" value="N" />
                                </v-radio-group>
                            </div>
                        </v-col>
                    </v-row>

                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="4">
                            <v-text-field label="단위" v-model="fUnit" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="unitDialog = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="기준값" v-model="fBaseVal" variant="outlined" />
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="비고(간략)" v-model="fRemk" variant="outlined" />
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" md="4">
                    <v-textarea label="비고" v-model="fRemk" outlined rows="8" />
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <!-- 🔎 검사명 선택 모달 (검색용) -->
    <v-dialog v-model="nameDialog" max-width="900">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">검사명 선택</span>
                <v-btn icon @click="closeNamePicker"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="search" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-4" />
                <DataTable :value="namePickerFiltered" scrollHeight="420px" tableStyle="font-size:0.85rem;">
                    <Column field="INSP_ID" header="검사코드" />
                    <Column field="INSP_NM" header="검사명" />
                    <Column field="INSP_MTHD" header="검사방식" />
                    <Column field="INSP_TYP" header="검사유형" />
                    <Column field="UNIT" header="단위" />
                    <Column header="선택">
                        <template #body="{ data }">
                            <v-btn size="small" color="primary" @click="selectName(data)">선택</v-btn>
                        </template>
                    </Column>
                </DataTable>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- 📏 단위 선택 모달 -->
    <v-dialog v-model="unitDialog" max-width="520">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">단위 선택</span>
                <v-btn icon @click="unitDialog = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="unitSearch" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-4" />
                <v-list lines="one">
                    <v-list-item v-for="u in unitFiltered" :key="u" @click="pickUnit(u)">{{ u }}</v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- ⚙️ 공정 선택 모달 -->
    <v-dialog v-model="processDialog" max-width="520">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">공정 선택</span>
                <v-btn icon @click="processDialog = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="processSearch"
                    label="검색"
                    append-inner-icon="mdi-magnify"
                    variant="outlined"
                    clearable
                    class="mb-4"
                />
                <v-list lines="one">
                    <v-list-item v-for="p in processFiltered" :key="p" @click="pickProcess(p)">{{ p }}</v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import CardHeader from '@/components/production/card-header-btn2k.vue';
import CardHeaderBase from '@/components/production/card-header.vue';
import CardHeader3 from '@/components/production/card-header-btn3k.vue';

const products = ref([]); // 원본
const viewRows = ref([]); // 화면 표시용
const selectedRow = ref(null); // 테이블 선택
const loading = ref(false);
const error = ref('');
// 검색 조건
const qName = ref('');
const qType = ref('');
const qMethod = ref('all');
const qUseYn = ref('all');
// 검색 모달 상태
const nameDialog = ref(false);
const search = ref('');
const namePickerFiltered = computed(() => {
    const kw = (search.value || '').toString().trim().toLowerCase();
    if (!kw) return products.value;
    return products.value.filter((r) =>
        [r.INSP_NM, r.INSP_ID, r.INSP_MTHD, r.INSP_TYP, r.UNIT].some((v) => (v || '').toString().toLowerCase().includes(kw))
    );
});
// 단위
const unitDialog = ref(false);
const unitSearch = ref('');
const unitOptions = ref(['%', '℃', '℉', 'g', 'mg', 'kg', 'cm', 'mm', 'mL', 'L', 'CFU/g']);
//
const fId = ref('');
const fName = ref('');
const fType = ref(''); // CCP / 일반검사
const fMethod = ref(''); // 전수검사 / 샘플링검사
const fBaseVal = ref('');
const fUnit = ref('');
const fUseYn = ref('Y'); // UON
const fProcessFg = ref(''); // 공정구분
const fRemk = ref('');
const canSave = computed(() => !!(fName.value && fType.value && fMethod.value && fUnit.value && fUseYn.value));
// btn 버ㅓㅓㅓㅓㅓㅓ튼
const onClickSearch = () => onSearch();
const onClickSearchReset = () => onReset();
// 공정정보이긴한데 뺄꺼빼야할수도 ㅇㅇ
const processDialog = ref(false);
const processSearch = ref('');
const processOptions = ref(['입고', '혼합', '반죽', '성형', '발효', '급속냉동', '포장', '출고']);

function openNamePicker() {
    search.value = '';
    nameDialog.value = true;
}
function closeNamePicker() {
    nameDialog.value = false;
    search.value = '';
}
function selectName(item) {
    qName.value = item?.INSP_NM || '';
    qType.value = item?.INSP_TYP || '';
    qMethod.value = item?.INSP_MTHD || 'all';
    nameDialog.value = false;
}

// 조회
async function fetchData() {
    loading.value = true;
    try {
        const { data } = await axios.get('/api/inspitem');
        products.value = Array.isArray(data) ? data : [];
        viewRows.value = [...products.value];
    } catch (e) {
        error.value = e?.message || '조회 실패';
    } finally {
        loading.value = false;
    }
}

const applyFilter = (rows) =>
    rows.filter((r) => {
        const matchName = !qName.value || String(r.INSP_NM || '').includes(qName.value);
        const matchType = !qType.value || String(r.INSP_TYP) === String(qType.value);
        const matchMethod = qMethod.value === 'all' || String(r.INSP_MTHD) === String(qMethod.value);
        const matchUse = qUseYn.value === 'all' || String(r.UON) === String(qUseYn.value);
        return matchName && matchType && matchMethod && matchUse;
    });

function onSearch() {
    viewRows.value = applyFilter(products.value);
}
function onReset() {
    qName.value = '';
    qType.value = '';
    qMethod.value = 'all';
    qUseYn.value = 'all';
    viewRows.value = [...products.value];
}
function onFormReset() {
    selectedRow.value = null;
    fId.value = '';
    fName.value = '';
    fType.value = '';
    fMethod.value = '';
    fBaseVal.value = '';
    fUnit.value = '';
    fUseYn.value = 'Y';
    fProcessFg.value = '';
    fRemk.value = '';
}
// 테이블 선택 -> 상세 맵핑
watch(selectedRow, (row) => {
    if (!row) {
        onFormReset();
        return;
    }
    fId.value = row.INSP_ID || '';
    fName.value = row.INSP_NM || '';
    fType.value = row.INSP_TYP || '';
    fMethod.value = row.INSP_MTHD || '';
    fBaseVal.value = row.BASI_VAL || '';
    fUnit.value = row.UNIT || '';
    fUseYn.value = row.UON || 'Y';
    fProcessFg.value = row.PRCS_FG || '';
    fRemk.value = row.REMK || '';
});
// 저장
async function onSave() {
    try {
        const basePayload = {
            INSP_NM: fName.value,
            INSP_MTHD: fMethod.value,
            INSP_TYP: fType.value,
            BASI_VAL: fBaseVal.value,
            UNIT: fUnit.value,
            UON: fUseYn.value,
            PRCS_FG: fProcessFg.value,
            REMK: fRemk.value
        };

        if (fId.value) {
            await axios.put(`/api/inspitem/${encodeURIComponent(fId.value)}`, basePayload);
        } else {
            const { data } = await axios.post('/api/inspitem', basePayload);
            if (data?.INSP_ID) fId.value = data.INSP_ID;
        }
        await fetchData();
        if (fId.value) {
            const found = viewRows.value.find((r) => r.INSP_ID === fId.value);
            if (found) selectedRow.value = found;
        }
        alert('저장되었습니다.');
    } catch (e) {
        console.error(e);
        alert('저장 실패: ' + (e?.response?.data?.message || e.message));
    }
}
// 삭제
async function onDelete() {
    if (!fId.value) return;
    if (!confirm('해당 검사항목을 삭제하시겠습니까?')) return;
    try {
        await axios.delete(`/api/inspitem/${encodeURIComponent(fId.value)}`);
        await fetchData();
        onFormReset();
        alert('삭제되었습니다.');
    } catch (e) {
        console.error(e);
        alert('삭제 실패: ' + (e?.response?.data?.message || e.message));
    }
}
const unitFiltered = computed(() => {
    const kw = unitSearch.value?.toLowerCase() || '';
    return unitOptions.value.filter((u) => u.toLowerCase().includes(kw));
});
function pickUnit(u) {
    fUnit.value = u;
    unitDialog.value = false;
}
const processFiltered = computed(() => {
    const kw = processSearch.value?.toLowerCase() || '';
    return processOptions.value.filter((p) => p.toLowerCase().includes(kw));
});
function pickProcess(p) {
    fProcessFg.value = p;
    processDialog.value = false;
}

onMounted(fetchData);
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>

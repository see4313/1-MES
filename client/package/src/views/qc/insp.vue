<template>
    <h1>검사항목 관리</h1>

    <!-- 🔷 검색 영역 카드 -->
    <v-card elevation="10" class="mb-6">
        <v-card-title class="px-6 pt-6">검색 조건</v-card-title>
        <v-divider />
        <v-card-item class="py-6 px-6">
            <v-form v-model="valid">
                <v-container>
                    <v-row>
                        <v-col cols="12" md="3">
                            <h3>검사명</h3>
                            <!-- 클릭 시 선택 모달 오픈 -->
                            <v-text-field
                                v-model="qName"
                                readonly
                                placeholder="검사명을 선택하세요"
                                append-inner-icon="mdi-magnify"
                                @click="openNamePicker"
                            />
                        </v-col>

                        <v-col cols="12" md="3">
                            <h3>검사유형</h3>
                            <v-radio-group v-model="qType" inline>
                                <v-radio label="CCP" value="CCP" class="mr-8" />
                                <v-radio label="일반검사" value="일반검사" class="mr-6" />
                            </v-radio-group>
                        </v-col>

                        <v-col cols="12" md="6">
                            <h3>검사방식</h3>
                            <div style="display: flex; align-items: center; gap: 16px">
                                <v-radio-group v-model="qMethod" inline>
                                    <v-radio label="전체" value="all" class="mr-8" />
                                    <v-radio label="전수검사" value="전수검사" class="mr-8" />
                                    <v-radio label="샘플링검사" value="샘플링검사" class="mr-6" />
                                </v-radio-group>

                                <v-btn :text="'조회'" variant="flat" color="primary" @click="onSearch">조회</v-btn>
                                <v-btn :text="'초기화'" variant="flat" color="secondary" @click="onReset"> 초기화 </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-card-item>
    </v-card>

    <!-- 🔶 데이터 영역 카드 -->
    <v-card elevation="10">
        <v-card-title class="px-6 pt-6">검사항목 목록</v-card-title>
        <v-divider />
        <v-card-item class="px-0 pb-0">
            <div style="max-height: 520px; overflow: auto; padding: 0 24px 24px">
                <DataTable :value="viewRows" tableStyle="font-size:0.85rem;">
                    <Column field="INSP_ID" header="검사코드" />
                    <Column field="INSP_NM" header="검사명" />
                    <Column field="INSP_MTHD" header="검사방식" />
                    <Column field="INSP_TYP" header="검사유형" />
                    <Column field="BASI_VAL" header="기준값" />
                    <Column field="UNIT" header="단위" />
                    <Column field="UON" header="사용" />
                    <Column field="PRCS_FG" header="공정구분" />
                    <Column field="REMK" header="비고" />
                    <Column field="REGIST_DATE" header="등록일" />
                    <Column field="MODI_DATE" header="수정일" />
                </DataTable>
                <div style="display: flex; justify-content: flex-end; margin-top: 12px; gap: 8px">
                    <v-btn color="primary" variant="flat" @click="onInsert">등록</v-btn>
                </div>
                <div v-if="loading" style="margin-top: 8px; color: #666">불러오는 중…</div>
                <div v-else-if="error" style="margin-top: 8px; color: red">에러: {{ error }}</div>
            </div>
        </v-card-item>
    </v-card>

    <!-- 🧩 검사명 선택 모달 -->
    <v-dialog v-model="dialog" max-width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">검사명 선택</span>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-text-field v-model="search" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-4" />

                <v-data-table :headers="modalHeaders" :items="filteredData" :search="search" :items-per-page="10" class="elevation-1">
                    <template #item.action="{ item }">
                        <v-btn color="primary" size="small" @click="selectName(item)">선택</v-btn>
                    </template>
                </v-data-table>
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

const qName = ref('');
const qType = ref('');
const qMethod = ref('all');

function toDateStr(v) {
    if (v) return dayjs(v).format('YYYY-MM-DD');
    else return null;
}

function mapRow(r) {
    return {
        INSP_ID: r.INSP_ID,
        INSP_NM: r.INSP_NM,
        INSP_MTHD: r.INSP_MTHD,
        INSP_TYP: r.INSP_TYP,
        BASI_VAL: r.BASI_VAL,
        UNIT: r.UNIT,
        UON: r.UON, // 서버 컬럼명에 맞게 유지
        PRCS_FG: r.PRCS_FG,
        REMK: r.REMK,
        REGIST_DATE: toDateStr(r.REGIST_DATE),
        MODI_DATE: toDateStr(r.MODI_DATE)
    };
}

/* ====== 조회 ====== */
/* 공백/대소문자/별칭 아무것도 건드리지 않고 “입력 그대로” 비교 */
function onSearch() {
    const nameSel = qName.value ?? '';
    const typeSel = qType.value ?? '';
    const methodSel = qMethod.value ?? 'all';

    viewRows.value = products.value.filter((r) => {
        // 검사명: 부분 포함(raw)
        let byName;
        if (!nameSel) byName = true;
        else {
            const nm = r.INSP_NM != null ? String(r.INSP_NM) : '';
            byName = nm.includes(nameSel);
        }

        // 검사유형: 완전 동일(raw)
        let byType;
        if (!typeSel) byType = true;
        else byType = String(r.INSP_TYP) === String(typeSel);

        // 검사방식: 'all'이면 통과, 아니면 완전 동일(raw)
        let byMethod;
        if (methodSel === 'all') byMethod = true;
        else byMethod = String(r.INSP_MTHD) === String(methodSel);

        return byName && byType && byMethod;
    });
}

function onReset() {
    qName.value = '';
    qType.value = '';
    qMethod.value = 'all';
    viewRows.value = [...products.value];
}

async function fetchData() {
    loading.value = true;
    try {
        const res = await axios.get('/api/inspitem');
        const data = res && res.data ? res.data : null;

        let arr = [];
        if (Array.isArray(data)) arr = data.map(mapRow);
        else arr = [];

        products.value = arr;
        viewRows.value = [...arr];
    } catch (e) {
        error.value = e && e.message ? e.message : '조회 실패';
    } finally {
        loading.value = false;
    }
}

/* ====== 검사명 선택 모달 ====== */
const dialog = ref(false);
const search = ref('');
const modalRows = ref([]);

const modalHeaders = [
    { title: '검사코드', value: 'INSP_ID', sortable: true },
    { title: '검사명', value: 'INSP_NM', sortable: true },
    { title: '검사방식', value: 'INSP_MTHD', sortable: true },
    { title: '검사유형', value: 'INSP_TYP', sortable: true },
    { title: '단위', value: 'UNIT', sortable: true },
    { title: '선택', value: 'action', sortable: false }
];

function openNamePicker() {
    // 현재 화면의 필터 결과가 있으면 그걸 기준, 아니면 전체
    let base = viewRows.value && viewRows.value.length > 0 ? viewRows.value : products.value;

    const nameSel = qName.value ?? '';
    if (!nameSel) modalRows.value = [...base];
    else {
        modalRows.value = base.filter((r) => {
            const nm = r.INSP_NM != null ? String(r.INSP_NM) : '';
            return nm.includes(nameSel); // raw includes
        });
    }

    search.value = '';
    dialog.value = true;
}

const filteredData = computed(() => modalRows.value);

function selectName(item) {
    if (item && item.INSP_NM != null) qName.value = String(item.INSP_NM);
    if (item && item.INSP_TYP != null) qType.value = String(item.INSP_TYP);
    if (item && item.INSP_MTHD != null) qMethod.value = String(item.INSP_MTHD);
    closeDialog();
}

function closeDialog() {
    dialog.value = false;
    search.value = '';
}

onMounted(fetchData);
</script>

<template>
    <h1>불량항목 관리</h1>
    <v-card elevation="10" class="mb-6">
        <v-card-title class="px-6 pt-6">불량검색 조건</v-card-title>
        <v-divider />
        <v-card-item class="py-6 px-6">
            <v-form v-model="valid">
                <v-container>
                    <v-row>
                        <v-col cols="12" md="3">
                            <h3>불량명</h3>
                            <v-text-field
                                v-model="qName"
                                readonly
                                placeholder="검사명을 선택하세요"
                                append-inner-icon="mdi-magnify"
                                @click="openNamePicker"
                            />
                        </v-col>
                        <v-col cols="12" md="3"></v-col>
                        <v-col cols="12" md="6">
                            <h3>검사방식</h3>
                            <div style="display: flex; align-items: center; gap: 16px">
                                <v-radio-group v-model="qMethod" inline>
                                    <v-radio label="전체" value="all" class="mr-8" />
                                    <v-radio label="전수검사" value="전수검사" class="mr-8" />
                                    <v-radio label="샘플링검사" value="샘플링검사" class="mr-6" />
                                </v-radio-group>

                                <v-btn color="primary" variant="flat" @click="onSearch">조회</v-btn>
                                <v-btn color="secondary" variant="flat" @click="onReset">초기화</v-btn>
                            </div>
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
                    <Column field="INSP_MTHD" header="검사방식" />
                    <Column field="REGIST_DE" header="등록일시" />
                    <Column field="UON" header="사용여부" />
                    <Column field="PRCS_NUMBER" header="공정번호" />
                </DataTable>

                <div style="display: flex; justify-content: flex-end; margin-top: 12px; gap: 8px">
                    <v-btn color="primary" variant="flat" @click="onInsert">등록</v-btn>
                </div>

                <div v-if="loading" style="margin-top: 8px; color: #666">불러오는 중…</div>
                <div v-else-if="error" style="margin-top: 8px; color: red">에러: {{ error }}</div>
            </div>
        </v-card-item>
    </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
const qMethod = ref('all');

// 날짜 포맷
function toDateStr(v) {
    if (v) return dayjs(v).format('YYYY-MM-DD');
    return null;
}

function mapRow(r) {
    const BADN_CODE = r.BADN_CODE ?? r.badn_code;
    const BADN_NAME = r.BADN_NAME ?? r.badn_name;
    const BADN_RESN = r.BADN_RESN ?? r.badn_resn;
    const INSP_MTHD = r.INSP_MTHD ?? r.insp_mthd;
    const REGIST_DE_RAW = r.REGIST_DE ?? r.regist_de;
    const UON = r.UON ?? r.uon;
    const PRCS_NUMBER = r.PRCS_NUMBER ?? r.prcs_number;

    return {
        BADN_CODE,
        BADN_NAME,
        BADN_RESN,
        INSP_MTHD,
        REGIST_DE: toDateStr(REGIST_DE_RAW),
        UON,
        PRCS_NUMBER
    };
}

function norm(v) {
    let s = v == null ? '' : String(v);
    s = s.toLowerCase().replace(/\s+/g, '').trim();
    return s;
}

function onSearch() {
    let nameSel = '';
    if (qName.value && typeof qName.value.trim === 'function') {
        nameSel = qName.value.trim();
    }
    const methodSel = qMethod.value;

    viewRows.value = products.value.filter((r) => {
        // 이름 필터
        let byName;
        if (!nameSel) {
            byName = true;
        } else {
            const nm = r.BADN_NAME ? String(r.BADN_NAME) : '';
            byName = nm.includes(nameSel);
        }

        // 방식 필터
        let byMethod;
        if (methodSel === 'all') {
            byMethod = true;
        } else {
            byMethod = norm(r.INSP_MTHD) === norm(methodSel);
        }

        return byName && byMethod;
    });
}

function onReset() {
    qName.value = '';
    qMethod.value = 'all';
    viewRows.value = [...products.value];
}

async function fetchData() {
    loading.value = true;
    try {
        const res = await axios.get('/api/badncode');
        const data = res && res.data ? res.data : null;

        let arr = [];
        if (Array.isArray(data)) {
            arr = data.map(mapRow);
        } else {
            arr = [];
        }

        products.value = arr;
        viewRows.value = [...arr];
    } catch (e) {
        let msg = '조회 실패';
        if (e && e.message) msg = e.message;
        error.value = msg;
    } finally {
        loading.value = false;
    }
}

onMounted(fetchData);
</script>

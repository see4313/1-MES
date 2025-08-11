<template>
    <h1>검사항목 관리</h1>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-col cols="12" md="3">
                    <h3>검사명</h3>
                    <v-text-field v-model="qName" />
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

                        <!-- 조회 / 초기화 버튼 정정 -->
                        <v-btn variant="tonal" color="blue" @click="onSearch">조회</v-btn>
                        <v-btn variant="tonal" color="blue" @click="onReset">초기화</v-btn>
                    </div>
                </v-col>
            </v-row>

            <DataTable :value="viewRows" tableStyle="font-size:0.85rem;">
                <Column field="INSP_ID" header="검사코드" />
                <Column field="INSP_NM" header="검사명" />
                <Column field="INSP_MTHD" header="검사방식" />
                <Column field="INSP_TYP" header="검사유형" />
                <Column field="BASI_VAL" header="기준값" />
                <Column field="UNIT" header="단위" />
                <Column field="USE" header="사용" />
                <Column field="PRCS_FG" header="공정구분" />
                <Column field="REMK" header="비고" />
                <Column field="REGIST_DATE" header="등록일" />
                <Column field="MODI_DATE" header="수정일" />
            </DataTable>

            <div v-if="loading" style="margin-top: 8px; color: #666">불러오는 중…</div>
            <div v-else-if="error" style="margin-top: 8px; color: red">에러: {{ error }}</div>
        </v-container>
    </v-form>
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
const qType = ref('');
const qMethod = ref('all');

function toDateStr(v) {
    if (v) {
        return dayjs(v).format('YYYY-MM-DD');
    } else {
        return null;
    }
}

function mapRow(r) {
    return {
        INSP_ID: r.INSP_ID,
        INSP_NM: r.INSP_NM,
        INSP_MTHD: r.INSP_MTHD,
        INSP_TYP: r.INSP_TYP,
        BASI_VAL: r.BASI_VAL,
        UNIT: r.UNIT,
        USE: r.USE,
        PRCS_FG: r.PRCS_FG,
        REMK: r.REMK,
        REGIST_DATE: toDateStr(r.REGIST_DATE),
        MODI_DATE: toDateStr(r.MODI_DATE)
    };
}

function norm(v) {
    let s;
    if (v === null || v === undefined) {
        s = '';
    } else {
        s = String(v);
    }
    s = s.toLowerCase().replace(/\s+/g, '').trim();
    return s;
}

const METHOD_ALIAS = {
    전수: '전수검사',
    전수검사: '전수검사',
    '전수 검사': '전수검사',
    샘플링: '샘플링검사',
    샘플링검사: '샘플링검사',
    '샘플링 검사': '샘플링검사'
};
function normalizeMethod(v) {
    let key;
    if (v === null || v === undefined) {
        key = '';
    } else {
        key = String(v);
    }

    if (Object.prototype.hasOwnProperty.call(METHOD_ALIAS, key)) {
        return METHOD_ALIAS[key];
    } else {
        return v;
    }
}

function onSearch() {
    let nameSel = '';
    if (qName.value && typeof qName.value.trim === 'function') {
        nameSel = qName.value.trim();
    }

    const typeSel = qType.value;
    const methodSel = qMethod.value;

    viewRows.value = products.value.filter((r) => {
        let byName;
        if (!nameSel) {
            byName = true;
        } else {
            const nm = r.INSP_NM ? String(r.INSP_NM) : '';
            byName = nm.includes(nameSel);
        }

        let byType;
        if (!typeSel) {
            byType = true;
        } else {
            byType = norm(r.INSP_TYP) === norm(typeSel);
        }

        const methodDb = norm(normalizeMethod(r.INSP_MTHD));
        const methodPick = norm(methodSel);
        let byMethod;
        if (methodPick === 'all') {
            byMethod = true;
        } else {
            byMethod = methodDb === methodPick;
        }

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
        if (Array.isArray(data)) {
            arr = data.map(mapRow);
        } else {
            arr = [];
        }

        products.value = arr;
        viewRows.value = [...arr];
    } catch (e) {
        let msg = '조회 실패';
        if (e && e.message) {
            msg = e.message;
        }
        error.value = msg;
    } finally {
        loading.value = false;
    }
}

onMounted(fetchData);
</script>

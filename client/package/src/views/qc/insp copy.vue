<template>
    <h1>검사항목 관리</h1>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-col cols="12" md="3">
                    <h3>검사명</h3>
                    <!-- [핵심] 단순 텍스트 검색 키워드 바인딩 -->
                    <v-text-field v-model="qName" />
                </v-col>

                <v-col cols="12" md="3">
                    <h3>검사유형</h3>
                    <!-- [핵심] 라디오로 단일 값 필터링 (CCP/일반검사) -->
                    <v-radio-group v-model="qType" inline>
                        <v-radio label="CCP" value="CCP" class="mr-8" />
                        <v-radio label="일반검사" value="일반검사" class="mr-6" />
                    </v-radio-group>
                </v-col>

                <v-col cols="12" md="6">
                    <h3>검사방식</h3>
                    <div style="display: flex; align-items: center; gap: 16px">
                        <!-- [핵심] '전체' 포함한 라디오 필터. 데이터 내 표현 다양성은 METHOD_ALIAS로 정규화 -->
                        <v-radio-group v-model="qMethod" inline>
                            <v-radio label="전체" value="all" class="mr-8" />
                            <v-radio label="전수검사" value="전수검사" class="mr-8" />
                            <v-radio label="샘플링검사" value="샘플링검사" class="mr-6" />
                        </v-radio-group>

                        <!-- [핵심] 조회 버튼: 현재 조건으로 클라이언트 측 필터 수행 -->
                        <v-btn variant="tonal" color="blue" @click="onSearch">조회</v-btn>

                        <!-- [핵심] 초기화 버튼: 조건/목록을 원본으로 복구 -->
                        <v-btn variant="tonal" color="blue" @click="onReset">초기화</v-btn>
                    </div>
                </v-col>
            </v-row>

            <!-- [핵심] PrimeVue DataTable: 서버 페이징/정렬이 필요하면 :lazy 로 전환 고려 (TODO) -->
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

            <!-- [UX] 로딩/에러 상태 표시 -->
            <div v-if="loading" style="margin-top: 8px; color: #666">불러오는 중…</div>
            <div v-else-if="error" style="margin-top: 8px; color: red">에러: {{ error }}</div>
        </v-container>
    </v-form>
</template>

<script setup>
/**
 * [파일 개요]
 * - 검사항목 조회 화면 (클라이언트 사이드 필터링)
 * - 데이터 로드는 /api/inspitem 단건 호출로 전체를 캐시하고, 화면에는 viewRows로 표시
 * - 중요 포인트는 주석 [핵심] 으로 표기
 */
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs';

/** [핵심] Vuetify v-form 유효성 상태 */
const valid = ref(true);

/**
 * [핵심] products: 서버에서 받아온 원본 목록 (불변 취급 권장)
 *        viewRows: 화면에 실제로 표시되는 목록 (필터 결과)
 */
const products = ref([]);
const viewRows = ref([]);

/** [핵심] 비동기 상태 관리 */
const loading = ref(false);
const error = ref('');

/** [핵심] 검색 조건 (양방향 바인딩) */
const qName = ref(''); // 검사명
const qType = ref(''); // 검사유형(CCP/일반검사)
const qMethod = ref('all'); // 검사방식(전체/전수검사/샘플링검사)

/** [핵심] 날짜 포맷은 view 용으로만 변환 (원본 보존) */
const toDateStr = (v) => (v ? dayjs(v).format('YYYY-MM-DD') : null);

/**
 * [핵심] 서버 응답 → 테이블 스키마 매핑
 *  - 뷰에 필요한 필드만 선택/변환
 *  - 날짜 문자열화 등 프레젠테이션 전용 로직 분리
 */
const mapRow = (r) => ({
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
});

/**
 * [핵심] 비교를 위한 정규화 함수
 *  - 대소문자/공백 무시
 *  - 다국어/한글 비교는 localeCompare 옵션 고려 가능 (TODO)
 */
const norm = (v) =>
    String(v ?? '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .trim();

/**
 * [핵심] '검사방식' 표기 변형을 흡수하는 alias 테이블
 *  - DB/운영에서 전수/샘플링 표기가 들쑥날쑥할 때 단일 값으로 정규화
 */
const METHOD_ALIAS = {
    전수: '전수검사',
    전수검사: '전수검사',
    '전수 검사': '전수검사',
    샘플링: '샘플링검사',
    샘플링검사: '샘플링검사',
    '샘플링 검사': '샘플링검사'
};
const normalizeMethod = (v) => METHOD_ALIAS[String(v ?? '')] ?? v;

/**
 * [핵심] 조회: 클라이언트 사이드 필터링
 *  - 서버 페이징이 필요하면 조건을 쿼리로 넘겨 서버 필터로 대체 (TODO)
 */
function onSearch() {
    const nameSel = qName.value?.trim() ?? '';
    const typeSel = qType.value;
    const methodSel = qMethod.value;

    viewRows.value = products.value.filter((r) => {
        const byName = !nameSel || String(r.INSP_NM || '').includes(nameSel);
        const byType = !typeSel || norm(r.INSP_TYP) === norm(typeSel);

        const methodDb = norm(normalizeMethod(r.INSP_MTHD));
        const methodPick = norm(methodSel);
        const byMethod = methodPick === 'all' || methodDb === methodPick;

        return byName && byType && byMethod;
    });
}

/**
 * [핵심] 초기화: 조건/리스트 원상 복구
 *  - viewRows는 얕은 복사로 원본 reference를 끊어 의도치 않은 동기화 방지
 */
function onReset() {
    qName.value = '';
    qType.value = '';
    qMethod.value = 'all';
    viewRows.value = [...products.value];
}

/**
 * [핵심] 데이터 로드
 *  - Array.isArray로 방어 코딩
 *  - 오류 메시지는 사용자 친화적으로 변환
 *  - 성능 요구 시: 서버 페이징/검색, debounce(입력 즉시 조회) 고려 (TODO)
 */
async function fetchData() {
    loading.value = true;
    try {
        const { data } = await axios.get('/api/inspitem');

        let arr = [];
        if (Array.isArray(data)) {
            arr = data.map(mapRow); // 배열이면 변환
        } else {
            arr = []; // 배열이 아니면 빈 배열
        }

        products.value = arr;
        viewRows.value = [...arr]; // 초기 전체 표시
    } catch (e) {
        error.value = e?.message || '조회 실패';
    } finally {
        loading.value = false;
    }
}

/** [핵심] 마운트 시 1회 로드 */
onMounted(fetchData);
</script>

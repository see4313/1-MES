<!-- instructionList.vue -->
<script setup>
import { ref, computed, onBeforeMount, watch } from 'vue';
import axios from 'axios';
import CardHeader from '@/components/production/card-header.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ModalSearch from '@/views/commons/CommonModal.vue';
import { useFormatDate } from '@/composables/useFormatDate';

// useFormatDate
const { kstFormatDate } = useFormatDate();

const visibleProductModal = ref(false); // 품목 선택 모달 표시 여부
const queryInstructionNo = ref(''); // 생산 지시 번호 검색
const instructionList = ref([]); // 생산 지시건 조회
const selectedProductList = ref([]); // 선택돤 상품 리스트
const selectedProductType = ref([]); // 선택된 품목 유형
const selectedInstructionStatus = ref(['0']); // 선택된 생산 지시 상태
const expandedRows = ref([]); // row 확장 상태
const detailCache = ref({}); // { [instructNo]: DetailRow[] }
const detailLoading = ref(new Set()); // 로딩 중인 instructNo

onBeforeMount(() => {
    getInstructionList();
});

// 디바운스
let time;
watch(queryInstructionNo, () => {
    clearTimeout(time);
    time = setTimeout(() => {
        getInstructionList();
    }, 300);
});

// 검색 필터링
watch(
    [selectedProductType, selectedInstructionStatus, selectedProductList],
    () => {
        getInstructionList();
    },
    { deep: true }
);

// 지시건 조회
const getInstructionList = async () => {
    try {
        const { data } = await axios.get('/api/prod/instructionlist', {
            params: {
                types: selectedProductType.value,
                status: selectedInstructionStatus.value,
                productIds: selectedProductList.value.map((p) => p.itemId),
                instructionNo: (queryInstructionNo.value || '').trim()
            }
        });

        instructionList.value = data.map((item) => ({
            ...item,
            instructionDatetimeFormatted: kstFormatDate(item.instructDatetime),
            startDatetimeFormatted: kstFormatDate(item.startDatetime),
            goalDatetimeFormatted: kstFormatDate(item.goalDatetime)
        }));
    } catch (e) {
        console.error(e);
        instructionList.value = [];
    }
};

// 상세 지시건 조회
const loadDetails = async (row) => {
    const key = row.instructNo;
    if (detailCache.value[key]) return;
    detailLoading.value.add(key);
    try {
        const { data } = await axios.get('/api/prod/detailinstruction', { params: { instructNo: key } });
        detailCache.value[key] = data;
    } catch (e) {
        console.error(e);
        detailCache.value[key] = [];
    } finally {
        detailLoading.value.delete(key);
    }
};

// 상품 유형
const productType = ref([
    { key: '반제품', value: 'semi' },
    { key: '완제품', value: 'finish' }
]);

// 지시 상태
const instructionStatus = ref([
    { key: '생산 중', value: '0' },
    { key: '생산 완료', value: '1' }
]);

// 지시 상태 뱃지
const statusBadge = computed(() => {
    const map = {};
    for (const { value, key } of instructionStatus.value) {
        map[String(value)] = {
            label: key,
            color: value === '0' ? 'warning' : 'success'
        };
    }
    return map;
});

// 품목 가져오기 중복 체크
const excludeIds = computed(() => selectedProductList.value.map((p) => p.itemId));
const excludeSet = computed(() => new Set(excludeIds.value));

// 품목 가져오기 (모달)
const getProductList = async () => {
    try {
        const { data } = await axios.get(`/api/prod/itemlist/notmaterial`);
        const set = excludeSet.value;
        return (data ?? []).filter((it) => !set.has(it.itemId));
    } catch (e) {
        console.error(e);
        return [];
    }
};

// 품목 추가
const onSelectProduct = (item) => {
    selectedProductList.value.push(item);
};

// 품목 삭제
const removeProduct = (id) => {
    const i = selectedProductList.value.findIndex((product) => product.itemId === id);
    if (i !== -1) selectedProductList.value.splice(i, 1);
};

// 품목 선택 모달 open
const openProductModal = () => {
    visibleProductModal.value = true;
};

const isExpanded = (row) => !!expandedRows.value[String(row.instructNo)];

const toggleRow = (row) => {
    const key = String(row.instructNo);
    const next = { ...expandedRows.value };
    if (next[key]) {
        delete next[key];
    } else {
        next[key] = true;
        loadDetails(row);
    }
    expandedRows.value = next;
};
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <v-container fluid>
                <CardHeader title="생산 지시 조회" />
                <v-row no-gutters>
                    <v-col cols="6" class="px-2 d-flex align-center">
                        <v-text-field label="생산 지시 번호" v-model="queryInstructionNo" variant="outlined" hide-details>
                            <template #append-inner>
                                <v-icon @click="getInstructionList" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="6" class="px-2">
                        <div class="d-flex flex-column">
                            <label class="font-weight-bold text-body-2">품목 유형</label>

                            <v-chip-group v-model="selectedProductType" column multiple selected-class="active">
                                <v-chip
                                    v-for="type in productType"
                                    :key="type.key"
                                    :value="type.value"
                                    variant="outlined"
                                    pill
                                    size="small"
                                >
                                    {{ type.key }}
                                </v-chip>
                            </v-chip-group>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters class="mt-4">
                    <v-col cols="6" class="px-2">
                        <div class="d-flex flex-column">
                            <label class="font-weight-bold text-body-2 mb-1">품목</label>

                            <div class="d-flex flex-wrap align-center gap-1">
                                <v-chip
                                    v-for="product in selectedProductList"
                                    :key="product.itemId"
                                    variant="outlined"
                                    pill
                                    color="primary"
                                    size="small"
                                    closable
                                    close-icon="mdi-close"
                                    close-icon-size="14"
                                    @click:close="removeProduct(product.itemId)"
                                >
                                    <p>
                                        {{ product.itemId }}
                                        <span style="font-weight: bold; margin-left: 2px">{{ product.itemName }}</span>
                                    </p>
                                </v-chip>

                                <v-chip append-icon="mdi-plus-circle" variant="flat" pill size="small" @click="openProductModal">
                                    <span style="font-weight: bold">품목 추가</span>
                                </v-chip>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="6" class="px-2">
                        <div class="d-flex flex-column">
                            <label class="font-weight-bold text-body-2">상태</label>

                            <v-chip-group v-model="selectedInstructionStatus" column multiple selected-class="active">
                                <v-chip
                                    v-for="status in instructionStatus"
                                    :key="status.key"
                                    :value="status.value"
                                    variant="outlined"
                                    pill
                                    size="small"
                                >
                                    {{ status.key }}
                                </v-chip>
                            </v-chip-group>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-4">
        <v-card-item class="py-6 px-6">
            <v-container fluid>
                <DataTable :value="instructionList" paginator :rows="10" dataKey="instructNo" v-model:expandedRows="expandedRows">
                    <Column field="instructNo" sortable header="지시 번호"></Column>
                    <Column field="itemType" sortable header="품목 유형"></Column>
                    <Column header="지시 상태">
                        <template #body="{ data }">
                            <v-chip size="x-small" variant="flat" :color="statusBadge[String(data.status)]?.color || 'grey'" label>
                                {{ statusBadge[String(data.status)]?.label }}
                            </v-chip>
                        </template>
                    </Column>
                    <Column field="instructionDatetimeFormatted" sortable header="지시 일자"></Column>
                    <Column field="startDatetimeFormatted" header="시작 일자"></Column>
                    <Column field="goalDatetimeFormatted" header="목표 생산 일자"></Column>
                    <Column expander header="" style="width: 3rem">
                        <template #body="{ data }">
                            <button class="row-toggler" @click.stop="toggleRow(data)" :aria-expanded="isExpanded(data)">
                                <v-icon size="18">{{ isExpanded(data) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </button>
                        </template>
                    </Column>

                    <template #expansion="{ data }">
                        <div class="px-4 py-3">
                            <div v-if="detailLoading.has(data.instructNo)" class="text-caption" style="color: #888">
                                세부 지시 불러오는 중…
                            </div>

                            <div v-else>
                                <DataTable :value="detailCache[data.instructNo] || []" size="small" responsiveLayout="scroll">
                                    <Column field="detaInstructNo" header="세부 지시 번호" />
                                    <Column field="itemId" header="품목번호" />
                                    <Column field="itemName" header="품목명" />
                                    <Column field="goalQty" header="지시 수량" />
                                    <Column header="상태">
                                        <template #body="{ data: d }">
                                            <v-chip
                                                size="x-small"
                                                variant="flat"
                                                :color="statusBadge[String(d.status)]?.color || 'grey'"
                                                label
                                            >
                                                {{ statusBadge[String(d.status)]?.label }}
                                            </v-chip>
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </div>
                    </template>
                </DataTable>
            </v-container>
        </v-card-item>
    </v-card>

    <!--
    <p>{{ queryInstructionNo }}</p>
    <p>{{ selectedProductType }}</p>
    <p>{{ selectedInstructionStatus }}</p>
    <p>{{ selectedProductList }}</p>
    <p>{{ instructionList }}</p> 
    -->

    <ModalSearch
        :visible="visibleProductModal"
        title="품목 검색"
        idField="itemId"
        :columns="[
            { key: 'itemId', label: '품목 번호' },
            { key: 'itemType', label: '품목 유형' },
            { key: 'itemName', label: '품목명' }
        ]"
        :fetchData="getProductList"
        :exclude-ids="excludeIds"
        :page-size="5"
        @select="onSelectProduct"
        @close="visibleProductModal = false"
    />

    <SnackBar />
</template>

<style scoped>
.active {
    background-color: #000;
    color: #fff;
}

.gap-1 {
    gap: 4px;
}

.row-toggler {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
}

.row-toggler:focus {
    outline: none;
}
</style>

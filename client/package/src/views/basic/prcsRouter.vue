<script setup>
import CardHeader from '@/components/production/card-header.vue';
import CardHeaderBtn from '@/components/production/card-header-btn.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import draggable from 'vuedraggable';
import ModalSearch from '@/views/commons/CommonModal.vue';
import { ref, onBeforeMount, watch } from 'vue';
import axios from 'axios';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackBar } = useSnackBar();

const prcsRouterList = ref([]);
const selectedPrcsRouter = ref(null);
const prcsRouterDetail = ref([]);
const visibleItemModal = ref(false);
const visibleProcessModal = ref(false);

// 품목별 공정 라우터 목록 조회
const getPrcsRouterList = async () => {
    try {
        const { data } = await axios.get('/api/prod/prcsrouterlist');
        prcsRouterList.value = data ?? [];
    } catch (e) {
        console.error(e);
        prcsRouterList.value = [];
    }
};
onBeforeMount(getPrcsRouterList);

// 품목 선택 시 해당 품목의 공정 라우터 상세 조회
watch(selectedPrcsRouter, async (newVal) => {
    if (!newVal) {
        prcsRouterDetail.value = [];
        return;
    }
    try {
        const result = await axios.get('/api/prod/prcsrouter', {
            params: { itemId: newVal.itemId }
        });
        const { data } = result;
        prcsRouterDetail.value = (data ?? []).sort((a, b) => a.opNo - b.opNo);
    } catch (e) {
        console.error(e);
        prcsRouterDetail.value = [];
    }
});

// 품목 목록 조회 (모달용)
const getItemList = async () => {
    try {
        const { data } = await axios.get('/api/prod/itemlist/notmaterial');
        return data ?? [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

// 품목 선택 시 처리
const onSelectItem = (item) => {
    selectedPrcsRouter.value = item;
    visibleItemModal.value = false;
};

// 공정 목록 조회 (모달용)
const getProcessList = async () => {
    try {
        const { data } = await axios.get('/api/prod/prcslist');
        const excludeSet = new Set(prcsRouterDetail.value.map((p) => p.prcsNumber));
        return (data ?? []).filter((it) => !excludeSet.has(it.prcsNumber));
    } catch (e) {
        console.error(e);
        return [];
    }
};

// 공정 선택 시 처리
const onSelectProcess = (process) => {
    prcsRouterDetail.value.push({
        prcsNumber: process.prcsNumber,
        prcsName: process.prcsName,
        opNo: prcsRouterDetail.value.length + 1
    });
    visibleProcessModal.value = false;
};

// 삭제 버튼
const removeProcess = (index) => {
    if (typeof index !== 'number' || index < 0 || index >= prcsRouterDetail.value.length) return;
    prcsRouterDetail.value.splice(index, 1);
    prcsRouterDetail.value.forEach((p, i) => { p.opNo = i + 1; });
}

// 공정 추가 버튼 클릭
const openProcessModal = () => {
    if (!selectedPrcsRouter.value) {
        snackBar('품목을 선택하세요.', 'warning');
        return;
    }
    visibleProcessModal.value = true;
}

// 저장 처리
const saveProcessRouter = async () => {
    if (!selectedPrcsRouter.value) {
        snackBar('품목을 선택하세요.', 'warning');
        return;
    }

    const itemId = selectedPrcsRouter.value.itemId;
    const isExisting = prcsRouterList.value.some(p => p.itemId === itemId);

    if (prcsRouterDetail.value.length === 0) {
        if (!isExisting) {
            snackBar('공정을 추가하세요.', 'warning');
            return;
        }
        if (!confirm('저장하시겠습니까?')) return;
        try {
            const { data } = await axios.post('/api/prod/saveprcsrouter', {
                itemId,
                processes: []
            });
            snackBar('성공적으로 삭제되었습니다.', 'error');
            await getPrcsRouterList();
            const reselection = prcsRouterList.value.find(p => p.itemId === itemId) || null;
            selectedPrcsRouter.value = reselection;
            if (reselection) {
                const { data } = await axios.get('/api/prod/prcsrouter', { params: { itemId } });
                prcsRouterDetail.value = (data ?? []).sort((a, b) => a.opNo - b.opNo);
            } else {
                prcsRouterDetail.value = [];
            }
        } catch (e) {
            console.error(e);
            snackBar('저장 중 오류가 발생했습니다.', 'error');
        }
        return;
    }

    if (!confirm('저장하시겠습니까?')) return;
    try {
        const ordered = prcsRouterDetail.value.map((p, idx) => ({
            ...p,
            opNo: idx + 1
        }));
        const { data } = await axios.post('/api/prod/saveprcsrouter', {
            itemId,
            processes: ordered
        });
        snackBar('성공적으로 저장되었습니다.', 'success');
        await getPrcsRouterList();
        const reselection = prcsRouterList.value.find(p => p.itemId === itemId) || null;
        selectedPrcsRouter.value = reselection;
        if (reselection) {
            const { data } = await axios.get('/api/prod/prcsrouter', { params: { itemId } });
            prcsRouterDetail.value = (data ?? []).sort((a, b) => a.opNo - b.opNo);
        } else {
            prcsRouterDetail.value = [];
        }
    } catch (e) {
        console.error(e);
        snackBar('저장 중 오류가 발생했습니다.', 'error');
    }
};
</script>

<template>
    <v-container fluid>
        <v-row>
            <!-- 좌측: 품목별 공정 흐름도 조회 -->
            <v-col cols="6">
                <v-card elevation="10">
                    <v-card-item class="py-6 px-6">
                        <v-container fluid>
                            <CardHeader title="공정 흐름도 조회" />
                            <DataTable
                                :value="prcsRouterList"
                                v-model:selection="selectedPrcsRouter"
                                selectionMode="single"
                                paginator
                                :rows="10"
                                dataKey="itemId"
                            >
                                <Column field="itemId" header="품목 번호" sortable />
                                <Column field="itemName" header="품목명" sortable />
                            </DataTable>
                        </v-container>
                    </v-card-item>
                </v-card>
            </v-col>

            <!-- 우측: 공정 흐름도 등록 -->
            <v-col cols="6">
                <v-card elevation="10">
                    <v-card-item class="py-6 px-6">
                        <v-container fluid>
                            <CardHeaderBtn
                                :title="selectedPrcsRouter ? `${selectedPrcsRouter.itemName}` : '품목을 선택해주세요'"
                                btn-icon="mdi-plus-circle"
                                btn-text="공정 흐름도 등록"
                                btn-variant="outlined"
                                btn-color="primary"
                                @btn-click="visibleItemModal = true"
                            />
                            <!-- 공정 리스트 (드래그 가능) -->
                            <draggable
                                v-model="prcsRouterDetail"
                                item-key="prcsNumber"
                                :animation="200"
                                handle=".handle"
                                ghost-class="ghost"
                                chosen-class="chosen"
                            >
                                <template #item="{ element, index }">
                                    <div class="row">
                                        <span class="handle">⠿</span>
                                        <span>{{ element.prcsName }}</span>
                                        <v-btn
                                            icon
                                            variant="text"
                                            color="error"
                                            style="margin-left:auto"
                                            @click="removeProcess(index)"
                                        >
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </template>
                            </draggable>
                            <!-- 버튼 영역 -->
                            <div class="btn-area">
                                <v-btn
                                    append-icon="mdi-plus-circle"
                                    variant="outlined"
                                    color="primary"
                                    @click="openProcessModal"
                                    block
                                >
                                    공정 추가
                                </v-btn>
                                <v-btn
                                    append-icon="mdi-content-save"
                                    variant="flat"
                                    color="primary"
                                    class="mt-3"
                                    @click="saveProcessRouter"
                                    block
                                >
                                    저장
                                </v-btn>
                            </div>
                        </v-container>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!-- 품목 선택 모달 -->
    <ModalSearch
        :visible="visibleItemModal"
        title="품목 선택"
        idField="itemId"
        :columns="[
            { key: 'itemId', label: '품목 번호' },
            { key: 'itemName', label: '품목명' }
        ]"
        :fetchData="getItemList"
        :exclude-ids="prcsRouterList.map((p) => p.itemId)"
        :page-size="5"
        @select="onSelectItem"
        @close="visibleItemModal = false"
    />

    <!-- 공정 선택 모달 -->
    <ModalSearch
        :visible="visibleProcessModal"
        title="공정 선택"
        idField="prcsNumber"
        :columns="[
            { key: 'prcsNumber', label: '공정 번호' },
            { key: 'prcsName', label: '공정명' }
        ]"
        :fetchData="getProcessList"
        :exclude-ids="prcsRouterDetail.map((p) => p.prcsNumber)"
        :page-size="5"
        @select="onSelectProcess"
        @close="visibleProcessModal = false"
    />

    <!-- {{ prcsRouterDetail }} -->
    <SnackBar />
</template>

<style scoped>
.row {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px;
    margin-bottom: 6px;
    border: 1px solid #eee;
    border-radius: 8px;
}
.handle {
    cursor: grab;
}
.ghost {
    opacity: 0.5;
}
.chosen {
    opacity: 0.9;
}
.btn-area {
    margin-top: 16px;
}
</style>

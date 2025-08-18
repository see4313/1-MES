<script setup>
import CardHeader from '@/components/production/card-header.vue';
import CardHeaderBtn from '@/components/production/card-header-btn.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import draggable from 'vuedraggable';
import ModalSearch from '@/views/commons/CommonModal.vue';
import { ref, onBeforeMount, watch } from 'vue';
import axios from 'axios';

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
        const { data } = await axios.get('/api/prod/itemlist');
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
        const { data } = await axios.get('/api/prod/processlist');
        const excludeSet = new Set(prcsRouterDetail.value.map((p) => p.opNo));
        return (data ?? []).filter((it) => !excludeSet.has(it.opNo));
    } catch (e) {
        console.error(e);
        return [];
    }
};

// 공정 선택 시 처리
const onSelectProcess = (process) => {
    prcsRouterDetail.value.push({
        opNo: process.opNo,
        prcsName: process.prcsName
    });
    visibleProcessModal.value = false;
};

// 저장 처리
const saveProcessRouter = async () => {
    if (!selectedPrcsRouter.value) {
        alert('먼저 품목을 선택하세요.');
        return;
    }
    try {
        await axios.post('/api/prod/saveprcsrouter', {
            itemId: selectedPrcsRouter.value.itemId,
            processes: prcsRouterDetail.value
        });
        alert('저장되었습니다.');
    } catch (e) {
        console.error(e);
        alert('저장 중 오류가 발생했습니다.');
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
                                item-key="opNo"
                                :animation="200"
                                handle=".handle"
                                ghost-class="ghost"
                                chosen-class="chosen"
                            >
                                <template #item="{ element }">
                                    <div class="row">
                                        <span class="handle">⠿</span>
                                        <span>{{ element.prcsName }}</span>
                                    </div>
                                </template>
                            </draggable>
                            <!-- 버튼 영역 -->
                            <div class="btn-area">
                                <v-btn
                                    append-icon="mdi-plus-circle"
                                    variant="outlined"
                                    color="primary"
                                    @click="visibleProcessModal = true"
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
        idField="opNo"
        :columns="[
            { key: 'opNo', label: '공정 번호' },
            { key: 'prcsName', label: '공정명' }
        ]"
        :fetchData="getProcessList"
        :exclude-ids="prcsRouterDetail.map((p) => p.opNo)"
        :page-size="5"
        @select="onSelectProcess"
        @close="visibleProcessModal = false"
    />

    {{ prcsRouterDetail }}
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

<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader1 title="품목조회" btn-text="조회" btn-variant="flat" btn-color="primary" @btn-click="select()" />
            <v-row>
                <v-col cols="12" md="12">
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="3">
                            <v-text-field label="품목명" v-model="selectItemName" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemNameModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-text-field label="품목구분" v-model="selectItemType" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="itemTypeModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-text-field label="보관조건" v-model="selectCutd" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="cutdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-radio-group v-model="useYn" label="사용여부" class="mt-0 radio-row">
                                <v-row justify="space-between" class="px-4">
                                    <v-radio label="사용" value="Y"></v-radio>
                                    <v-radio label="미사용" value="N"></v-radio>
                                </v-row>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader title="품목목록" />
            <v-row>
                <v-col cols="12" md="12">
                    <v-row>
                        <v-col cols="12">
                            <div class="card">
                                <DataTable :value="itemList" tableStyle="min-width: 50rem" @row-click="onRowClick" class="cursor-pointer">
                                    <Column field="item_id" header="품목번호"></Column>
                                    <Column field="item_name" header="품목명"></Column>
                                    <Column field="item_type" header="품목구분"></Column>
                                    <Column field="cutd_cond" header="보관조건"></Column>
                                    <Column field="spec" header="규격"></Column>
                                    <Column field="unit" header="단위"></Column>
                                    <Column field="uon" header="사용여부"></Column>
                                    <Column field="remk" header="비고"></Column>
                                </DataTable>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <v-card elevation="10" class="mt-3">
        <v-card-item class="py-6 px-6">
            <CardHeader2
                title="품목관리"
                btn-text1="삭제"
                btn-variant1="flat"
                btn-color1="error"
                @btn-click1="dataReset()"
                btn-text2="저장"
                btn-variant2="flat"
                btn-color2="primary"
                @btn-click2=""
            />
            <v-row>
                <v-col cols="12" md="8">
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="4">
                            <v-text-field label="품목명" v-model="itemName" variant="outlined">
                                <!-- 입력 -->
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="품목구분" v-model="itemType" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="단위" v-model="itemUnit" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="space-between" dense>
                        <v-col cols="12" sm="4">
                            <v-text-field label="규격" v-model="itemSpec" variant="outlined">
                                <template #append-inner>
                                    <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field label="보관조건" v-model="itemCutd" variant="outlined" readonly>
                                <template #append-inner>
                                    <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-radio-group v-model="itemUseYn" label="사용여부" class="mt-0 radio-row">
                                <v-row justify="space-between" class="px-4">
                                    <v-radio label="사용" value="Y"></v-radio>
                                    <v-radio label="미사용" value="N"></v-radio>
                                </v-row>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" md="4">
                    <v-row>
                        <v-col cols="12">
                            <v-textarea label="비고" v-model="selectedItem" outlined rows="5"> </v-textarea>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>

    <ModalSearch
        :visible="itemNameModal"
        title="품목명"
        idField="item_id"
        :columns="[
            { key: 'item_id', label: '품목번호' },
            { key: 'item_name', label: '품목명' },
            { key: 'item_type', label: '품목구분' }
        ]"
        :fetchData="fetchItemName"
        :pageSize="5"
        @select="onSelectItemName"
        @close="itemNameModal = false"
    />
</template>

<script setup>
import CardHeader from '@/components/production/card-header.vue';
import CardHeader1 from '@/components/production/card-header-btn.vue';
import CardHeader2 from '@/components/production/card-header-btn2.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';

const useYn = ref('Y');
const itemId = ref(null);
const itemName = ref(null);
const itemType = ref(null);
const itemUnit = ref(null);
const itemSpec = ref(null);
const itemCutd = ref(null);
const itemUseYn = ref(null);
const itemList = ref(); // 조회 목록
const itemNameModal = ref(false); // 품목명 모달
const itemTypeModal = ref(false); // 품목구분 모달
const cutdModal = ref(false); // 보관조건 모달
const selectItemName = ref(null); // 품목번호 선택
const selectItemType = ref(null); // 품목구분 선택
const selectCutd = ref(null); // 보관조건 선택

function onRowClick(event) {
    itemId.value = event.data.item_id;
    itemName.value = event.data.item_name;
    itemType.value = event.data.item_type;
    itemUnit.value = event.data.unit;
    itemSpec.value = event.data.spec;
    itemCutd.value = event.data.cutd_cond;
    itemUseYn.value = event.data.uon;
}

function dataReset() {
    itemId.value = null;
    itemName.value = null;
    itemType.value = null;
    itemUnit.value = null;
    itemSpec.value = null;
    itemCutd.value = null;
    itemUseYn.value = null;
}

// 조회
const select = async () => {
    try {
        const params = {
            item_name: selectItemName.value, // 품목명
            item_type: selectItemType.value, // 품목구분
            cutd_cond: selectCutd.value, // 보관조건
            uon: useYn.value // 사용여부
        };

        const response = await axios.get('/api/itemList', { params });
        itemList.value = response.data;
    } catch (error) {
        console.error('조회 실패', error);
    }
};

// 모달조회
const fetchItemName = async () => {
    try {
        const response = await axios.get('/api/itemId');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchItemType = async () => {
    try {
        const response = await axios.get('/api/itemType');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const fetchCutd = async () => {
    try {
        const response = await axios.get('/api/cutdCond');
        return response.data; // 반드시 배열 형태여야 함
    } catch (error) {
        console.error('조회 실패', error);
        return [];
    }
};

const onSelectItemName = (item) => {
    selectItemName.value = item.item_name; // 품목번호
};

const onSelectItemType = (item) => {
    selectItemName.value = item.item_name; // 품목번호
};

const onSelectCutd = (item) => {
    selectItemName.value = item.item_name; // 품목번호
};
</script>

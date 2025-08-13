<template>
    <v-card elevation="10" class="mb-6">
        <v-card-title class="px-6 pt-6">입고 품질 검사 조회</v-card-title>
        <v-divider />
        <v-card-item class="py-6 px-6">
            <v-form v-model="valid">
                <v-container>
                    <v-row>
                        <!-- LOT 번호 (모달로 선택) -->
                        <v-col cols="12" md="3">
                            <h3>LOT번호</h3>
                            <v-text-field
                                v-model="selectLotId"
                                readonly
                                variant="outlined"
                                placeholder="LOT번호를 선택하세요"
                                append-inner-icon="mdi-magnify"
                                @click="openLotModal"
                            />
                        </v-col>
                        <v-col cols="12" md="3">
                            <h3>품목명</h3>
                            <v-text-field v-model="itemName" variant="outlined" disabled />
                        </v-col>
                        <v-col cols="12" md="3">
                            <h3>품목번호</h3>
                            <v-text-field v-model="itemId" variant="outlined" disabled />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="d-flex" style="gap: 8px">
                            <v-btn color="primary" variant="flat" @click="onSearch">조회</v-btn>
                            <v-btn color="secondary" variant="flat" @click="onReset">초기화</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-card-item>
    </v-card>
    <ModalSearch
        :visible="lotIdModal"
        title="LOT 검색"
        idField="lot_id"
        :columns="[
            { key: 'lot_id', label: 'LOT번호' },
            { key: 'item_id', label: '품목번호' },
            { key: 'wh_id', label: '창고번호' }
        ]"
        :fetchData="fetchLotId"
        :pageSize="5"
        @select="onSelectLotId"
        @close="closeLotModal"
    />
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import ModalSearch from '@/views/commons/CommonModal.vue';

const valid = ref(true);

/* LOT + 연동 필드 */
const lotIdModal = ref(false);
const selectLotId = ref('');

const itemName = ref(''); // 품목명 (ITEM_NAME)
const itemId = ref(''); // 품목번호 (ITEM_ID)

/* 모달 열기/닫기 */
function openLotModal() {
    lotIdModal.value = true;
}
function closeLotModal() {
    lotIdModal.value = false;
}

/* LOT 목록 조회 (모달용) - 반드시 배열 반환 */
async function fetchLotId() {
    try {
        const res = await axios.get('/api/lotId');
        if (res && res.data && Array.isArray(res.data)) {
            return res.data;
        } else {
            return [];
        }
    } catch (e) {
        console.error('LOT 조회 실패:', e && e.message ? e.message : e);
        return [];
    }
}

/* LOT 선택 시 상세 조회 → 품목명/품목번호 세팅 */
async function onSelectLotId(item) {
    if (item && item.lot_id) {
        selectLotId.value = String(item.lot_id);
    } else {
        return;
    }
    closeLotModal();

    try {
        const res = await axios.get('/api/lotData', { params: { lot_id: selectLotId.value } });
        let row = null;

        if (res && res.data) {
            if (Array.isArray(res.data)) {
                if (res.data.length > 0) row = res.data[0];
            } else if (typeof res.data === 'object') {
                row = res.data;
            }
        }

        if (row) {
            itemName.value = row.item_name ? String(row.item_name) : '';
            itemId.value = row.item_id ? String(row.item_id) : '';
        } else {
            itemName.value = '';
            itemId.value = '';
        }
    } catch (e) {
        console.error('LOT 상세조회 실패:', e && e.message ? e.message : e);
        itemName.value = '';
        itemId.value = '';
    }
}

function onSearch() {
    console.log('조회 실행 - LOT:', selectLotId.value, 'ITEM_ID:', itemId.value, 'ITEM_NAME:', itemName.value);
}
function onReset() {
    selectLotId.value = '';
    itemName.value = '';
    itemId.value = '';
}
</script>

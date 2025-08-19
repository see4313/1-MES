<!-- instruction.vue -->
<script setup>
import { ref, watch, computed, onBeforeMount } from 'vue';
import axios from 'axios';
import ModalSearch from '@/views/commons/CommonModal.vue';
import CardHeader from '@/components/production/card-header-btn.vue';
import { useFormatDate } from '@/composables/useFormatDate';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackBar } = useSnackBar();
const { formatDate, minDate } = useFormatDate();

const selectProductType = ref('semi');
const visibleProductModal = ref(false);
const selectProductList = ref([]);
const goalDatePicker = ref(false);
const goalDate = ref(null);
const startDatePicker = ref(false);
const startDate = ref(null);
const remk = ref('');

const productType = ref([
    { key: '반제품', value: 'semi' },
    { key: '완제품', value: 'finish' }
]);

const planLoad = () => {};

watch(selectProductType, () => {
    selectProductList.value = [];
});

watch(
    () => selectProductList.value.map((product) => product.quantity),
    () => {
        for (const product of selectProductList.value) {
            const qty = product.quantity;
            if (qty < 0 || qty === '' || Number.isNaN(qty)) {
                product.quantity = 0;
            }
        }
    }
);

const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const n = Number(value);
    if (Number.isNaN(n)) return '';
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const parseNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(String(value).replace(/,/g, ''));
    return Number.isNaN(num) ? 0 : num;
};
const onQtyInput = (product, val) => {
    const n = parseNumber(val);
    product.quantity = n < 0 ? 0 : Math.floor(n);
};

const getProductList = async () => {
    try {
        const { data } = await axios.get(`/api/prod/itemlist/${selectProductType.value}`);
        const set = excludeSet.value;
        return (data ?? []).filter((it) => !set.has(it.itemId));
    } catch (e) {
        console.error(e);
        return [];
    }
};

const removeProduct = (id) => {
    const i = selectProductList.value.findIndex((product) => product.itemId === id);
    if (i !== -1) selectProductList.value.splice(i, 1);
};

const excludeIds = computed(() => selectProductList.value.map((p) => p.itemId));
const excludeSet = computed(() => new Set(excludeIds.value));

const onSelectProduct = (item) => {
    const list = selectProductList.value;
    list.push({ ...item, quantity: 0 });
};

const instructionsBtn = async () => {
    if (selectProductList.value.length === 0) {
        snackBar('생산 지시할 품목을 선택해주세요.', 'warning');
        return;
    }
    if (selectProductList.value.some((product) => product.quantity < 1)) {
        snackBar('지시 수량을 다시 한번 확인하여 주세요.', 'warning');
        return;
    }
    if (!startDate.value) {
        snackBar('생산 시작 일자를 선택하여주세요.', 'warning');
        return;
    }
    if (!goalDate.value) {
        snackBar('목표 생산 일자를 선택하여주세요.', 'warning');
        return;
    }
    if (!confirm('등록하시겠습니까?')) {
        return;
    }

    const detail = [];
    for (const product of selectProductList.value) {
        detail.push({
            item_id: String(product.itemId),
            goal_qty: Number(product.quantity)
        });
    }

    try {
        const result = await axios.post('api/prod/instructions', {
            itemType: selectProductType.value,
            goalDate: formatDate(goalDate.value, '-'),
            startDate: formatDate(startDate.value, '-'),
            remark: remk.value,
            details: detail
        });
        if (result.data.affectedRows > 0) {
            selectProductList.value = [];
            startDate.value = null;
            goalDate.value = null;
            remk.value = null;
            snackBar('성공적으로 생산 지시하였습니다.', 'success');
        }
    } catch (e) {
        console.error(e);
    }
};
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <v-container fluid>
                <CardHeader
                    title="생산 지시"
                    btn-icon="mdi-plus-circle"
                    btn-text="생산 계획 불러오기"
                    btn-variant="outlined"
                    btn-color="primary"
                    @btn-click="planLoad"
                />

                <v-chip-group v-model="selectProductType" mandatory selected-class="active">
                    <v-chip v-for="type in productType" :key="type.value" :value="type.value" label pill variant="outlined" size="small">
                        {{ type.key }}
                    </v-chip>
                </v-chip-group>

                <v-table class="fixed-table">
                    <colgroup>
                        <col style="width: 14%" />
                        <col style="width: 12%" />
                        <col style="width: 24%" />
                        <col style="width: 16%" />
                        <col style="width: 24%" />
                        <col style="width: 10%" />
                    </colgroup>

                    <thead>
                        <tr>
                            <th class="text-center font-weight-bold">품목 번호</th>
                            <th class="text-center font-weight-bold">품목 유형</th>
                            <th class="text-center font-weight-bold">품목명</th>
                            <th class="text-center font-weight-bold">규격</th>
                            <th class="text-center font-weight-bold">지시 수량</th>
                            <th class="text-center font-weight-bold">삭제</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="product in selectProductList" :key="product.itemId">
                            <td class="text-center">
                                <div class="cell">{{ product.itemId }}</div>
                            </td>
                            <td class="text-center">
                                <div class="cell">{{ product.itemType }}</div>
                            </td>
                            <td class="text-center">
                                <div class="cell">{{ product.itemName }}</div>
                            </td>
                            <td class="text-center">
                                <div class="cell">{{ product.spec }}</div>
                            </td>

                            <td class="text-center">
                                <v-text-field
                                    :model-value="formatNumber(product.quantity)"
                                    @update:model-value="(val) => onQtyInput(product, val)"
                                    type="text"
                                    inputmode="numeric"
                                    variant="outlined"
                                    hide-details
                                    density="compact"
                                    :disabled="!product.itemId"
                                    placeholder="0"
                                    class="qty-input has-unit"
                                    style="min-width: 0"
                                >
                                    <template #append-inner>
                                        <span class="unit-label">{{ product.unit || '' }}</span>
                                    </template>
                                </v-text-field>
                            </td>

                            <td class="text-center">
                                <v-btn color="error" class="del-btn" @click="removeProduct(product.itemId)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <v-row justify="center" class="my-4">
                    <v-btn append-icon="mdi-plus-circle" variant="outlined" color="primary" @click="visibleProductModal = true">
                        품목 추가
                    </v-btn>
                </v-row>

                <v-menu
                    v-model="startDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    location="bottom"
                    :offset="8"
                    min-width="auto"
                >
                    <template #activator="{ props }">
                        <v-text-field
                            v-bind="props"
                            :model-value="formatDate(startDate, '-')"
                            label="생산 시작 일자"
                            append-inner-icon="mdi-calendar"
                            readonly
                            variant="outlined"
                            density="compact"
                            clearable
                            @click:clear="startDate = null"
                        />
                    </template>
                    <v-date-picker v-model="startDate" :min="minDate()" :max="goalDate" @update:model-value="startDatePicker = false" />
                </v-menu>

                <v-menu
                    v-model="goalDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    location="bottom"
                    :offset="8"
                    min-width="auto"
                >
                    <template #activator="{ props }">
                        <v-text-field
                            v-bind="props"
                            :model-value="formatDate(goalDate, '-')"
                            label="목표 생산 일자"
                            append-inner-icon="mdi-calendar"
                            readonly
                            variant="outlined"
                            density="compact"
                            clearable
                            @click:clear="goalDate = null"
                        />
                    </template>
                    <v-date-picker v-model="goalDate" :min="startDate || minDate()" @update:model-value="goalDatePicker = false" />
                </v-menu>

                <v-textarea v-model="remk" label="비고" variant="outlined" density="compact" auto-grow rows="3" clearable />

                <v-btn color="primary" @click="instructionsBtn" block>생산 지시</v-btn>
            </v-container>
        </v-card-item>
    </v-card>

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
.fixed-table {
    table-layout: fixed;
    width: 100%;
}
.fixed-table .cell {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.text-center {
    max-width: 160px;
}
.fixed-table .td {
    max-width: 160px;
}
.qty-input .v-field {
    width: 100%;
}
.qty-input .v-field__input {
    min-width: 0;
}
.qty-input :deep(input) {
    text-align: right;
    padding-right: 2.5rem;
}
.qty-input :deep(.v-field__append-inner) {
    margin-left: 4px;
}
.unit-label {
    font-size: 12px;
    color: #6b7280;
    pointer-events: none;
    white-space: nowrap;
}
.del-btn {
    min-width: 0;
    padding: 6px 10px;
}
</style>

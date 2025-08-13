<!-- instruction.vue -->
<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import ModalSearch from '@/views/commons/CommonModal.vue';
import CardHeader from '@/components/production/card-header-btn.vue';
import { useFormatDate } from '@/composables/useFormatDate';

// Date Format
const { formatDate } = useFormatDate();
const minDate = computed(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate());
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
});

const productType = ref('semi'); // 상품 유형
const visibleProductModal = ref(false); // 상품 선택 모달창 표시 여부
const selectProductList = ref([]); // 선택된 상품
const goalDatePicker = ref(false); // Date Picker 표시 여부
const goalDate = ref(null); // 목표 생산 일자
const remk = ref(''); // 비고

// 생산 계획 Load
const planLoad = () => {};

// 상품 유형 변경시 선택된 상품 init
watch(productType, () => {
    selectProductList.value = [];
});

// 상품 수량 값이 없거나 0보다 작을 경우 자동으로 0으로 init
watch(
    () => selectProductList.value.map((product) => product.quantity),
    () => {
        for (const product of selectProductList.value) {
            const qty = product.quantity;
            if (qty < 0 || qty == '') {
                product.quantity = 0;
            }
        }
    }
);

// DB에서 선택된 상품 유형에 맞게 리스트를 불러옴
const getProductList = async () => {
    try {
        const { data } = await axios.get(`/api/itemlist/${productType.value}`);
        return data ?? [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

// 선택된 상품 삭제
const deleteProduct = (id) => {
    const i = selectProductList.value.findIndex((product) => product.itemId === id);
    if (i !== -1) selectProductList.value.splice(i, 1);
};

// 상품 선택시 중복 체크
const onSelectProduct = (item) => {
    const list = selectProductList.value;
    if (list.some((product) => product.itemId === item.itemId)) {
        alert('이미 상품이 존재합니다.');
        return;
    }
    list.push({ ...item, quantity: 0 });
};

// 생산 지시 버튼을 누를 경우
const instructionsBtn = async () => {
    if (selectProductList.value.length == 0) {
        alert('생산 지시할 상품을 선택해주세요.');
        return;
    }
    if (selectProductList.value.some((product) => product.quantity < 1)) {
        alert('지시 수량을 다시 한번 확인하여 주세요.');
        return;
    }
    if (!goalDate.value) {
        alert('목표 생산 일자를 입력하여주세요.');
        return;
    }
    try {
        const result = await axios.post();
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
                    btn-variant="flat"
                    btn-color="primary"
                    @btn-click="planLoad"
                />

                <v-chip-group v-model="productType" mandatory selected-class="active">
                    <v-chip value="semi" label pill variant="tonal" size="small">반제품</v-chip>
                    <v-chip value="finish" label pill variant="tonal" size="small">완제품</v-chip>
                </v-chip-group>

                <v-table>
                    <thead>
                        <tr>
                            <th class="text-center font-weight-bold">품목 번호</th>
                            <th class="text-center font-weight-bold">품목 유형</th>
                            <th class="text-center font-weight-bold">품목명</th>
                            <th class="text-center font-weight-bold">지시 수량</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in selectProductList" :key="product.itemId">
                            <td class="text-center">{{ product.itemId }}</td>
                            <td class="text-center">{{ product.itemType }}</td>
                            <td class="text-center">{{ product.itemName }}</td>
                            <td class="text-center">
                                <v-text-field
                                    v-model.number="product.quantity"
                                    type="number"
                                    inputmode="numeric"
                                    min="0"
                                    variant="outlined"
                                    hide-details
                                    density="compact"
                                />
                            </td>
                            <td class="text-center">
                                <v-btn color="error" @click="deleteProduct(product.itemId)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <v-row justify="center" class="my-4">
                    <v-btn append-icon="mdi-plus-circle" color="primary" @click="visibleProductModal = true"> 품목 추가 </v-btn>
                </v-row>

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

                    <v-date-picker v-model="goalDate" :min="minDate" @update:model-value="goalDatePicker = false" />
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
        :page-size="5"
        @select="onSelectProduct"
        @close="visibleProductModal = false"
    />
</template>

<style scoped>
.active {
    background-color: #000;
    color: #fff;
}
</style>

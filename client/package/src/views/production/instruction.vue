<!-- instruction.vue -->
<script setup>
import { ref, watch, computed, onBeforeMount } from 'vue';
import axios from 'axios';
import ModalSearch from '@/views/commons/CommonModal.vue';
import CardHeader from '@/components/production/card-header-btn.vue';
import { useFormatDate } from '@/composables/useFormatDate';
import SnackBar from '@/components/shared/SnackBar.vue'; 
import { useSnackBar } from '@/composables/useSnackBar.js';

// Snack Bar
const { snackBar } = useSnackBar();

// Date Format
const { formatDate, minDate } = useFormatDate();

const selectProductType = ref("semi"); // 선택된 상품 유형
const visibleProductModal = ref(false); // 상품 선택 모달창 표시 여부
const selectProductList = ref([]); // 선택된 상품
const goalDatePicker = ref(false); // 목표 생산 일자 Date Picker 표시 여부
const goalDate = ref(null); // 목표 생산 일자
const startDatePicker = ref(false); // 생산 시작 일자 Date Picker 표시 여부
const startDate = ref(null); // 생산 시작 일자
const remk = ref(''); // 비고
const snackOpen = ref(false); // 스낵바 표시 여부
const snackMessage = ref(''); // 스낵바 메시지
const snackColor = ref(''); // 스낵바 색상

// 상품 유형 
const productType = ref([
  { key: "반제품", value : "semi" },
  { key: "완제품", value : "finish" }
]);

// 품목 계획 Load
const planLoad = () => {

};

// 품목 유형 변경시 선택된 상품 init
watch(selectProductType, () => {
  selectProductList.value = [];
});

// 품목 수량 값이 없거나 0보다 작을 경우 자동으로 0으로 init
watch(
  () => selectProductList.value.map(product => product.quantity),
  () => {
    for (const product of selectProductList.value) {
      const qty = product.quantity;
      if (qty < 0 || qty == '') {
        product.quantity = 0;
      }
    }    
  }
);

// DB에서 선택된 품목 유형에 맞게 리스트를 불러옴
const getProductList = async () => {
  try {
    const { data } = await axios.get(`/api/itemlist/${selectProductType.value}`);
    const set = excludeSet.value;
    return (data ?? []).filter(it => !set.has(it.itemId));
  } catch (e) {
    console.error(e);
    return [];
  }
};

// 선택된 품목 삭제
const deleteProduct = (id) => {
  const i = selectProductList.value.findIndex(product => product.itemId === id);
  if (i !== -1) selectProductList.value.splice(i, 1);
};

// 품목 선택시 중복 체크

const excludeIds = computed(() => selectProductList.value.map(p => p.itemId));
const excludeSet = computed(() => new Set(excludeIds.value));

const onSelectProduct = (item) => {
  const list = selectProductList.value;
  // if (list.some(product => product.itemId === item.itemId)) {
  //   alert('이미 품목이 존재합니다.');
  //   return;
  // }
  list.push({ ...item, quantity: 0 });
};

// 생산 지시 버튼을 누를 경우
const instructionsBtn = async () => {
  if (selectProductList.value.length == 0) {
    snackBar("생산 지시할 품목을 선택해주세요.", 'warning');
    return;
  }
  if (selectProductList.value.some(product => product.quantity < 1)) {
    snackBar("지시 수량을 다시 한번 확인하여 주세요.", 'warning');
    return;
  }
  if (!startDate.value) {
    snackBar("생산 시작 일자를 선택하여주세요.", 'warning');
    return;
  }
  if (!goalDate.value) {
    snackBar("목표 생산 일자를 선택하여주세요.", 'warning');
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
    const result 
      = await axios
        .post('api/instructions', {
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
      snackBar("성공적으로 생산 지시하였습니다.", 'success');
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
          btn-variant="flat"
          btn-color="primary"
          @btn-click="planLoad"
        />

        <v-chip-group v-model="selectProductType" mandatory selected-class="active">
          <v-chip v-for="type in productType" :key="type.value" :value="type.value" label pill variant="tonal" size="small">{{ type.key }}</v-chip>
        </v-chip-group>
        
        <v-table>
          <thead>
            <tr>
              <th class="text-center font-weight-bold">품목 번호</th>
              <th class="text-center font-weight-bold">품목 유형</th>
              <th class="text-center font-weight-bold">품목명</th>
              <th class="text-center font-weight-bold">단위</th>
              <th class="text-center font-weight-bold">규격</th>
              <th class="text-center font-weight-bold">지시 수량</th>
              <th class="text-center font-weight-bold">삭제</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in selectProductList" :key="product.itemId">
              <td class="text-center">{{ product.itemId }}</td>
              <td class="text-center">{{ product.itemType }}</td>
              <td class="text-center">{{ product.itemName }}</td>
              <td class="text-center">{{ product.unit }}</td>
              <td class="text-center">{{ product.spec }}</td>
              <td class="text-center">
                <v-text-field
                  v-model.number="product.quantity"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  variant="outlined"
                  hide-details
                  density="compact"
                  :disabled="!product.itemId"
                  placeholder="0"
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
          <v-btn append-icon="mdi-plus-circle" color="primary" @click="visibleProductModal = true">
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

          <v-date-picker
            v-model="startDate"
            :min="minDate()"
            :max="goalDate"
            @update:model-value="startDatePicker = false"
          />
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

          <v-date-picker
            v-model="goalDate"
            :min="startDate || minDate()"
            @update:model-value="goalDatePicker = false"
          />
        </v-menu>

        <v-textarea
          v-model="remk"
          label="비고"
          variant="outlined"
          density="compact"
          auto-grow
          rows="3"
          clearable
        />

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
</style>

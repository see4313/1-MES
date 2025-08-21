<!-- instruction.vue -->
<script setup>
import { ref, watch, computed } from 'vue';
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
const isConfirmDialog = ref(false);

const productType = ref([
  { key: '반제품', value: 'semi' },
  { key: '완제품', value: 'finish' }
]);

watch(selectProductType, () => {
  selectProductList.value = [];
});

watch(
  () => selectProductList.value.map((p) => p.quantity),
  () => {
    for (const product of selectProductList.value) {
      const qty = product.quantity;
      if (qty < 0 || qty === '' || Number.isNaN(qty)) {
        product.quantity = 0;
      }
    }
  }
);

const formatNumber = (val) => {
  if (!val && val !== 0) return '';
  const n = Number(val);
  return Number.isNaN(n) ? '' : n.toLocaleString();
};
const parseNumber = (val) => {
  if (!val) return 0;
  const num = Number(String(val).replace(/,/g, ''));
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
  const idx = selectProductList.value.findIndex((p) => p.itemId === id);
  if (idx !== -1) selectProductList.value.splice(idx, 1);
};

const excludeIds = computed(() => selectProductList.value.map((p) => p.itemId));
const excludeSet = computed(() => new Set(excludeIds.value));

const onSelectProduct = (item) => {
  selectProductList.value.push({ ...item, quantity: 0 });
};

// 버튼 클릭 시 → 유효성 검사 후 모달 열기
const openConfirmDialog = () => {
  if (selectProductList.value.length === 0) {
    snackBar('생산 지시할 품목을 선택해주세요.', 'warning');
    return;
  }
  if (selectProductList.value.some((p) => p.quantity < 1)) {
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
  isConfirmDialog.value = true;
};

const confirmSubmit = async () => {
  const details = selectProductList.value.map((p) => ({
    item_id: String(p.itemId),
    goal_qty: Number(p.quantity)
  }));
  isConfirmDialog.value = false;
  try {
    const { data } = await axios.post('api/prod/instructions', {
      itemType: selectProductType.value,
      goalDate: formatDate(goalDate.value, '-'),
      startDate: formatDate(startDate.value, '-'),
      remark: remk.value,
      details
    });

    if (data.affectedRows > 0) {
      selectProductList.value = [];
      startDate.value = null;
      goalDate.value = null;
      remk.value = null;
      snackBar('성공적으로 생산 지시하였습니다.', 'success');
    } else {
      snackBar('생산 지시 중 문제가 발생하였습니다. 공정흐름도를 확인하여 주세요.', 'error');
    }
  } catch (e) {
    console.error(e);
    snackBar('생산 지시 중 문제가 발생하였습니다.', 'error');
  }
};
</script>

<template>
  <v-row>
    <!-- 좌측 영역 -->
    <v-col cols="9">
      <v-card elevation="10">
        <v-card-item class="py-6 px-6">
          <v-container fluid>
            <CardHeader
              title="생산 지시"
              btn-icon="mdi-plus-circle"
              btn-text="생산 계획 불러오기"
              btn-variant="outlined"
              btn-color="primary"
              @btn-click="() => {}"
            />

            <!-- Chip Group -->
            <v-chip-group v-model="selectProductType" mandatory selected-class="active">
              <v-chip
                v-for="t in productType"
                :key="t.value"
                :value="t.value"
                label
                pill
                variant="outlined"
                size="small"
              >
                {{ t.key }}
              </v-chip>
            </v-chip-group>

            <!-- Table -->
            <v-table class="fixed-table mt-4">
              <thead>
                <tr>
                  <th class="text-center">품목 번호</th>
                  <th class="text-center">품목 유형</th>
                  <th class="text-center">품목명</th>
                  <th class="text-center">규격</th>
                  <th class="text-center">지시 수량</th>
                  <th class="text-center">삭제</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in selectProductList" :key="product.itemId">
                  <td class="text-center">{{ product.itemId }}</td>
                  <td class="text-center">{{ product.itemType }}</td>
                  <td class="text-center">{{ product.itemName }}</td>
                  <td class="text-center">{{ product.spec }}</td>
                  <td class="text-center">
                    <v-text-field
                      :model-value="formatNumber(product.quantity)"
                      @update:model-value="(val) => onQtyInput(product, val)"
                      type="text"
                      inputmode="numeric"
                      variant="outlined"
                      hide-details
                      density="compact"
                      class="qty-input"
                    >
                      <template #append-inner>
                        <span class="unit-label">{{ product.unit || '' }}</span>
                      </template>
                    </v-text-field>
                  </td>
                  <td class="text-center">
                    <v-btn color="error" size="small" @click="removeProduct(product.itemId)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-row justify="center" class="my-4">
              <v-btn
                append-icon="mdi-plus-circle"
                variant="outlined"
                color="primary"
                @click="visibleProductModal = true"
              >
                품목 추가
              </v-btn>
            </v-row>
          </v-container>
        </v-card-item>
      </v-card>
    </v-col>

    <!-- 우측 옵션 -->
    <v-col cols="3">
      <v-card elevation="10">
        <v-card-item class="py-6 px-6">
          <v-container fluid>
            <!-- Start Date -->
            <v-menu v-model="startDatePicker" :close-on-content-click="false" transition="scale-transition">
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
              <v-date-picker v-model="startDate" :min="minDate()" :max="goalDate" @update:model-value="startDatePicker = false"/>
            </v-menu>

            <!-- Goal Date -->
            <v-menu v-model="goalDatePicker" :close-on-content-click="false" transition="scale-transition">
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
              <v-date-picker v-model="goalDate" :min="startDate || minDate()" @update:model-value="goalDatePicker = false"/>
            </v-menu>

            <v-textarea v-model="remk" label="비고" variant="outlined" density="compact" auto-grow rows="3" clearable />

            <v-btn color="primary" block @click="openConfirmDialog">생산 지시</v-btn>
          </v-container>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>

  <!-- 등록 확인 모달 -->
  <v-dialog v-model="isConfirmDialog" max-width="600">
    <v-card class="pa-4 rounded-xl">
      <div class="text-center mb-4">
        <v-avatar size="48" color="grey-lighten-4">
          <v-icon size="28" color="primary">mdi-alert-circle-outline</v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold mt-2">등록하시겠습니까?</h3>
      </div>
      <v-table density="comfortable" class="mb-4">
        <tbody>
          <tr><td>생산 유형</td><td>{{ productType.find(t => t.value === selectProductType)?.key }}</td></tr>
          <tr><td>생산 시작 일자</td><td>{{ formatDate(startDate, '-') }}</td></tr>
          <tr><td>목표 생산 일자</td><td>{{ formatDate(goalDate, '-') }}</td></tr>
          <tr><td>비고</td><td>{{ remk || '-' }}</td></tr>
        </tbody>
      </v-table>
      <v-table density="compact" class="mb-4">
        <thead><tr><th>품목 번호</th><th>품목명</th><th>지시 수량</th></tr></thead>
        <tbody>
          <tr v-for="p in selectProductList" :key="p.itemId">
            <td>{{ p.itemId }}</td>
            <td>{{ p.itemName }}</td>
            <td>{{ formatNumber(p.quantity) }} {{ p.unit }}</td>
          </tr>
        </tbody>
      </v-table>
      <v-card-actions class="justify-end">
        <v-btn variant="tonal" color="grey-darken-1" @click="isConfirmDialog = false">취소</v-btn>
        <v-btn color="primary" @click="confirmSubmit">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 검색 모달 -->
  <ModalSearch
    :visible="visibleProductModal"
    title="품목 검색"
    idField="itemId"
    :columns="[ { key: 'itemId', label: '품목 번호' }, { key: 'itemType', label: '품목 유형' }, { key: 'itemName', label: '품목명' } ]"
    :fetchData="getProductList"
    :exclude-ids="excludeIds"
    :page-size="5"
    @select="onSelectProduct"
    @close="visibleProductModal = false"
  />

  <SnackBar />
</template>

<style scoped>
.active { background:#000; color:#fff }
.fixed-table { table-layout:fixed; width:100% }
.fixed-table .cell { white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.qty-input :deep(input){ text-align:right; padding-right:2.5rem }
.unit-label { font-size:12px; color:#6b7280; }
</style>

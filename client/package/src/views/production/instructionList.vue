<!-- instructionList.vue -->
<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import axios from 'axios';
import CardHeader from '@/components/production/card-header.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ModalSearch from '@/views/commons/CommonModal.vue';
import SnackBar from '@/components/shared/SnackBar.vue'; 
import { useSnackBar } from '@/composables/useSnackBar.js';
import { useFormatDate } from '@/composables/useFormatDate';

// useFormatDate
const { formatDate, minDate } = useFormatDate();

// Snack Bar
const { snackBar } = useSnackBar();

const visibleProductModal = ref(false); // 품목 선택 모달 표시 여부
const queryInstructionNo = ref(""); // 생산 지시 번호 검색
const instructionList = ref([]); // 생산 지시건 조회
const selectedProductList = ref([]); // 선택돤 상품 리스트
const selectedProductType = ref([]); // 선택된 품목 유형
const selectedInstructionStatus = ref(['0']); // 선택된 생산 지시 상태

onBeforeMount(async () => {
  instructionList.value = await getInstructionList()
});

const getInstructionList = async () => {
  try {
    const { data } = await axios.get(`/api/prod/instructionlist`);
      return data.map(item => ({
    ...item,
    instructionDatetimeFormatted: formatDate(item.instructDatetime),
    startDatetimeFormatted: formatDate(item.startDatetime),
    goalDatetimeFormatted: formatDate(item.goalDatetime)
  }))
  } catch (e) {
    console.error(e);
    return [];
  }
};

// 상품 유형
const productType = ref([
  { key : "반제품", value : "semi" },
  { key : "완제품", value : "finish" }
]);

const instructionStatus = ref([
  { key : "생산 중", value : "0" },
  { key : "생산 완료", value : "1" }
]);

// 품목 가져오기 중복 체크
const excludeIds = computed(() => selectedProductList.value.map(p => p.itemId));
const excludeSet = computed(() => new Set(excludeIds.value));

// 품목 가져오기 (모달)
const getProductList = async () => {
  try {
    const { data } = await axios.get(`/api/prod/itemlist/notmaterial`);
    const set = excludeSet.value;
    return (data ?? []).filter(it => !set.has(it.itemId));
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
  const i = selectedProductList.value.findIndex(product => product.itemId === id);
  if (i !== -1) selectedProductList.value.splice(i, 1);
}


// 품목 선택 모달 open
const openProductModal = () => {
  visibleProductModal.value = true;
};

</script>

<template>
  <v-card elevation="10">
    <v-card-item class="py-6 px-6">
      <v-container fluid>
        <CardHeader
          title="생산 지시 조회"
        />
        <v-row no-gutters>

          <v-col cols="6" class="px-2 d-flex align-center">
            <v-text-field label="생산 지시 번호" v-model="queryInstructionNo" variant="outlined" hide-details>
              <template #append-inner>
                <v-icon @click="itemIdModal = true" class="cursor-pointer">mdi-magnify</v-icon>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="6" class="px-2">
            <div class="d-flex flex-column">
              <label class="font-weight-bold text-body-2">품목 유형</label>

              <v-chip-group
                v-model="selectedProductType"
                column
                multiple
                selected-class="active"
              >
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
                  <span style="font-weight: bold; margin-left: 2px;">{{ product.itemName }}</span>
                </p>
              </v-chip>

              <v-chip
                append-icon="mdi-plus-circle"
                variant="flat"
                pill
                size="small"
                @click="openProductModal"
              >
                <span style="font-weight: bold;">품목 추가</span>
              </v-chip>

              </div>
            </div>
          </v-col>


          <v-col cols="6" class="px-2">
            <div class="d-flex flex-column">
              <label class="font-weight-bold text-body-2">상태</label>

              <v-chip-group
                v-model="selectedInstructionStatus"
                column
                multiple
                selected-class="active"
              >
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
          <DataTable :value="instructionList" paginator :rows="10">
            <Column field="instructNo" sortable header="지시 번호"></Column>
            <Column field="itemType" sortable header="품목 유형"></Column>
            <Column field="status" header="지시 상태"></Column>
            <Column field="instructionDatetimeFormatted" sortable header="지시 일자"></Column>
            <Column field="startDatetimeFormatted" header="시작 일자"></Column>
            <Column field="goalDatetimeFormatted" header="목표 생산 일자"></Column>
        </DataTable>
      </v-container>
    </v-card-item>
  </v-card>

  <p>{{ selectedProductType }}</p>
  <p>{{ selectedInstructionStatus }}</p>
  <p>{{ selectedProductList }}</p>
  <p>{{ instructionList }}</p>

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
</style>

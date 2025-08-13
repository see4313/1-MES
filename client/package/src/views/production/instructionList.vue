<!-- instructionList.vue -->
<script setup>
import { ref } from 'vue';
import CardHeader from '@/components/production/card-header.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const queryInstructionNo = ref(""); // 생산 지시 번호 검색
const instructionList = ref([]); // 생산 지시건 조회
const seletedProductList = ref([]); // 선택돤 상품 리스트
const selectedProductType = ref([]); // 선택된 품목 유형
const selectedInstructionStatus = ref([]); // 선택된 생산 지시 상태

// 상품 유형
const productType = ref([
  { key : "반제품", value : "반제품" },
  { key : "완제품", value : "완제품" }
]);

const instructionStatus = ref([
  { key : "생산 지시", value : "0" },
  { key : "생산 중", value : "1" },
  { key : "생산 완료", value : "2" }
]);

</script>

<template>
  <v-card elevation="10" >
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
                  variant="tonal"
                  pill
                  size="small"
                >
                  {{ type.key }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-col>

          <v-col cols="6" class="px-2">
            <div class="d-flex flex-column">
              <label class="font-weight-bold text-body-2 mb-1">품목</label>

              <div class="d-flex flex-wrap align-center gap-1">
                <v-chip
                  v-for="product in seletedProductList"
                  :key="product.itemnId"
                  variant="tonal"
                  pill
                  size="small"
                >
                  {{ product.itemName }}
                </v-chip>

                <v-chip
                  append-icon="mdi-plus-circle"
                  variant="tonal"
                  pill
                  size="small"
                  color="primary"
                  @click=addProduct
                >
                  품목 추가
                </v-chip>
              </div>
            </div>
          </v-col>


          <v-col cols="6" class="px-2">
            <div class="d-flex flex-column">
              <label class="font-weight-bold text-body-2">지시 상태</label>

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
                  variant="tonal"
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

  <p>{{ selectedProductType }}</p>
  <p>{{ selectedInstructionStatus }}</p>
  <div class="my-4"></div>

  <v-card elevation="10">
    <v-card-item class="py-6 px-6">
      <v-container fluid>
          <DataTable :value="instructionList" paginator :rows="10">
            <Column field="lot_id" sortable header="LOT번호"></Column>
            <Column field="item_id" sortable header="품목번호"></Column>
            <Column field="item_name" header="품목명"></Column>
            <Column field="item_type" header="품목구분"></Column>
            <Column field="wh_name" header="위치"></Column>
            <Column field="cutd_cond" header="보관조건"></Column>
            <Column field="qty" header="수량"></Column>
            <Column field="vald_date" sortable header="유효기한"></Column>
        </DataTable>
      </v-container>
    </v-card-item>
  </v-card>
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

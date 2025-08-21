<script setup>
import { ref, computed, watch, onBeforeMount } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import CardHeader from '@/components/production/card-header.vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';
import { useFormatDate } from '@/composables/useFormatDate';

const { snackBar } = useSnackBar();
const { formatDate } = useFormatDate();

const selectedProd = ref({}); // 선택된 생산번호
const isOpenProdModal = ref(false);
const selectedFacility = ref({});
const isOpenFacilityModal = ref(false);
const selectedEmp = ref({});
const isOpenEmpModal = ref(false);
const prodList = ref([]);
const inferQty = ref(0);   // 불량 수량

// 생산번호 리스트 불러오기
const getProdList = async () => {
  try {
    const { data } = await axios.get('/api/prod/getstatuszeroprodlist');
    prodList.value = data ?? [];
  } catch (e) {
    console.error(e);
    prodList.value = [];
  }
};

onBeforeMount(getProdList);

// 3자리 콤마 포맷
const formatNumber = (val) => {
  return (val ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 불량 수량 포맷
const inferQtyFormatted = computed(() => formatNumber(inferQty.value));

// 불량 수량 입력 처리
const onInferQtyInput = (val) => {
  const numeric = Number(val.replace(/,/g, "")) || 0;
  const max = selectedProd.value.drctQty || 0;

  if (numeric > max) {
    inferQty.value = max;
    snackBar("불량 수량은 투입 수량을 초과할 수 없습니다.", "warning");
  } else {
    inferQty.value = numeric;
  }
};

// 실제 생산 수량 계산
const prodQty = computed(() => {
  return (selectedProd.value.drctQty || 0) - (inferQty.value || 0);
});
const prodQtyFormatted = computed(() => formatNumber(prodQty.value));

// 생산번호가 바뀌면 관련 값 초기화
watch(() => selectedProd.value.prodNo, () => {
  selectedFacility.value = {};
  inferQty.value = 0;
  selectedEmp.value = {};
});

// 모달 표시 메소드
const showProdModal = () => { isOpenProdModal.value = true };
const showFacilityModal = () => {
  if (!selectedProd.value.prcsNumber) {
    snackBar("생산번호를 먼저 선택해주세요", "warning");
    return;
  }
  isOpenFacilityModal.value = true;
};
const showEmpModal = () => { isOpenEmpModal.value = true };

// DataTable에서 생산번호 선택
const onSelectProduction = ({ data }) => {
  selectedProd.value = { ...data };
  isOpenProdModal.value = false;
};

// 설비
const getFacilityList = async () => {
  const { prcsNumber } = selectedProd.value;
  try {
    const { data } = await axios.get(`/api/prod/getfacilitybyname/${prcsNumber}`);
    return data ?? [];
  } catch (e) {
    console.log(e);
    return [];
  }
};
const onSelectFacility = (item) => {
  selectedFacility.value = { ...item };
  isOpenFacilityModal.value = false;
};

// 사원
const getEmpList = async () => {
  const params = { dept_id: 'D001' };
  try {
    const { data } = await axios.get(`/api/selectEmp`, { params });
    return data ?? [];
  } catch (e) {
    console.log(e);
    return [];
  }
};
const onSelectEmp = (item) => {
  selectedEmp.value = { ...item };
  isOpenEmpModal.value = false;
};

// 등록 버튼 (더미)
const submitBtn = () => {
  if (!selectedProd.value?.prodNo) {
    snackBar("생산 지시건을 선택해주세요.", "warning");
    return;
  }
  if (!selectedFacility.value?.facilityId) {
    snackBar("설비를 선택해주세요.", "warning");
    return;
  }
  if (!selectedEmp.value?.emp_id) {
    snackBar("사원을 선택해주세요.", "warning");
    return;
  }

  console.log({
    selectedProd: selectedProd.value,
    selectedFacility: selectedFacility.value,
    inferQty: inferQty.value,
    prodQty: prodQty.value,
    selectedEmp: selectedEmp.value
  });
  // snackBar("생산 실적이 등록되었습니다.", "success");
};

// 뒤로가기
const clearSelectedProd = () => {
  selectedProd.value = {};
};
</script>

<template>

    <!-- 목록 영역 -->
    <v-row v-if="!selectedProd.prodNo">
      <v-col cols="12">
        <v-card elevation="10">
          <v-card-item class="py-6 px-6">
            <v-container fluid>
              <CardHeader title="생산 지시건 선택" />
              <DataTable
                :value="prodList"
                selectionMode="single"
                :selection="selectedProd"
                dataKey="prodNo"
                paginator
                :rows="10"
                @row-select="onSelectProduction"
              >
                <Column field="detaInstructNo" header="세부 지시 번호" sortable />
                <Column field="prodNo" header="생산 번호" sortable />
                <Column field="instructDatetime" header="지시 일자" sortable>
                  <template #body="{ data }">
                    {{ formatDate(data.instructDatetime) }}
                  </template>
                </Column>
                <Column field="itemType" header="생산 유형" sortable />
                <Column field="itemName" header="품목명" sortable />
                <Column field="opNo" header="공정 순서" sortable />
                <Column field="prcsName" header="현재 공정" sortable />
              </DataTable>
            </v-container>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- 입력 영역 -->
    <v-row v-else>
      <v-col cols="4">
        <v-card elevation="10">
          <v-card-item class="py-6 px-6">
            <v-container fluid>
              <CardHeader title="선택한 생산 지시건" />

              <v-row class="py-2">

                <v-col cols="12" class="mt-4 mb-2 py-0">
                  <v-chip
                    color="warning"
                    size="small"
                    variant="flat"
                    class="py-1 px-4 font-weight-medium"
                  >
                    {{ selectedProd.itemType }}
                  </v-chip>
                </v-col>

                <v-col cols="12" class="pt-0">
                    <p class="mx-1 text-h4 font-weight-bold">{{ selectedProd.itemName }}</p>
                </v-col>

                <v-col cols="12" class="pa-0 ma-1">
                  <v-chip
                    color="primary"
                    variant="flat"
                    class="py-1 px-4 ma-1 font-weight-medium"
                  >
                    {{ selectedProd.prodNo }}
                  </v-chip>
                  <v-chip
                    variant="tonal"
                    class="py-1 px-4 ma-1 font-weight-medium"
                  >
                    {{ selectedProd.detaInstructNo }}
                  </v-chip>
                </v-col>

                <v-col cols="12" class="pa-0 ma-1">
                  <v-chip
                    color="success"
                    variant="tonal"
                    class="ma-1 font-weight-medium"
                    prepend-icon="mdi-progress-wrench"
                  >
                    {{ selectedProd.prcsName }}
                  </v-chip>
                  <v-chip
                    variant="flat"
                    class="ma-1"
                    prepend-icon="mdi-cog"
                  >
                    {{ "총 " + selectedProd.lastOpNo + "개의 공정 중 " + selectedProd.currentOpNo + "번째 공정" }}
                  </v-chip>
                </v-col>

                <v-col cols="12" class="pa-0 ma-1">
                  <v-chip
                    color="secondary"
                    variant="outlined"
                    class="ma-1"
                    prepend-icon="mdi-calendar"
                  >
                    <p><span class="font-weight-bold">지시 일자</span> {{ formatDate(selectedProd.instructDatetime) }}</p>
                  </v-chip>
                </v-col>

              </v-row>
            </v-container>
          </v-card-item>
        </v-card>
      </v-col>


      <v-col cols="8">
        <v-card elevation="10">
          <v-card-item class="py-6 px-6">
            <v-container fluid>
              <CardHeader title="생산 실적 등록" />

              <!-- 설비 선택 -->
              <v-col cols="12" class="px-2 d-flex align-center">
                <v-text-field
                  label="설비 선택"
                  :model-value="selectedFacility.facilityName"
                  variant="outlined"
                  @click="showFacilityModal"
                  readonly
                  hide-details
                >
                  <template #append-inner>
                    <v-icon class="cursor-pointer" @click.stop="showFacilityModal">mdi-magnify</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- 투입 수량 -->
              <v-col cols="12" class="px-2 d-flex align-center">
                <v-text-field
                  label="투입 수량"
                  :model-value="formatNumber(selectedProd.drctQty || 0)"
                  variant="outlined"
                  readonly
                  hide-details
                  class="text-right"
                />
              </v-col>

              <!-- 불량 수량 -->
              <v-col cols="12" class="px-2 d-flex align-center">
                <v-text-field
                  label="불량 수량"
                  :model-value="inferQtyFormatted"
                  @update:model-value="onInferQtyInput"
                  variant="outlined"
                  hide-details
                  class="text-right"
                />
              </v-col>

              <!-- 실제 생산 수량 -->
              <v-col cols="12" class="px-2 d-flex align-center">
                <v-text-field
                  label="실제 생산 수량"
                  :model-value="prodQtyFormatted"
                  variant="outlined"
                  readonly
                  hide-details
                  class="text-right"
                />
              </v-col>

              <!-- 사원 선택 -->
              <v-col cols="12" class="px-2 d-flex align-center">
                <v-text-field
                  label="사원 선택"
                  :model-value="selectedEmp.emp_name"
                  variant="outlined"
                  @click="showEmpModal"
                  readonly
                  hide-details
                >
                  <template #append-inner>
                    <v-icon class="cursor-pointer" @click.stop="showEmpModal">mdi-magnify</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-row>
                <v-col cols="3" class="px-2 my-2 d-flex align-center">
                  <v-btn color="secondary" variant="outlined" @click="clearSelectedProd" block>다시 선택</v-btn>
                </v-col>
                <v-col cols="9" class="px-2 my-2 d-flex align-center">
                  <v-btn color="primary" @click="submitBtn" block>생산 실적 등록</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- 설비 모달 -->
    <ModalSearch
      :visible="isOpenFacilityModal"
      title="설비 검색"
      idField="prcsNumber"
      :columns="[
        { key: 'facilityId', label: '설비 번호' },
        { key: 'facilityName', label: '설비명' }
      ]"
      :fetchData="getFacilityList"
      :page-size="5"
      @select="onSelectFacility"
      @close="isOpenFacilityModal = false"
    />

    <!-- 사원 모달 -->
    <ModalSearch
      :visible="isOpenEmpModal"
      title="사원 검색"
      idField="emp_id"
      :columns="[
        { key: 'emp_id', label: '사원 번호' },
        { key: 'emp_name', label: '사원 이름' }
      ]"
      :fetchData="getEmpList"
      :page-size="5"
      @select="onSelectEmp"
      @close="isOpenEmpModal = false"
    />

    <SnackBar />
</template>

<style scoped>
.text-right .v-field__input input {
  text-align: right;
}
</style>

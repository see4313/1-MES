<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';

import CardHeader from '@/components/production/card-header.vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackBar } = useSnackBar();

const selectedProd = ref({}); // 선택된 생산번호
const isOpenProdModal = ref(false);
const selectedFacility = ref({});
const isOpenFacilityModal = ref(false);
const selectedEmp = ref({});
const isOpenEmpModal = ref(false);

const inferQty = ref(0);   // 불량 수량

// 3자리 콤마 포맷
const formatNumber = (val) => {
  return (val ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 불량 수량 포맷
const inferQtyFormatted = computed(() => formatNumber(inferQty.value));

// 불량 수량 입력 처리 (투입 수량 초과 제한 포함)
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

// 실제 생산 수량 = 투입 - 불량
const prodQty = computed(() => {
  return (selectedProd.value.drctQty || 0) - (inferQty.value || 0);
});

const prodQtyFormatted = computed(() => formatNumber(prodQty.value));

// 생산 번호가 바뀌면 관련 input 초기화
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

// 생산번호
const getProdList = async () => {
  try {
    const { data } = await axios.get('/api/prod/getstatuszeroprodlist');
    return data ?? [];
  } catch (e) {
    console.error(e);
    return [];
  }
};
const onSelectProduction = (item) => {
  selectedProd.value = { ...item };
  console.log(selectedProd.value);
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
  console.log(selectedFacility.value);
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
</script>

<template>
  <v-container fluid>
      <v-row>
        
        <v-col cols="6">
          <v-card elevation="10">
            <v-card-item class="py-6 px-6">
              <v-container fluid>
                  <CardHeader title="선택된 생산건이 없습니다." />
              </v-container>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card elevation="10">
            <v-card-item class="py-6 px-6">
              <v-container fluid>
                <CardHeader title="생산 실적 등록" />
                  <!-- 생산번호 -->
                  <v-col cols="12" class="px-2 d-flex align-center">
                    <v-text-field
                      label="생산 번호"
                      :model-value="selectedProd.prodNo"
                      variant="outlined"
                      @click="showProdModal"
                      readonly
                      hide-details
                    >
                      <template #append-inner>
                        <v-icon class="cursor-pointer" @click.stop="showProdModal">mdi-magnify</v-icon>
                      </template>
                    </v-text-field>
                  </v-col>

                  <!-- 설비 -->
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

                  <!-- 사원 -->
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

                  <!-- 버튼 -->
                  <v-col cols="12" class="px-2 my-2 d-flex align-center">
                    <v-btn color="primary" @click="submitBtn" block>생산 실적 등록</v-btn>
                  </v-col>
              </v-container>
            </v-card-item>
          </v-card>
        </v-col>

    </v-row>
  </v-container>

  <p>{{ selectedProd }}</p>

  <!-- 생산번호 모달 -->
  <ModalSearch
    :visible="isOpenProdModal"
    title="생산 번호 검색"
    idField="prodNo"
    :columns="[
      { key: 'prodNo',       label: '생산 번호' },
      { key: 'itemType', label: '품목 유형' },
      { key: 'itemName',     label: '품목명' },
      { key: 'opNo',     label: '공정 순서' },
      { key: 'prcsName',     label: '현재 공정' }
    ]"
    :fetchData="getProdList"
    :page-size="5"
    @select="onSelectProduction"
    @close="isOpenProdModal = false"
  />

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
    idField="prcsNumber"
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

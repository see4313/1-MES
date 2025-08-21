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

const selectedProd = ref({});
const isOpenProdModal = ref(false);
const selectedFacility = ref({});
const isOpenFacilityModal = ref(false);
const selectedEmp = ref({});
const isOpenEmpModal = ref(false);
const prodList = ref([]);
const inferQty = ref(0);

const isConfirmDialog = ref(false);

// 생산번호 리스트
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

// 숫자 포맷
const formatNumber = (val) => (val ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// 불량 수량 포맷
const inferQtyFormatted = computed(() => formatNumber(inferQty.value));
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

// 실제 생산 수량
const prodQty = computed(() => (selectedProd.value.drctQty || 0) - (inferQty.value || 0));
const prodQtyFormatted = computed(() => formatNumber(prodQty.value));

watch(() => selectedProd.value.prodNo, () => {
  selectedFacility.value = {};
  inferQty.value = 0;
  selectedEmp.value = {};
});

// 모달 열기
const showFacilityModal = () => { isOpenFacilityModal.value = true; };
const showEmpModal = () => { isOpenEmpModal.value = true; };

// 선택 처리
const onSelectProduction = ({ data }) => {
  selectedProd.value = { ...data };
  isOpenProdModal.value = false;
};
const getFacilityList = async () => {
  const { prcsNumber } = selectedProd.value;
  try {
    const { data } = await axios.get(`/api/prod/getfacilitybyname/${prcsNumber}`);
    return data ?? [];
  } catch (e) { return []; }
};
const onSelectFacility = (item) => {
  selectedFacility.value = { ...item };
  isOpenFacilityModal.value = false;
};
const getEmpList = async () => {
  try {
    const { data } = await axios.get(`/api/selectEmp`, { params: { dept_id: 'D001' } });
    return data ?? [];
  } catch (e) { return []; }
};
const onSelectEmp = (item) => {
  selectedEmp.value = { ...item };
  isOpenEmpModal.value = false;
};

// 등록 버튼
const openConfirmDialog = () => {
  if (!selectedProd.value?.prodNo) return snackBar("생산 지시건을 선택해주세요.", "warning");
  if (!selectedFacility.value?.facilityId) return snackBar("설비를 선택해주세요.", "warning");
  if (!selectedEmp.value?.emp_id) return snackBar("사원을 선택해주세요.", "warning");
  isConfirmDialog.value = true;
};
const confirmSubmit = async () => {
  isConfirmDialog.value = false;
  const payload = {
    prodNo: selectedProd.value.prodNo,
    itemId: selectedProd.value.itemId,
    empNo: selectedEmp.value.emp_id,
    facilityNo: selectedFacility.value.facilityId,
    inputQty: selectedProd.value.drctQty,
    inferQty: inferQty.value,
    prodQty: prodQty.value,
    currOpNo: selectedProd.value.currentOpNo,
    remk: ""
  };
  try {
    const { data } = await axios.post('/api/prod/addprodacmslt', payload);
    if (data.affectedRows > 0) {
      snackBar("성공적으로 등록되었습니다.", "success");
      selectedProd.value = {};
      getProdList();
    }
  } catch (e) {
    console.error(e);
    snackBar("오류가 발생하였습니다.", "error");
  }
};
const clearSelectedProd = () => { selectedProd.value = {}; };
</script>

<template>
  <!-- 목록 -->
  <v-row v-if="!selectedProd.prodNo">
    <v-col cols="12">
      <v-card elevation="10">
        <v-container fluid>
        <v-card-item class="py-6 px-6">
          <CardHeader title="생산 지시건 선택" />
          <DataTable
            :value="prodList"
            selectionMode="single"
            :selection="selectedProd"
            dataKey="prodNo"
            paginator :rows="10"
            @row-select="onSelectProduction"
          >
            <Column field="instructNo" header="생산 지시 번호" sortable />
            <Column field="detaInstructNo" header="세부 지시 번호" sortable />
            <Column field="instructDatetime" header="지시 일자" sortable>
              <template #body="{ data }">{{ formatDate(data.instructDatetime) }}</template>
            </Column>
            <Column field="itemType" header="생산 유형" sortable />
            <Column field="itemName" header="품목명" sortable />
            <Column field="currentOpNo" header="공정 순서" sortable />
            <Column field="prcsName" header="현재 공정" sortable />
          </DataTable>
        </v-card-item>
        </v-container>
      </v-card>
    </v-col>
  </v-row>

  <!-- 입력 -->
  <v-row v-else>
    <!-- 왼쪽: 심플한 표 -->
    <v-col cols="4">
      <v-card elevation="10">
        <v-container fluid>
        <v-card-item class="py-6 px-6">
          <CardHeader title="선택한 생산 지시건" />
          <v-table density="comfortable" class="mt-4">
            <tbody>
              <tr>
                <td class="font-weight-medium text-subtitle-1">생산 지시 번호</td>
                <td class="text-subtitle-1">{{ selectedProd.instructNo }}</td>
              </tr>
              <tr>
                <td class="font-weight-medium text-subtitle-1">세부 지시 번호</td>
                <td class="text-subtitle-1">{{ selectedProd.detaInstructNo }}</td>
              </tr>
              <tr>
                <td class="font-weight-medium text-subtitle-1">품목명</td>
                <td class="text-subtitle-1">{{ selectedProd.itemName }}</td>
              </tr>
              <tr>
                <td class="font-weight-medium text-subtitle-1">생산 유형</td>
                <td class="text-subtitle-1">{{ selectedProd.itemType }}</td>
              </tr>
              <tr>
                <td class="font-weight-medium text-subtitle-1">현재 공정</td>
                <td class="text-subtitle-1">{{ selectedProd.prcsName }}</td>
              </tr>
              <tr>
                <td class="font-weight-medium text-subtitle-1">공정 순서</td>
                <td class="text-subtitle-1">총 {{ selectedProd.lastOpNo }}개 공정 중 {{ selectedProd.currentOpNo }}번째</td>
              </tr>
              <tr>
                <td class="font-weight-medium text-subtitle-1">지시 일자</td>
                <td class="text-subtitle-1">{{ formatDate(selectedProd.instructDatetime) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-item>
        </v-container>
      </v-card>
    </v-col>

    <!-- 오른쪽: 그대로 유지 -->
    <v-col cols="8">
      <v-card elevation="10">
        <v-container fluid>
        <v-card-item class="py-6 px-6">
          <CardHeader title="생산 실적 등록" />
          <v-col cols="12" class="px-2 d-flex align-center">
            <v-text-field
              label="설비 선택"
              :model-value="selectedFacility.facilityName"
              variant="outlined"
              @click="showFacilityModal"
              readonly hide-details>
              <template #append-inner>
                <v-icon class="cursor-pointer" @click.stop="showFacilityModal">mdi-magnify</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" class="px-2 d-flex align-center">
            <v-text-field label="투입 수량" :model-value="formatNumber(selectedProd.drctQty || 0)"
              variant="outlined" readonly hide-details class="text-right" />
          </v-col>
          <v-col cols="12" class="px-2 d-flex align-center">
            <v-text-field label="불량 수량" :model-value="inferQtyFormatted" @update:model-value="onInferQtyInput"
              variant="outlined" hide-details class="text-right" />
          </v-col>
          <v-col cols="12" class="px-2 d-flex align-center">
            <v-text-field label="실제 생산 수량" :model-value="prodQtyFormatted"
              variant="outlined" readonly hide-details class="text-right" />
          </v-col>
          <v-col cols="12" class="px-2 d-flex align-center">
            <v-text-field label="사원 선택" :model-value="selectedEmp.emp_name" variant="outlined"
              @click="showEmpModal" readonly hide-details>
              <template #append-inner>
                <v-icon class="cursor-pointer" @click.stop="showEmpModal">mdi-magnify</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-row>
            <v-col cols="4" class="pt-4 pb-4 pl-4 pr-1 d-flex align-center">
              <v-btn color="secondary" variant="outlined" @click="clearSelectedProd" block>
                다시 선택
              </v-btn>
            </v-col>
            <v-col cols="8" class="pt-4 pb-4 pl-1 pr-4 d-flex align-center">
              <v-btn color="primary" @click="openConfirmDialog" block>
                생산 실적 등록
              </v-btn>
            </v-col>
          </v-row>

        </v-card-item>
        </v-container>
      </v-card>
    </v-col>
  </v-row>

  <!-- 등록 확인 모달 -->
  <v-dialog v-model="isConfirmDialog" max-width="520">
    <v-card elevation="12" class="rounded-xl pa-4" color="white">
      <div class="text-center mb-4">
        <v-avatar size="48" color="grey-lighten-4">
          <v-icon size="28" color="primary">mdi-alert-circle-outline</v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold mt-2">등록하시겠습니까?</h3>
      </div>
      <v-table density="comfortable" class="mb-4">
        <tbody>
          <tr><td class="font-weight-medium text-subtitle-1">생산 지시 번호</td><td class="text-subtitle-1">{{ selectedProd.instructNo }}</td></tr>
          <tr><td class="font-weight-medium text-subtitle-1">세부 지시 번호</td><td class="text-subtitle-1">{{ selectedProd.detaInstructNo }}</td></tr>
          <tr><td class="font-weight-medium text-subtitle-1">품목명</td><td class="text-subtitle-1">{{ selectedProd.itemName }}</td></tr>
          <tr><td class="font-weight-medium text-subtitle-1">투입 수량</td><td class="text-subtitle-1">{{ formatNumber(selectedProd.drctQty || 0) }}</td></tr>
          <tr><td class="font-weight-medium text-subtitle-1">불량 수량</td><td class="text-subtitle-1">{{ inferQtyFormatted }}</td></tr>
          <tr><td class="font-weight-medium text-subtitle-1">실제 생산 수량</td><td class="text-subtitle-1">{{ prodQtyFormatted }}</td></tr>
        </tbody>
      </v-table>
      <v-card-actions class="justify-end">
        <v-btn variant="tonal" color="grey-darken-1" rounded="lg" @click="isConfirmDialog = false">취소</v-btn>
        <v-btn color="primary" rounded="lg" class="ml-2 px-6" @click="confirmSubmit">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 공용 모달 -->
  <ModalSearch :visible="isOpenFacilityModal" title="설비 검색" idField="prcsNumber"
    :columns="[{ key: 'facilityId', label: '설비 번호' },{ key: 'facilityName', label: '설비명' }]"
    :fetchData="getFacilityList" :page-size="5"
    @select="onSelectFacility" @close="isOpenFacilityModal = false" />
  <ModalSearch :visible="isOpenEmpModal" title="사원 검색" idField="emp_id"
    :columns="[{ key: 'emp_id', label: '사원 번호' },{ key: 'emp_name', label: '사원 이름' }]"
    :fetchData="getEmpList" :page-size="5"
    @select="onSelectEmp" @close="isOpenEmpModal = false" />

  <SnackBar />
</template>

<style scoped>
.text-right .v-field__input input {
  text-align: right;
}
</style>

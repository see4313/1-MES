<script setup>
import { ref } from 'vue';
import axios from 'axios';

import CardHeader from '@/components/production/card-header.vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';

const { snackBar } = useSnackBar();

const selectedProd = ref({}); // 선택된 생산번호
const isOpenProdModal = ref(false); // 생산번호 선택 모달 오픈여부
const selectedFacility = ref({}); // 선택된 설비
const isOpenFacilityModal = ref(false); // 설비 선택 모달 오픈여부
const selectedEmp = ref({}); // 선택된 사원
const isOpenEmpModal = ref(false); // 사원 선택 모달 오픈여부

const showProdModal = () => { isOpenProdModal.value = true };
const showFacilityModal = () => { 
  if (!selectedProd.value.prcsNumber) {
    snackBar("생산번호를 먼저 선택해주세요", "warning");
    return;
  }
  isOpenFacilityModal.value = true 
};
const showEmpModal = () => { 
  isOpenEmpModal.value = true 
};

const getProdList = async () => {
  try {
    const { data } = await axios.get('/api/prod/getstatuszeroprodlist');
    return data ?? [];
  } catch (e) {
    console.error(e)
    return [];
  }
};

const onSelectProduction = (item) => {
  selectedProd.value = { ...item };
  console.log(selectedProd.value);
  isOpenProdModal.value = false;
};

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

const onSelectFacility= (item) => {
  selectedFacility.value = { ...item };
  console.log(selectedFacility.value);
  isOpenFacilityModal.value = false;
};
</script>

<template>
  <v-card elevation="10">
    <v-card-item class="py-6 px-6">
      <v-container fluid>
        <CardHeader title="생산 실적 등록" />
        <v-row no-gutters>

          <v-col cols="12" class="px-2 my-2 d-flex align-center">
            <v-text-field
              label="생산 번호"
              :model-value="selectedProd.prodNo"
              variant="outlined"
              @click="showProdModal"
              readonly
              hide-details
            >
              <template #append-inner>
                <v-icon class="cursor-pointer" @click.stop="showProdModal">
                  mdi-magnify
                </v-icon>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12" class="px-2 my-2 d-flex align-center">
            <v-text-field
              label="설비 선택"
              :model-value="selectedFacility.facilityName"
              variant="outlined"
              @click="showFacilityModal"
              readonly
              hide-details
            >
              <template #append-inner>
                <v-icon class="cursor-pointer" @click.stop="showFacilityModal">
                  mdi-magnify
                </v-icon>
              </template>
            </v-text-field>
          </v-col>

          <!-- <v-col cols="12" class="px-2 my-2 d-flex align-center">
            <v-text-field
              label="사원 선택"
              :model-value="selectedFacility.facilityName"
              variant="outlined"
              @click="showFacilityModal"
              readonly
              hide-details
            >
              <template #append-inner>
                <v-icon class="cursor-pointer" @click.stop="showFacilityModal">
                  mdi-magnify
                </v-icon>
              </template>
            </v-text-field>
          </v-col> -->


        </v-row>
      </v-container>
    </v-card-item>
  </v-card>

  <ModalSearch
    :visible="isOpenProdModal"
    title="생산 번호 검색"
    idField="prodNo"
    :columns="[
      { key: 'prodNo',       label: '생산 번호' },
      { key: 'itemTypeName', label: '생산 품목 유형' },
      { key: 'itemName',     label: '품목명' },
      { key: 'prcsName',     label: '현재 공정' }
    ]"
    :fetchData="getProdList"
    :page-size="5"
    @select="onSelectProduction"
    @close="isOpenProdModal = false"
  />

  <ModalSearch
    :visible="isOpenFacilityModal"
    title="설비 검색"
    idField="prcsNumber"
    :columns="[
      { key: 'facilityId', label: '설비 번호' },
      { key: 'facilityName', label: '설비명' },
    ]"
    :fetchData="getFacilityList"
    :page-size="5"
    @select="onSelectFacility"
    @close="isOpenFacilityModal = false"
  />

  <SnackBar />
</template>

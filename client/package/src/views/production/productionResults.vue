<script setup>
import { ref } from 'vue';
import axios from 'axios';
import CardHeader from '@/components/production/card-header.vue';
import ModalSearch from '@/views/commons/CommonModal.vue';

const selectedProd = ref({});
const isOpenProdModal = ref(false);

const showProdModal = () => { isOpenProdModal.value = true };

const getProdList = async () => {
  try {
    const { data } = await axios.get('/api/prod/getstatuszeroprodlist');
    return data ? data : [];
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
</script>

<template>
  <v-card elevation="10">
    <v-card-item class="py-6 px-6">
      <v-container fluid>
        <CardHeader title="생산 실적 등록" />
        <v-row no-gutters>
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
                <v-icon class="cursor-pointer" @click.stop="showProdModal">
                  mdi-magnify
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
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
</template>

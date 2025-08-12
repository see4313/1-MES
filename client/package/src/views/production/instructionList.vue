<!-- instructionList.vue -->
<script setup>
import CardHeader from '@/components/production/card-header.vue'
</script>

<template>
  <v-card elevation="10">
    <v-card-item class="py-6 px-6">
      <v-container fluid>
        <h1>test</h1>
      </v-container>
    </v-card-item>
  </v-card>
  <div class="my-4"></div>

  <v-card elevation="10">
    <v-card-item class="py-6 px-6">
      <v-container fluid>
        <CardHeader
          title="생산 지시 조회"
        />

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

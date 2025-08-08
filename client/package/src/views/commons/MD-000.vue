<template>
    <button @click="openModal">주문 검색</button>

    <ModalSearch
        :title="'주문 번호'"
        :data="productList"
        :columns="productColumns"
        :visible="showModal"
        idField="orderNo"
        @close="showModal = false"
        @select="handleSelect"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';

const showModal = ref(false);

const productList = ref([
    { orderNo: 'P001', empName: '사원1', vendName: '소베', orderDate: '2025-08-08' },
    { orderNo: 'P002', empName: '사원2', vendName: '소베', orderDate: '2025-08-08' }
]);

const productColumns = [
    { key: 'orderNo', label: '주문 번호' },
    { key: 'empName', label: '담당자' },
    { key: 'vendName', label: '업체명' },
    { key: 'orderDate', label: '주문일자' }
];

function openModal() {
    showModal.value = true;
}

function handleSelect(selected: any) {
    console.log('선택된 상품:', selected);
    // ex) form.value.productCode = selected.productCode
}
</script>

<template>
    <v-row>
        <v-card elevation="10">
            <v-card-item class="py-4 px-6">
                <v-col cols="12">
                    <div class="d-sm-flex align-center justify-space-between">
                        <v-card-title class="text-h5 mb-0">주문조회</v-card-title>
                    </div>
                </v-col>
                <v-row no-gutters>
                    <v-col>
                        <v-sheet class="pa-2 ma-2">
                            <v-text-field
                                variant="outlined"
                                label="담당자 검색"
                                append-inner-icon="mdi-magnify"
                                @click:append-inner="onSearchCompany"
                            />
                        </v-sheet>
                    </v-col>
                    <v-col>
                        <v-sheet class="pa-2 ma-2">
                            <v-text-field
                                variant="outlined"
                                label="주문명 검색"
                                append-inner-icon="mdi-magnify"
                                @click:append-inner="onSearchCompany"
                            />
                        </v-sheet>
                    </v-col>
                    <v-sheet class="pa-2 ma-2">
                        <v-btn color="primary">주문일자📅</v-btn>
                    </v-sheet>
                    <v-col>
                        <v-sheet class="pa-2 ma-2">
                            <v-btn color="primary">조회</v-btn>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card-item>
            <DataTable :value="products" tableStyle="min-width: 50rem">
                <Column field="productId" header="주문코드"></Column>
                <Column field="itemName" header="주문명"></Column>
                <Column field="qty" header="주문일자"></Column>
                <Column field="amt" header="담당자"></Column>
                <Column field="allamt" header="업체명"></Column>
                <Column field="allamt" header="상태"></Column>
                <Column field="allamt" header="비고"></Column>
            </DataTable>
        </v-card>

        <v-card elevation="10" class="mt-10">
            <div class="d-sm-flex align-center justify-space-between">
                <v-card-title class="text-h5 mb-0">주문조회</v-card-title>
            </div>

            <DataTable :value="products" tableStyle="min-width: 50rem">
                <Column field="productId" header="주문상세코드"></Column>
                <Column field="itemName" header="주문코드"></Column>
                <Column field="qty" header="제품코드"></Column>
                <Column field="amt" header="제품명"></Column>
                <Column field="allamt" header="수량"></Column>
                <Column field="allamt" header="금액"></Column>
                <Column field="allamt" header="총금액"></Column>
            </DataTable>
        </v-card>
    </v-row>
</template>
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, computed } from 'vue';
import { ProductService } from '@/service/ProductService';
import dayjs from 'dayjs';

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

function onSearchEmployee() {
    console.log('담당자 검색 클릭!');
}

function onSearchCompany() {
    console.log('업체명 검색 클릭!');
}

const products = ref();
const joinMenu = ref(false);
const joinDate = ref(null);
const leavMenu = ref(false);
const leavDate = ref(null);

const formattedJoinDate = computed(() => {
    return joinDate.value ? dayjs(joinDate.value).format('YYYY-MM-DD') : '';
});

const formattedLeavDate = computed(() => {
    return leavDate.value ? dayjs(leavDate.value).format('YYYY-MM-DD') : '';
});
</script>

<style scoped>
::v-deep(.v-field__append-inner) {
    cursor: pointer;
}
</style>

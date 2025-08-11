<!-- 제품조회 -->
<template>
    <v-row>
        <v-card elevation="10">
            <v-card-item class="py-6 px-6">
                <CardHeader title="제품 조회" btn-text="조회" btn-variant="flat" btn-color="primary" @btn-click="Select()" />
            </v-card-item>
            <v-row no-gutters>
                <v-col cols="12" sm="4">
                    <v-sheet class="pa-2 ma-2">
                        <v-text-field variant="outlined" label="제품코드 검색" v-model="selectemp" readonly>
                            <template #append-inner>
                                <v-icon @click="showModal = true" class="cursor-pointer">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>
                    </v-sheet>
                </v-col>
            </v-row>

            <DataTable :value="orderList" tableStyle="min-width: 50rem" @row-click="onRowClick" class="cursor-pointer">
                <Column field="order_id" header="LOT"></Column>
                <Column field="ordr" header="제품 코드"></Column>
                <Column field="ordr_date" header="입고 일자"></Column>
                <Column field="emp_name" header="완제품명"></Column>
                <Column field="vend_name" header="창고코드"></Column>
                <Column field="st" header="안전재고량"></Column>
                <Column field="remk" header="현수량"></Column>
                <Column field="remk" header="안전대비 보유율"></Column>
            </DataTable>
        </v-card>
    </v-row>
</template>

<script setup>
import CardHeader from '@/components/production/card-header-btn.vue';
import Column from 'primevue/column';
import ModalSearch from '@/views/commons/CommonModal.vue';
import DataTable from 'primevue/datatable';
import { ref } from 'vue';
</script>

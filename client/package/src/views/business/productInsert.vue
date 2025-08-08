<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="주문등록">
                <h3>주문등록</h3>
                <v-row justify="end">
                    <v-btn color="primary">등록</v-btn>
                </v-row>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="주문명" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="담당자"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="onSearchEmployee"
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            variant="outlined"
                            label="업체명"
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="onSearchCompany"
                        />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="joinMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="joinDate"
                                    label="주문일자"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedJoinDate"
                                />
                            </template>
                            <v-date-picker v-model="joinDate" @change="joinMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="leavMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="leavDate"
                                    label="납기일자"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedLeavDate"
                                />
                            </template>
                            <v-date-picker v-model="leavDate" @change="leavMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="비고" />
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <div class="card">
                <DataTable :value="products" tableStyle="min-width: 50rem">
                    <Column field="code" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                </DataTable>
            </div>
        </v-col>
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

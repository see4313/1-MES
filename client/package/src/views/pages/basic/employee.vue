<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="사원조회">
                <h3>사원조회</h3>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="사원명" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="부서명" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="연락처" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-menu v-model="joinMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="joinDate"
                                    label="입사일"
                                    prepend-icon="mdi-calendar"
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
                                    label="퇴사일"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="formattedLeavDate"
                                />
                            </template>
                            <v-date-picker v-model="leavDate" @change="leavMenu = false" />
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="사원상태" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field variant="outlined" label="권한" />
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
    <v-row>
        <v-data-table-server
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="serverItems"
            :items-length="totalItems"
            :loading="loading"
            item-value="name"
            @update:options="loadItems"
        ></v-data-table-server>
    </v-row>
</template>
<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

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

const cars = [
    {
        name: 'Ford Mustang',
        horsepower: 450,
        fuel: 'Gasoline',
        origin: 'USA',
        price: 55000
    },
    {
        name: 'Tesla Model S',
        horsepower: 670,
        fuel: 'Electric',
        origin: 'USA',
        price: 79999
    },
    {
        name: 'BMW M3',
        horsepower: 503,
        fuel: 'Gasoline',
        origin: 'Germany',
        price: 70000
    },
    {
        name: 'Audi RS6',
        horsepower: 591,
        fuel: 'Gasoline',
        origin: 'Germany',
        price: 109000
    },
    {
        name: 'Chevrolet Camaro',
        horsepower: 650,
        fuel: 'Gasoline',
        origin: 'USA',
        price: 62000
    },
    {
        name: 'Porsche 911',
        horsepower: 379,
        fuel: 'Gasoline',
        origin: 'Germany',
        price: 101000
    },
    {
        name: 'Jaguar F-Type',
        horsepower: 575,
        fuel: 'Gasoline',
        origin: 'UK',
        price: 61000
    },
    {
        name: 'Mazda MX-5',
        horsepower: 181,
        fuel: 'Gasoline',
        origin: 'Japan',
        price: 26000
    },
    {
        name: 'Nissan GT-R',
        horsepower: 565,
        fuel: 'Gasoline',
        origin: 'Japan',
        price: 113540
    },
    {
        name: 'Mercedes-AMG GT',
        horsepower: 523,
        fuel: 'Gasoline',
        origin: 'Germany',
        price: 115900
    }
];

const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy }) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const items = cars.slice();
                if (sortBy.length) {
                    const sortKey = sortBy[0].key;
                    const sortOrder = sortBy[0].order;
                    items.sort((a, b) => {
                        const aValue = a[sortKey];
                        const bValue = b[sortKey];
                        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
                    });
                }
                const paginated = items.slice(start, end);
                resolve({ items: paginated, total: items.length });
            }, 500);
        });
    }
};
const itemsPerPage = ref(5);
const headers = ref([
    { title: 'Car Model', key: 'name', align: 'start' },
    { title: 'Horsepower', key: 'horsepower', align: 'end' },
    { title: 'Fuel Type', key: 'fuel', align: 'start' },
    { title: 'Origin', key: 'origin', align: 'start' },
    { title: 'Price ($)', key: 'price', align: 'end' }
]);
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
function loadItems({ page, itemsPerPage, sortBy }) {
    loading.value = true;
    FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
        serverItems.value = items;
        totalItems.value = total;
        loading.value = false;
    });
}
</script>

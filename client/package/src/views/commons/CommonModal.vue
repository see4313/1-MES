<template>
    <v-dialog v-model="dialog" max-width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">{{ title }}</span>
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-text-field v-model="search" label="검색" append-inner-icon="mdi-magnify" variant="outlined" clearable class="mb-4" />

                <v-data-table
                    :headers="headers"
                    :items="filteredData"
                    :search="search"
                    :items-per-page="pageSize"
                    :items-per-page-options="[5, 10, 15, 20]"
                    :page.sync="page"
                    class="elevation-1"
                >
                    <template #item.action="{ item }">
                        <v-btn color="primary" size="small" @click="selectItem(item)">선택</v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    visible: Boolean,
    title: String,
    columns: Array, // [{ key: 'itemCode', label: '품목코드' }, ...]
    idField: String,
    fetchData: Function,
    pageSize: {
        type: Number,
        default: 10
    }
});

const emit = defineEmits(['close', 'select']);

const dialog = ref(false);
const search = ref('');
const fullData = ref([]);
const page = ref(1);

const filteredData = computed(() => fullData.value);

const headers = computed(() => {
    return [
        ...props.columns.map((col) => ({
            title: col.label,
            value: col.key,
            sortable: true
        })),
        { title: '선택', value: 'action', sortable: false }
    ];
});

async function loadData() {
    const result = await props.fetchData?.();
    fullData.value = result || [];
}

function selectItem(item) {
    emit('select', item);
    close();
}

function close() {
    emit('close');
    dialog.value = false;
}

watch(
    () => props.visible,
    (val) => {
        dialog.value = val;
        if (val) loadData();
    }
);

watch(dialog, (val) => {
    if (!val) {
        emit('close');
    }
});
</script>

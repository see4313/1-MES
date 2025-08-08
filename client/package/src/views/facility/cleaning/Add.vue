<template>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="사원조회">
                <h3>세척이력 등록</h3>

                <v-form @submit.prevent="submitForm">
                    <v-row dense>
                        <!-- 설비명 -->
                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.facilityName" label="설비명" variant="outlined">
                                <template #append-inner>
                                    <v-icon class="cursor-pointer" @click="showFacilityModal = true">mdi-magnify</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.cleaningItem" :rules="[required]" label="세척 항목" variant="outlined" />
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-menu v-model="joinMenu" :close-on-content-click="false" location="bottom start" :offset="8" min-width="auto">
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-bind="props"
                                        :model-value="formattedJoinDate"
                                        :rules="[() => !!form.cleaningDate || '필수 항목입니다.']"
                                        label="세척 일자"
                                        prepend-inner-icon="mdi-calendar"
                                        readonly
                                        variant="outlined"
                                        clearable
                                        @click:clear="form.cleaningDate = null"
                                    />
                                </template>

                                <v-date-picker
                                    :model-value="form.cleaningDate"
                                    locale="ko-KR"
                                    :max="today"
                                    @update:model-value="
                                        (val) => {
                                            form.cleaningDate = normalizeDate(val);
                                            joinMenu = false;
                                        }
                                    "
                                />
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.manager" :rules="[required]" label="담당자" variant="outlined" />
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.method" label="세척방법" variant="outlined" />
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.result" label="세척결과/비고" variant="outlined" />
                        </v-col>
                    </v-row>

                    <v-btn :loading="loading" type="submit" color="primary" class="mt-4">등록</v-btn>
                </v-form>
            </UiParentCard>
        </v-col>
    </v-row>

    <!-- 설비 검색 모달 -->
    <ModalSearch
        :data="facilityList"
        :visible="showFacilityModal"
        title="설비검색"
        idField="facility_id"
        :columns="[
            { key: 'facility_id', label: '설비ID' },
            { key: 'facility_nm', label: '설비명' },
            { key: 'facility_type', label: '유형' }
        ]"
        :fetchData="fetchFacilities"
        :pageSize="5"
        @select="onSelectFacility"
        @close="showFacilityModal = false"
    />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';

const facilityList = ref([
    { facility_id: 'FC001', facility_nm: '혼합기1호', facility_type: '혼합' },
    { facility_id: 'FC002', facility_nm: '냉동기2호', facility_type: '냉동' },
    { facility_id: 'FC003', facility_nm: '포장기3호', facility_type: '포장' },
    { facility_id: 'FC004', facility_nm: '발효기1호', facility_type: '발효' },
    { facility_id: 'FC005', facility_nm: '혼합기2호', facility_type: '혼합' }
]);

type CleaningForm = {
    facilityId: number | null;
    facilityName: string;
    cleaningItem: string;
    cleaningDate: Date | null;
    manager: string;
    method: string;
    result: string;
};

const form = ref<CleaningForm>({
    facilityId: null,
    facilityName: '',
    cleaningItem: '',
    cleaningDate: null,
    manager: '',
    method: '',
    result: ''
});

const joinMenu = ref(false);
const loading = ref(false);
const today = new Date();

const required = (v: unknown) => (!!v && String(v).trim().length > 0) || '필수 항목입니다.';

const normalizeDate = (val: unknown): Date | null => {
    if (!val) return null;
    return val instanceof Date ? val : new Date(val as any);
};

function toYmd(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const formattedJoinDate = computed(() => (form.value.cleaningDate ? toYmd(form.value.cleaningDate) : ''));

async function submitForm() {
    loading.value = true;
    try {
        const res = await fetch('/api/clean-hist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                facilityId: form.value.facilityId,
                cleaningItem: form.value.cleaningItem,
                cleaningDate: formattedJoinDate.value,
                manager: form.value.manager,
                method: form.value.method,
                result: form.value.result
            })
        });

        if (!res.ok) {
            const msg = await res.json().catch(() => ({}));
            alert(`등록 실패: ${msg.message || res.statusText}`);
            return;
        }

        const data = await res.json();
        alert(`등록 완료! ID: ${data.insertedId}`);

        form.value = { facilityId: null, facilityName: '', cleaningItem: '', cleaningDate: null, manager: '', method: '', result: '' };
    } catch (e: any) {
        alert(`에러: ${e?.message || e}`);
    } finally {
        loading.value = false;
    }
}

/* ---------- 설비 검색 모달 ---------- */
const showFacilityModal = ref(false);

const mapFacility = (r: any) => ({
    facility_id: r.facility_id ?? r.FACILITY_ID,
    facility_nm: r.facility_nm ?? r.FACILITY_NM,
    facility_type: r.facility_type ?? r.FACILITY_TYPE
});

async function fetchFacilities(query = '', page = 1, size = 5) {
    const { data } = await axios.get('/api/facilities', { params: { q: query, page, size } });
    const items = Array.isArray(data) ? data : (data.items ?? []);
    return items.map(mapFacility);
}

function onSelectFacility(row: { facility_id: number; facility_nm: string }) {
    form.value.facilityId = row.facility_id;
    form.value.facilityName = row.facility_nm;
    showFacilityModal.value = false;
}
</script>

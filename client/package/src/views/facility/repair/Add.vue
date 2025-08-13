<template>
    <div>
        <!-- 상단 카드 -->
        <v-card elevation="10">
            <v-card-item class="py-6 px-6">
                <CardHeader
                    title="세척이력 등록"
                    btn-text1="초기화"
                    btn-variant1="flat"
                    btn-color1="grey"
                    @btn-click1="onReset"
                    btn-text2="등록"
                    btn-variant2="flat"
                    btn-color2="primary"
                    @btn-click2="submitForm"
                    :loading="loading"
                />
            </v-card-item>
        </v-card>

        <!-- 입력 폼 -->
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

                            <!-- 세척 항목 -->
                            <v-col cols="12" sm="4">
                                <v-text-field v-model="form.cleaningItem" :rules="[required]" label="세척 항목" variant="outlined" />
                            </v-col>

                            <!-- 세척 일자 -->
                            <v-col cols="12" sm="4">
                                <v-menu
                                    v-model="joinMenu"
                                    :close-on-content-click="false"
                                    location="bottom start"
                                    :offset="8"
                                    min-width="auto"
                                >
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

                            <!-- 담당자 -->
                            <v-col cols="12" sm="4">
                                <v-text-field v-model="form.manager" :rules="[required]" label="담당자" variant="outlined" />
                            </v-col>

                            <!-- 세척방법 -->
                            <v-col cols="12" sm="4">
                                <v-text-field v-model="form.method" label="세척방법" variant="outlined" />
                            </v-col>

                            <!-- 세척결과/비고 -->
                            <v-col cols="12" sm="4">
                                <v-text-field v-model="form.result" label="세척결과/비고" variant="outlined" />
                            </v-col>
                        </v-row>

                        <!-- 등록 버튼 -->
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ModalSearch from '@/views/commons/CommonModal.vue';
import axios from 'axios';

// 폼 타입 정의
type CleaningForm = {
    facilityId: number | null;
    facilityName: string;
    cleaningItem: string;
    cleaningDate: Date | null;
    manager: string;
    method: string;
    result: string;
};

// 폼 상태
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

// 필수 입력 검증
const required = (v: unknown) => (!!v && String(v).trim().length > 0) || '필수 항목입니다.';

// 날짜 포맷 변환
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

// 폼 제출
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

// 모달 제어
const showFacilityModal = ref(false);
const facilityList = ref([]);

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

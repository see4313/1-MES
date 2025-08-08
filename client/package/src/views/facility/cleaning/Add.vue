<template>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="사원조회">
                <h3>세척이력 등록</h3>

                <v-form @submit.prevent="submitForm">
                    <v-row dense>
                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.facilityName" label="설비명" variant="outlined" />
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.cleaningItem" :rules="[required]" label="세척 항목" variant="outlined" />
                        </v-col>

                        <v-col cols="12" sm="4">
                            <!-- 달력 팝업 -->
                            <v-menu v-model="joinMenu" :close-on-content-click="false" location="bottom start" :offset="8" min-width="auto">
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-bind="props"
                                        :value="formattedJoinDate"
                                        :rules="[required]"
                                        label="세척 일자"
                                        append-inner-icon="mdi-calendar"
                                        readonly
                                        variant="outlined"
                                        clearable
                                        @click:clear="form.cleaningDate = ''"
                                    />
                                </template>

                                <v-date-picker>
                                    v-model="form.cleaningDate" locale="ko-KR" :max="today"
                                    <!-- 미래 날짜 금지 -->
                                    @update:model-value="joinMenu = false"
                                </v-date-picker>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type CleaningForm = {
    facilityName: string;
    cleaningItem: string;
    cleaningDate: string | Date | '';
    manager: string;
    method: string;
    result: string;
};

const form = ref<CleaningForm>({
    facilityName: '',
    cleaningItem: '',
    cleaningDate: '',
    manager: '',
    method: '',
    result: ''
});

const joinMenu = ref(false);
const loading = ref(false);
const today = new Date(); // v-date-picker max 제한

// 필수값 검증
const required = (v: unknown) => (!!v && String(v).trim().length > 0) || '필수 항목입니다.';

// YYYY-MM-DD 포맷
function toYmd(d: string | Date) {
    const dt = typeof d === 'string' ? new Date(d) : d;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const formattedJoinDate = computed(() => (form.value.cleaningDate ? toYmd(form.value.cleaningDate as any) : ''));

async function submitForm() {
    loading.value = true;
    try {
        const res = await fetch('/api/clean-hist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                facilityId: null, // TODO: 실제 facility_id로 교체
                cleaningItem: form.value.cleaningItem,
                cleaningDate: formattedJoinDate.value, // YYYY-MM-DD
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

        // 초기화
        form.value = { facilityName: '', cleaningItem: '', cleaningDate: '', manager: '', method: '', result: '' };
    } catch (e: any) {
        alert(`에러: ${e?.message || e}`);
    } finally {
        loading.value = false;
    }
}
</script>

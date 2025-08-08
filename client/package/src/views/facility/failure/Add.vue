<template>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="고장등록">
                <v-form @submit.prevent="submitForm">
                    <v-row dense>
                        <!-- 설비명 -->
                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.facilityName" label="설비명" variant="outlined" />
                        </v-col>

                        <!-- 고장 발견자 -->
                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.reporter" :rules="[required]" label="고장 발견자" variant="outlined" />
                        </v-col>

                        <!-- 고장 발생 일시 (날짜+시간) -->
                        <v-col cols="12" sm="4">
                            <v-menu v-model="dateMenu" :close-on-content-click="false" location="bottom start" min-width="auto">
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-bind="props"
                                        :model-value="formattedFaultDateTime"
                                        :rules="[required]"
                                        label="고장 발생 일시"
                                        append-inner-icon="mdi-calendar-clock"
                                        readonly
                                        variant="outlined"
                                        clearable
                                        @click:clear="clearDateTime"
                                    />
                                </template>

                                <v-card>
                                    <!--  Date 객체로 주고받기 -->
                                    <v-date-picker v-model="datePart" locale="ko-KR" :max="today" />
                                    <!-- 시간 선택 (문자열 'HH:mm:ss') -->
                                    <v-time-picker v-model:model-value="timePart" format="24hr" use-seconds scrollable />
                                    <v-card-actions class="justify-end">
                                        <v-btn text color="primary" @click="applyDateTime">확인</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </v-col>

                        <!-- 고장 유형 -->
                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.faultType" :rules="[required]" label="고장 유형" variant="outlined" />
                        </v-col>

                        <!-- 긴급 정도 -->
                        <v-col cols="12" sm="4">
                            <v-text-field v-model="form.urgency" label="긴급 정도" variant="outlined" />
                        </v-col>

                        <!-- 고장 내용 및 조치사항 -->
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="form.result" label="고장 내용 및 조치사항" variant="outlined" rows="3" />
                        </v-col>
                    </v-row>

                    <div class="d-flex" style="gap: 12px">
                        <v-btn :loading="loading" type="submit" color="primary" class="mt-4">등록</v-btn>
                        <v-btn type="button" color="grey-darken-1" class="mt-4" @click="resetForm">초기화</v-btn>
                    </div>
                </v-form>
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type FailureForm = {
    facilityName: string;
    reporter: string;
    faultDateTime: string | '';
    faultType: string;
    urgency: string;
    result: string;
};

const form = ref<FailureForm>({
    facilityName: '',
    reporter: '',
    faultDateTime: '',
    faultType: '',
    urgency: '',
    result: ''
});

const loading = ref(false);

// ----- 날짜/시간 픽커 상태 -----
const dateMenu = ref(false);
const today = new Date(); //  v-date-picker max에 그대로 사용
const datePart = ref<Date | null>(new Date()); //  반드시 Date 객체!
const timePart = ref<string | null>(new Date().toTimeString().slice(0, 5)); // "HH:MM:ss"

// 필수값 검증
const required = (v: unknown) => (!!v && String(v).trim().length > 0) || '필수 항목입니다.';

// 화면 표시용 포맷 (YYYY-MM-DD HH:mm:ss)
const formattedFaultDateTime = computed(() => {
    if (!form.value.faultDateTime) return '';
    const dt = new Date(form.value.faultDateTime);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    const hh = String(dt.getHours()).padStart(2, '0');
    const mm = String(dt.getMinutes()).padStart(2, '0');
    const ss = String(dt.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

// 날짜+시간 합쳐서 ISO 저장
function applyDateTime() {
    if (!datePart.value || !timePart.value) return;
    const [hh, mm, ss] = timePart.value.split(':').map(Number);
    const merged = new Date(datePart.value);
    merged.setHours(hh ?? 0, mm ?? 0, ss ?? 0, 0);
    form.value.faultDateTime = merged.toISOString();
    dateMenu.value = false;
}

// 초기화
function resetForm() {
    form.value = { facilityName: '', reporter: '', faultDateTime: '', faultType: '', urgency: '', result: '' };
    const n = new Date();
    datePart.value = n;
    timePart.value = n.toTimeString().slice(0, 5); // "HH:MM:ss"
}

// 제출
async function submitForm() {
    loading.value = true;
    try {
        const res = await fetch('/api/failure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
        });

        if (!res.ok) {
            const msg = await res.json().catch(() => ({}));
            alert(`등록 실패: ${msg.message || res.statusText}`);
            return;
        }

        const data = await res.json();
        alert(`등록 완료! ID: ${data.insertedId}`);
        resetForm();
    } catch (e: any) {
        alert(`에러: ${e?.message || e}`);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <v-container fluid>
        <!-- 상단 통계 카드 -->
        <v-row dense>
            <v-col cols="12" sm="3">
                <v-card elevation="4" class="pa-4 text-center">
                    <v-icon color="primary" size="36">mdi-factory</v-icon>
                    <h3>총 설비</h3>
                    <p class="text-h5">{{ summary.total }} 대</p>
                </v-card>
            </v-col>
            <v-col cols="12" sm="3">
                <v-card elevation="4" class="pa-4 text-center">
                    <v-icon color="success" size="36">mdi-cog-play</v-icon>
                    <h3>가동</h3>
                    <p class="text-h5">{{ summary.running }} 대</p>
                </v-card>
            </v-col>
            <v-col cols="12" sm="3">
                <v-card elevation="4" class="pa-4 text-center">
                    <v-icon color="error" size="36">mdi-alert</v-icon>
                    <h3>비가동</h3>
                    <p class="text-h5">{{ summary.stopped }} 대</p>
                </v-card>
            </v-col>
            <v-col cols="12" sm="3">
                <v-card elevation="4" class="pa-4 text-center">
                    <v-icon color="warning" size="36">mdi-wrench</v-icon>
                    <h3>점검중</h3>
                    <p class="text-h5">{{ summary.inspect }} 대</p>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <!-- 고장/수리 현황 -->
            <v-col cols="12" md="7">
                <UiParentCard title="고장 / 수리 현황">
                    <v-table dense>
                        <thead>
                            <tr>
                                <th>설비명</th>
                                <th>고장유형</th>
                                <th>긴급도</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in failureList" :key="row.id">
                                <td>{{ row.facility_name }}</td>
                                <td>{{ row.failure_type }}</td>
                                <td>
                                    <v-chip :color="row.urgency === '긴급' ? 'error' : 'primary'">
                                        {{ row.urgency }}
                                    </v-chip>
                                </td>
                                <td>
                                    <v-chip :color="row.status === '미수리' ? 'error' : 'success'">
                                        {{ row.status }}
                                    </v-chip>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </UiParentCard>
            </v-col>

            <!-- 예정 작업 -->
            <v-col cols="12" md="5">
                <UiParentCard title="예정 작업">
                    <v-list dense>
                        <v-list-item v-for="task in upcomingTasks" :key="task.id">
                            <v-list-item-content>
                                <v-list-item-title> {{ task.facility_name }} ({{ task.date }}) </v-list-item-title>
                                <v-list-item-subtitle> {{ task.type }} 예정 </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </UiParentCard>
            </v-col>
        </v-row>

        <v-row>
            <!-- 설비 가동률 차트 -->
            <v-col cols="12">
                <UiParentCard title="설비 가동률 추이">
                    <apexchart type="line" height="300" :options="chartOptions" :series="chartSeries" />
                </UiParentCard>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';

// 상단 요약 데이터
const summary = ref({
    total: 15,
    running: 10,
    stopped: 3,
    inspect: 2
});

// 고장/수리 현황
const failureList = ref([
    { id: 1, facility_name: '믹서기1', failure_type: '모터 고장', urgency: '긴급', status: '미수리' },
    { id: 2, facility_name: '발효기2', failure_type: '온도센서 오류', urgency: '보통', status: '수리중' }
]);

// 예정 작업
const upcomingTasks = ref([
    { id: 1, facility_name: '성형기', date: '2025-08-21', type: '점검' },
    { id: 2, facility_name: '냉동기3', date: '2025-08-22', type: '세척' }
]);

// 차트 데이터 (예: 월별 가동률)
const chartOptions = {
    chart: { toolbar: { show: false } },
    xaxis: { categories: ['1월', '2월', '3월', '4월', '5월', '6월'] },
    yaxis: { title: { text: '가동률 (%)' } },
    colors: ['#2196f3']
};

const chartSeries = [
    {
        name: '가동률',
        data: [82, 75, 88, 90, 85, 92]
    }
];
</script>

<style scoped>
h3 {
    margin: 8px 0;
}
</style>

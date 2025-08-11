<template>
    <h1>불량코드 관리</h1>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-col cols="12" md="3">
                    <h3>불량코드</h3>
                    <v-text-field v-model="qName" />
                </v-col>
                <v-col cols="12" md="3">
                    <h3>불량사유</h3>
                    <v-text-field v-model="qName" />
                </v-col>
                <v-col cols="12" md="6">
                    <h3>검사방식</h3>
                    <div style="display: flex; align-items: center; gap: 16px">
                        <v-radio-group v-model="qMethod" inline>
                            <v-radio label="전체" value="all" class="mr-8" />
                            <v-radio label="전수검사" value="전수검사" class="mr-8" />
                            <v-radio label="샘플링검사" value="샘플링검사" class="mr-6" />
                        </v-radio-group>
                        <v-btn variant="tonal" color="blue" @click="onSearch">조회</v-btn>
                        <v-btn color="primary" @click="openCreate">등록</v-btn>
                    </div>
                </v-col>
            </v-row>
            <DataTable :value="viewRows" tableStyle="font-size:0.85rem;">
                <Column field="INSP_ID" header="검사코드" /><Column field="INSP_NM" header="검사명" />
                <Column field="INSP_MTHD" header="검사방식" /><Column field="INSP_TYP" header="검사유형" />
                <Column field="BASI_VAL" header="기준값" /><Column field="UNIT" header="단위" /> <Column field="USE" header="사용" /><Column
                    field="PRCS_FG"
                    header="공정구분"
                />
                <Column field="REMK" header="비고" /><Column field="REGIST_DATE" header="등록일" />
                <Column field="MODI_DATE" header="수정일" />
            </DataTable>
            <div v-if="loading" style="margin-top: 8px; color: #666">불러오는 중…</div>
            <div v-else-if="error" style="margin-top: 8px; color: red">에러: {{ error }}</div>
        </v-container>
    </v-form>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs';
</script>

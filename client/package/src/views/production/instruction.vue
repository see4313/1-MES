<!-- instruction.vue -->
<script setup>
// import CardHeader from '@/components/production/card-header.vue';
import CardHeader from '@/components/production/card-header-btn2.vue';
import { useFormatDate } from '@/composables/useFormatDate.js';
import { ref } from 'vue';


</script>

<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader
                title="생산 지시"
                btn-icon1="mdi-plus-circle"
                btn-text1="생산 계획 불러오기"
                btn-variant1="flat"
                btn-color1="primary"
                isBtn1="false"
                @btn-click1="planLoad"
                btn-icon2="mdi-plus-circle"
                btn-text2="생산 계획 불러오기"
                btn-variant2="flat"
                btn-color2="warning"
                isBtn2="false"
                @btn-click2="planLoad"
            />
              <v-table>
                    <thead>
                        <tr>
                            <th class="text-center font-weight-bold">
                            품목 번호
                            </th>
                            <th class="text-center font-weight-bold">
                            품목 유형
                            </th>
                            <th class="text-center font-weight-bold">
                            품목명
                            </th>
                            <th class="text-center font-weight-bold">
                            지시 수량
                            </th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center">001</td>
                            <td class="text-center">테스트 제품</td>
                            <td class="text-center">테스트</td>
                            <td class="text-center">
                            <v-text-field
                                v-model="quantity"
                                type="number"
                                variant="outlined"
                                hide-details
                                density="compact"
                            />
                            </td>
                            <td class="text-center">
                                <v-btn
                                    color="error"
                                >
                                <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <v-row justify="center" class="my-2">
                        <v-btn
                            append-icon="mdi-plus-circle"
                            color="primary"
                        >품목 추가
                    </v-btn>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="12">
                        <v-menu v-model="joinMenu1" :close-on-content-click="true" transition="scale-transition" offset-y min-width="auto">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-bind="props"
                                    v-model="goalDate"
                                    label="목표 생산 일자"
                                    append-inner-icon="mdi-calendar"
                                    readonly
                                    variant="outlined"
                                    :model-value="a"
                                />
                            </template>
                            <v-date-picker v-model="joinDate1" @update:model-value="joinMenu1 = false" />
                        </v-menu>
                    </v-col>
                </v-row>
        </v-card-item>
    </v-card>
</template>
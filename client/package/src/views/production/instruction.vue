<!-- instruction.vue -->

<script setup>
import CardHeader from '@/components/production/card-header.vue';
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="py-6 px-6">
            <CardHeader
                title="생산 지시"
                btn-icon="mdi-plus-circle"
                btn-text="생산 계획 불러오기"
                btn-variant="flat"
                btn-color="primary"
                @btn-click="planLoad"
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
        </v-card-item>
    </v-card>
</template>
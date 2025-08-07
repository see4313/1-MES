<template>
    <div>
        <v-form v-model="valid">
            <v-container>
                <v-row justify="end">
                    <v-btn color="primary">등록</v-btn>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="주문명" :counter="10" :rules="nameRules" label="주문명" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="주문일자"
                            :counter="10"
                            :rules="nameRules"
                            label="주문일자"
                            required
                            append-inner-icon="mdi-calendar"
                            @click:append-inner="주문일자Dialog = true"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="업체명"
                            :rules="emailRules"
                            label="업체명"
                            required
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="onSearchCompany"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="담당자"
                            :counter="10"
                            :rules="nameRules"
                            label="담당자"
                            required
                            append-inner-icon="mdi-magnify"
                            @click:append-inner="onSearchEmp"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="납기일자"
                            :counter="10"
                            :rules="nameRules"
                            label="납기일자"
                            required
                            append-inner-icon="mdi-calendar"
                            @click:append-inner="납기일자Dialog = true"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field v-model="비고" :rules="emailRules" label="비고" required></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script>
export default {
    data: () => ({
        valid: false,
        firstname: '',
        lastname: '',
        nameRules: [
            (value) => {
                if (value) return true;

                return 'Name is required.';
            },
            (value) => {
                if (value?.length <= 10) return true;

                return 'Name must be less than 10 characters.';
            }
        ],
        email: '',
        emailRules: [
            (value) => {
                if (value) return true;

                return 'E-mail is required.';
            },
            (value) => {
                if (/.+@.+\..+/.test(value)) return true;

                return 'E-mail must be valid.';
            }
        ]
    }),
    methods: {
        onSearchCompany() {
            console.log('업체명 검색 아이콘 클릭됨');
        },
        onSearchEmp() {
            console.log('사원명 검색 아이콘 클릭됨');
        }
    }
};
</script>

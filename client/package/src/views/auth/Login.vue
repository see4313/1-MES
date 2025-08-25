<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import SnackBar from '@/components/shared/SnackBar.vue';
import { useSnackBar } from '@/composables/useSnackBar.js';
import loginBg from '@/assets/images/login/login-bg.jpg';

const router = useRouter();
const { snackBar } = useSnackBar();

const userId = ref(null);
const userPw = ref(null);
const userInfo = ref(null);

const onSignIn = async () => {
  if (!userId.value || !userPw.value) {
    return snackBar('아이디와 비밀번호를 모두 입력해주세요.', 'warning');
  }
  try {
    const params = {
      emp_id: userId.value,
      emp_pw: userPw.value
    };

    const response = await axios.get('/api/userLogin', { params });
    console.log(response);
    userInfo.value = response.data;

    if (!userInfo.value || Object.keys(userInfo.value).length === 0) {
      snackBar('아이디 또는 비밀번호를 확인해주세요', 'error');
      return;
    } else {
      sessionStorage.setItem('userId', userInfo.value[0].emp_id);
      sessionStorage.setItem('userName', userInfo.value[0].emp_name);
      sessionStorage.setItem('userPerm', userInfo.value[0].perm);
      sessionStorage.setItem('deptName', userInfo.value[0].dept_name);

      router.push('/');
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};
</script>

<template>
  <div
    class="authentication"
    :style="{
      backgroundImage: `url(${loginBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }"
  >
    <v-container fluid class="pa-3">
      <v-row class="h-100vh d-flex justify-center align-center">
        <v-col cols="12" lg="4" xl="3" class="d-flex align-center">
          <!-- glass effect card -->
          <v-card
            elevation="0"
            class="glass-card px-sm-1 px-0 mx-auto"
            max-width="500"
          >
            <v-card-item class="pa-sm-8">
              <v-form @submit.prevent="onSignIn">
                <v-row class="d-flex mb-3">
                  <v-col cols="12">
                    <v-label class="font-weight-bold mb-1">아이디</v-label>
                    <v-text-field
                      class="white-input"
                      variant="outlined"
                      density="compact"
                      hide-details
                      color="primary"
                      v-model="userId"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-label class="font-weight-bold mb-1">비밀번호</v-label>
                    <v-text-field
                      class="white-input"
                      variant="outlined"
                      density="compact"
                      type="password"
                      hide-details
                      color="primary"
                      v-model="userPw"
                      required
                    />
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <v-btn
                      color="primary"
                      size="large"
                      block
                      flat
                      type="submit"
                    >
                      로그인
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <SnackBar />
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
}

.glass-card .v-label {
  color: #fff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

:deep(.white-input .v-field__input) {
  color: #fff !important;
}

:deep(.white-input .v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.glass-card .v-field__outline {
  color: rgba(255, 255, 255, 0.6) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
}
.glass-card .v-field.v-field--focused .v-field__outline {
  color: #fff !important;
  border-color: #fff !important;
}

.glass-card .v-field.v-field--focused .v-label.v-field-label {
  color: #fff !important;
}
</style>

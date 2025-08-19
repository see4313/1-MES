<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const sessionId = ref(null);
const sessionName = ref(null);
const sessionDept = ref(null);

onMounted(() => {});

const onLogOut = () => {
    sessionStorage.clear();
};

const ononclick = () => {
    sessionId.value = sessionStorage.getItem('userId');
    sessionName.value = sessionStorage.getItem('userName');
    sessionDept.value = sessionStorage.getItem('deptName');
};
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn class="profileBtn custom-hover-primary" variant="text" v-bind="props" icon @click="ononclick">
                <v-avatar size="35">
                    <img src="@/assets/images/profile/user-1.jpg" height="35" alt="user" />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="200" elevation="10" class="mt-2">
            <v-list class="py-0" lines="one" density="compact">
                <v-list-item value="item1" active-color="primary">
                    <v-list-item-title class="pl-4 text-body-1">{{ sessionId }}</v-list-item-title>
                </v-list-item>
                <v-list-item value="item2" active-color="primary">
                    <v-list-item-title class="pl-4 text-body-1">{{ sessionName }}</v-list-item-title>
                </v-list-item>
                <v-list-item value="item3" active-color="primary">
                    <v-list-item-title class="pl-4 text-body-1">{{ sessionDept }}</v-list-item-title>
                </v-list-item>
            </v-list>
            <div class="pt-4 pb-4 px-5 text-center">
                <v-btn to="/auth/login" color="primary" variant="outlined" block @click="onLogOut">Logout</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>

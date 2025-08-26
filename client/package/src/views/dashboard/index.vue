<script setup>
/*Call Components*/
import RevenueCard from '@/components/dashboard/RevenueCard.vue';
import NewCustomer from '@/components/dashboard/NewCustomer.vue';
import Totalincome from '@/components/dashboard/TotalIncome.vue';
import RevenueProduct from '@/components/dashboard/RevenueProducts.vue';
import DailyActivities from '@/components/dashboard/DailyActivities.vue';
import BlogCards from '@/components/dashboard/BlogCards.vue';
import SafetyStock from '@/components/dashboard/SafetyStock.vue';
</script>

<template>
    <v-row>
        <v-col cols="12" lg="12"><SafetyStock /></v-col>
        <v-col cols="12" lg="4">< /></v-col>
        <v-col cols="12" lg="8"></v-col>
        <v-col cols="12" lg="4"></v-col>

    </v-row>

    <v-row>
        <v-col cols="12" lg="8"><RevenueCard /></v-col>
        <v-col cols="12" lg="4"
            ><NewCustomer class="mb-6" />
            <Totalincome />
        </v-col>
        <v-col cols="12" lg="8"><RevenueProduct /></v-col>
        <v-col cols="12" lg="4"><DailyActivities /> </v-col>
        <v-col cols="12"><BlogCards /></v-col>
    </v-row>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useDisplay } from 'vuetify';
import sidebarItems from './vertical-sidebar/sidebarItem.js';
import NavGroup from './vertical-sidebar/NavGroup/index.vue';
import NavItem from './vertical-sidebar/NavItem/index.vue';
// dropdown imports
import ProfileDD from './vertical-header/ProfileDD.vue';
import { Icon } from '@iconify/vue';
import NavCollapse from './vertical-sidebar/NavCollapse/NavCollapse.vue';
const sidebarMenu = ref([]);
const { mdAndDown } = useDisplay();
const sDrawer = ref(true);

const updateSidebarMenu = () => {
    const sessionPerm = sessionStorage.getItem('userPerm');
    const userRoleMap = { '전체 관리자': 'admin', '부서 관리자': 'mgr', '일반 사용자': 'prod' };
    const currentRole = userRoleMap[sessionPerm];

    sidebarMenu.value = sidebarItems.map((menu) => {
        if (!menu.children) return menu;
        return {
            ...menu,
            children: menu.children.filter((child) => child.roles.includes(currentRole))
        };
    });
};

onMounted(() => {
    if (sessionStorage.getItem('userPerm')) {
        updateSidebarMenu();
    }
    sDrawer.value = !mdAndDown.value; // hide on mobile, show on desktop
});

watch(mdAndDown, (val) => {
    sDrawer.value = !val;
});
</script>

<template>
    <!------Sidebar-------->
    <v-navigation-drawer left elevation="0" app class="leftSidebar" v-model="sDrawer">
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div>
            <perfect-scrollbar class="scrollnavbar">
                <v-list class="pa-6 pt-0">
                    <!---Menu Loop -->
                    <template v-for="(item, i) in sidebarMenu">
                        <!---Item Sub Header -->
                        <NavGroup :item="item" v-if="item.header" :key="item.title" />
                        <NavCollapse class="" :item="item" :level="0" v-else-if="item.children" />
                        <!---Single Item-->
                        <NavItem :item="item" v-else class="leftPadding" />
                        <!---End Single Item-->
                    </template>
                </v-list>
            </perfect-scrollbar>
        </div>
    </v-navigation-drawer>
    <!------Header-------->
    <v-app-bar elevation="0" height="70" class="top-header">
        <div class="d-flex align-center justify-space-between w-100">
            <div>
                <v-btn class="hidden-lg-and-up ms-md-3 text-muted" @click="sDrawer = !sDrawer" icon variant="flat" size="small">
                    <Icon icon="solar:hamburger-menu-outline" height="20"></Icon>
                </v-btn>
            </div>
            <div>
                <!-- User Profile -->
                <ProfileDD />
            </div>
        </div>
    </v-app-bar>
</template>

// src/router/FacilityRoutes.ts
import type { RouteRecordRaw } from 'vue-router';

const FacilityRoutes: RouteRecordRaw[] = [
    {
        path: '/facility',
        component: () => import('@/layouts/full/FullLayout.vue'), // 공통 레이아웃
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'FacilityDashboard',
                component: () => import('@/views/facility/Dashboard.vue')
            },
            {
                path: 'list',
                name: 'FacilityList',
                component: () => import('@/views/facility/List.vue')
            },

            {
                path: 'management',
                name: 'FacilityManagement',
                component: () => import('@/views/facility/Management.vue')
            },
            {
                path: 'status',
                name: 'FacilityStatus',
                component: () => import('@/views/facility/Status.vue')
            },
            {
                path: 'inspect/add',
                name: 'FacilityInspectAdd',
                component: () => import('@/views/facility/inspect/Add.vue')
            },
            {
                path: 'inspect/manage',
                name: 'FacilityInspectManage',
                component: () => import('@/views/facility/inspect/Manage.vue')
            },
            {
                path: 'cleaning/histmanage',
                name: 'FacilityHistMange',
                component: () => import('@/views/facility/cleaning/CleaningHistMange.vue')
            },
            {
                path: 'failure/add',
                name: 'FacilityFailureAdd',
                component: () => import('@/views/facility/failure/Add.vue')
            },
            {
                path: 'repair/add',
                name: 'FacilityRepairAdd',
                component: () => import('@/views/facility/repair/Add.vue')
            },
            {
                path: 'downtime',
                name: 'FacilityDowntimeManage',
                component: () => import('@/views/facility/Downtime.vue')
            }
        ]
    }
];

export default FacilityRoutes;

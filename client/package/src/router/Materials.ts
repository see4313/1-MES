const MainRoutes = {
    path: '/Materials',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'mt-002',
            path: '/mt-002',
            component: () => import('@/views/materials/MT-002.vue')
        },
        {
            name: 'mt-001',
            path: '/mt-001',
            component: () => import('@/views/materials/MT-001.vue')
        },
        {
            name: 'mt-003',
            path: '/mt-003',
            component: () => import('@/views/materials/MT-003.vue')
        },
        {
            name: 'mt-004',
            path: '/mt-004',
            component: () => import('@/views/materials/MT-004.vue')
        },
        {
            name: 'mt-006',
            path: '/mt-006',
            component: () => import('@/views/materials/MT-006.vue')
        }
    ]
};

export default MainRoutes;

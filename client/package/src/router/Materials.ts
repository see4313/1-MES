const MainRoutes = {
    path: '/Materials',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'mt-003',
            path: '/mt-003',
            component: () => import('@/views/materials/MT-003.vue')
        },
        {
            name: 'mt-001',
            path: '/mt-001',
            component: () => import('@/views/materials/MT-001.vue')
        }
    ]
};

export default MainRoutes;

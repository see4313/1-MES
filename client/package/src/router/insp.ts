const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'inspitem',
            path: '/insp',
            component: () => import('@/views/qc/insp.vue')
        },
        {
            name: 'badnlist',
            path: '/badnlist',
            component: () => import('@/views/qc/badn.vue')
        }
    ]
};

export default MainRoutes;

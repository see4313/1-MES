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
        },
        {
            name: 'iqii',
            path: '/iqii',
            component: () => import('@/views/qc/iqii.vue')
        },
        {
            name: 'iqc',
            path: '/iqc',
            component: () => import('@/views/qc/iqc.vue')
        }
    ]
};

export default MainRoutes;

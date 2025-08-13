const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'test',
            path: '/test',
            component: () => import('@/views/production/test.vue')
        },
        {
            name: 'instructions',
            path: '/instructions',
            component: () => import('@/views/production/instruction.vue')
        }
    ]
};

export default MainRoutes;

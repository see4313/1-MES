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
            component: () => import('@/views/production/instruction.vue')
        }
    ]
};

export default MainRoutes;

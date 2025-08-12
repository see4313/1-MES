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
            name: 'Instructions',
            path: '/instructions',
            component: () => import('@/views/production/instruction.vue')
        },
        {
            name: 'instructionsList',
            path: '/instructionslist',
            component: () => import('@/views/production/instructionList.vue')
        }
    ]
};

export default MainRoutes;

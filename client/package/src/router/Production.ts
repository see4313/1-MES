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
            name: 'instruction',
            path: '/instruction',
            component: () => import('@/views/production/instruction.vue')
        },
        {
            name: 'instructionList',
            path: '/instructionlist',
            component: () => import('@/views/production/instructionList.vue')
        },
        {
            name: 'productionㄲesults',
            path: '/productionresults',
            component: () => import('@/views/production/productionResults.vue')
        },
        {
            name: 'prcsRouter',
            path: '/prcsrouter',
            component: () => import('@/views/basic/prcsRouter.vue')
        }
    ]
};

export default MainRoutes;

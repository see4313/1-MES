const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: '사원관리',
            path: '/emp',
            component: () => import('@/views/basic/employee.vue')
        },
        {
            name: '거래처관리',
            path: '/vendor',
            component: () => import('@/views/basic/vendor.vue')
        },
        {
            name: 'BOM관리',
            path: '/bom',
            component: () => import('@/views/basic/bom.vue')
        },
        {
            name: '창고관리',
            path: '/warehouse',
            component: () => import('@/views/basic/warehouse.vue')
        },
        {
            name: '공정정보',
            path: '/process',
            component: () => import('@/views/basic/process.vue')
        },
        {
            name: 'mt-001',
            path: '/mt-001',
            component: () => import('@/views/materials/MT-001.vue')
        },
        {
            name: 'Cards',
            path: '/ui/cards',
            component: () => import('@/views/ui-components/Cards.vue')
        },
        {
            name: 'Tables',
            path: '/ui/tables',
            component: () => import('@/views/ui-components/Tables.vue')
        },
        {
            name: 'Icons',
            path: '/icons',
            component: () => import('@/views/pages/Icons.vue')
        },
        {
            name: 'Starter',
            path: '/sample-page',
            component: () => import('@/views/pages/SamplePage.vue')
        }
    ]
};

export default MainRoutes;

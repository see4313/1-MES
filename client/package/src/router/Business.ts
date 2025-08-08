const MainRoutes = {
    path: '/business',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'orderInsert',
            path: '/orderInsert',
            component: () => import('@/views/business/orderInsert.vue')
        },
        {
            name: 'orderList',
            path: '/orderList',
            component: () => import('@/views/business/orderList.vue')
        },
        {
            name: 'setOrder',
            path: '/setOrder',
            component: () => import('@/views/business/setOrder.vue')
        },
        {
            name: 'productList',
            path: '/productList',
            component: () => import('@/views/business/productList.vue')
        },
        {
            name: 'productInsert',
            path: '/productInsert',
            component: () => import('@/views/business/productInsert.vue')
        },
        {
            name: 'setProduct',
            path: '/setProduct',
            component: () => import('@/views/business/setProduct.vue')
        },
        {
            name: 'setDelivery',
            path: '/setDelivery',
            component: () => import('@/views/business/setDelivery.vue')
        }
    ]
};

export default MainRoutes;

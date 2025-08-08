import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import FacilityRoutes from './FacilityRoutes';

import Business from './Business';
import Materials from './Materials';

import Production from './Production';
import BasicRoutes from './BasicRoutes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/auth/Error.vue')
        },
        MainRoutes,
        AuthRoutes,
        ...FacilityRoutes,
        Business,
        Production,
        BasicRoutes,
        Materials
    ]
});

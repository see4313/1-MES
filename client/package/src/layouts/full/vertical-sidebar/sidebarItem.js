const userRole = 'user';

const sidebarRoutes = MainRoutes.children.filter((route) => {
    const roles = route.meta?.roles;
    if (!roles) return true;
    return roles.includes(userRole);
});

const sidebarItem = [
    {
        title: '기준정보',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: 'Homepage',
                to: '/sample-page'
            },
            {
                title: 'About Us',
                to: ''
            },
            {
                title: 'Blog',
                to: ''
            },
            {
                title: 'Blog Details',
                to: ''
            },
            {
                title: 'Contact Us',
                to: ''
            },
            {
                title: 'Portfolio',
                to: ''
            },
            {
                title: 'Pricing',
                to: ''
            }
        ]
    },

    {
        title: '영업',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: 'Homepage',
                to: '/sample-page'
            },
            {
                title: 'About Us',
                to: ''
            },
            {
                title: 'Blog',
                to: ''
            },
            {
                title: 'Blog Details',
                to: ''
            },
            {
                title: 'Contact Us',
                to: ''
            },
            {
                title: 'Portfolio',
                to: ''
            },
            {
                title: 'Pricing',
                to: ''
            }
        ]
    },

    {
        title: '자재',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: 'Homepage',
                to: '/sample-page'
            },
            {
                title: 'About Us',
                to: ''
            },
            {
                title: 'Blog',
                to: ''
            },
            {
                title: 'Blog Details',
                to: ''
            },
            {
                title: 'Contact Us',
                to: ''
            },
            {
                title: 'Portfolio',
                to: ''
            },
            {
                title: 'Pricing',
                to: ''
            }
        ]
    },

    {
        title: '생산',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: 'Homepage',
                to: '/sample-page'
            },
            {
                title: 'About Us',
                to: ''
            },
            {
                title: 'Blog',
                to: ''
            },
            {
                title: 'Blog Details',
                to: ''
            },
            {
                title: 'Contact Us',
                to: ''
            },
            {
                title: 'Portfolio',
                to: ''
            },
            {
                title: 'Pricing',
                to: ''
            }
        ]
    },

    {
        title: '품질',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: 'Homepage',
                to: '/sample-page'
            },
            {
                title: 'About Us',
                to: ''
            },
            {
                title: 'Blog',
                to: ''
            },
            {
                title: 'Blog Details',
                to: ''
            },
            {
                title: 'Contact Us',
                to: ''
            },
            {
                title: 'Portfolio',
                to: ''
            },
            {
                title: 'Pricing',
                to: ''
            }
        ]
    },

    {
        title: '설비',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: 'Homepage',
                to: '/sample-page'
            },
            {
                title: 'About Us',
                to: ''
            },
            {
                title: 'Blog',
                to: ''
            },
            {
                title: 'Blog Details',
                to: ''
            },
            {
                title: 'Contact Us',
                to: ''
            },
            {
                title: 'Portfolio',
                to: ''
            },
            {
                title: 'Pricing',
                to: ''
            }
        ]
    },

    { header: 'auth' },
    {
        title: 'Login',
        icon: 'login-3-line-duotone',
        to: '/auth/login'
    }
];

export default sidebarItem;

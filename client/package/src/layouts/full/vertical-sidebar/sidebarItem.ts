export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    BgColor?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
    external?: boolean;
}

const sidebarItem: menu[] = [
    {
        title: '기준정보',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: 'Homepage',
                to: '/sample-page',
                external: true
            },
            {
                title: 'About Us',
                to: '',
                external: true
            },
            {
                title: 'Blog',
                to: '',
                external: true
            },
            {
                title: 'Blog Details',
                to: '',
                external: true
            },
            {
                title: 'Contact Us',
                to: '',
                external: true
            },
            {
                title: 'Portfolio',
                to: '',
                external: true
            },
            {
                title: 'Pricing',
                to: '',
                external: true
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
                to: '',
                external: true
            },
            {
                title: 'About Us',
                to: '',
                external: true
            },
            {
                title: 'Blog',
                to: '',
                external: true
            },
            {
                title: 'Blog Details',
                to: '',
                external: true
            },
            {
                title: 'Contact Us',
                to: '',
                external: true
            },
            {
                title: 'Portfolio',
                to: '',
                external: true
            },
            {
                title: 'Pricing',
                to: '',
                external: true
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
                to: '',
                external: true
            },
            {
                title: 'About Us',
                to: '',
                external: true
            },
            {
                title: 'Blog',
                to: '',
                external: true
            },
            {
                title: 'Blog Details',
                to: '',
                external: true
            },
            {
                title: 'Contact Us',
                to: '',
                external: true
            },
            {
                title: 'Portfolio',
                to: '',
                external: true
            },
            {
                title: 'Pricing',
                to: '',
                external: true
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
                to: '',
                external: true
            },
            {
                title: 'About Us',
                to: '',
                external: true
            },
            {
                title: 'Blog',
                to: '',
                external: true
            },
            {
                title: 'Blog Details',
                to: '',
                external: true
            },
            {
                title: 'Contact Us',
                to: '',
                external: true
            },
            {
                title: 'Portfolio',
                to: '',
                external: true
            },
            {
                title: 'Pricing',
                to: '',
                external: true
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
                to: '',
                external: true
            },
            {
                title: 'About Us',
                to: '',
                external: true
            },
            {
                title: 'Blog',
                to: '',
                external: true
            },
            {
                title: 'Blog Details',
                to: '',
                external: true
            },
            {
                title: 'Contact Us',
                to: '',
                external: true
            },
            {
                title: 'Portfolio',
                to: '',
                external: true
            },
            {
                title: 'Pricing',
                to: '',
                external: true
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
                to: '',
                external: true
            },
            {
                title: 'About Us',
                to: '',
                external: true
            },
            {
                title: 'Blog',
                to: '',
                external: true
            },
            {
                title: 'Blog Details',
                to: '',
                external: true
            },
            {
                title: 'Contact Us',
                to: '',
                external: true
            },
            {
                title: 'Portfolio',
                to: '',
                external: true
            },
            {
                title: 'Pricing',
                to: '',
                external: true
            }
        ]
    },

    { header: 'auth' },
    {
        title: 'Login',
        icon: 'login-3-line-duotone',
        to: '/auth/login'
    },
    {
        title: 'Register',
        icon: 'user-plus-rounded-line-duotone',
        to: '/auth/register'
    }
];

export default sidebarItem;

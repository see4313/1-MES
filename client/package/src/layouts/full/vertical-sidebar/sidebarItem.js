const sidebarItem = [
    {
        title: '기준정보',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: '사원관리',
                to: '/emp'
            },
            {
                title: '거래처관리',
                to: '/vendor'
            },

            {
                title: 'BOM관리',
                to: ''
            },
            {
                title: '창고관리',
                to: ''
            },
            {
                title: '공정정보',
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
                title: '주문조회',
                to: '/orderList'
            },
            {
                title: '주문등록',
                to: '/orderInsert'
            },
            {
                title: '주문관리',
                to: '/setOrder'
            },
            {
                title: '제품조회',
                to: '/productList'
            },
            {
                title: '제품입고처리',
                to: '/productInsert'
            },
            {
                title: '제품관리',
                to: '/setProduct'
            },
            {
                title: '출고관리',
                to: '/setDelivery'
            }
        ]
    },

    {
        title: '자재',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: '품목관리',
                to: '/mt-001'
            },
            {
                title: '자재 발주등록',
                to: ''
            },
            {
                title: '자재 입고등록',
                to: ''
            },
            {
                title: '자재 출고관리',
                to: ''
            },
            {
                title: '재고조회',
                to: '/mt-003'
            },
            {
                title: '반품관리',
                to: ''
            },
            {
                title: '폐기관리',
                to: ''
            },
            {
                title: '폐기/반품 조회',
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
                title: '생산 지시',
                to: '/instructions'
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
                to: ''
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
                title: '대시보드',
                to: '/facility/dashboard'
            },
            {
                title: '설비목록',
                to: '/facility/list'
            },
            {
                title: '설비 상태 조회',
                to: '/facility/status'
            },
            {
                title: '점검 이력 등록',
                to: '/facility/inspect/add'
            },
            {
                title: '점검 이력 관리',
                to: '/facility/inspect/manage'
            },
            {
                title: '세척이력 등록',
                to: '/facility/cleaning/add'
            },
            {
                title: '세척이력 관리',
                to: '/facility/cleaning/manage'
            },
            {
                title: '고장 등록',
                to: '/facility/failure/add'
            },
            {
                title: '수리이력 등록',
                to: '/facility/repair/add'
            },
            {
                title: '비가동 관리',
                to: '/facility/downtime'
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

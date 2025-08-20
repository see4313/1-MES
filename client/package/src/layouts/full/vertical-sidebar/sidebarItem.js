const sidebarItem = [
    {
        title: '기준정보',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: '사원관리',
                to: '/emp',
                roles: ['admin', 'mgr']
            },
            {
                title: '거래처관리',
                to: '/vendor',
                roles: ['admin', 'mgr']
            },
            {
                title: 'BOM관리',
                to: '/bom',
                roles: ['admin', 'mgr']
            },
            {
                title: '창고관리',
                to: '/warehouse',
                roles: ['admin', 'mgr']
            },
            {
                title: '공정정보',
                to: '/process',
                roles: ['admin', 'mgr']
            },
            {
                title: '공정흐름도',
                to: '/prcsrouter',
                roles: ['admin', 'mgr']
            },
            {
                title: '품목관리',
                to: '/mt-001',
                roles: ['admin', 'mgr']
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
                to: '/orderList',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '주문등록',
                to: '/orderInsert',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '주문관리',
                to: '/setOrder',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '제품조회',
                to: '/productList',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '제품입고처리',
                to: '/productInsert',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '출고관리',
                to: '/setDelivery',
                roles: ['admin', 'prod', 'mgr']
            }
        ]
    },

    {
        title: '자재',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: '자재 발주등록',
                to: '/mt-003',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '자재 입고등록',
                to: '/mt-004',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '재고조회',
                to: '/mt-002',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '반품관리',
                to: '/mt-006',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '폐기관리',
                to: '/mt-007',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '출고 이력',
                to: '/mt-008',
                roles: ['admin', 'prod', 'mgr']
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
                to: '/instruction',
                roles: ['admin', 'mgr']
            },
            {
                title: '생산 지시 조회',
                to: '/instructionlist',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '생산 실적 등록',
                to: '/productionresults',
                roles: ['admin', 'prod', 'mgr']
            }
        ]
    },

    {
        title: '품질',
        icon: 'home-angle-linear',
        to: '/front',
        children: [
            {
                title: '검사항목 관리',
                to: '/insp',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '불량코드 관리',
                to: '/badnlist',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '입고 품질 검사 등록',
                to: '/iqc',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '입고 품질 검사 조회',
                to: '/iqii',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '불량이력서 확인',
                to: '',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '공정 품질 검사 등록',
                to: '',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '공정 품질 검사 조회',
                to: '',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '검사서 관리',
                to: '/exam',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '제품 품질 검사',
                to: '/itemExam',
                roles: ['admin', 'prod', 'mgr']
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
                to: '/facility/dashboard',
                roles: ['admin', 'prod', 'mgr']
            },

            {
                title: '설비 관리',
                to: '/facility/management',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '점검 이력 관리',
                to: '/facility/inspect/manage',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '세척 이력 관리',
                to: '/facility/cleaning/histmanage',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '고장/수리 관리',
                to: '/facility/repair/rfmanage',
                roles: ['admin', 'prod', 'mgr']
            },
            {
                title: '비가동 관리',
                to: '/facility/downtime',
                roles: ['admin', 'prod', 'mgr']
            }
        ]
    }
];

export default sidebarItem;

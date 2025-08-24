import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const BLUE_THEME: ThemeTypes = {
    name: 'CROISSANT_THEME',
    dark: false,
    variables: {
        'border-color': '#e5d5c5', // 크로와상 반죽 느낌의 옅은 베이지
        'border-opacity': 1
    },
    colors: {
        primary: '#a47148',       // 구운 크로와상 갈색
        secondary: '#d9b08c',     // 고소한 버터 베이지
        info: '#c19a6b',          // 밀가루-누룽지 중간색
        success: '#5a7d4e',       // 진한 카라멜 브라운
        warning: '#e6c07b',       // 옅은 꿀빛
        error: '#b84a3c',         // 구운 붉은기 갈색 (타는 듯한 느낌)
        
        lightprimary: '#f1e4d2',  // 밀가루 베이스
        lightsecondary: '#f6ede4',
        lightsuccess: '#e9dbc9',
        lighterror: '#f4d6d2',
        lightinfo: '#f2e6d9',
        lightwarning: '#f9f1dd',

        textPrimary: '#3d2b1f',   // 진한 초콜릿 브라운 (글씨 가독성)
        textSecondary: '#7a6a58', // 옅은 모카
        borderColor: '#e5d5c5',   // 베이지 톤 테두리
        containerBg: '#ffffff',   // 카드/컨테이너 배경
        background: '#faf6f1',    // 화면 전체 배경 (따뜻한 크림톤)
        hoverColor: '#f5ede6',    // hover 시 은은한 톤
        surface: '#fff',
        grey100: '#ede8e3',       // 연한 회갈색
        grey200: '#5c4a3a',       // 진한 브라운
        light: '#faf6f1',
        muted: '#8c7a6b'          // 부드러운 카푸치노 톤
    }
};

export { BLUE_THEME };



// import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

// const BLUE_THEME: ThemeTypes = {
//     name: 'BLUE_THEME',
//     dark: false,
//     variables: {
//         'border-color': '#e0e6eb',
//         'border-opacity': 1
//     },
//     colors: {
//         primary: '#635BFF',
//         secondary: '#14E9E2',
//         info: '#46caeb',
//         success: '#36c76c',
//         warning: '#ffd648',
//         error: '#ff6692',
//         lightprimary: '#D5D3FC',
//         lightsecondary: '#D0FBF9',
//         lightsuccess: '#E1F7E9',
//         lighterror: '#FFD9E4',
//         lightinfo: '#DAF4FB',
//         lightwarning: '#FFF7DA',
//         textPrimary: '#0a2540',
//         textSecondary: '#7b8893',
//         borderColor: '#e0e6eb',
//         containerBg: '#ffffff',
//         background: '#F4F7FB',
//         hoverColor: '#f6f9fc',
//         surface: '#fff',
//         grey100: '#EAEFF4',
//         grey200: '#29343d',
//         light: '#EFF4FA',
//         muted:'#526b7a'
//     }
// };



// export { BLUE_THEME};

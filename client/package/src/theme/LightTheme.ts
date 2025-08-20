import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const BLUE_THEME: ThemeTypes = {
  name: 'BLUE_THEME',
  dark: false,
  variables: {
    'border-color': '#E8EEF3',
    'border-opacity': 1
  },
  colors: {
    // 고정: 주색
    primary:   '#914900',

    // 밝고 트렌디한 보조 팔레트
    secondary: '#2ED3B7',
    // 변경 포인트: 스카이 대신 퍼윈클(인디고 톤) — 검은 글씨와 조합 우수
    info:      '#C7D2FE',  // periwinkle/indigo-200
    success:   '#22C55E',
    warning:   '#FDB022',
    error:     '#F97066',

    // 라이트 톤
    lightprimary:   '#F8EADF',
    lightsecondary: '#E8FBF6',
    lightsuccess:   '#EAFBF2',
    lighterror:     '#FFE7E4',
    // 변경 포인트: 라이트 인디고
    lightinfo:      '#EEF2FF',
    lightwarning:   '#FFF4D6',

    // 텍스트 & 베이스
    textPrimary:   '#0F172A',
    textSecondary: '#667085',
    borderColor:   '#E8EEF3',
    containerBg:   '#FFFFFF',
    background:    '#F9FAFB',
    hoverColor:    '#F3F4F6',
    surface:       '#FFFFFF',

    // 뉴트럴
    grey100: '#F2F4F7',
    grey200: '#1F2937',
    light:   '#F8FAFC',
    muted:   '#98A2B3'
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

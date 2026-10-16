export type FontFamilyId = 'pretendard' | 'nanum-square-neo' | 'nanum-gothic' | 'system';

export interface FontOption {
  id: FontFamilyId;
  name: string;
  badge?: string;
  cssFamily: string;
  description: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'pretendard',
    name: 'Pretendard',
    badge: '추천',
    cssFamily:
      '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif',
    description: '작은 글씨(10~12px) 및 숫자/코드 정렬에 최적화된 ERP 추천 폰트',
  },
  {
    id: 'nanum-square-neo',
    name: '나눔스퀘어 네오',
    badge: '네이버',
    cssFamily:
      '"NanumSquareNeo", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    description: '단정하고 현대적인 직선형 네이버 고딕 폰트',
  },
  {
    id: 'nanum-gothic',
    name: '나눔고딕',
    badge: '클래식',
    cssFamily:
      '"Nanum Gothic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    description: '부드러운 곡선의 친근한 대중적 한글 고딕 폰트',
  },
  {
    id: 'system',
    name: '시스템 기본',
    badge: 'OS 기본',
    cssFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif',
    description: '맑은 고딕(Windows) / 산돌고딕(macOS) 등 OS 내장 폰트',
  },
];

export function getFontOption(id?: string): FontOption {
  return FONT_OPTIONS.find((f) => f.id === id) || FONT_OPTIONS[0];
}

export function applyGlobalFont(id?: string): string {
  const fontOpt = getFontOption(id);
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--app-font-family', fontOpt.cssFamily);
    document.body.style.fontFamily = fontOpt.cssFamily;
  }
  return fontOpt.cssFamily;
}

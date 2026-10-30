/**
 * 접대비 현황(U18) 탭 페이지 공통 약속 — AS-IS InterfaceTabPage.retrieve(Map param)
 * param = year(yyyy) · month('01'~'12' | '전체') · cardRealUserType('관리자' | '실사용자')
 */
export interface EntertmParam {
  year: string;
  month: string;
  cardRealUserType: string;
}

export interface EntertmTabHandle {
  /** AS-IS retrieve(param) — 탭을 고르거나 [조회]를 누르면 상위가 활성 탭에 시킨다 */
  retrieve: (param: EntertmParam) => Promise<void>;
  /** AS-IS init() — 그리드 비움 */
  init: () => void;
}

/**
 * 수평 스크롤 방지(Page 원칙 1): AS-IS 폭을 비율(flex)로 쓰되, 열마다 실제 값(천 단위 쉼표 포함)과 제목이 잘리지 않는 최소 폭을 지킨다.
 * 최소 폭은 AS-IS 폭을 넘지 않는다. 그래도 모자란 좁은 화면에서만 가로 스크롤이 생긴다.
 */
export const fitCols = <C extends { width?: number; field?: string; headerName?: string }>(cols: C[], rows: object[]): C[] =>
  cols.map(c => {
    const w = c.width ?? 100;
    const values = rows.map(r => (c.field ? (r as Record<string, unknown>)[c.field] : null));
    const dataLen = values.reduce<number>((m, v) => {
      if (v == null) return m;
      const t = typeof v === 'number' ? v.toLocaleString() : String(v);
      return Math.max(m, t.length);
    }, 0);
    const need = Math.max(dataLen * 8 + 24, (c.headerName ?? '').length * 13 + 24, 40);
    return { ...c, flex: w, minWidth: Math.min(w, need) };
  });

/** grid-SUM: 합계 행의 가짜 키 */
export const TOTAL_ID = -1;

/** grid-SUM: 조회 결과 끝에 합계 행("계")을 붙인다 — 맨 아래 고정이 아니라 마지막 내역 바로 다음 행. 0건이면 붙이지 않는다 */
export function withTotalRow<T extends object>(rows: T[], keyField: keyof T, labelField: keyof T, sumFields: (keyof T)[]): T[] {
  if (rows.length === 0) return rows;
  const total: Record<string, unknown> = { [keyField as string]: TOTAL_ID, [labelField as string]: '계' };
  sumFields.forEach(f => {
    total[f as string] = rows.reduce((a, r) => a + Number((r[f] as unknown as number | null) ?? 0), 0);
  });
  return [...rows, total as T];
}

/** grid-SUM: 합계 행에 `-total-row` 클래스 */
export const totalRowClass = <T extends object>(keyField: keyof T) =>
  (p: { data?: T }) => (p.data && (p.data[keyField] as unknown as number) === TOTAL_ID ? 'gsum-total-row' : undefined);

/** grid-SUM: 셀 세로선 · 합계 행 윗선(연한 파랑)·굵게·행번호 숨김·클릭 불가. 그리드를 감싼 div 클래스 `cls`로 범위를 좁힌다 */
export const gridSumCss = (cls: string) => [
  `.${cls} .ag-cell { border-right: 1px solid #e0e0e0; }`,
  `.${cls} .gsum-total-row { pointer-events: none; }`,
  `.${cls} .gsum-total-row .ag-cell { background-color: var(--gb-summary-row); font-weight: 700; border-top: 2px solid #91caff !important; }`,
  `.${cls} .ag-pinned-left-cols-container .gsum-total-row .ag-cell { color: transparent; }`,
].join(' ');

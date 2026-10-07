import type { ColDef, ColGroupDef } from 'ag-grid-community';
import { fmtDate, fmtDouble, fmtLong, numComparator } from './format';
import { CheckCell, SignColorCell, StatusCell } from './renderers';

/**
 * 컬럼 헬퍼 — AS-IS GridBuilder `addXxx(valueProvider, width, header)`와 이름·인자 순서를 1:1로 맞춘다.
 * yunhee 변환 명세의 `gb.textCenter('field', 80, 'ICAM<br>운용사코드')`를 그대로 붙여 쓴다. 목록: docs/grid-types.md
 *
 *   const gb = gbFor<CompanyDetail>();
 *   const cols = [gb.text('companyNm', 200, '고객명'), gb.booleanYn2('useYn', 80, '사용여부')];
 *
 * - header의 `<br>`은 두 줄 헤더가 된다.
 * - opts.editor가 있으면 편집 컬럼(파란 글씨, AS-IS `addXxx(…, IsField)`). 그 밖의 opts는 ColDef에 그대로 덮어쓴다.
 */
export type GbEditor = 'text' | 'largeText' | 'number' | 'date' | 'select';

export interface GbOpts<T> extends Omit<ColDef<T>, 'field' | 'width' | 'headerName'> {
  editor?: GbEditor;
  /** editor: 'select' 선택값 */
  values?: unknown[];
}

type Align = 'left' | 'center' | 'right';

const EDITORS: Record<GbEditor, string> = {
  text: 'agTextCellEditor',
  largeText: 'agLargeTextCellEditor',
  number: 'agNumberCellEditor',
  date: 'agDateStringCellEditor',
  select: 'agSelectCellEditor',
};

export function gbFor<T>() {
  type Field = ColDef<T>['field'];

  const col = (field: Field, width: number, header: string, align: Align, base: ColDef<T>, opts?: GbOpts<T>): ColDef<T> => {
    const { editor, values, cellStyle, ...rest } = opts ?? {};
    const multiline = /<br\s*\/?>/i.test(header);
    const def: ColDef<T> = {
      field,
      width,
      headerName: header.replace(/<br\s*\/?>/gi, '\n'),
      headerClass: 'gb-hdr',
      ...(multiline ? { wrapHeaderText: true, autoHeaderHeight: true } : {}),
      ...base,
      cellStyle: {
        textAlign: align,
        ...(editor ? { color: '#1677ff' } : {}),
        ...(cellStyle as object | undefined),
      },
      ...rest,
    };
    // 체크박스는 셀 편집기 없이 CheckCell이 직접 값을 바꾼다
    if (base.cellRenderer === CheckCell) def.editable = false;
    if (editor) {
      def.editable = rest.editable ?? true;
      def.cellEditor = rest.cellEditor ?? EDITORS[editor];
      if (editor === 'select') def.cellEditorParams = rest.cellEditorParams ?? { values: values ?? [] };
      if (editor === 'largeText') def.cellEditorPopup = rest.cellEditorPopup ?? true;
    }
    return def;
  };

  const num = (fmt: (v: unknown) => string): ColDef<T> => ({
    valueFormatter: p => fmt(p.value),
    comparator: numComparator,
  });
  const date = (len: 7 | 10 | 19): ColDef<T> => ({ valueFormatter: p => fmtDate(p.value, len) });
  /** 네모 체크박스, 가운데, 선택·해제 두 상태. { editable: true }면 클릭으로 바꾼다 (셀 편집기는 쓰지 않는다) */
  const check = (o?: GbOpts<T>): ColDef<T> => ({
    // 타입 추론을 끈다: 값이 'true'/'false' 문자열이라 AG Grid가 text로 추론하면 다른 타입 값을 setDataValue에서 조용히 거부한다(경고 #135)
    cellDataType: false,
    cellClass: 'gb-check',
    cellRenderer: CheckCell,
    cellRendererParams: { editable: !!o?.editable },
    editable: false,
  });

  return {
    // ── 문자 ──
    /** addText: 왼쪽 정렬 */
    text: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'left', {}, o),
    /** addTextCenter */
    textCenter: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'center', {}, o),
    /** addTextRight */
    textRight: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'right', {}, o),
    /** addTextArea: 줄바꿈 유지(행 높이 자동) */
    textArea: (f: Field, w: number, h: string, o?: GbOpts<T>) =>
      col(f, w, h, 'left', { cellClass: 'gb-wrap', wrapText: true, autoHeight: true }, o),
    /** addTextStatus: 완료/반려/미흡 … 굵은 색 글씨 */
    textStatus: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'left', { cellRenderer: StatusCell }, o),

    // ── 숫자 ──
    /** addLong: 오른쪽 정렬, 천단위 콤마 */
    long: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'right', num(fmtLong), o),
    /** addLongCenter */
    longCenter: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'center', num(fmtLong), o),
    /** addLongColor: 음수 빨강 · 양수 파랑 (원본 그대로) */
    longColor: (f: Field, w: number, h: string, o?: GbOpts<T>) =>
      col(f, w, h, 'right', { ...num(fmtLong), cellRenderer: SignColorCell, cellRendererParams: { kind: 'long' } }, o),
    /** addDouble: "#,###.######" */
    double: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'right', num(fmtDouble), o),
    /** addDoubleCenter */
    doubleCenter: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'center', num(fmtDouble), o),
    /** addDoubleColor: 양수 빨강 · 음수 파랑 (원본 그대로) */
    doubleColor: (f: Field, w: number, h: string, o?: GbOpts<T>) =>
      col(f, w, h, 'right', { ...num(fmtDouble), cellRenderer: SignColorCell, cellRendererParams: { kind: 'double' } }, o),

    // ── 날짜 ('yyyy-MM-dd…' 문자열) ──
    /** addDate: yyyy-MM-dd */
    date: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'center', date(10), o),
    /** addDateMonth: yyyy-MM */
    dateMonth: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'center', date(7), o),
    /** addDateTime: yyyy-MM-dd HH:mm:ss */
    dateTime: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'center', date(19), o),

    // ── 논리 ──
    /** addBoolean: 체크박스 (정렬 안 함). 편집하려면 { editable: true } */
    boolean: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'center', { ...check(o), sortable: false }, o),
    /** addBooleanYn: O / X (null → X) */
    booleanYn: (f: Field, w: number, h: string, o?: GbOpts<T>) =>
      col(f, w, h, 'center', { valueFormatter: p => (p.value ? 'O' : 'X') }, o),
    /** addBooleanYn2: 체크박스 표시 (AS-IS는 ✓/빈칸 글자) */
    booleanYn2: (f: Field, w: number, h: string, o?: GbOpts<T>) => col(f, w, h, 'center', check(o), o),

    // ── 헤더 묶음 (AS-IS addHeaderGroupMap) ──
    group: (header: string, children: (ColDef<T> | ColGroupDef<T>)[]): ColGroupDef<T> => ({
      headerName: header.replace(/<br\s*\/?>/gi, '\n'),
      headerClass: 'gb-hdr',
      children,
    }),
  };
}

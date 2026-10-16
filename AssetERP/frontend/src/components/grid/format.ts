/**
 * 그리드 값 포맷 (AS-IS GridBuilder의 NumberCell / DateCell 대응).
 * 숫자는 ko-KR 천단위 콤마, 날짜는 서버가 주는 'yyyy-MM-dd…' 문자열을 잘라 쓴다.
 */

export const toNum = (v: unknown): number => {
  if (v === undefined || v === null || v === '') return 0;
  return Number(String(v).replace(/,/g, ''));
};

/** NumberCell<Long>: 정수 천단위 콤마 */
export const fmtLong = (v: unknown): string =>
  v === undefined || v === null || v === '' ? '' : toNum(v).toLocaleString('ko-KR', { maximumFractionDigits: 0 });

/** NumberCell<Double>("#,###.######"): 소수 6자리까지 */
export const fmtDouble = (v: unknown): string =>
  v === undefined || v === null || v === '' ? '' : toNum(v).toLocaleString('ko-KR', { maximumFractionDigits: 6 });

/** 정렬용 숫자 비교 */
export const numComparator = (a: unknown, b: unknown): number => toNum(a) - toNum(b);

/** DateCell: 'yyyy-MM-dd' (len 10), 'yyyy-MM' (len 7), 'yyyy-MM-dd HH:mm:ss' (len 19) */
export const fmtDate = (v: unknown, len: 7 | 10 | 19 = 10): string =>
  v === undefined || v === null || v === '' ? '' : String(v).replace('T', ' ').slice(0, len);

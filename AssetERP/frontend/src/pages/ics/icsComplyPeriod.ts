import dayjs from 'dayjs';

/** 준수확인서(K01)·준수점검(K02)의 기준 분기(월) 계산 — AS-IS enable()·getDate()가 두 화면에서 같다 */

const QUARTER_END_MONTH: Record<string, string> = { '1': '03', '2': '06', '3': '09', '4': '12' };

/** enable(): 체크주기(M 월 / Q 분기)에 맞춰 기준을 지난 달(분기)로 둔다 */
export function defaultPeriod(cycleType: string) {
  const today = dayjs();
  const mm = today.month() + 1;
  const yy = today.year();
  if (cycleType === 'M') return mm === 1 ? { year: yy - 1, period: '12' } : { year: yy, period: String(mm - 1).padStart(2, '0') };
  if (mm <= 3) return { year: yy - 1, period: '4' };
  if (mm <= 6) return { year: yy, period: '1' };
  if (mm <= 9) return { year: yy, period: '2' };
  return { year: yy, period: '3' };
}

/** getDate(): 기준 분기(월)의 말일. 기준년도를 읽을 수 없으면 null (원본은 파싱 예외) */
export function getDate(year: string, period: string, cycleType: string): dayjs.Dayjs | null {
  if (!/^\d{4}$/.test(year.trim())) return null;
  const month = cycleType === 'M' ? period : (QUARTER_END_MONTH[period] ?? '12');
  const first = dayjs(`${year.trim()}-${month}-01`);
  return first.isValid() ? first.endOf('month') : null;
}

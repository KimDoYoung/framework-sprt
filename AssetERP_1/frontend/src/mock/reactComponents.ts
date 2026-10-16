/**
 * 공통 컴포넌트 테스트(Test_Tab_ReactComponents) 전용 mock — 서버 없이 부품(UX보강 등)을 시험한다.
 * 행은 시드 고정 난수로 만들어 새로고침해도 같다. 조회·저장은 600ms 늦게 끝나 로딩 표시(UX-01)를 볼 수 있다.
 */
import type { PageRes } from '@/types/auth';

export interface MockPerson {
  personId: number;
  companyNm: string;
  orgNm: string;
  empNo: string;
  korName: string;
  posNm: string;
  hireDate: string;
  stateCd: string;
  useYn: string;
  note: string;
}

export interface MockSearch {
  companyNm: string;
  baseDate: string;
  stateCd: string;
  searchText: string;
  useOnly: boolean;
  /** 실제 공통코드 콤보(SystemCodeComboBox MonthsCode) 시험용 — mock 조회에는 쓰지 않는다 */
  monthCd: string;
}

export const MOCK_COMPANIES = ['한국펀드서비스(주)', '칼파자산운용', '한빛투자자문', '누리자산운용'];
export const MOCK_STATES = [
  { value: 'W', label: '재직' },
  { value: 'L', label: '휴직' },
  { value: 'R', label: '퇴직' },
];

const ORGS = ['경영지원팀', '운용1팀', '운용2팀', '리스크관리팀', '컴플라이언스팀', '전산팀', '펀드회계팀'];
const POS = ['사원', '대리', '과장', '차장', '부장', '이사'];
const LAST = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
const FIRST = ['민준', '서연', '도윤', '지우', '하준', '서윤', '은우', '지민', '시우', '수아', '예준', '하은'];

const rand = (() => {
  let seed = 20261016;
  return () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
})();
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const pad = (n: number) => String(n).padStart(2, '0');

const PEOPLE: MockPerson[] = Array.from({ length: 237 }, (_, i) => {
  const state = rand() < 0.8 ? 'W' : pick(['L', 'R']);
  return {
    personId: i + 1,
    companyNm: pick(MOCK_COMPANIES),
    orgNm: pick(ORGS),
    empNo: `E${String(10001 + i)}`,
    korName: pick(LAST) + pick(FIRST),
    posNm: pick(POS),
    hireDate: `${2005 + Math.floor(rand() * 21)}-${pad(1 + Math.floor(rand() * 12))}-${pad(1 + Math.floor(rand() * 28))}`,
    stateCd: state,
    useYn: rand() < 0.9 ? 'true' : 'false',
    note: rand() < 0.2 ? '비고 있음' : '',
  };
});

const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

/** 페이징 조회 (selectXxxPaging + selectXxxTotal 흉내). 기준일 이전 입사자만 */
export async function searchMockPeople(p: MockSearch & { offset: number; limit: number }): Promise<PageRes<MockPerson>> {
  await delay();
  const text = p.searchText.trim();
  const filtered = PEOPLE.filter(r =>
    (!p.companyNm || r.companyNm === p.companyNm)
    && (!p.stateCd || r.stateCd === p.stateCd)
    && (!p.useOnly || r.useYn === 'true')
    && (!p.baseDate || r.hireDate <= p.baseDate)
    && (!text || [r.korName, r.empNo, r.orgNm, r.note].some(v => v.includes(text))));
  return { total: filtered.length, rows: filtered.slice(p.offset, p.offset + p.limit) };
}

// ---- 셀 편집 CRUD (UX-03 저장(n) 확인용) ----
export interface MockMemo {
  memoId: number;
  title: string;
  owner: string;
  useYn: string;
}

let memos: MockMemo[] = Array.from({ length: 10 }, (_, i) => ({
  memoId: i + 1, title: `메모 ${i + 1}`, owner: pick(LAST) + pick(FIRST), useYn: 'true',
}));
let memoSeq = memos.length;

export async function searchMockMemos(): Promise<MockMemo[]> {
  await delay();
  return memos.map(m => ({ ...m }));
}

/** useGridCrud save: 0 이하 ID는 새 행(INSERT) */
export async function saveMockMemos(rows: MockMemo[]): Promise<MockMemo[]> {
  await delay();
  return rows.map(r => {
    const saved = r.memoId > 0 ? { ...r } : { ...r, memoId: ++memoSeq };
    memos = memos.some(m => m.memoId === saved.memoId) ? memos.map(m => (m.memoId === saved.memoId ? saved : m)) : [...memos, saved];
    return { ...saved };
  });
}

export async function deleteMockMemos(ids: number[]): Promise<void> {
  await delay(300);
  memos = memos.filter(m => !ids.includes(m.memoId));
}

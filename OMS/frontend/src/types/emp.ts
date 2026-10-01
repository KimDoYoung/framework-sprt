/** 사원 현재 정보 (GET /api/v1/emp/trans-infos, AS-IS Emp00_TransInfoModel). 일자는 yyyy-MM-dd */
export interface TransInfo {
  transId: number;
  personId: number;
  empNo: string;
  korNm: string;
  orgCodeId: number | null;
  orgKorNm: string | null;
  /** 본부(부서) 전체 이름 */
  parentFullNm: string | null;
  transCd: string | null;
  kindCd: string | null;
  kindNm: string | null;
  posCd: string | null;
  posNm: string | null;
  titleCd: string | null;
  titleNm: string | null;
  hireDate: string | null;
  officeDetail: string | null;
  mobileTelno: string | null;
  emailAddr: string | null;
  orderSeq: string | null;
  /** 전문인력 (AS-IS도 항상 false) */
  financeProYn: boolean;
}

/** 발령 기준 사원 (GET /api/v1/emp/trans, 사원 Lookup) */
export interface Trans {
  transId: number;
  personId: number;
  empNo: string;
  korNm: string;
  orgCodeId: number | null;
  orgKorNm: string | null;
  titleNm: string | null;
}

/** 신규사원 등록 요청 (POST /api/v1/emp/trans-infos) */
export interface TransInfoCreate {
  empNo: string;
  korNm: string;
  kindCd: string;
  hireDate: string;
  officeTelno: string | null;
  officeDetail: string | null;
  mobileTelno: string;
  emailAddr: string;
  titleCd: string;
  posCd: string;
  orgCodeId: number;
  note: string | null;
}

/** 사원 기본정보 (GET /api/v1/emp/persons/{id}) */
export interface Person {
  personId: number;
  companyId: number;
  empNo: string;
  korNm: string;
  hireDate: string | null;
  orderSeq: string | null;
  emailAddr: string | null;
  officeTelno: string | null;
  officeDetail: string | null;
  mobileTelno: string | null;
  note: string | null;
}

export type PersonSave = Omit<Person, 'personId' | 'companyId' | 'empNo'>;

/** 사원 발령 (GET /api/v1/emp/trans/persons/{personId}) */
export interface EmpTrans {
  transId: number;
  personId: number;
  transDate: string | null;
  transCd: string | null;
  transNm: string | null;
  kindCd: string | null;
  kindNm: string | null;
  orgCodeId: number | null;
  orgNm: string | null;
  titleCd: string | null;
  titleNm: string | null;
  posCd: string | null;
  posNm: string | null;
  gradeCd: string | null;
  /** 특정직위 */
  gradeNm: string | null;
  transReason: string | null;
  /** 조직장 */
  orgHeadYn: boolean;
}

/** 겸직발령 (GET /api/v1/emp/persons/{personId}/add-titles) */
export interface AddTitle {
  addTitleId: number;
  personId: number;
  /** 파생 사원 */
  addPersonId: number;
  empNo: string;
  startDate: string;
  closeDate: string | null;
  orgCodeId: number;
  orgNm: string | null;
  titleCd: string;
  titleNm: string | null;
  posCd: string | null;
  posNm: string | null;
  orgHeadYn: boolean;
  transReason: string | null;
}

export type AddTitleSave = Pick<AddTitle, 'startDate' | 'closeDate' | 'orgCodeId' | 'titleCd' | 'orgHeadYn' | 'transReason'> & { posCd: string };

/** 조직별 사원 (GET /api/v1/emp/trans-infos/by-org) */
export interface OrgPerson {
  personId: number;
  empNo: string;
  korNm: string;
  posNm: string | null;
  orgKorNm: string | null;
  /** 특정직위가 있으면 특정직위, 없으면 직책 */
  titleNm2: string | null;
  kindNm: string | null;
  hireDate: string | null;
  emailAddr: string | null;
  mobileTelno: string | null;
  officeTelno: string | null;
}

/** 발령 변경 내역 (GET /api/v1/emp/trans/histories) */
export interface TransHistory {
  transId: number;
  transDate: string;
  empNo: string;
  korNm: string;
  transNm: string | null;
  kindNm: string | null;
  orgNm: string | null;
  titleNm: string | null;
  posNm: string | null;
  gradeNm: string | null;
  orgHeadYn: boolean;
  transReason: string | null;
}

/** 사용자정보 (GET /api/v1/emp/persons/user-infos, 전 고객사) */
export interface UserInfo {
  personId: number;
  companyNm: string;
  korNm: string;
  empNo: string;
  posNm: string | null;
  orgNm: string | null;
  officeTelno: string | null;
  mobileTelno: string | null;
  emailAddr: string | null;
  hireDate: string | null;
  note: string | null;
}

/** 서버 페이징 응답 */
export interface Page<T> {
  total: number;
  rows: T[];
}

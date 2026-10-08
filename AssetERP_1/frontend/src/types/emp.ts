/** 사원정보 목록 행 (GET /api/v1/emp/trans-infos, AS-IS Emp00_TransInfoModel). Y/N은 'true'/'false' 문자열, 날짜는 'yyyy-MM-dd…' */
export interface TransInfo {
  transId: number;
  personId: number;
  transDate?: string | null;
  transCd?: string | null;
  transNm?: string | null;
  kindCd?: string | null;
  kindNm?: string | null;
  posCd?: string | null;
  posNm?: string | null;
  titleCd?: string | null;
  titleNm?: string | null;
  orgCodeId?: number | null;
  orgKorNm?: string | null;
  parentFullNm?: string | null;
  officerYn?: string | null;
  expiryDate?: string | null;
  empNo?: string | null;
  korNm?: string | null;
  orderSeq?: string | null;
  hireCd?: string | null;
  hireNm?: string | null;
  applyCd?: string | null;
  applyNm?: string | null;
  hireDate?: string | null;
  retireDate?: string | null;
  emailAddr?: string | null;
  officeTelNo?: string | null;
  officeDetail?: string | null;
  mobileTelNo?: string | null;
  note?: string | null;
  financeProYn?: string | null;
  birthday?: string | null;
  genderNm?: string | null;
}

/** 신규사원 등록 (POST /api/v1/emp/trans-infos, AS-IS Emp03_Edit_Person) */
export interface TransInfoCreateReq {
  empNo: string;
  korNm: string;
  kindCd?: string;
  hireDate?: string;
  expiryDate?: string;
  officeTelNo?: string;
  officeDetail?: string;
  mobileTelNo: string;
  hireCd?: string;
  emailAddr: string;
  titleCd?: string;
  posCd?: string;
  orgCodeId?: number;
  note?: string;
}

/** 기본정보 탭 저장 (PUT /api/v1/emp/persons/{personId}, AS-IS Emp01_PersonModel) */
export interface PersonSaveReq {
  empNo?: string | null;
  korNm?: string | null;
  hireDate?: string | null;
  hireCd?: string | null;
  applyCd?: string | null;
  orderSeq?: string | null;
  emailAddr?: string | null;
  officeTelNo?: string | null;
  officeDetail?: string | null;
  mobileTelNo?: string | null;
  note?: string | null;
}

/** 일반발령 행 (GET /api/v1/emp/persons/{personId}/trans, AS-IS Emp03_TransModel) */
export interface Trans {
  transId: number;
  personId: number;
  transDate?: string | null;
  transCd?: string | null;
  transNm?: string | null;
  kindCd?: string | null;
  kindNm?: string | null;
  orgCodeId?: number | null;
  orgNm?: string | null;
  titleCd?: string | null;
  titleNm?: string | null;
  posCd?: string | null;
  posNm?: string | null;
  gradeNm?: string | null;
  duty?: string | null;
  expiryDate?: string | null;
  transReason?: string | null;
  orgHeadYn?: string | null;
  officerYn?: string | null;
  tdmTargetYn?: string | null;
  nonStayYn?: string | null;
}

/** 조직 (GET /api/v1/org/org-infos, AS-IS Org00_OrgInfoModel) */
export interface OrgInfo {
  orgCodeId: number;
  orgCd?: string | null;
  korNm?: string | null;
  parentFullNm?: string | null;
  levelCd?: string | null;
  levelNm?: string | null;
  modDate?: string | null;
}

/** 사원찾기 행 (GET /api/v1/emp/trans, AS-IS Emp01_Lookup_PersonModel) */
export interface TransPerson {
  transId: number;
  personId: number;
  orgCodeId?: number | null;
  orgNm?: string | null;
  empNo?: string | null;
  korNm?: string | null;
  titleNm?: string | null;
}

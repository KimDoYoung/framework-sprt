/** 리서치 일정 한 건 (AS-IS Pln03_ResrchModel 중 Pln03_Lookup_ResrchDetail이 다루는 값, EE90). regEmpName·cfrmEmpName = "이름 (부서)" */
export interface PlnResrch {
  resrchId: number;
  classTreeId?: number | null;
  classTreeName?: string | null;
  issuingEntityId?: number | null;
  issuingEntityName?: string | null;
  visitReason?: string | null;
  regPersonId?: number | null;
  regEmpName?: string | null;
  regDate?: string | null;
  closeDate?: string | null;
  closeYn?: string | null;
  resrchStartDate?: string | null;
  resrchCloseDate?: string | null;
  cfrmPersonId?: number | null;
  cfrmEmpName?: string | null;
  cfrmDate?: string | null;
  note?: string | null;
  targetTypeCode?: string | null;
  targetTypeName?: string | null;
}

/** 리서치 일정 저장 — 등록자·등록일·완료·확인일은 서버가 정한다 */
export interface PlnResrchSaveReq {
  resrchId: number;
  classTreeId: number | null;
  issuingEntityId: number | null;
  visitReason: string | null;
  resrchStartDate: string | null;
  resrchCloseDate: string | null;
  cfrmPersonId: number | null;
  note: string | null;
  targetTypeCode: string | null;
}

/** 시스템 개발의뢰(SR) 한 줄 (AS-IS Scm01_SrModel, scm01_sr.selectByText·selectById, EE15) */
export interface Sr {
  srId: number;
  systemCd?: string | null;
  srDate?: string | null;
  personId?: number | null;
  corpId?: number | null;
  requestor?: string | null;
  srType?: string | null;
  srContent?: string | null;
  apprStatusCd?: string | null;
  srStatusCd?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  closeDate?: string | null;
  resultContent?: string | null;
  devImportanceCd?: string | null;
  expectPeriod?: string | null;
  devContent?: string | null;
  devTarget?: string | null;
  devTargetEtc?: string | null;
  srNo?: string | null;
  srArrangeContent?: string | null;
  personNm?: string | null;
  corpNm?: string | null;
  systemNm?: string | null;
  srTypeNm?: string | null;
  apprStatusNm?: string | null;
  srStatusNm?: string | null;
  devImportanceNm?: string | null;
  fileCount?: number | null;
  requestorCorpNm?: string | null;
  devCountStr?: string | null;
}

/** 의뢰 결재단계 한 줄 (AS-IS Scm02_SrApprStepModel). 새 줄은 임시 음수 번호 */
export interface SrApprStep {
  srApprStepId: number;
  srId?: number | null;
  stepTypeCd: string;
  seq?: string | null;
  stepStatusCd?: string | null;
  apprDate?: string | null;
  note?: string | null;
  rejectReason?: string | null;
  stepEmpId: number;
  apprEmpId?: number | null;
  stepTypeNm?: string | null;
  stepStatusNm?: string | null;
  stepApprName?: string | null;
  orgKorNm?: string | null;
  titleNm?: string | null;
  empKorNm?: string | null;
}

/** 의뢰 저장 요청 — apprStatusCd: 임시저장 '99' / 결재요청 '10'(결재선이 1명이면 '30') / 전체 초기화 null */
export interface SrSaveReq {
  srId: number;
  systemCd: string | null;
  srDate: string | null;
  corpId: number | null;
  requestor: string | null;
  srType: string | null;
  srContent: string | null;
  apprStatusCd: string | null;
}

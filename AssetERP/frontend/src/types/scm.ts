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

/** 개발관리 폼 저장 요청 (Scm01_Edit_DevMng.updateRow, EE16) — devTarget: 화면프로그램|서버프로그램|보고서|DB|기타 를 1/0 다섯 글자로 */
export interface SrDevMngSaveReq {
  srStatusCd: string | null;
  dueDate: string | null;
  startDate: string | null;
  closeDate: string | null;
  devImportanceCd: string | null;
  expectPeriod: string | null;
  devContent: string | null;
  devTarget: string | null;
  devTargetEtc: string | null;
  resultContent: string | null;
}

/** 개발자 그리드 한 줄 (AS-IS Scm10_DevModel, scm10_dev.selectBySrId, EE16). 새 줄은 임시 음수 번호 */
export interface Dev {
  devId: number;
  srId?: number | null;
  personId?: number | null;
  startDate?: string | null;
  dueDate?: string | null;
  note?: string | null;
  regDate?: string | null;
  arrangeNote?: string | null;
  personNm?: string | null;
  srDate?: string | null;
  srNo?: string | null;
  systemNm?: string | null;
  requestor?: string | null;
  resultDate?: string | null;
  devStepResult?: string | null;
  devProgramCnt?: number | null;
  fileCnt?: number | null;
}

/** 개발자 저장 요청 (Scm10_Grid_Dev.update) */
export interface DevSaveReq {
  devId: number;
  srId: number | null;
  personId: number | null;
  regDate: string | null;
  note: string | null;
}

/** 예상프로그램 한 줄 (AS-IS Scm03_ExpectProgramModel). 새 줄은 임시 음수 번호 */
export interface ExpectProgram {
  expectProgramId: number;
  srId?: number | null;
  programId?: number | null;
  programTypeNm?: string | null;
  programCd?: string | null;
  programNm?: string | null;
}

/** 진행단계 한 줄 (AS-IS Scm11_DevStepModel, scm11_dev_step.selectByDevId). 새 줄은 임시 음수 번호 */
export interface DevStep {
  devStepId: number;
  devId?: number | null;
  devStepSeq?: string | null;
  devStepCd?: string | null;
  devStatusCd?: string | null;
  personId?: number | null;
  resultCd?: string | null;
  resultDate?: string | null;
  result?: string | null;
  note?: string | null;
  personNm?: string | null;
  devPersonNm?: string | null;
  devStepNm?: string | null;
  devStatusNm?: string | null;
  resultNm?: string | null;
  regDate?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  resultDateStr?: string | null;
  srDate?: string | null;
  srNo?: string | null;
  systemCd?: string | null;
  systemNm?: string | null;
  devNote?: string | null;
  devArrangeNote?: string | null;
  arrangeResult?: string | null;
  fileCount?: number | null;
  devStepResult?: string | null;
}

/** 진행단계 기본설정 한 줄 (AS-IS Scm12_DevStepRuleModel) */
export interface DevStepRule {
  devStepRuleId: number;
  devStepSeq?: string | null;
  devStepCd?: string | null;
  devStepNm?: string | null;
}

/** 개발 프로그램 한 줄 + 프로그램(scm30) 열 (AS-IS Scm13_DevProgramModel + programModel) */
export interface DevProgram {
  devProgramId: number | null;
  devId?: number | null;
  programId: number;
  modiType?: string | null;
  deployTgtYn?: string | null;
  deploySeq?: number | null;
  deployYn?: string | null;
  deployerId?: number | null;
  deployDate?: string | null;
  deployNote?: string | null;
  systemCd?: string | null;
  programType?: string | null;
  programCd?: string | null;
  programNm?: string | null;
  source?: string | null;
  version?: number | null;
  personId?: number | null;
  regDate?: string | null;
  note?: string | null;
  useYn?: string | null;
  modiTypeNm?: string | null;
  systemNm?: string | null;
  programTypeNm?: string | null;
  regDateStr?: string | null;
}

/** 프로그램 선택 창 한 줄 (AS-IS Scm30_ProgramModel, scm30_program.selectByTextPaging) */
export interface Program {
  programId: number;
  systemCd?: string | null;
  programType?: string | null;
  programCd?: string | null;
  programNm?: string | null;
  source?: string | null;
  version?: number | null;
  personId?: number | null;
  regDate?: string | null;
  note?: string | null;
  useYn?: string | null;
  systemNm?: string | null;
  programTypeNm?: string | null;
  regDateStr?: string | null;
  fileId?: number | null;
  fileParentId?: number | null;
  fileNm?: string | null;
}

/** 개발 진행상태 콤보 한 건 (AS-IS sys.Sys00_Common.selectDevStatus, EE17) */
export interface DevStatus {
  code: string;
  name: string;
}

/** 배포처리 위쪽 목록 한 줄 (AS-IS Scm11_DevStepModel, scm11_dev_step.selectByDeployPersonId) (EE18) */
export interface Deploy {
  devStepId: number;
  devId: number;
  srDate?: string | null;
  systemCd?: string | null;
  systemNm?: string | null;
  devNote?: string | null;
  devPersonNm?: string | null;
  resultDateStr?: string | null;
  deployCount?: number | null;
  devStepResult?: string | null;
  srNo?: string | null;
}

/** 배포처리 아래쪽 목록 한 줄 (AS-IS Scm13_DevProgramModel, scm13_dev_program.selectByDeployTgtDevId) (EE18) */
export interface DeployProgram extends DevProgram {
  deployDateStr?: string | null;
  personNm?: string | null;
}

/** 인감 한 행 (AS-IS Apr10_StampModel — Apr10_Lookup_DocStamp 그리드) */
export interface AprStamp {
  stampId: number;
  /** 이미지 URL용 문자열 ID */
  stampIdString: string;
  stampName?: string | null;
  useName?: string | null;
  orgName?: string | null;
}

/** 결재선 지정그룹 (AS-IS Apr30_ApprStepGroupModel) */
export interface AprApprStepGroup {
  apprStepGroupId: number;
  apprStepGroupName?: string | null;
  note?: string | null;
}

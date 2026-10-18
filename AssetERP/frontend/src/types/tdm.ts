/** 법규에 연결된 책무이행점검항목 한 행 (AS-IS Tdm45_ManlRelateIcsModel 중 Ics01_Lookup_RelateTdm 그리드 열) */
export interface ManlRelateIcs {
  manlRelateIcsId: number;
  manlId: number;
  icsClassTreeId?: number | null;
  roleName?: string | null;
  taskName?: string | null;
  taskDetailName?: string | null;
  taskDutyName?: string | null;
  taskCheckItem?: string | null;
  taskCheckHow?: string | null;
}

/** 책무기술서 한 행 (AS-IS Tdm31_RoleDescModel 중 Tdm31_Tab_RoleDescAdmin 그리드·재생성에 쓰는 속성) */
export interface TdmRoleDesc {
  roleDescId: number;
  regDate?: string | null;
  reasonName?: string | null;
  companyId: number;
  companyName?: string | null;
  personId: number;
  personName?: string | null;
  allcStdDate?: string | null;
  roleName?: string | null;
  addTitle?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
}

/** 책무체계도 한 행 (AS-IS Tdm32_RoleDigmModel 중 Tdm32_Tab_RoleDigmAdmin 그리드·재생성·보기에 쓰는 속성) */
export interface TdmRoleDigm {
  roleDigmId: number;
  companyId: number;
  companyName?: string | null;
  regDate?: string | null;
  allcStdDate?: string | null;
  reasonName?: string | null;
  useFileType?: string | null;
  useFileTypeName?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  roleDigmFileId?: number | null;
}

/** 책무진행 상태 한 행 (AS-IS Sys99_PrintModel 중 Tdm50_Tab_DutyProgressAdmin 그리드에 쓰는 속성, f_recon_tdm 'CHCK_STATUS' 결과). m00~m11은 조회 기준월부터 12개월 */
export interface TdmDutyProgress {
  printId: number;
  companyName?: string | null;
  roleName?: string | null;
  exctName?: string | null;
  orgName?: string | null;
  name1454?: string | null;
  apprList1463?: string | null;
  manlCnt?: number | null;
  endCnt?: number | null;
  lockCnt?: number | null;
  approveCnt?: number | null;
  unusedCnt?: number | null;
  manlAnnually?: number | null;
  manlSemiannually?: number | null;
  manlQuarterly?: number | null;
  manlMonthly?: number | null;
  manlAnytime?: number | null;
  manlEtc?: number | null;
  thisMonthYn?: string | null;
  nextMonthYn?: string | null;
  m00Cnt?: number | null;
  m01Cnt?: number | null;
  m02Cnt?: number | null;
  m03Cnt?: number | null;
  m04Cnt?: number | null;
  m05Cnt?: number | null;
  m06Cnt?: number | null;
  m07Cnt?: number | null;
  m08Cnt?: number | null;
  m09Cnt?: number | null;
  m10Cnt?: number | null;
  m11Cnt?: number | null;
  itemCnt1455?: number | null;
  checker1456?: string | null;
  apprList1456?: string | null;
  apprStatus?: string | null;
  exctApproveYn?: string | null;
  chckLockYn?: string | null;
  chckCloseYn?: string | null;
  chckApprStatus?: string | null;
}

/** 책무마감 검증 한 행 (AS-IS Sys99_PrintModel 중 Tdm50_Tab_DutyReconAdmin 그리드에 쓰는 속성, f_recon_tdm 'DB_CHK' 결과) */
export interface TdmDutyRecon {
  printId: number;
  companyName?: string | null;
  string01?: string | null;
  string02?: string | null;
  string03?: string | null;
}

/** 부서 책무매뉴얼 한 행 (AS-IS Tdm42_ManlOrgModel 중 Tdm42_Tab_ManlManagerAdmin 그리드·재생성·보기·점검항목 조회창에 쓰는 속성) */
export interface TdmManlOrg {
  manlOrgId: number;
  companyId: number;
  companyName?: string | null;
  orgName?: string | null;
  roleName?: string | null;
  exctId?: number | null;
  exctName?: string | null;
  manlDutyEndYn?: boolean | null;
  manlDutyEndDate?: string | null;
  taskCnt?: number | null;
  taskRelateDetailCnt?: number | null;
  taskRelateDutyCnt?: number | null;
  manlCnt?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  /** 적용시작일이 있으면 'true' (책무매뉴얼 보기 아이콘을 보인다) */
  startDateYnStr?: string | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  jobName?: string | null;
  lockYn?: boolean | null;
}

/** 부서 책무매뉴얼의 점검항목 한 행 (AS-IS Tdm43_ManlModel 중 Tdm43_Lookup_ManlItem 그리드·삭제와 Tdm43_Edit_Manl 등록·수정·보기가 쓰는 속성) */
export interface TdmManlItem {
  manlId: number;
  manlOrgId: number;
  companyId?: number | null;
  orgId?: number | null;
  exctId?: number | null;
  roleId?: number | null;
  roleName?: string | null;
  taskId?: number | null;
  taskName?: string | null;
  taskRelateDetailId?: number | null;
  taskRelateDetailName?: string | null;
  taskRelateDutyId?: number | null;
  taskRelateDutyName?: string | null;
  manlDutyId?: number | null;
  manlCode?: string | null;
  taskDetailAddSeq?: string | null;
  taskDutyAddSeq?: string | null;
  checkItem?: string | null;
  checkItemAddCode?: string | null;
  checkCycleCode?: string | null;
  checkMonth?: string | null;
  checkHow?: string | null;
  checkHowLimit?: string | null;
  checkCycleName?: string | null;
  checkEvidDocName?: string | null;
  refBasis?: string | null;
  startDate?: string | null;
  ceoDutyCode?: string | null;
  exctDutyMap?: string | null;
  exctDutyName?: string | null;
  importLevelCode?: string | null;
  unuseYn?: boolean | null;
}

/** 점검항목에 연결된 법규·내규·양식·문서분류 (AS-IS Tdm43_Page_Relate 그리드 4개). id가 없는 행은 아직 저장 안 한 새 연결 */
export interface TdmManlRelates {
  ics: { manlRelateIcsId?: number; icsClassTreeId: number; icsClassTreeCode?: string | null; icsClassTreeName?: string | null }[];
  icr: { manlRelateIcrId?: number; icrClassTreeId: number; icrClassTreeCode?: string | null; icrClassTreeName?: string | null }[];
  forms: { relateFileId?: number; fileId: number; fileName?: string | null; regDate?: string | null }[];
  dcrs: { manlRelateDcrId?: number; dcrClassTreeId: number; dcrClassTreeCode?: string | null; dcrClassTreeName?: string | null; dcrClassTreeFullName?: string | null }[];
}

/** 점검항목 저장 요청 (AS-IS tdm.Tdm43_Manl.modelUpdate) */
export interface TdmManlSaveReq {
  manlId: number;
  manlOrgId: number;
  orgId?: number | null;
  exctId?: number | null;
  roleId?: number | null;
  roleName?: string | null;
  taskId?: number | null;
  taskName?: string | null;
  taskRelateDetailId?: number | null;
  taskRelateDetailName?: string | null;
  taskRelateDutyId?: number | null;
  taskRelateDutyName?: string | null;
  manlDutyId?: number | null;
  checkItem: string;
  checkCycleCode: string;
  checkMonth: string;
  checkEvidDocName?: string | null;
  checkHow?: string | null;
  refBasis?: string | null;
  startDate?: string | null;
  ceoDutyCode?: string | null;
  exctDutyMap?: string | null;
  importLevelCode?: string | null;
  relateIcsClassTreeIds: number[];
  relateIcrClassTreeIds: number[];
  relateFormFileIds: number[];
  relateDcrClassTreeIds: number[];
}

/** 연결할 책무점검 양식 파일 한 행 (AS-IS Sys10_FileModel 중 Tdm43_Lookup_RelateFormFileList 그리드 열) */
export interface TdmManlFormFile {
  fileId: number;
  tdmCheckFormTypeName?: string | null;
  fileName?: string | null;
  note?: string | null;
  regDate?: string | null;
}

/** 연결할 책무이행점검항목 한 행 (AS-IS Tdm43_ManlModel 중 Ics01_Lookup_SelectTdm 그리드 열) */
export interface Manl {
  manlId: number;
  manlCode?: string | null;
  roleName?: string | null;
  taskRelateDutyName?: string | null;
  checkItemAddCode?: string | null;
  checkHow?: string | null;
}

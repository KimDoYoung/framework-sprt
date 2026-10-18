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

/** 부서 책무매뉴얼의 점검항목 한 행 (AS-IS Tdm43_ManlModel 중 Tdm43_Lookup_ManlItem 그리드·삭제와 등록/수정창이 넘겨받는 속성) */
export interface TdmManlItem {
  manlId: number;
  manlOrgId: number;
  orgId?: number | null;
  exctId?: number | null;
  roleId?: number | null;
  roleName?: string | null;
  taskId?: number | null;
  taskName?: string | null;
  taskRelateDetailId?: number | null;
  taskRelateDutyId?: number | null;
  manlDutyId?: number | null;
  manlCode?: string | null;
  taskDetailAddSeq?: string | null;
  taskDutyAddSeq?: string | null;
  checkItemAddCode?: string | null;
  checkHowLimit?: string | null;
  checkCycleName?: string | null;
  checkEvidDocName?: string | null;
  unuseYn?: boolean | null;
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

/** 문서분류 선택 조회창 한 행 (AS-IS Dcr01_ClassTreeModel 중 Dcr01_Lookup_SelectMulti 그리드 열, E13-3) */
export interface DcrClassTreeLookup {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeFullName?: string | null;
}

// ── E16 문서분류 (Dcr01_Tab_ClassTree 외) ──

/** 문서분류 트리 한 행 (AS-IS Dcr01_ClassTreeModel — selectByCompanyId). 전위 순서 평평한 목록 + depth(0부터, 한 건만 읽으면 null) */
export interface DcrClassTree {
  classTreeId: number;
  companyId: number;
  parentTreeId: number;
  classTreeName: string;
  classTreeCode: string;
  seq: string;
  note?: string | null;
  /** C 문서분류 · T 문서구분 */
  typeCode: string;
  /** 'true'/'false' */
  useYn: string;
  adminYn: string;
  depth?: number | null;
}

/** 사용여부 설정 창 한 행 (AS-IS selectByAll). apprCount는 문서구분(T)만 */
export interface DcrClassTreeAll {
  classTreeId: number;
  parentTreeId: number;
  classTreeName: string;
  typeCode: string;
  useYn: string;
  apprCount?: number | null;
  depth: number;
}

/** 문서구분(T) 그리드 행 (AS-IS Dcr01_ClassTreeModel — selectByClassTreeId). 새 행은 classTreeId가 0 이하 */
export interface DcrDocTypeRow {
  classTreeId: number;
  companyId?: number | null;
  parentTreeId: number;
  classTreeName?: string | null;
  classTreeCode?: string | null;
  seq?: string | null;
  note?: string | null;
  adminYn?: string | null;
  approvalTypeCode?: string | null;
  approvalTypeName?: string | null;
  apprStepGroupId?: number | null;
  apprStepGroupName?: string | null;
  sealCode?: string | null;
  sealName?: string | null;
  compYn?: string | null;
  mngmYn?: string | null;
  printFundYn?: string | null;
  formCountStr?: string | null;
  icsCountStr?: string | null;
  icrCountStr?: string | null;
  classTreeFullName?: string | null;
}

export interface DcrClassTreeSaveReq {
  parentTreeId: number;
  classTreeName: string | null;
  classTreeCode: string | null;
  seq: string | null;
  note: string | null;
}

export type DcrDocTypeSaveReq = Pick<DcrDocTypeRow, 'classTreeId' | 'parentTreeId' | 'classTreeName' | 'classTreeCode' | 'seq' | 'note'
  | 'approvalTypeCode' | 'apprStepGroupId' | 'sealCode' | 'compYn' | 'mngmYn' | 'printFundYn'>;

export interface DcrUseYnReq {
  classTreeId: number;
  useYn: string;
}

/** 서버 점검 결과 (updateCheck: 1 통과/-1 문구, deleteCheck: 0이면 지워도 됨) */
export interface DcrCheckRes {
  status: number;
  message?: string | null;
}

export interface DcrCheckRowReq {
  classTreeId?: number | null;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  seq?: string | null;
  note?: string | null;
}

export interface DcrCopyCompany {
  companyId: number;
  companyName: string;
  locationName?: string | null;
  icsGuideYn?: string | null;
}

/** 세부분류 (AS-IS Dcr07_ClassDetailModel) */
export interface DcrClassDetail {
  classDetailId: number;
  classTreeId: number;
  classDetailName?: string | null;
  keyword?: string | null;
  guide?: string | null;
  seq?: number | null;
  linkYn?: string | null;
  useYn?: string | null;
}

/** 문서구분에 연결한 문서양식 (AS-IS Dcr06_RelateDocTypeModel) */
export interface DcrRelateDocType {
  relateDocTypeId: number;
  classTreeId: number;
  docTypeId: number;
  title?: string | null;
  defaultYn?: string | null;
  note?: string | null;
}

/** 문서구분에 연결한 법규 (AS-IS Dcr20_RelateIcsModel) · 내규(Dcr21_RelateIcrModel)는 relateIcsId 대신 relateIcrId */
export interface DcrRelateIcs {
  relateIcsId: number;
  dcrClassTreeId: number;
  icsClassTreeId?: number | null;
  classTreeFullName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  cycleName?: string | null;
  relatedLaw?: string | null;
  classTreeCode?: string | null;
  note?: string | null;
}

export interface DcrRelateIcr {
  relateIcrId: number;
  dcrClassTreeId: number;
  icrClassTreeId?: number | null;
  classTreeFullName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  cycleName?: string | null;
  relatedLaw?: string | null;
  classTreeCode?: string | null;
  note?: string | null;
}

export interface DcrRelateSaveReq {
  relateId: number;
  dcrClassTreeId: number;
  targetClassTreeId: number;
  note?: string | null;
}

/** 문서양식 (AS-IS Dcr05_DocTypeModel) */
export interface DcrDocType {
  docTypeId: number;
  companyId?: number | null;
  title: string;
  content?: string | null;
  note?: string | null;
  docFormClassCode?: string | null;
  docFormClassName?: string | null;
}

export interface DcrDocTypeUpdateReq {
  title: string | null;
  content: string | null;
  note: string | null;
  docFormClassCode: string | null;
}

// ── E17 문서분류지정 (Dcr30_Tab_LinkAdmin) ──

/** Link 한 행 (AS-IS Dcr30_LinkModel — dcr30_link.selectBySearchId) */
export interface DcrLink {
  linkId: number;
  linkCode: string;
  linkName: string;
  companyId: number;
  classTreeId?: number | null;
  classTreeFullName?: string | null;
  formMappingId?: number | null;
  /** A 데이터연결 지원 고정 · B 양식 있음 · ' ' 양식 없음 */
  gubun?: string | null;
  note?: string | null;
}

/** 저장할 때 보내는 열 (UpdateDataModel(dcr30_link)이 바꾸는 문서분류ID·비고) */
export interface DcrLinkSaveReq {
  linkId: number;
  classTreeId?: number | null;
  note?: string | null;
}


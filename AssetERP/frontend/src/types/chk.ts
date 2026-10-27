/** 일일점검내역 분류 한 행 (AS-IS chk01_class_tree) — 전위 순서 평평한 목록, depth는 0부터. 사용여부는 'true'/'false' 문자열 */
export interface ChkClassTree {
  classTreeId: number
  companyId?: number | null
  parentTreeId: number
  classTreeName?: string | null
  seq?: number | null
  useYn?: string | null
  note?: string | null
  linkCode?: string | null
  linkName?: string | null
  depth: number
}

/** Chk01_Edit_ClassTree 저장 본문 — 회사는 서버가 채운다 */
export interface ChkClassTreeSaveReq {
  parentTreeId: number
  classTreeName?: string | null
  seq?: number | null
  useYn?: string | null
  note?: string | null
  linkCode?: string | null
}

/** 일일점검내역 한 행 (AS-IS chk02_daily_list, E07) — 사용여부는 'true'/'false' 문자열 */
export interface ChkDailyList {
  dailyListId: number
  companyId: number
  classTreeId: number
  classTreeName?: string | null
  content?: string | null
  explan?: string | null
  /** AS-IS 그리드 "설명" 열 속성(chk02_reason) — 테이블에 열이 없어 항상 null (원본 그대로) */
  reason?: string | null
  cutoff?: string | null
  windowNo?: string | null
  seq?: number | null
  useYn?: string | null
  adminDailyListId?: number | null
  /** 회사 0이거나 관리자 점검내역에서 복사된 행 */
  adminYn: boolean
  /** 담당그룹(R01) — sch22_write_group */
  writeGroupId?: number | null
  writeGroupName?: string | null
}

/** Chk02_Edit_DailyList 저장 본문 — 회사는 서버가 채운다 */
export interface ChkDailyListSaveReq {
  classTreeId: number | null
  content?: string | null
  explan?: string | null
  cutoff?: string | null
  windowNo?: string | null
  seq?: number | null
  useYn?: string | null
}

/** 점검내역복사 본문 */
export interface ChkDailyListCopyReq {
  dailyListIds: number[]
  companyIds: number[]
}

/** 일일점검내역 작성 화면의 한 행 (R02, AS-IS Chk02_DailyListModel) — 답변 코드 Y(예)·N(아니오)·X(해당없음) */
export interface ChkDailyListWrite {
  dailyListId: number
  classTreeId: number
  classTreeName?: string | null
  content?: string | null
  explan?: string | null
  cutoff?: string | null
  windowNo?: string | null
  seq?: number | null
  useYn?: string | null
  dailyListWriteId?: number | null
  answerCode?: string | null
  reason?: string | null
  note?: string | null
  confirmYn: boolean
}

/** 작성 행 하나 (AS-IS Chk03_DailyListWriteModel) */
export interface ChkDailyListWriteItem {
  dailyListWriteId: number
  dailyListId: number
  answerCode?: string | null
  reason?: string | null
  note?: string | null
  confirmYn: boolean
}

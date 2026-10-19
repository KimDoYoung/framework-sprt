/** 파일보관함 한 행 (AS-IS Fbx01_BoxModel 중 Fbx01_Tab_Document 위 그리드 열). crtDate는 ISO 일시 */
export interface FbxBox {
  boxId: number;
  crtDate: string;
  crtEmpId: number;
  title: string;
  note?: string | null;
  statusCd: string;
  statusName: string;
  fileCount?: number | null;
}

/** 파일보관함 저장 한 행 (boxId가 없거나 0 이하면 새 행) */
export interface FbxBoxSaveReq {
  boxId?: number;
  crtDate?: string | null;
  title: string;
  note?: string | null;
  statusCd: string;
}

/** 파일보관함 기록 한 행 (AS-IS Fbx02_HistoryModel 중 Fbx02_Popup_History 열) */
export interface FbxHistory {
  historyId: number;
  actDate: string;
  actName: string;
  actContent: string;
  actEmpName?: string | null;
  actOrgName?: string | null;
}

/** 보관함 파일 한 행 (AS-IS Fbx03_FileModel 중 Fbx01_TabPage_DocList 열). fileId = 첨부(sys10_file)의 parent id */
export interface FbxFile {
  fileId: number;
  boxId: number;
  dcrClassId: number;
  dcrClassName?: string | null;
  empId: number;
  empName?: string | null;
  crtDate: string;
  fileName: string;
}

/** L05 Bmt01_Tab_Buy 그리드 한 행 (AS-IS Bmt01_BuyModel). 날짜는 'yyyy-MM-dd'. 아직 저장 전인 새 행은 buyId가 음수(임시) */
export interface BmtBuy {
  buyId: number;
  buyDate: string | null;
  provideContentCode: string | null;
  provideContentName: string | null;
  buyQty: number | null;
  buyAmt: number | null;
  totalPeple: number | null;
  averagePrice: number | null;
  leftQty: number | null;
  personId: number | null;
  personName: string | null;
  apprId: number | null;
  apprStatusName: string | null;
}

/** T20 Bmt12_Tab_EmpIct 그리드 한 행 (AS-IS Bmt12_PcHistoryModel) */
export interface BmtEmpIct {
  pcHistoryId: number;
  personName: string | null;
  messenger: string | null;
  website: string | null;
  internalIp: string | null;
  astClassTreeName: string | null;
  spec: string | null;
  etc: string | null;
}

/** W18 Bmt10_Tab_Info 그리드 한 행 (AS-IS Bmt10_InfoModel). 날짜는 'yyyy-MM-dd' */
export interface BmtInfo {
  infoId: number;
  astClassTreeId: number | null;
  astClassTreeName: string | null;
  applyDate: string | null;
  retireDate: string | null;
  acqAmount: number | null;
  acqInfo: string | null;
  spec: string | null;
  note: string | null;
  personName: string | null;
}

/** Bmt10_Edit_Info [저장] 요청 */
export interface BmtInfoSaveReq {
  astClassTreeId: number | null;
  applyDate: string | null;
  retireDate: string | null;
  acqAmount: number | null;
  acqInfo: string | null;
  spec: string | null;
  note: string | null;
}

/** W18 Bmt11_TabPage_History 그리드 한 행 (AS-IS Bmt11_HistoryModel). 아직 저장 전인 새 행은 historyId가 음수(임시) */
export interface BmtHistory {
  historyId: number;
  infoId: number;
  personId: number | null;
  personName: string | null;
  startDate: string | null;
  messenger: string | null;
  website: string | null;
  note: string | null;
}

/** W18 Bmt10_Lookup_History 그리드 한 행 (AS-IS Bmt12_PcHistoryModel) */
export interface BmtPcHistory {
  pcHistoryId: number;
  infoId: number;
  astClassTreeName: string | null;
  startDate: string | null;
  hostName: string | null;
  settingDate: string | null;
  internalIp: string | null;
  macAddress: string | null;
  etc: string | null;
  note: string | null;
}

/** Bmt12_Edit_PcHistory [저장] 요청 (pcHistoryId 없으면 새 행) */
export interface BmtPcHistorySaveReq {
  pcHistoryId?: number | null;
  infoId: number | null;
  startDate: string | null;
  hostName: string | null;
  settingDate: string | null;
  internalIp: string | null;
  macAddress: string | null;
  etc: string | null;
  note: string | null;
}

/** W18 Bmt20_Lookup_RelateAppr 그리드 한 행 (AS-IS Bmt20_RelateApprModel) */
export interface BmtRelateAppr {
  relateApprId: number;
  infoId: number;
  apprId: number;
  regDate: string | null;
  title: string | null;
}

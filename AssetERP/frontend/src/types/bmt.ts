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

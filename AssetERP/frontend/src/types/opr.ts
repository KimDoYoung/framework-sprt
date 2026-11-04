/** AS-IS opr.Opr01_Create.selectByLookupTitle (Opr02_Lookup_Fund, EE100) — 운용계획서 한 줄 */
export interface OprCreate {
  createId: number;
  title: string | null;
  year: string | null;
  termName: string | null;
  korName: string | null;
  posName: string | null;
  startDate: string | null;
}

/** AS-IS opr.Opr02_Fund.selectByCreateId (Opr02_Lookup_Fund, EE100) — 연관펀드 한 줄. regFundId = 고른 펀드의 번호 */
export interface OprFund {
  fundId: number;
  regFundId: number;
  fundCode: string | null;
  fundName: string | null;
  fundTypeName: string | null;
  empName1: string | null;
  startDate: string | null;
  publicName: string | null;
  orgCodeName: string | null;
}

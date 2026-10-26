/** adv(일임·자문) 화면 타입 (Q01~) — 백엔드 biz.adv.dto */

/** 일임/자문 고객계좌 (AS-IS Adv02_AccountModel). accountId ≤ 0은 아직 저장 안 한 새 행 */
export interface AdvAccount {
  accountId: number;
  companyId?: number | null;
  manageCode?: string | null;
  manageName?: string | null;
  trCorpCode?: string | null;
  trCorpName?: string | null;
  /** 복호화한 계좌번호 */
  accountNoDec?: string | null;
  startDate?: string | null;
  closeDate?: string | null;
  workDate?: string | null;
  worker?: string | null;
}

/** 일임보유주식(타사무) 한 행 (Q03, AS-IS Adv11_BookExtrModel). bookExtrId가 0 이하면 새 행 */
export interface AdvBookExtr {
  bookExtrId: number;
  stdDate?: string | null;
  manageCode?: string | null;
  manageName?: string | null;
  itemCode?: string | null;
  itemName?: string | null;
  itemType?: string | null;
  itemTypeName?: string | null;
}

/** act(관리회계) 화면 타입 (E25~) — API 응답 record와 같은 필드 */

/** 계정코드 한 행 (act01_account_code.selectBySlipYn) */
export interface AccountCode {
  accountCodeId: number;
  companyId: number;
  attributeCode: string;
  attributeName: string;
  accountCode: string;
  accountName: string;
  accountName2: string;
}

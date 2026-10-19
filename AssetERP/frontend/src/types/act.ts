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

/** 계정코드 관리 그리드 한 행 (act01_account_code.selectByCompanyId, E27). 여부 열은 DB 형태('true'/'false') 그대로 */
export interface AccountCodeAdmin {
  accountCodeId: number;
  companyId: number;
  accountCode: string;
  accountName: string;
  accountName2: string | null;
  accountEName: string | null;
  parentCode: string | null;
  parentName: string | null;
  attributeCode: string | null;
  attributeName: string | null;
  drcrType: string | null;
  drcrName: string | null;
  slipYn: string | null;
  printYn: string | null;
  useYn: string | null;
  fssYn: string | null;
  fssAccountName: string | null;
  fssSlipYn: string | null;
  printSeq: string | null;
  content: string | null;
}

/** 계정코드 편집창 저장 (act.Act01_AccountCode.modelUpdate) — accountCodeId가 없거나 0 이하면 새 계정 */
export type AccountCodeSaveReq = Omit<AccountCodeAdmin, 'companyId' | 'parentName' | 'attributeName' | 'drcrName' | 'accountCodeId'> & { accountCodeId?: number | null };

/** 출력정보 및 사용여부 설정 저장 한 행 */
export interface AccountCodePrintSaveReq {
  accountCodeId: number;
  accountName2: string | null;
  printYn: string | null;
  useYn: string | null;
}

/** 계정과목 트리 한 행 — 전위 순서 평평한 목록 (act01_account_code.selectTreeByCompanyId). parentId는 화면에서 parentCode로 찾아 채운다 */
export interface AccountCodeTree {
  accountCodeId: number;
  companyId: number;
  accountCode: string;
  accountName: string;
  accountName2: string | null;
  parentCode: string | null;
  slipYn: string | null;
  level: number;
  parentId: number;
}

/** 계정과목복사 창의 고객사 한 행 (sys01_company.selectByUseYn) */
export interface ActCompany {
  companyId: number;
  companyName: string;
  locationName: string | null;
}

/** 이익제공(수령) 연결정보 한 행 (act14_link.selectByAccountCode) */
export interface ActLink {
  linkId: number;
  companyId: number;
  accountCode: string;
  provideContentCode: string;
  seq: number | null;
  provideName: string | null;
}

/** 이익제공(수령) 내용 콤보 한 항목 */
export interface ActCodeOption {
  code: string;
  name: string;
}

/** 대표계정코드 한 행 (act10_repr_account.selectByCompanyId, E28) — 계정속성명·상대 대표계정명은 SQL 계산 열 */
export interface ReprAccount {
  reprAccountId: number;
  companyId: number;
  reprAccountCode: string;
  reprAccountName: string;
  attributeCode: string | null;
  attributeName: string | null;
  tgtReprAccountCode: string | null;
  tgtReprAccountName: string | null;
  note: string | null;
}

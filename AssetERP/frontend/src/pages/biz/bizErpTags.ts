/**
 * AssetERP 사용료청구 메일 양식 태그 목록 (EE22) — AS-IS TempData.getMailMappingList().
 * Biz55_Tab_ErpFeeCharge(EE23)가 createMapping()에서 TempData.setMailMappingList(mapping)으로 키를 바꿔 두기 전에는 기본 3개(L884-890),
 * 바꾼 뒤에는 그 매핑 키 목록(L892-898, 빈 키는 뺀다)이다. 지금은 기본 목록만 쓴다 — EE23 변환 때 setErpMailMappingKeys를 부른다.
 */
const DEFAULT_TAGS = ['계약사명', '청구일', '청구금액'];

let current: string[] = [];

/** TempData.setMailMappingList */
export const setErpMailMappingKeys = (keys: string[]) => { current = keys; };

/** TempData.getMailMappingList — 비어 있으면 기본 목록 */
export const getErpMailMappingTags = (): string[] => (current.length === 0 ? DEFAULT_TAGS : current.filter(k => k !== ''));

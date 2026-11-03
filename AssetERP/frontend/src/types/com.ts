/** 데이터맵핑 문서양식 (AS-IS Com10_FormMappingModel — com10_form_mapping.selectById, E17) */
export interface FormMapping {
  formMappingId?: number | null;
  companyId?: number | null;
  linkCode?: string | null;
  title?: string | null;
  content?: string | null;
  defaultYn?: string | null;
  note?: string | null;
}

/** 종목정보 (AS-IS Com50_ItemModel — com50_item.selectByTextPaging, E20). itemType 2010=주식 */
export interface Com50Item {
  itemId: number;
  itemCode?: string | null;
  itemName?: string | null;
  itemType?: string | null;
}

/** 상세코드별 데이터맵핑 양식 (GET /api/v1/com/form-mapping-multis, AS-IS Com11_FormMappingMultiModel). 저장된 것이 없으면 번호만 새로 받은 빈 양식 */
export interface FormMappingMulti {
  formMappingMultiId: number;
  companyId: number;
  sysKindCode: string;
  sysDetailCode: string | null;
  linkCode: string;
  content: string | null;
  note: string | null;
}

/** EE34 증빙자료 창(Com01_Lookup_RelateAppr) 그리드 한 행 — AS-IS Com01_RelateApprModel, 서버 com01_relate_appr.selectByKeyTableId */
export interface ComRelateAppr {
  relateApprId: number;
  keyTable: string;
  keyTableId: number;
  apprId: number;
  regDate: string | null;
  effectDate: string | null;
  title: string | null;
  regEmpName: string | null;
  statusName: string | null;
}

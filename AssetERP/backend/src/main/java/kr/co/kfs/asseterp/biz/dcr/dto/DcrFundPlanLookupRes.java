package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서구분 조회창(Dcr00_Lookup_FundPlan) 그리드 한 행 — AS-IS Dcr01_ClassTreeModel 중 구분코드·문서구분명·상품분류·최종결재 */
public record DcrFundPlanLookupRes(Long classTreeId, String classTreeCode, String classTreeName, String classTreeFullName,
                                   String approvalTypeName, String itemTypeName) {
}

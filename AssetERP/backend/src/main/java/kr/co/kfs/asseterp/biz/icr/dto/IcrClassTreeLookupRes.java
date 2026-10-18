package kr.co.kfs.asseterp.biz.icr.dto;

/** 내규 선택 조회창(Icr01_Lookup_SelectMulti) 그리드 한 행 */
public record IcrClassTreeLookupRes(Long classTreeId, String classTreeCode, String classTreeName, String content, String submitTo,
                                    String cycleName, String relatedLaw, String classTreeFullName) {
}

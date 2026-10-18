package kr.co.kfs.asseterp.biz.icr.dto;

/** 내규상세 창(Icr01_Lookup_ClassTreeDetail) 폼 값 */
public record IcrClassTreeDetailRes(Long classTreeId, String classTreeCode, String classTreeName, String content, String relatedLaw,
                                    String submitTo, String deadlineName) {
}

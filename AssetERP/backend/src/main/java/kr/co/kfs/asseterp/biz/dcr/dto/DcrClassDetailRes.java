package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류 세부분류 (AS-IS Dcr07_ClassDetailModel — Dcr07_Lookup_ClassDetail 그리드) */
public record DcrClassDetailRes(Long classDetailId, Long classTreeId, String classDetailName, String keyword, String guide,
                                Long seq, String linkYn, String useYn) {
}

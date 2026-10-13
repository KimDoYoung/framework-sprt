package kr.co.kfs.asseterp.biz.sys.dto;

/** 코드구분 저장 한 행 (codeKindId가 null/0 이하면 신규) */
public record CodeKindSaveReq(Long codeKindId, String kindCd, String kindNm, String sysYn, String note) {
}

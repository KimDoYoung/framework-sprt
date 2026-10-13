package kr.co.kfs.asseterp.biz.sys.dto;

/** 사원권한 저장 한 행 (specificMenuPersonId가 null/0 이하면 신규) */
public record SpecificMenuPersonSaveReq(Long specificMenuPersonId, Long personId, String useYn, String note, String specificWorkCd) {
}

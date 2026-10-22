package kr.co.kfs.asseterp.biz.flt.dto;

/** 예외사원 저장 행 (J09). exceptPersonId ≤ 0이면 새 행. personName은 중복 안내 문구에만 쓴다 */
public record ExceptPersonSaveReq(Long exceptPersonId, Long personId, String personName, String rptStartDate, String reason) {
}

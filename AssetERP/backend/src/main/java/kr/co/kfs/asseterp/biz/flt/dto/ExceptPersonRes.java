package kr.co.kfs.asseterp.biz.flt.dto;

/** 예외사원 한 행 (J09, AS-IS Flt16_ExceptPersonModel) — 정기보고 매매등록 시작일을 별도로 관리하는 사원 */
public record ExceptPersonRes(Long exceptPersonId, Long companyId, Long personId, String personName, String orgName,
                              String rptStartDate, String reason) {
}

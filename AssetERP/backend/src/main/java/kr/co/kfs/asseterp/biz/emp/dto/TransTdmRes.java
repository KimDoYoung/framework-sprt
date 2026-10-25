package kr.co.kfs.asseterp.biz.emp.dto;

/** 책무 대상 사원찾기 한 행 (AS-IS Emp03_TransModel — emp03_trans.selectByTdmYn) */
public record TransTdmRes(Long personId, String orgNm, String titleNm, String empNo, String korNm, String transDate) {
}

package kr.co.kfs.asseterp.oms.biz.emp.dto;

/** 발령 기준 사원 (AS-IS emp03_trans.selectByText → Emp03_TransModel 중 Lookup에 쓰는 컬럼) */
public record TransRes(Long transId, Long personId, String empNo, String korNm, Long orgCodeId, String orgKorNm, String titleNm) {
}

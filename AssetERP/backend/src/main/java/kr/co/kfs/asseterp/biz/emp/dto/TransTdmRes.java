package kr.co.kfs.asseterp.biz.emp.dto;

/** 책무 대상 사원찾기 한 행 (AS-IS Emp03_TransModel — emp03_trans.selectByTdmYn). orgId는 N22 이행점검의 점검자 부서(emp01_org_id) */
public record TransTdmRes(Long personId, String orgNm, String titleNm, String empNo, String korNm, String transDate, Long orgId) {
}

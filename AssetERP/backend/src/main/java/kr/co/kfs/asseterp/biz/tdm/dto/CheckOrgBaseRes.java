package kr.co.kfs.asseterp.biz.tdm.dto;

/** 확정·승인요청이 서버에서 다시 읽는 부서 점검현황 한 행 (AS-IS tdm51_chck_org.selectById) */
public record CheckOrgBaseRes(Long chckOrgId, Long companyId, String checkYm, Long chckJobId, Long orgId) {
}

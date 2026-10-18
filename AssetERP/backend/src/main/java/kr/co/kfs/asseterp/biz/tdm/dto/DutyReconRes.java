package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 책무마감 검증 한 행 (AS-IS Sys99_PrintModel 중 Tdm50_Tab_DutyReconAdmin 그리드에 쓰는 속성, 원본 f_recon_tdm 'DB_CHK' 결과).
 * 괄호는 sys99_print 컬럼: 회사명(sys99_company_id → f_get_company_nm, 0이면 '-'), string01 점검항목, string02 점검결과, string03 참조
 */
public record DutyReconRes(Long printId, String companyName, String string01, String string02, String string03) {
}

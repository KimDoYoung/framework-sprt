package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 조직별 사원 (AS-IS emp00_trans_info.selectByAllOrgCodeId → Emp00_TransInfoModel 중 화면 컬럼) */
public record OrgPersonRes(Long personId, String empNo, String korNm, String posNm, String orgKorNm, String titleNm2,
                           String kindNm, LocalDate hireDate, String emailAddr, String mobileTelno, String officeTelno) {
}

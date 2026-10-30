package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/**
 * 여비교통비 신청서 한 행 (AS-IS emp51_relate_appr.selectByCompanyId — Emp51_RelateApprModel).
 * closeYn은 DB 형태('true'/'false'/null) 그대로, 마감여부 글자(closeName)는 서버가 '마감'/''로 만든다
 */
public record RelateApprRes(Long relateApprId, Long companyId, Long personId, String yyyymm, String regNo, LocalDate regDate,
                            Long regAmt, Long apprId, String closeYn, String closeName, String personName, String posName,
                            String orgName, String statusCode, String statusName, String apprTitle, String inoutCode) {
}

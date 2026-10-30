package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 전자결재 문서 열기 (apr.Apr01_Appr.selectById 중 Apr01_Edit_ApprDoc 편집기가 쓰는 열, V01) */
public record AprApprDetailRes(Long apprId, Long companyId, Long classTreeId, String classTreeFullName, String printFundYn, String title,
                               String inOutTypeCode, String content, LocalDateTime regDate, LocalDateTime effectDate, String statusCode,
                               Long regEmpId, String regEmpName, Long stampId, String stampName, String stampPosition, String stampPositionName,
                               String receiveName, String referenceName, String signCompany, String signCeo, String note, String linkCode, String advertYn) {
}

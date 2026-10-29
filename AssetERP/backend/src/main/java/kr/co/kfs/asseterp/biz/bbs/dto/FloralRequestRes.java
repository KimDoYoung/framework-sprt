package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** AS-IS Bbs20_FloralRequestModel (bbs20_floral_request + 계산 열) */
public record FloralRequestRes(Long floralRequestId, Long companyId, LocalDate regDate, Long personId, String personName, String personInfo,
                               String occasionsCode, String occasionsName, String message,
                               String sendCompany, String sendEmp, String sendPos,
                               String rcvCompany, String rcvEmp, String rcvPos, String rcvDept, String rcvTel, String rcvAddr,
                               LocalDate sendRequestDate, String sendRequestTime, String statusCode, String statusName, LocalDate endDate,
                               String note, String reason, String addInfo, String requests, String rejectReason, String privateYn,
                               Long fileCount, String shareInfo) {
}

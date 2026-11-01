package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/**
 * 화환신청 등록·수정(Bbs20_Edit_FloralRequest.update → Bbs20_FloralRequest.modelUpdate)의 입력.
 * floralRequestId는 등록 창이 열 때 받은 번호(`POST bbs/floral-requests/new`). 이미 있는 번호면 수정, 없으면 등록(신청상태 10)
 */
public record FloralRequestSaveReq(Long floralRequestId, LocalDate regDate, String occasionsCode, String message,
                                   String sendCompany, String sendEmp, String sendPos,
                                   String rcvCompany, String rcvEmp, String rcvPos, String rcvDept, String rcvTel, String rcvAddr,
                                   LocalDate sendRequestDate, String sendRequestTime, String reason, String addInfo, String requests,
                                   boolean privateYn) {
}

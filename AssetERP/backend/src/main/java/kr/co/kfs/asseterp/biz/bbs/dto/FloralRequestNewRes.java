package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 화환신청 등록 창의 새 모델 기본값 (Bbs20_Edit_FloralRequest.insert L107-161) — 번호는 새로 받은 것, 보내는 사람은 대표이사(직책 100) 첫 행 또는 신청자 */
public record FloralRequestNewRes(Long floralRequestId, LocalDate regDate, Long personId, String personName,
                                  String sendCompany, String sendEmp, String sendPos) {
}

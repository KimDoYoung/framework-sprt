package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDate;

/**
 * AS-IS Scm01_Sr.update 의 모델 중 Scm01_Edit_Sr 폼이 바꾸는 값. srId는 새 의뢰면 next-id로 받은 번호.
 * apprStatusCd: 임시저장 '99' / 결재요청 '10'(결재선이 1명이면 '30') / 전체 초기화 null
 */
public record SrSaveReq(Long srId, String systemCd, LocalDate srDate, Long corpId, String requestor, String srType,
                        String srContent, String apprStatusCd) {
}

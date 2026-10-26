package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드규약 신청구분·조회순서·예탁원코드 수정 (P12 예탁원코드 창, AS-IS Fnd26_TermsDetail.update mode fnd25update). 종료일은 원본 모델에 없어 null이 온다 */
public record TermsUpdateReq(
        String termsType,
        Long seq,
        Long fundId,
        LocalDate closeDate,
        Long originFundId
) {
}

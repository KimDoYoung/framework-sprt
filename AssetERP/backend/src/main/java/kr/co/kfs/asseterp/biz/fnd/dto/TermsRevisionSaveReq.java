package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/**
 * 펀드규약 개정 저장 (P12, AS-IS Fnd26_TermsDetail.update). mode: insert(새 규약, termsId 없음) / new(규약에 개정 추가) / copy(개정 복사) / edit(수정).
 * originRevisionNo(edit만)·originFundId(edit만 — 원본 그대로)는 중복 검사에서 자기 자신을 뺀다
 */
public record TermsRevisionSaveReq(
        String mode,
        Long originRevisionNo,
        Long originFundId,
        Long termsDetailId,
        Long termsId,
        String termsType,
        String termsName,
        Long seq,
        Long fundId,
        LocalDate closeDate,
        String content,
        String note,
        LocalDate revisionDate,
        Long revisionNo,
        Boolean useYn
) {
}

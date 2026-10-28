package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** 인사평가 대상등록 조회창 한 행 (AS-IS emp00_trans_info.selectByEvalText — Emp43_Lookup_SelectMulti) */
public record EvalCandidateRes(
        Long personId,
        Long orgCodeId,
        String orgTitleNm,
        String parentFullNm,
        String titleNm,
        String posNm,
        String korNm,
        String orgHeadNm,
        LocalDate hireDate,
        LocalDateTime transDate
) {
}

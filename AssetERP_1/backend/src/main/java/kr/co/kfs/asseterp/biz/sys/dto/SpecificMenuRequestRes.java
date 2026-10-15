package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** A27 특정화면 사용요청 목록 행 (AS-IS Sys53_SpecificMenuRequestModel — 신청일·신청자·특정업무·문서상태·처리담당자·처리상태) */
public record SpecificMenuRequestRes(
        Long specificMenuRequestId,
        Long companyId,
        Long personId,
        String personNm,
        LocalDate regDate,
        String stateCd,
        String stateNm,
        String specificWorkCd,
        String specificWorkNm,
        Long apprId,
        String aprStatusCd,
        String aprStatusNm,
        String confirmNm
) {
}

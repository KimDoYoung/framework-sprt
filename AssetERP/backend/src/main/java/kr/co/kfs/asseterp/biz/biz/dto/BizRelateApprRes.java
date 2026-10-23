package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDateTime;

/** 상신문서 연결 한 행 (AS-IS Biz05_RelateApprModel). 사용자별 조회(selectByPersonId)는 상태 열만, 내역별 조회(selectByPromoId)는 제목·일자·등록자까지 */
public record BizRelateApprRes(
        Long relateApprId,
        Long promoId,
        Long apprId,
        String statusCode,
        String statusName,
        String title,
        LocalDateTime regDate,
        LocalDateTime effectDate,
        String regEmpName
) {
}

package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 요청이력 저장 한 행 (specificMenuHistoryId가 null/0 이하면 신규). 참고내용은 별도 API */
public record SpecificMenuHistorySaveReq(Long specificMenuHistoryId, LocalDate regDate, LocalDate confirmDate, String confirmNm) {
}

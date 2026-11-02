package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 확인·확인취소·메모 저장·출력 대상 보고 (AS-IS Rpt04_Lookup_WeekConfirm — 작성자와 주 시작일). confirmNote는 확인 때는 쓰지 않는다 */
public record WeekConfirmReq(Long personId, LocalDate startDate, String confirmNote) {
}

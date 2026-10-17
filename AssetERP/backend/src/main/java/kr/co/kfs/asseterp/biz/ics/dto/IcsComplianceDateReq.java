package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** Ics30 기준 적용일 하나를 가리키는 요청 (생성·확정·확정취소). dateFixYn은 확정 변경 때만 */
public record IcsComplianceDateReq(LocalDate startDate, String dateFixYn) {
}

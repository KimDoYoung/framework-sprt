package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** apr90_disposal_list.selectByPersonId 조건. personId는 로그인 사용자 */
public record AprDisposalListCond(Long personId, LocalDate startDate, LocalDate closeDate) {
}

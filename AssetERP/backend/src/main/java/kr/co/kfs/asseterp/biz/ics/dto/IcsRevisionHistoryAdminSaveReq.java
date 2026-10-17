package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** Ics20_Edit_RevisionHistoryAdmin 저장: 편집 폼이 바꾸는 열만. revisionHistoryId가 없거나 0 이하면 새로 등록한다 (사전예고일은 폼에 없어 건드리지 않는다) */
public record IcsRevisionHistoryAdminSaveReq(Long revisionHistoryId, LocalDate regDate, LocalDate submissionDate, LocalDate effectDate,
                                             LocalDate reflectionDate, String financeAgencyCode, String title, String relatedLaw, String note) {
}

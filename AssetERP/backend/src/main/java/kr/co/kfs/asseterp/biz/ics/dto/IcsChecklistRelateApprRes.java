package kr.co.kfs.asseterp.biz.ics.dto;

/** 상신 조회창 한 행 (K06, AS-IS ics.Ics16_RelateAppr.selectByConfirmerId — Ics16_RelateApprModel): 대분류별 전체·확인 건수와 결재 상태 */
public record IcsChecklistRelateApprRes(Long relateApprId, String checkLClassName, Long totalCount, Long confirmCount,
                                        Long checklistLClassId, Long apprId, String statusCode, String statusName) {
}

package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** AS-IS act.Act80_RelateAppr.selectByTrId·selectByJournalId — 연관문서 창(Act80_Lookup_RelateAppr, W05 2단계 ⓑ) 한 행. lockYn은 거래·결제에서 오는 문서라 연결을 끊을 수 없는 것 */
public record ActRelateApprRes(
        Long relateApprId,
        Long apprId,
        Long journalId,
        Long trId,
        LocalDate regDate,
        LocalDate effectDate,
        String title,
        String statusName,
        String regEmpName,
        boolean lockYn
) {
}

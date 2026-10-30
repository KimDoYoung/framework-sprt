package kr.co.kfs.asseterp.biz.act.dto;

/** AS-IS act.Act06_JournalTmp.selectByJournalId — 전표변경 창(Act02_Lookup_ModiJournal)의 분개 한 줄. reprAccountCode·accountMap·forAmt는 그리드에 안 보이지만 저장 때 그대로 되돌려 보낸다 */
public record JournalTmpRes(
        Long journalTmpId,
        Long seq,
        String drcrType,
        String drcrTypeName,
        String realAccountCode,
        String realAccountName,
        String reprAccountCode,
        String accountMap,
        Long amt,
        Double forAmt,
        Long depositId,
        String depositName,
        String note
) {
}

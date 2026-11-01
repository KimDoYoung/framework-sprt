package kr.co.kfs.asseterp.biz.act.dto;

/** AS-IS act.Act03_JournalDtl.selectByJournalId — 분개 그리드(차변/대변) 한 행 */
public record JournalLineRes(
        Long journalDtlId,
        String trName,
        String drAccountCode,
        String drAstAccountName,
        Long drAmt,
        Double drForAmt,
        String drNote,
        String crAccountCode,
        String crAstAccountName,
        Long crAmt,
        Double crForAmt,
        String crNote
) {
}

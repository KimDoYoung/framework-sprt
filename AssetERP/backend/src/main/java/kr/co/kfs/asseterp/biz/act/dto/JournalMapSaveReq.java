package kr.co.kfs.asseterp.biz.act.dto;

/** Act11_Grid_TrJournalMap 저장 한 행 (UpdateDataModel(act12_journal_map)) — 이름 열은 저장하지 않는다 */
public record JournalMapSaveReq(Long journalMapId, String journalGroup, Long seq, String reprAccountCode, String drcrType,
                                String formula, String forFormula, String note, String useYn) {
}

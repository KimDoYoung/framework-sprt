package kr.co.kfs.asseterp.biz.act.dto;

/** Act11_Tab_TrJournalMap 저장 한 행 (UpdateDataModel(act11_tr_map)) — 거래명·이름 열은 저장하지 않는다 */
public record TrMapSaveReq(Long trMapId, String trCode, String journalGroup, String bookIoType, String plReprAccountCode,
                           String useYn, String note) {
}

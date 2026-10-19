package kr.co.kfs.asseterp.biz.act.dto;

/** AS-IS Act12_JournalMapModel 중 Act11_Grid_TrJournalMap 그리드 열. 여부는 DB 형태('true'/'false') 그대로 */
public record JournalMapRes(Long journalMapId, Long companyId, String journalGroup, Long seq, String reprAccountCode,
                            String reprAccountName, String drcrType, String drcrTypeName, String formula,
                            String forFormula, String note, String useYn) {
}

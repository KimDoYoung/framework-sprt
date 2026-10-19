package kr.co.kfs.asseterp.biz.act.dto;

/** AS-IS Act11_TrMapModel 중 Act11_Tab_TrJournalMap 그리드 열. 여부는 DB 형태('true'/'false') 그대로 */
public record TrMapRes(Long trMapId, Long companyId, String trCode, String trName, String journalGroup,
                       String bookIoType, String bookIoTypeName, String plReprAccountCode, String plReprAccountName,
                       String useYn, String note) {
}

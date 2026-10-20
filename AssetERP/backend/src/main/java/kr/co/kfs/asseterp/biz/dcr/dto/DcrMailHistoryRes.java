package kr.co.kfs.asseterp.biz.dcr.dto;

/** 발신메일 한 행 (AS-IS Dcr10_MailHistoryModel, selectBySenderEmail). 본문(bodyText)은 상세보기창이 쓴다 */
public record DcrMailHistoryRes(Long mailHistoryId, Long aprId, String sendTimeString, String personName, String senderEmail,
                                String receiverEmail, String referencerEmail, String titleText, String bodyText) {
}

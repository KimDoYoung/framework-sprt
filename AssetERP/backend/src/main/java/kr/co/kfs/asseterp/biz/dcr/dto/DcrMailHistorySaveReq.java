package kr.co.kfs.asseterp.biz.dcr.dto;

import java.util.List;

/** 보낸 메일 기록 (AS-IS dcr.Dcr10_MailHistory.insertMailHistory 파라미터) */
public record DcrMailHistorySaveReq(
        Long apprId,
        String senderEmail,
        String receiverEmail,
        String referencerEmail,
        String titleText,
        String bodyText,
        List<Long> fileIds
) {
}

package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/**
 * 신청 창(Apr16_Lookup_StampDocAppl)의 저장 — stampDocId가 없거나 0 이하면 새 행.
 * stampQty·docApplQty는 서버가 구분으로 정한다(preUpdate L368-374: 3이면 stampQty=applQty·docApplQty=null, 아니면 반대). stampOutYn은 'true'/'false'
 */
public record AprStampApplSaveReq(Long stampDocId, LocalDate applDate, String applType, Long stampId, Long reprCorpId, Long applQty, String stampOutYn,
                                  String provideCo, String purpose, String requester, String note, Long apprId) {
}

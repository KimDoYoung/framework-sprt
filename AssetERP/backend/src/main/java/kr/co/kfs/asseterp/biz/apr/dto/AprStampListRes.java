package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/**
 * 인감날인대장 그리드(AS-IS Apr16_StampDocModel — selectStampByCompanyId). stampOutYn은 'true'/'false' 글자.
 * stampDocId는 ROW_NUMBER(그리드 행 키), realStampDocId는 실제 날인 신청 ID(전자결재 대외문서는 null).
 */
public record AprStampListRes(Long stampDocId, LocalDate applDate, String applEmpName, String stampName, Long stampQty,
                              String stampOutYn, String provideCo, String purpose, String note, String apprStatusName,
                              String stampSeq, LocalDate stampDate, Long apprId, Long realStampDocId) {
}

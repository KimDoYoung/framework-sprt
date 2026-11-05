package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/**
 * 인감날인대장 그리드(AS-IS Apr19_RelateStampModel — selectBySearchText·selectByOrgCodeId). outYn은 'true'면 true.
 * relateStampId는 ROW_NUMBER(그리드 행 키), realRelateStampId는 실제 인감날인 ID(전자결재 대외문서는 null).
 */
public record AprRelateStampListRes(Long relateStampId, LocalDate callDate, String callEmpName, Long stampId, String stampName,
                                    Long stampCnt, Boolean outYn, String provideCo, String purpose, String note,
                                    String stampSeq, LocalDate stampDate, Long apprId, String apprCntStr, Long realRelateStampId) {
}

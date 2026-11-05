package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 인감날인본 업로드확인 그리드(AS-IS Apr19_RelateStampModel — selectByStampCheckList). stampFileYnStr은 날인본 첨부 'O'/'X'(모델 getter L167) */
public record AprRelateStampCheckRes(Long relateStampId, Long corpDocId, LocalDate callDate, String callEmpName, String stampName,
                                     Long stampCnt, String provideCo, String purpose, String apprCntStr, LocalDate stampDate,
                                     String stampFileYnStr, LocalDate confirmDate, Long confirmerId, String confirmerName) {
}

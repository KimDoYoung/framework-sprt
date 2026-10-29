package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 인감날인본 업로드확인 그리드(AS-IS Apr16_StampDocModel — selectStampCheck). stampFileChk는 날인본 첨부 'O'/'X' */
public record AprStampCheckRes(Long stampDocId, LocalDate applDate, String applEmpName, String stampName, Long stampQty,
                               String provideCo, String purpose, Long apprId, String apprStatusName, LocalDate stampDate,
                               String stampFileChk, LocalDate confirmDate, Long confirmerId, String confirmerName) {
}

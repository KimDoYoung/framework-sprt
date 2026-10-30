package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 연관문서 한 줄 (apr21_relate_appr.selectByApprId, V01) */
public record AprRelateApprRes(Long relateApprId, Long targetApprId, String inOutTypeCode, String inOutTypeName, LocalDateTime targetRegDate,
                               String targetTitle) {
}

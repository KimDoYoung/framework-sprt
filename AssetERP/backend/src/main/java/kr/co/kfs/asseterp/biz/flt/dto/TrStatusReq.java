package kr.co.kfs.asseterp.biz.flt.dto;

import java.util.List;

/** 승인신청(statusCode "10")·신청취소(statusCode null) — AS-IS Flt10_Tr.updateStatusCode */
public record TrStatusReq(List<Long> trIds, String statusCode) {
}

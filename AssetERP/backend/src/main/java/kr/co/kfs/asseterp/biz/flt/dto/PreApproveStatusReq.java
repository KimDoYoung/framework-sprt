package kr.co.kfs.asseterp.biz.flt.dto;

import java.util.List;

/** 승인('20')·반려('30')·취소('10') — rejectReason은 승인·반려 사유(취소는 null) */
public record PreApproveStatusReq(List<Long> trIds, String statusCode, String rejectReason) {
}

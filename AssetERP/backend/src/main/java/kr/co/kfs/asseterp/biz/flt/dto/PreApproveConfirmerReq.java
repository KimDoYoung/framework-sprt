package kr.co.kfs.asseterp.biz.flt.dto;

import java.util.List;

/** 협의승인자 지정 — addConfirmerId가 null이면 [선택안함](지정 해제) */
public record PreApproveConfirmerReq(List<Long> trIds, Long addConfirmerId) {
}

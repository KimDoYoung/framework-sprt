package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/**
 * AS-IS Ics40_Edit_DcrPreconfirm.update(applyYn) → ics.Ics40_DcrPreconfirm.modelUpdate (준법감시인 사전확인 신청창)
 * dcrPreconfirmId null = 새 신청(insert(apprId)), 아니면 수정(edit).
 * applyYn = [신청]·[신청취소](true)면 statusCode를 쓴다 — "10" 신청 / null 신청취소. [저장](false)이면 상태는 그대로.
 */
public record IcsDcrPreconfirmSaveReq(
        Long dcrPreconfirmId,
        Long apprId,
        String dcrTypeCode,
        String content,
        String provideCo,
        String adType,
        String mediaType,
        String adItemName,
        String adContent,
        LocalDate startDate,
        LocalDate closeDate,
        String spec,
        String qtyCnt,
        String preApprNo,
        boolean applyYn,
        String statusCode) {
}

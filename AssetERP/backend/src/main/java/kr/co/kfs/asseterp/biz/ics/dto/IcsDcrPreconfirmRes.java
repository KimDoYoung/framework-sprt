package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** AS-IS Ics40_DcrPreconfirmModel (ics40_dcr_preconfirm.selectByConfirm·selectByReviewConfirm) — 그리드·승인 처리에 쓰는 열 */
public record IcsDcrPreconfirmRes(
        Long dcrPreconfirmId,
        LocalDate regDate,
        String dcrTypeCode,
        String dcrTypeName,
        String apprNo,
        String apprNoPrefix,
        String provideCo,
        String content,
        String personName,
        Long apprId,
        String confirmerName,
        LocalDate confirmDate,
        String statusCode,
        String statusName,
        String confirmMsg,
        String regEmpMsg,
        String msgYnStr,
        String adTypeName,
        String mediaTypeName,
        String adItemName,
        String adContent,
        LocalDate startDate,
        LocalDate closeDate,
        String spec,
        String qtyCnt,
        String preApprNo,
        // 신청창(Ics40_Edit_DcrPreconfirm)의 광고종류·매체종류 콤보 값
        String adType,
        String mediaType) {
}

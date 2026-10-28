package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 증명서 신청내역 행 (AS-IS Bbs11_ApplicationModel, bbs11_application.selectByAppStatus) */
public record ApplicationRes(
        Long applicationId,
        LocalDate appDate,
        Long appEmpId,
        String appEmpName,
        String appType,
        String appTypeName,
        String appStatus,
        String content
) {
}

package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 기타신청서 작성 그리드 행 (AS-IS Bbs11_ApplicationModel, bbs11_application.selectByPersonId·selectById) */
public record ApplicationMineRes(
        Long applicationId,
        LocalDate appDate,
        Long appEmpId,
        String appEmpName,
        String appType,
        String appTypeName,
        String appStatus,
        String appStatusName,
        LocalDate closeDate,
        String note,
        String content
) {
}

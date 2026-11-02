package kr.co.kfs.asseterp.biz.mkt.dto;

import java.time.LocalDate;

/** AS-IS Mkt03_HistoryModel (selectByTargetCompanyId·selectById) — 업무활동내역 한 줄 */
public record MktHistoryRes(
        Long historyId,
        Long personId,
        LocalDate regDate,
        Long targetCompanyId,
        String targetCompanyName,
        LocalDate activityDate,
        String activityTitle,
        String activityContent,
        String personOrgName,
        String fileCount,
        String fundInfo,
        String shareInfo) {
}

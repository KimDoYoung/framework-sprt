package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/**
 * 대외활동신청 행 (AS-IS Ics35_ExtrActivityModel, ics35_extr_activity.selectByPersonId·selectByCompanyId·selectById).
 * 신청자 열(personNm·personNo·orgNm)은 M02 신청내역 그리드, 나머지는 M01 신청 그리드와 편집 창이 쓴다
 */
public record IcsExtrActivityRes(
        Long extrActivityId,
        Long companyId,
        Long personId,
        LocalDate regDate,
        String activityCorp,
        String activityTgtCd,
        String activityTgtNm,
        String activityTgtNm2,
        String activityTgtEtc,
        String activityPeriod,
        String activityDesc,
        String activityPay,
        Long apprId,
        String apprStatusCd,
        String apprStatusNm,
        Long resultApprId,
        String resultApprStatusCd,
        String resultApprStatusNm,
        String personNm,
        String personNo,
        String orgNm,
        String titleNm,
        String fileCntStr,
        String fileStr
) {
}

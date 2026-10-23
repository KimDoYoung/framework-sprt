package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** Ics35_Edit_ExtrActivity 저장 (AS-IS Ics35_ExtrActivity.modelUpdate): 회사·신청자는 서버가 로그인 정보로 채운다. extrActivityId는 창을 열 때 받은 새 id(next-id) 또는 기존 id */
public record IcsExtrActivitySaveReq(Long extrActivityId, LocalDate regDate, String activityCorp, String activityTgtCd,
                                     String activityTgtEtc, String activityPeriod, String activityDesc, String activityPay) {
}

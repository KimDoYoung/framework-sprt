package kr.co.kfs.asseterp.biz.rpt.dto;

/** 내가 확인한 기록 (AS-IS rpt04_week_confirm.selectByConfirmerId → 확인자 칸 "부서 이름 (일시)") */
public record WeekConfirmerRes(String confirmerName, String confirmerOrgName, String confirmDateStr) {
}

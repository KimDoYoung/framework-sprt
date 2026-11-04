package kr.co.kfs.asseterp.biz.att.dto;

/**
 * 연장근무신청 창 기준값 (AS-IS defaultInfo의 Att01_WorkPolicy.getModel + Pay34_WorkTimeConfig.getModel + 등록 때 Att05_PmWork.getWorkDateInfo).
 * policyFound=false(근태 정책이 정확히 1건이 아님)이면 workEndTime·pmWorkEndTime은 비어 있다.
 * pmWorkOnDate: 그날 결재 중·완료 오후근무가 있는지 (있으면 오후근무 퇴근시간이 기준)
 */
public record AttMyOvertimeSettingsRes(boolean policyFound, String workEndTime, String pmWorkEndTime, String ntStartTime,
                                       String ntEndTime, Long weekMaxAddHours, boolean pmWorkOnDate) {
}

package kr.co.kfs.asseterp.biz.rpt.dto;

/** 주간업무구분 관리 그리드 행 (AS-IS Rpt05_WeekBizClassModel, rpt05_week_biz_class.selectByPersonId). 사원이 정하지 않은 구분은 미사용 */
public record WeekBizClassRes(Long weekBizClassId, String weekBizType, String weekBizTypeName, Boolean unUseYn) {
}

package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무 및 세부내용 창의 오른쪽 세부내용 한 행 (AS-IS tdm35_role_allc_task.selectTaskDetail) */
public record RoleAllcTaskDetailRes(
        Long roleAllcTaskId,
        String taskRelateDetailName) {
}

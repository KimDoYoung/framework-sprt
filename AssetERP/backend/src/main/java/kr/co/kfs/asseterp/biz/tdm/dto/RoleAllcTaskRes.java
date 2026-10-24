package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무 및 세부내용 창의 왼쪽 책무 한 행 (AS-IS tdm35_role_allc_task.selectTask, Tdm35_RoleAllcTaskModel) */
public record RoleAllcTaskRes(
        Long roleAllcTaskId,
        Long taskId,
        String taskName,
        boolean apprYn) {
}

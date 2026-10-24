package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 직책에 연결된 책무 한 행 (AS-IS Tdm21_RoleRelateTaskModel, tdm21_role_relate_task.selectByRoloId). 새 행은 ID ≤ 0 + taskId */
public record RoleTaskRes(
        Long roleRelateTaskId,
        Long roleId,
        Long taskId,
        String taskClassName,
        String taskTypeName,
        String taskName,
        LocalDate startDate,
        LocalDate endDate) {
}

package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/**
 * 책무 등록·복사·수정 요청 (AS-IS Tdm10_Task.modelUpdate의 updateModel + actionType·oldTaskId).
 * 수정이면 변경사유(reason)가 필요하다 — 서버가 변경 전 값과 비교해 변경이력(modiColumnList)을 만든다.
 */
public record TaskSaveReq(
        Long taskId,
        String taskClassCode,
        String taskTypeCode,
        String taskName,
        String commonYn,
        String ceoYn,
        LocalDate startDate,
        LocalDate endDate,
        Long oldTaskId,
        String reason
) {
}

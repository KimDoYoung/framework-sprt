package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무 세부내용 한 행 (AS-IS tdm12_task_relate_detail.selectByTaskId → Tdm12_TaskRelateDetailModel 중 그리드 속성) */
public record TaskDetailRes(
        Long taskRelateDetailId,
        Long taskId,
        String content,
        Long seq,
        String useYn
) {
}

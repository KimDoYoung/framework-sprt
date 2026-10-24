package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무 세부내용 저장 한 행 — ID가 null/0 이하면 신규 */
public record TaskDetailRow(
        Long taskRelateDetailId,
        Long taskId,
        String content,
        Long seq,
        String useYn
) {
}

package kr.co.kfs.asseterp.biz.tdm.dto;

/** 변경/삭제 이력 한 행 (AS-IS tdm95_change_history.selectByTargetId → Tdm95_ChangeHistoryModel) */
public record ChangeHistoryRes(
        Long changeHistoryId,
        Long rowNum,
        String changeDateStr,
        String changeEmpName,
        String changeType,
        String reason
) {
}

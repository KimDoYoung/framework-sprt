package kr.co.kfs.asseterp.biz.tdm.dto;

/** 관리의무 한 행 (AS-IS Tdm13_TaskRelateDutyModel) */
public record TaskDutyRes(Long taskRelateDutyId, Long taskId, Long taskRelateDetailId, String content, Long seq, String useYn) {
}

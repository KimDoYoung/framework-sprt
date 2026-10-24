package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 관리의무 저장 (AS-IS Tdm13_TaskRelateDuty.update): 기존 행을 고쳤으면 reason 필요 */
public record TaskDutySaveReq(List<TaskDutyRes> rows, String reason) {
}

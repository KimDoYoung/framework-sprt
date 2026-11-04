package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 알림발송 요청 (AS-IS Emp00_Lookup_SendMessage.sendMessage: 선택한 사원 + 알림내용) */
public record EmpAlarmSendReq(List<Long> personIds, String message) {
}

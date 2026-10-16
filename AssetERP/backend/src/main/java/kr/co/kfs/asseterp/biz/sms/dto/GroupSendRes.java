package kr.co.kfs.asseterp.biz.sms.dto;

import java.time.LocalDate;

/** AS-IS Sms03_GroupSendModel — sms03_group_send (단체문자: 제목·내용·비고) */
public record GroupSendRes(Long groupSendId, Long companyId, Long personId, LocalDate startDate, String title, String content, String note) {
}

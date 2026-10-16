package kr.co.kfs.asseterp.biz.sms.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * AS-IS Sms04_GroupSendHistoryModel — selectByText (전송기록).
 * historyId는 18자리라 JS 정수 한계(2^53)를 넘는다 → 문자열로 내린다(05 §6 큰 ID).
 */
public record GroupSendHistoryRes(@JsonSerialize(using = ToStringSerializer.class) Long historyId, Long companyId, Long groupSendId,
                                  String sendDateStr, String targetName, String targetTelNo) {
}

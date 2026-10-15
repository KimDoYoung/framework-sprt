package kr.co.kfs.asseterp.biz.sms.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * AS-IS Sms02_HistoryModel — selectByDate (발신기록).
 * historyId는 18자리(예 902606100000002639)라 JS 정수 한계(2^53)를 넘어 JSON을 읽으면 서로 다른 ID가 같은 값이 된다
 * → 그리드 행 ID가 겹쳐 행이 사라진다. 문자열로 내려보낸다.
 */
public record HistoryRes(@JsonSerialize(using = ToStringSerializer.class) Long historyId, Long companyId, String sendDateStr, String content, String note) {
}

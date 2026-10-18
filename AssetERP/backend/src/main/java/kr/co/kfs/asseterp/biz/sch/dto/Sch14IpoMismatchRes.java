package kr.co.kfs.asseterp.biz.sch.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * 공모주일정 미일치내역 (Sch14_Lookup_IpoMismatch 그리드). checkYn은 'true'/'false'.
 * ID는 DB 함수(f_create_ipoMismatch)가 만든 18자리라 JS 숫자(2^53 미만만 정확)로 보내면 끝자리가 틀어진다 → 글자로 보낸다
 */
public record Sch14IpoMismatchRes(@JsonSerialize(using = ToStringSerializer.class) Long ipoMismatchId, String stkCode, String target1, String target2,
                                  String insertDateTimeStr, String checkYn) {
}

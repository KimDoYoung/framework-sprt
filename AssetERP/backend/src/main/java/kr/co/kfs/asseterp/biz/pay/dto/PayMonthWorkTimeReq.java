package kr.co.kfs.asseterp.biz.pay.dto;

/** 근로시간 팝업(Pay10_Lookup_Work) [저장] — 총근로시간은 서버가 근로일수×8 + 연장 + 야간 + 휴일로 계산한다(AS-IS 클라이언트 식) */
public record PayMonthWorkTimeReq(Double workDay, Double extendWorkTime, Double nightWorkTime, Double holidayWorkTime) {
}

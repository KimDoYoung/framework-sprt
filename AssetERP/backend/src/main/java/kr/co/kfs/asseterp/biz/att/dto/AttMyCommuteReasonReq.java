package kr.co.kfs.asseterp.biz.att.dto;

/** 지각·조기퇴근 사유 (actionCode: in = 출근사유, 그 밖 = 퇴근사유) */
public record AttMyCommuteReasonReq(String actionCode, String reason) {
}

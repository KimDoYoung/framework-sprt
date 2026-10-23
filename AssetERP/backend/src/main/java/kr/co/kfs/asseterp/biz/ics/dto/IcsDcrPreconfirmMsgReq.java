package kr.co.kfs.asseterp.biz.ics.dto;

/** AS-IS Ics40_Edit_Msg.update — 준감인 의견만 고친다(신청인 의견 칸은 editConfirmMsg에서 비활성) */
public record IcsDcrPreconfirmMsgReq(String confirmMsg) {
}

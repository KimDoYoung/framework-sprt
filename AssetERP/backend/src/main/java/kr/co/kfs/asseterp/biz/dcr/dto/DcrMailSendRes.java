package kr.co.kfs.asseterp.biz.dcr.dto;

/** 메일 발송 결과 (AS-IS ServiceResult status -1 = 실패, message를 화면에 띄운다) */
public record DcrMailSendRes(boolean ok, String message) {
}

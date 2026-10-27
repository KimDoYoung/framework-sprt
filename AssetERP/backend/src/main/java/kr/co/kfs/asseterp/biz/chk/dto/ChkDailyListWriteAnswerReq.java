package kr.co.kfs.asseterp.biz.chk.dto;

import java.time.LocalDate;

/** 예·아니오·해당없음 체크 저장 본문 (AS-IS chk.Chk03_DailyListWrite.updateAnswerCode) */
public record ChkDailyListWriteAnswerReq(Long dailyListId, String answerCode, LocalDate date) {
}

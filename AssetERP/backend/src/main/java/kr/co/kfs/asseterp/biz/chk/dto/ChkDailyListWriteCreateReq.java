package kr.co.kfs.asseterp.biz.chk.dto;

import java.time.LocalDate;

/** 답변 없는 작성 행 만들기 본문 (AS-IS Chk03_Tab_DailyListWrite.updateReasonNote의 modelUpdate) */
public record ChkDailyListWriteCreateReq(Long dailyListId, LocalDate date) {
}

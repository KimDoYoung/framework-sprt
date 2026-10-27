package kr.co.kfs.asseterp.biz.chk.dto;

/** 작성 행 하나 (AS-IS Chk03_DailyListWriteModel 중 화면이 쓰는 열) */
public record ChkDailyListWriteItem(Long dailyListWriteId, Long dailyListId, String answerCode, String reason, String note, Boolean confirmYn) {
}

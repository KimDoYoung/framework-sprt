package kr.co.kfs.asseterp.biz.chk.dto;

import java.time.LocalDate;
import java.util.List;

/** 확인·확인취소 본문 — 선택한 행(점검내역 + 담당자)을 점검일 기준으로 처리 */
public record ChkDailyListConfirmReq(boolean confirmYn, LocalDate date, List<Item> items) {
    public record Item(Long dailyListId, Long personId) {
    }
}

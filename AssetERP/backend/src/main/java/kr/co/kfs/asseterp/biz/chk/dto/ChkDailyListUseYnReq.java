package kr.co.kfs.asseterp.biz.chk.dto;

import java.util.List;

/** 사용여부설정 저장 본문 — 바꾼 행만 (AS-IS Chk02_Lookup_UseYn.update) */
public record ChkDailyListUseYnReq(List<Item> items) {
    public record Item(Long dailyListId, String useYn) {}
}

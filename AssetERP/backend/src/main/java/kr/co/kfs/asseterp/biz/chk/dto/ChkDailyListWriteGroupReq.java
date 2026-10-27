package kr.co.kfs.asseterp.biz.chk.dto;

import java.util.List;

/** 담당그룹 지정 본문 — writeGroupId가 null이면 작성그룹없음 (AS-IS Chk02_Tab_DailyList.batchManger) */
public record ChkDailyListWriteGroupReq(Long writeGroupId, List<Long> dailyListIds) {}

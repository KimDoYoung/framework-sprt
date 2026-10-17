package kr.co.kfs.asseterp.biz.chk.dto;

import java.util.List;

/** 점검내역복사 본문 — 복사할 점검내역 id와 받을 고객사 id */
public record ChkDailyListCopyReq(List<Long> dailyListIds, List<Long> companyIds) {
}

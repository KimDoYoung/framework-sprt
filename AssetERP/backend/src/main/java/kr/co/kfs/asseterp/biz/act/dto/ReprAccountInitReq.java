package kr.co.kfs.asseterp.biz.act.dto;

import java.util.List;

/** 기초데이터생성 (AS-IS act.Act10_ReprAccount.insertInitData) — 관리자 회사의 대표계정코드를 고른 고객사들로 */
public record ReprAccountInitReq(List<Long> companyIds, List<String> reprAccountCodes) {
}

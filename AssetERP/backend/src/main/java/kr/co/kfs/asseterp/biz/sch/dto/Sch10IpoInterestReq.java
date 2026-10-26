package kr.co.kfs.asseterp.biz.sch.dto;

import java.util.List;

/** 관심종목 등록·제거 (AS-IS sch.Sch11_IpoCompany.insertInterest): 고른 공모주 ID 목록 + 관심 여부 */
public record Sch10IpoInterestReq(List<Long> ipoIds, Boolean interestYn) {
}

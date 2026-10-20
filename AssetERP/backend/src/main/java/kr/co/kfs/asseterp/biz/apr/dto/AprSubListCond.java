package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** AS-IS apr01_appr.selectBySubList 조건 (G17 Apr01_Tab_SubList 건별명세). docType은 일반·내부통제·'%', statusCode는 'true'(완료)·'false'(미처리)·'%' */
public record AprSubListCond(Long companyId, String personName, String orgName, LocalDate startDate, LocalDate closeDate,
                             String docType, String statusCode) {
}

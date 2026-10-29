package kr.co.kfs.asseterp.biz.rpt.dto;

/** 작성요령 및 변경이력 보기 (AS-IS rpt10_fss_submit.selectByReportCode — 두 열만 읽는다) */
public record RptWriteGuideRes(String writeGuide, String reviseHistory) {
}

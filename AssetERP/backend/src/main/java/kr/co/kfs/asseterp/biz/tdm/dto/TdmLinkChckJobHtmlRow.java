package kr.co.kfs.asseterp.biz.tdm.dto;

/** A94 본문 행 — AS-IS tdm51_chck_org.selectApprContent (직책, 임원, 당월점검 건수들, 미흡내역, 점검상태) */
public record TdmLinkChckJobHtmlRow(String roleName, String exctName, Long monthManlCnt, Long monthCheck1Cnt, Long monthCheck2Cnt,
                                    Long monthCheck9Cnt, Long insuffUndoneCnt, Long insuffDoneCnt, String checkStatusCode) {
}

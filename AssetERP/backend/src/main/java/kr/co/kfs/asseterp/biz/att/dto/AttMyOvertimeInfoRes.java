package kr.co.kfs.asseterp.biz.att.dto;

/** AS-IS att03_overtime_req.getInfo — 안내 줄에 쓰는 주간·월간 현황(HTML 조각 "&lt;b style=…&gt;1 / 12&lt;/b&gt;") */
public record AttMyOvertimeInfoRes(String weekReport, String monthReport) {
}

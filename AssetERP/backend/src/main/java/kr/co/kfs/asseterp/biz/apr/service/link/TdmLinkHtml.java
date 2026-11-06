package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.DecimalFormat;
import java.util.List;

import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkChckJobHtmlRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleDescTaskRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleDigmRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkTaskDetailRow;

/**
 * 책무 결재 본문 HTML 4종 — AS-IS client/htmlData/RoleAllcHtmlData(A90)·RoleDescHtmlData(A91)·RoleDigmHtmlData(A92)·ChckJobHtmlData(A94)를 그대로 옮겼다.
 * 값은 이스케이프하지 않는다(AS-IS도 그대로 이어 붙임).
 */
final class TdmLinkHtml {

    private TdmLinkHtml() {
    }

    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private static String checkNullPlain(String text) {
        if (text == null || "undefined".equals(text) || "null".equals(text)) {
            return " ";
        }
        return text;
    }

    /** RoleDescHtmlData·RoleDigmHtmlData의 checkNull — 값이 있으면 앞뒤에 &nbsp; */
    private static String checkNullNbsp(String text) {
        if (text == null || "undefined".equals(text) || "null".equals(text)) {
            return " ";
        }
        return "&nbsp;" + text + "&nbsp;";
    }

    private static String checkBooleanNull(Boolean yn) {
        return yn == null || !yn ? " " : "O";
    }

    // ---------------------------------------------------------------- A90 RoleAllcHtmlData

    private static final String A90_TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";

    private static String a90TdStColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></strong></td>";
    }

    private static String a90TdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:1px; width:" + (colspan * 3.3) + "%;\">"
                + "<span></span></td>";
    }

    /** RoleAllcHtmlData.getHtmlContent(roleAllcModel, taskRelateDetailList) — 책무(작업) 이름이 연속으로 같으면 rowspan으로 묶는다 */
    static String roleAllc(List<TdmLinkTaskDetailRow> list) {
        StringBuilder text = new StringBuilder();
        text.append(A90_TABLE_START).append("<tbody>").append(TR_START);
        for (int i = 0; i < 20; i++) {
            text.append(a90TdEmpty(1, 1, 0));
        }
        text.append(TR_CLOSE).append(TR_START)
                .append(a90TdEmpty(1, 1, 0))
                .append(a90TdStColor(18, 1, 0, "left", 12, "본인의 책무를 확인하였으며, 이에 동의합니다.", "#FFFFFF"))
                .append(a90TdEmpty(1, 1, 0))
                .append(TR_CLOSE).append(TR_START)
                .append(a90TdEmpty(20, 1, 0))
                .append(TR_CLOSE).append(TR_START)
                .append(a90TdEmpty(1, 1, 0))
                .append(a90TdStColor(9, 1, 1, "center", 12, "책무", "#EAEFF4"))
                .append(a90TdStColor(9, 1, 1, "center", 12, "책무 세부내용", "#EAEFF4"))
                .append(a90TdEmpty(1, 1, 0))
                .append(TR_CLOSE);
        int i = 0;
        while (i < list.size()) {
            TdmLinkTaskDetailRow current = list.get(i);
            String taskName = checkNullPlain(Html.esc(current.taskName()));

            // 같은 taskName이 몇 개 연속되는지 확인
            int rowspanCount = 1;
            int j = i + 1;
            while (j < list.size() && taskName.equals(checkNullPlain(Html.esc(list.get(j).taskName())))) {
                rowspanCount++;
                j++;
            }

            // 첫 번째 행: 책무 + 세부내용
            text.append(TR_START)
                    .append(a90TdEmpty(1, 1, 0))
                    .append(a90TdStColor(9, rowspanCount, 1, "left", 12, taskName, "#FFFFFF"))
                    .append(a90TdStColor(9, 1, 1, "left", 12, checkNullPlain(Html.esc(current.content())), "#FFFFFF"))
                    .append(a90TdEmpty(1, 1, 0))
                    .append(TR_CLOSE);

            // 나머지 행: 세부내용만
            for (int k = i + 1; k < j; k++) {
                text.append(TR_START)
                        .append(a90TdEmpty(1, 1, 0))
                        .append(a90TdStColor(9, 1, 1, "left", 12, checkNullPlain(Html.esc(list.get(k).content())), "#FFFFFF"))
                        .append(a90TdEmpty(1, 1, 0))
                        .append(TR_CLOSE);
            }
            i = j;
        }
        return text.append("</tbody>").append("</table>").toString();
    }

    // ---------------------------------------------------------------- A91·A92 (같은 표 도구)

    private static final String HEIGHT = "25";

    private static String tableStart(int border) {
        return "<table border=2 style='border-collapse:collapse; border:" + border + "px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    }

    private static String tdStrongCreate(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></strong></td>";
    }

    private static String tdCreate(int colspan, int rowspan, int border, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">"
                + "<span></span></td>";
    }

    /** RoleDescHtmlData.getHtmlContent(roleAllcList) — 직책·겸직여부가 연속으로 같으면 rowspan으로 묶는다. 첫 행이 없으면 AS-IS는 IndexOutOfBounds라 호출하지 않는다 */
    static String roleDesc(List<TdmLinkRoleDescTaskRow> list) {
        TdmLinkRoleDescTaskRow first = list.get(0);
        StringBuilder text = new StringBuilder();
        text.append(tableStart(0)).append("<tbody>")
                .append(TR_START).append(tdCreate(20, 1, 0, "left", 13, "「금융회사의 지배구조에 관한 법률」에 의거하여 작성한 책무기술서 승인을 요청드립니다.")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdCreate(20, 1, 0, "left", 13, "1. 임원 : " + Html.esc(first.personName()))).append(TR_CLOSE)
                .append(TR_START).append(tdCreate(20, 1, 0, "left", 13, "2. 직책별 책무")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START)
                .append(tdStrongCreate(5, 1, 1, "center", 13, "직책", "#F2F2F2"))
                .append(tdStrongCreate(3, 1, 1, "center", 13, "겸직여부", "#F2F2F2"))
                .append(tdStrongCreate(12, 1, 1, "center", 13, "책무", "#F2F2F2"))
                .append(TR_CLOSE);

        for (int i = 0; i < list.size();) {
            TdmLinkRoleDescTaskRow current = list.get(i);

            int rowspan = 1;
            for (int j = i + 1; j < list.size(); j++) {
                TdmLinkRoleDescTaskRow next = list.get(j);
                if (current.roleName() != null && current.roleName().equals(next.roleName())
                        && ((current.addTitleYn() == null && next.addTitleYn() == null)
                        || (current.addTitleYn() != null && current.addTitleYn().equals(next.addTitleYn())))) {
                    rowspan++;
                } else {
                    break;
                }
            }

            for (int k = 0; k < rowspan; k++) {
                TdmLinkRoleDescTaskRow row = list.get(i + k);
                text.append(TR_START);
                if (k == 0) {
                    text.append(tdCreate(5, rowspan, 1, "center", 13, checkNullNbsp(Html.esc(row.roleName()))));
                    text.append(tdCreate(3, rowspan, 1, "center", 13, checkBooleanNull(row.addTitleYn())));
                }
                text.append(tdCreate(12, 1, 1, "left", 13, checkNullNbsp(Html.esc(row.taskName()))));
                text.append(TR_CLOSE);
            }
            i += rowspan;
        }
        return text.append("</tbody>").append("</table>").toString();
    }

    /** RoleDigmHtmlData.getHtmlContent(roleAllcList) */
    static String roleDigm(List<TdmLinkRoleDigmRow> list) {
        StringBuilder text = new StringBuilder();
        text.append(tableStart(0)).append("<tbody>")
                .append(TR_START).append(tdCreate(20, 1, 0, "left", 13, "「금융회사의 지배구조에 관한 법률」에 의거하여 작성한 책무체계도 승인을 요청드립니다.")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START)
                .append(tdStrongCreate(6, 1, 1, "Center", 13, "직책", "#F2F2F2"))
                .append(tdStrongCreate(3, 1, 1, "center", 13, "임원", "#F2F2F2"))
                .append(tdStrongCreate(3, 1, 1, "center", 13, "직위", "#F2F2F2"))
                .append(tdStrongCreate(3, 1, 1, "center", 13, "겸직여부", "#F2F2F2"))
                .append(tdEmpty(5, 1, 0))
                .append(TR_CLOSE);
        for (TdmLinkRoleDigmRow row : list) {
            text.append(TR_START)
                    .append(tdCreate(6, 1, 1, "left", 13, checkNullNbsp(Html.esc(row.roleName()))))
                    .append(tdCreate(3, 1, 1, "center", 13, checkNullNbsp(Html.esc(row.personName()))))
                    .append(tdCreate(3, 1, 1, "center", 13, checkNullNbsp(Html.esc(row.posName()))))
                    .append(tdCreate(3, 1, 1, "center", 13, checkBooleanNull(row.addTitleYn())))
                    .append(tdEmpty(5, 1, 0))
                    .append(TR_CLOSE);
        }
        return text.append("</tbody>").append("</table>").toString();
    }

    // ---------------------------------------------------------------- A94 ChckJobHtmlData

    private static final String A94_TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";

    private static String a94TdStColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:20px; width:" + colspan + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></strong></td>";
    }

    private static String a94TdColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String a94TdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + colspan + "%;\">"
                + "<span></span></td>";
    }

    private static String a94TdStNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:2px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String checkLongNull(Long num) {
        return num == null ? "0" : new DecimalFormat("#,###").format(num);
    }

    private static long checkLong(Long num) {
        return num == null ? 0L : num;
    }

    /** ChckJobHtmlData.getHtmlContent(list, stdDate) */
    static String chckJob(List<TdmLinkChckJobHtmlRow> list, String stdDate) {
        StringBuilder text = new StringBuilder();
        text.append(A94_TABLE_START).append("<tbody>")
                .append(TR_START).append(a94TdEmpty(100, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(a94TdStNone(100, 1, "left", 13, stdDate + " 책무 이행 점검 보고서를 제출합니다.")).append(TR_CLOSE)
                .append(TR_START).append(a94TdEmpty(100, 1, 0)).append(TR_CLOSE)
                .append(TR_START)
                .append(a94TdStColor(23, 2, 1, "center", 13, "직책", "#EAEFF4"))
                .append(a94TdStColor(13, 2, 1, "center", 13, "임원", "#EAEFF4"))
                .append(a94TdStColor(9, 2, 1, "center", 13, "당월<br>점검", "#EAEFF4"))
                .append(a94TdStColor(24, 1, 1, "center", 13, "점검결과", "#EAEFF4"))
                .append(a94TdStColor(16, 1, 1, "center", 13, "미흡/개선내역<br>(당월발생건 제외)", "#EAEFF4"))
                .append(a94TdStColor(15, 2, 1, "center", 13, "점검상태", "#EAEFF4"))
                .append(TR_CLOSE)
                .append(TR_START)
                .append(a94TdStColor(8, 1, 1, "center", 13, "적정", "#EAEFF4"))
                .append(a94TdStColor(8, 1, 1, "center", 13, "미흡", "#EAEFF4"))
                .append(a94TdStColor(8, 1, 1, "center", 13, "해당없음", "#EAEFF4"))
                .append(a94TdStColor(8, 1, 1, "center", 13, "진행중", "#EAEFF4"))
                .append(a94TdStColor(8, 1, 1, "center", 13, "종료", "#EAEFF4"))
                .append(TR_CLOSE);

        long seq1 = 0;
        long seq2 = 0;
        long seq3 = 0;
        long seq4 = 0;
        long seq5 = 0;
        long seq6 = 0;
        for (TdmLinkChckJobHtmlRow m : list) {
            seq1 += checkLong(m.monthManlCnt());
            seq2 += checkLong(m.monthCheck1Cnt());
            seq3 += checkLong(m.monthCheck2Cnt());
            seq4 += checkLong(m.monthCheck9Cnt());
            seq5 += checkLong(m.insuffUndoneCnt());
            seq6 += checkLong(m.insuffDoneCnt());
            text.append(TR_START)
                    .append(a94TdColor(23, 1, 1, "left", 13, checkNullPlain(Html.esc(m.roleName())), "none"))
                    .append(a94TdColor(13, 1, 1, "center", 13, checkNullPlain(Html.esc(m.exctName())), "none"))
                    .append(a94TdColor(9, 1, 1, "right", 13, checkLongNull(m.monthManlCnt()) + "&nbsp", "none"))
                    .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(m.monthCheck1Cnt()) + "&nbsp", "none"))
                    .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(m.monthCheck2Cnt()) + "&nbsp", "none"))
                    .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(m.monthCheck9Cnt()) + "&nbsp", "none"))
                    .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(m.insuffUndoneCnt()) + "&nbsp", "none"))
                    .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(m.insuffDoneCnt()) + "&nbsp", "none"))
                    .append(a94TdColor(15, 1, 1, "center", 13, checkNullPlain(Html.esc(m.checkStatusCode())), "none"))
                    .append(TR_CLOSE);
        }

        text.append(TR_START)
                .append(a94TdColor(36, 1, 1, "center", 13, "합 계", "#D9D9D9"))
                .append(a94TdColor(9, 1, 1, "right", 13, checkLongNull(seq1) + "&nbsp", "#D9D9D9"))
                .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(seq2) + "&nbsp", "#D9D9D9"))
                .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(seq3) + "&nbsp", "#D9D9D9"))
                .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(seq4) + "&nbsp", "#D9D9D9"))
                .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(seq5) + "&nbsp", "#D9D9D9"))
                .append(a94TdColor(8, 1, 1, "right", 13, checkLongNull(seq6) + "&nbsp", "#D9D9D9"))
                .append(a94TdColor(15, 1, 1, "center", 13, "", "#D9D9D9"))
                .append(TR_CLOSE);
        return text.append("</tbody>").append("</table>").toString();
    }
}

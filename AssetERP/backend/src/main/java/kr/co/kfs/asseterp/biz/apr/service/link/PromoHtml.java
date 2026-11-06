package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.DecimalFormat;
import java.util.List;

import kr.co.kfs.asseterp.biz.biz.dto.BizCardHtmlRow;

/**
 * A13 법인카드 사용내역서 본문 (AS-IS client/htmlData/PromoHtmlData.getHtmlContent).
 * 1) 카드별 사용내역(카드명 (사원)·사용금액·비고) 2) 계정과목별 사용내역(계정과목명·사용금액·비고). 마크업 순서·문구는 원본 그대로다.
 */
final class PromoHtml {

    /** 계정과목별 한 줄 — 호출 화면이 계정과목 이름별로 합친 값(AS-IS gridList) */
    record AccountRow(String accountName, long approvalAmount) {
    }

    private static final String HEIGHT = "25";
    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";

    private PromoHtml() {
    }

    private static String tdNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String td(int colspan, int rowspan, int border, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan + "\" style=\"border:" + border
                + "px;border-color:black; border-style:solid; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdHead(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan + "\" style=\"border:" + border
                + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdStrong(int colspan, int rowspan, int border, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan + "\" style=\"border:" + border
                + "px;border-color:black; border-style:solid; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan + "\" style=\"border:" + border
                + "px; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">" + "<span></span></td>";
    }

    private static String checkLong(Long num) {
        return num == null ? "- " : "&nbsp;" + new DecimalFormat("###,###,###,###").format(num) + "&nbsp;";
    }

    private static String checkNull(String text) {
        if (text == null || "undefined".equals(text) || "null".equals(text)) {
            return " ";
        }
        return "&nbsp;" + text + "&nbsp;";
    }

    private static String row(String... cells) {
        return "<tr>" + String.join("", cells) + "</tr>";
    }

    static String content(List<BizCardHtmlRow> titleList, List<AccountRow> promoList) {
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody>")
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdEmpty(5, 1, 0), tdNone(10, 2, "center", 14, "- 다&nbsp;&nbsp;&nbsp;&nbsp;음 -"), tdEmpty(5, 1, 0)))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdNone(10, 1, "left", 14, "1) 카드별 사용내역"), tdEmpty(10, 1, 0)))
                .append(row(tdHead(8, 1, 1, "center", 14, "카드명(사원)", "#EAEFF4"), tdHead(4, 1, 1, "center", 14, "사용금액(원)", "#EAEFF4"),
                        tdHead(8, 1, 1, "center", 14, "비고", "#EAEFF4")));
        if (promoList.isEmpty()) {
            t.append(row(td(8, 1, 1, "center", 14, "- "), td(4, 1, 1, "center", 14, "- "), td(8, 1, 1, "center", 14, "- ")))
                    .append(row(tdStrong(8, 1, 1, "center", 14, "합계"), tdStrong(4, 1, 1, "center", 14, "- "), td(8, 1, 1, "center", 14, " ")));
        } else {
            long sum = 0;
            for (BizCardHtmlRow c : titleList) {
                sum += c.cardPrice() == null ? 0 : c.cardPrice();
                t.append(row(td(8, 1, 1, "left", 14, checkNull(Html.esc(c.cardName()))), td(4, 1, 1, "right", 14, checkLong(c.cardPrice())), td(8, 1, 1, "center", 14, "")));
            }
            t.append(row(tdStrong(8, 1, 1, "center", 14, "합계"), tdStrong(4, 1, 1, "right", 14, checkLong(sum)), td(8, 1, 1, "center", 14, " ")));
        }
        t.append(row(tdEmpty(20, 1, 0)))
                .append(row(tdNone(10, 1, "left", 14, "2) 계정과목별 사용내역"), tdEmpty(10, 1, 0)))
                .append(row(tdHead(8, 1, 1, "center", 14, "계정과목명", "#EAEFF4"), tdHead(4, 1, 1, "center", 14, "사용금액(원)", "#EAEFF4"),
                        tdHead(8, 1, 1, "center", 14, "비고", "#EAEFF4")));
        if (promoList.isEmpty()) {
            t.append(row(td(8, 1, 1, "center", 14, "- "), td(4, 1, 1, "center", 14, "- "), td(8, 1, 1, "center", 14, "- ")))
                    .append(row(tdStrong(8, 1, 1, "center", 14, "합계"), tdStrong(4, 1, 1, "center", 14, "- "), td(8, 1, 1, "center", 14, " ")));
        } else {
            long sum = 0;
            for (AccountRow a : promoList) {
                sum += a.approvalAmount();
                t.append(row(td(8, 1, 1, "left", 14, checkNull(Html.esc(a.accountName()))), td(4, 1, 1, "right", 14, checkLong(a.approvalAmount())), td(8, 1, 1, "center", 14, " ")));
            }
            t.append(row(tdStrong(8, 1, 1, "center", 14, "합계"), tdStrong(4, 1, 1, "right", 14, checkLong(sum)), td(8, 1, 1, "center", 14, " ")));
        }
        t.append(row(tdEmpty(20, 1, 0))).append(row(tdEmpty(20, 1, 0)));
        return t.append("</tbody></table>").toString();
    }
}

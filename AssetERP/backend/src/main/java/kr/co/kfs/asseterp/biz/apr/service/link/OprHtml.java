package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.List;

import kr.co.kfs.asseterp.biz.fnd.dto.OprDemandRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprFundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprSubRes;

/**
 * 공모주 결재 본문 두 가지 (AS-IS client/htmlData/OprHtmlData(A26 청약 및 납입 운용지시)·DemandOprHtmlData(A38 수요예측)).
 * 마크업 순서는 원본 그대로다 — A26의 "1. 청약내역" 칸은 `<tr>` 밖에 놓이고 tdStNone은 `</strong>`만 닫는다(이상한점 #90).
 */
final class OprHtml {

    private static final String HEIGHT = "25";
    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final String TR = "<tr>";
    private static final String TR_END = "</tr>";

    private OprHtml() {
    }

    // ───── 셀 (OprHtmlData / DemandOprHtmlData 공통) ─────

    private static String tdStrong(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; background-color:" + bg + "; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String td(int colspan, int rowspan, int border, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + (colspan * 5) + "%;\">"
                + "<span></span></td>";
    }

    private static String checkNull(String text) {
        if (text == null || "undefined".equals(text) || "null".equals(text)) {
            return " ";
        }
        return text;
    }

    private static String checkLong(Long num) {
        return num == null ? "- " : new DecimalFormat("#,###").format(num);
    }

    private static String checkDouble(Double num) {
        return num == null ? "- " : new DecimalFormat("#,###.######").format(num);
    }

    private static String ymd(LocalDate d) {
        return d == null ? "" : d.toString();
    }

    private static long nz(Long n) {
        return n == null ? 0L : n;
    }

    private static String emptyRow20() {
        StringBuilder b = new StringBuilder(TR);
        for (int i = 0; i < 20; i++) {
            b.append(tdEmpty(1, 1, 0));
        }
        return b.append(TR_END).toString();
    }

    private static String row(String... cells) {
        return TR + String.join("", cells) + TR_END;
    }

    // ───── A26 공모주 청약 및 납입 운용지시 ─────

    static String subscription(List<OprFundRes> list, OprSubRes m) {
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody>")
                .append(emptyRow20())
                .append(row(tdNone(20, 1, "left", 14, "다음과 같이 [" + Html.esc(m.itemName()) + "] 공모주 청약 및 납입 운용지시를 드립니다.")))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdNone(20, 1, "center", 14, "- 다 음 -")))
                .append(row(tdEmpty(20, 1, 0)))
                .append(tdNone(20, 1, "left", 14, "1. 청약내역"))   // 원본은 이 칸이 <tr> 밖에 있다
                .append(row(tdStrong(4, 1, 1, "center", 14, "종목명", "#EAEFF4"), td(6, 1, 1, "center", 14, checkNull(Html.esc(m.itemName()))),
                        tdStrong(4, 1, 1, "center", 14, "주간사", "#EAEFF4"), td(6, 1, 1, "center", 14, checkNull(Html.esc(m.corpName())))))
                .append(row(tdStrong(4, 1, 1, "center", 14, "발행가", "#EAEFF4"), td(6, 1, 1, "center", 14, checkLong(m.price()) + "원"),
                        tdStrong(4, 1, 1, "center", 14, "수수료율", "#EAEFF4"), td(6, 1, 1, "center", 14, checkDouble(m.feeRate()) + "%")))
                .append(row(tdStrong(4, 1, 1, "center", 14, "청약일", "#EAEFF4"), td(6, 1, 1, "center", 14, ymd(m.subscriptionDate())),
                        tdStrong(4, 1, 1, "center", 14, "납입일", "#EAEFF4"), td(6, 1, 1, "center", 14, ymd(m.payDate()))))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdNone(20, 1, "left", 14, "2. 납입내역")))
                .append(row(tdStrong(6, 1, 1, "center", 14, "펀드명<br>" + "(펀드코드)", "#EAEFF4"), tdStrong(2, 1, 1, "center", 14, "배정수량", "#EAEFF4"),
                        tdStrong(2, 1, 1, "center", 14, "단가", "#EAEFF4"), tdStrong(3, 1, 1, "center", 14, "배정금액", "#EAEFF4"),
                        tdStrong(2, 1, 1, "center", 14, "수수료", "#EAEFF4"), tdStrong(3, 1, 1, "center", 14, "납입금액", "#EAEFF4"),
                        tdStrong(2, 1, 1, "center", 14, "확약기간", "#EAEFF4")));
        long qtySum = 0;
        long contAmtSum = 0;
        long feeSum = 0;
        long settleAmtSum = 0;
        for (OprFundRes f : list) {
            qtySum += nz(f.qty());
            contAmtSum += nz(f.contAmt());
            feeSum += nz(f.fee());
            settleAmtSum += nz(f.settleAmt());
            t.append(row(td(6, 1, 1, "left", 12, checkNull(Html.esc(f.fundName())) + "<br>(" + checkNull(Html.esc(f.fundCode())) + ")"),
                    td(2, 1, 1, "right", 12, checkLong(f.qty())), td(2, 1, 1, "right", 12, checkLong(f.price())),
                    td(3, 1, 1, "right", 12, checkLong(f.contAmt())), td(2, 1, 1, "right", 12, checkLong(f.fee())),
                    td(3, 1, 1, "right", 12, checkLong(f.settleAmt())), td(2, 1, 1, "center", 12, checkNull(Html.esc(m.lockPeriod())))));
        }
        t.append(row(tdStrong(6, 1, 1, "center", 14, "합계", "#FFFFFF"), td(2, 1, 1, "right", 12, checkLong(qtySum)), td(2, 1, 1, "right", 12, ""),
                td(3, 1, 1, "right", 12, checkLong(contAmtSum)), td(2, 1, 1, "right", 12, checkLong(feeSum)),
                td(3, 1, 1, "right", 12, checkLong(settleAmtSum)), td(2, 1, 1, "right", 12, "")));
        return t.append("</tbody></table>").toString();
    }

    // ───── A38 공모주 수요예측 ─────

    static String demand(List<OprFundRes> list, OprDemandRes m) {
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody>")
                .append(emptyRow20())
                .append(row(tdNone(20, 1, "left", 14, "아래와 같이 수요예측에 참여하고자 합니다.")))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdNone(20, 1, "center", 14, "- 아 래 -")))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdNone(20, 1, "left", 14, "1. 종목명 : " + Html.esc(m.itemName()))))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdNone(20, 1, "left", 14, "2. 주요내용")))
                .append(row(tdNone(20, 1, "left", 14, "&nbsp&nbsp " + "1) 기본정보")))
                .append(row(tdNone(1, 1, "left", 14, "&nbsp&nbsp"), tdStrong(5, 1, 1, "center", 14, "수요예측기간", "#EAEFF4"),
                        tdStrong(5, 1, 1, "center", 14, "공모가밴드", "#EAEFF4"), tdStrong(4, 1, 1, "center", 14, "시장구분", "#EAEFF4"),
                        tdStrong(5, 1, 1, "center", 14, "주간사", "#EAEFF4")))
                .append(row(tdNone(1, 1, "left", 14, "&nbsp&nbsp"), td(5, 1, 1, "center", 14, checkNull(Html.esc(m.demandPeriod()))),
                        td(5, 1, 1, "center", 14, checkNull(Html.esc(m.priceBracket()))), td(4, 1, 1, "center", 14, checkNull(Html.esc(m.market()))),
                        td(5, 1, 1, "center", 14, checkNull(Html.esc(m.leadManager())))))
                .append(row(tdEmpty(20, 1, 0)))
                .append(row(tdNone(20, 1, "left", 14, "&nbsp&nbsp " + "2) 신청가격 : " + checkLong(m.price()) + "원")))
                .append(row(tdNone(20, 1, "left", 14, "&nbsp&nbsp " + "3) 확약기간 : " + checkNull(Html.esc(m.lockPeriod())))))
                .append(row(tdNone(20, 1, "left", 14, "&nbsp&nbsp " + "4) 확정공모가액 -10% 변동수요 : " + checkNull(Html.esc(m.priceAcceptStr())))))
                .append(row(tdNone(20, 1, "left", 14, "&nbsp&nbsp " + "5) 신청수량")))
                .append(row(tdNone(1, 1, "left", 14, "&nbsp&nbsp"), tdStrong(10, 1, 1, "center", 14, "펀드명", "#EAEFF4"),
                        tdStrong(4, 1, 1, "center", 14, "신청수량", "#EAEFF4"), tdStrong(5, 1, 1, "center", 14, "신청금액", "#EAEFF4")));
        long qtySum = 0;
        long priceSum = 0;
        for (OprFundRes f : list) {
            qtySum += nz(f.qty());
            priceSum += nz(f.qty()) * nz(f.price());
            t.append(row(tdNone(1, 1, "left", 14, "&nbsp&nbsp"),
                    td(10, 1, 1, "left", 14, checkNull(Html.esc(f.fundName())) + "<br>(" + checkNull(Html.esc(f.fundCode())) + ")"),
                    td(4, 1, 1, "right", 14, checkLong(f.qty()) + "&nbsp"),
                    td(5, 1, 1, "right", 14, checkLong(nz(f.qty()) * nz(f.price())) + "&nbsp")));
        }
        t.append(row(tdNone(1, 1, "left", 14, "&nbsp&nbsp"), td(10, 1, 1, "center", 14, "합 계"),
                td(4, 1, 1, "right", 14, checkLong(qtySum) + "&nbsp"), td(5, 1, 1, "right", 14, checkLong(priceSum) + "&nbsp")))
                .append(row(tdNone(20, 1, "left", 14, "&nbsp&nbsp " + "6) 투자의견 : 첨부와 같음")))
                .append(row(tdEmpty(20, 1, 0)));
        return t.append("</tbody></table>").toString();
    }
}

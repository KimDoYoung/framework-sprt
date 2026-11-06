package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.DecimalFormat;
import java.util.List;

import kr.co.kfs.asseterp.biz.pay.dto.PayMonthListRow;

/**
 * 급여대장 PDF의 HTML (AS-IS client/htmlData/PayMonthHtmlData.getHtmlList10Content L351-596, V25).
 * 표 문자열을 잇는 순서·열 폭까지 원본 그대로다. 합계는 호출마다 0에서 시작한다(AS-IS는 static 합계를 clear2()로 비움).
 */
final class PayMonthListHtml {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private PayMonthListHtml() {
    }

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></strong></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
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

    private static String checkLongNull(Long num) {
        return num == null ? "- " : new DecimalFormat("###,###,###").format(num);
    }

    private static String checkDoubleNull(Double num) {
        return num == null ? "- " : new DecimalFormat("###,###,###.##").format(num);
    }

    private static long n(Long v) {
        return v == null ? 0L : v;
    }

    static String html(List<PayMonthListRow> rows) {
        long code110 = 0, code130 = 0, code111 = 0, code112 = 0, code113 = 0, code120 = 0, code121 = 0, code122 = 0, code123 = 0, code190 = 0, code140 = 0, paySum = 0;
        long code210 = 0, code220 = 0, code221 = 0, code230 = 0, code231 = 0, code240 = 0, code241 = 0, code250 = 0, code251 = 0, code260 = 0, code261 = 0;
        long taxDdcSum = 0, deductionSum = 0;

        StringBuilder text = new StringBuilder();
        text.append(TABLE_START).append(TBODY_START)
                .append(TR_START).append(tdEmpty(1, 1, 0).repeat(26)).append(TR_CLOSE)
                .append(TR_START).append(tdStColor(26, 1, 1, "center", 16, "급여대장", "#FFFFFF")).append(TR_CLOSE)
                .append(TR_START)
                .append(tdStColor(3, 1, 1, "center", 7, "사원", "#EAEFF4"))
                .append(tdStColor(10, 1, 1, "center", 7, "급여액월", "#EAEFF4"))
                .append(tdStColor(7, 1, 1, "center", 7, "공제액(월)", "#EAEFF4"))
                .append(tdStColor(1, 3, 1, "center", 7, "차감지급액", "#EAEFF4"))
                .append(tdStColor(5, 1, 1, "center", 7, "근로시간(월)", "#EAEFF4"))
                .append(TR_CLOSE)
                .append(TR_START);
        String[][] head2 = {
                {"사번", "2"}, {"사원명", "2"}, {"직급", "2"},
                {"기본급여", "2"}, {"상여금", "2"}, {"중식대", "2"}, {"차량유지비", "2"}, {"양육수당", "2"}, {"연차수당", "2"},
                {"연장수당", "1"}, {"휴일수당", "1"}, {"급여소급분", "2"}, {"지급액 계", "2"},
                {"국민연금", "2"}, {"건강보험", "1"}, {"장기요양", "1"}, {"고용보험", "1"}, {"소득세", "1"}, {"지방세", "1"}, {"공제액계", "2"},
                {"근로일수", "2"}, {"총<br>근로일수", "2"}, {"연장<br>근로시간", "2"}, {"야간<br>근로시간", "2"}, {"휴일<br>근로시간", "2"}};
        for (String[] h : head2) {
            text.append(tdStColor(1, Integer.parseInt(h[1]), 1, "center", 7, h[0], "#EAEFF4"));
        }
        text.append(TR_CLOSE).append(TR_START);
        String[] head3 = {"야간수당", "기타수당", "(연말정산)", "(연말정산)", "(연말정산)", "(연말정산)", "(연말정산)"};
        for (String h : head3) {
            text.append(tdStColor(1, 1, 1, "center", 7, h, "#EAEFF4"));
        }
        text.append(TR_CLOSE);

        for (PayMonthListRow m : rows) {
            code110 += n(m.code110());
            code130 += n(m.code130());
            code111 += n(m.code111());
            code112 += n(m.code112());
            code113 += n(m.code113());
            code120 += n(m.code120());
            code121 += n(m.code121());
            code122 += n(m.code122());
            code123 += n(m.code123());
            code190 += n(m.code190());
            code140 += n(m.code140());
            paySum += n(m.paySum());
            code210 += n(m.code210());
            code220 += n(m.code220());
            code221 += n(m.code221());
            code230 += n(m.code230());
            code231 += n(m.code231());
            code240 += n(m.code240());
            code241 += n(m.code241());
            code250 += n(m.code250());
            code251 += n(m.code251());
            code260 += n(m.code260());
            code261 += n(m.code261());
            taxDdcSum += n(m.taxDdcSum());
            deductionSum += n(m.deductionSum());

            text.append(TR_START)
                    .append(tdColor(1, 2, 1, "center", 7, checkNull(Html.esc(m.personNo())), "none"))
                    .append(tdColor(1, 2, 1, "center", 7, checkNull(Html.esc(m.personName())), "none"))
                    .append(tdColor(1, 2, 1, "center", 7, checkNull(Html.esc(m.posName())), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.code110()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.code130()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.code111()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.code112()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.code113()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.code123()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code120()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code122()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.code140()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.paySum()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.code210()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code220()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code230()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code240()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code250()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code260()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.taxDdcSum()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkLongNull(m.deductionSum()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkDoubleNull(m.workDay()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkDoubleNull(m.totalWorkTime()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkDoubleNull(m.extendWorkTime()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkDoubleNull(m.nightWorkTime()), "none"))
                    .append(tdColor(1, 2, 1, "right", 7, checkDoubleNull(m.holidayWorkTime()), "none"))
                    .append(TR_CLOSE)
                    .append(TR_START)
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code121()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code190()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code221()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code231()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code241()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code251()), "none"))
                    .append(tdColor(1, 1, 1, "right", 7, checkLongNull(m.code261()), "none"))
                    .append(TR_CLOSE);
        }

        text.append(TR_START)
                .append(tdStColor(3, 1, 1, "center", 7, " 합   계 ", "none"))
                .append(sumCell(code110))
                .append(sumCell(code130))
                .append(sumCell(code111))
                .append(sumCell(code112))
                .append(sumCell(code113))
                .append(sumCell(code123))
                .append(sumCell(code120 + code121))      // (연장+야간) 수당
                .append(sumCell(code122 + code190))      // (휴일+기타) 수당
                .append(sumCell(code140))
                .append(sumCell(paySum))
                .append(sumCell(code210))
                .append(sumCell(code220 + code221))      // 건강보험(+연말)
                .append(sumCell(code230 + code231))
                .append(sumCell(code240 + code241))
                .append(sumCell(code250 + code251))
                .append(sumCell(code260 + code261))
                .append(sumCell(taxDdcSum))
                .append(sumCell(deductionSum))
                .append(tdStColor(5, 1, 1, "center", 7, "", "none"))
                .append(TR_CLOSE);
        text.append(TBODY_CLOSE).append(TABLE_CLOSE);
        return text.toString();
    }

    private static String sumCell(long value) {
        return tdStColor(1, 1, 1, "right", 7, checkLongNull(value), "none");
    }
}

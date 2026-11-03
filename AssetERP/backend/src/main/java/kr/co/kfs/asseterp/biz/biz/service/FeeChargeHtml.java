package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeDtlRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeRes;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 최저보수 청구서 PDF 의 HTML (AS-IS client/htmlData/FeeChargeHtmlData.getHtmlContent1·2, EE33).
 * 운영구분 '1' 은 펀드별 발생액 요약(content1), 그 밖은 일별 보수현황(content2). 모양은 AS-IS 문자열을 그대로 옮겼다
 * (content2 의 머리 셀에 `<tr>` 이 빠진 것·`ledt` 정렬 같은 원본의 흠도 그대로 — HTML 정리 단계가 보정한다).
 */
final class FeeChargeHtml {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; "
            + "font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private static final DateTimeFormatter DOT = DateTimeFormatter.ofPattern("yyyy.MM.dd");
    private static final DateTimeFormatter KOR = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

    private FeeChargeHtml() {
    }

    private static String num(Long v) {
        return v == null ? "- " : new DecimalFormat("###,###,###").format(v);
    }

    private static String dbl(Double v) {
        return v == null ? "- " : new DecimalFormat("###,###,###.##").format(v);
    }

    private static String nul(String text) {
        return text == null || "undefined".equals(text) || "null".equals(text) ? " " : text;
    }

    private static long nz(Long v) {
        return v == null ? 0 : v;
    }

    private static String stColor(int colspan, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:1px;border-color:black; border-style:solid; border-width:1px; background-color:"
                + bg + "; text-align:" + align + "; height:25px; width:" + (colspan * 5) + "%;\"><strong><span style=\"font-size:" + size + "px;\">"
                + text + "</span></strong></td>";
    }

    private static String color(int colspan, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:1px;border-color:black; border-style:solid; border-width:1px; background-color:"
                + bg + "; text-align:" + align + "; height:25px; width:" + (colspan * 5) + "%;\"><span style=\"font-size:" + size + "px;\">"
                + text + "</span></td>";
    }

    private static String stNone(int colspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border-style:none; border-width:2px; text-align:" + align
                + "; height:25px; width:" + (colspan * 5) + "%;\"><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String none(int colspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border-style:none; border-width:2px; text-align:" + align
                + "; height:25px; width:" + (colspan * 5) + "%;\"><span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String empty(int colspan) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:0px; height:15px; width:" + (colspan * 5) + "%;\"><span></span></td>";
    }

    /** 맨 윗줄: 폭을 잡는 빈 셀 20개 */
    private static String widthRow() {
        return TR + empty(1).repeat(20) + TR_CLOSE;
    }

    /** 운영구분 1 — 펀드별 발생액 */
    static String content1(String quarterStr, BizFeeChargeRes model, List<BizFeeChargeDtlRes> list) {
        StringBuilder t = new StringBuilder(TABLE_START).append(TBODY_START).append(widthRow());
        t.append(TR).append(stColor(20, "center", 12, nul(model.corpNm()), "#FFFFFF")).append(TR_CLOSE);
        t.append(TR)
                .append(stColor(3, "center", 12, "최저보수", "#FFFFFF"))
                .append(stColor(2, "center", 12, "분기", "#FFFFFF"))
                .append(stColor(2, "center", 12, "시작일", "#FFFFFF"))
                .append(stColor(2, "center", 12, "기준일", "#FFFFFF"))
                .append(stColor(2, "center", 12, "경과일수", "#FFFFFF"))
                .append(stColor(3, "center", 12, "총 보수 금액(A)", "#FFFFFF"))
                .append(stColor(3, "center", 12, "펀드발생금액(B)", "#FFFFFF"))
                .append(stColor(3, "center", 12, "청구금액(A-B)", "#FFFFFF"))
                .append(TR_CLOSE);
        t.append(TR)
                .append(color(3, "right", 12, num(model.minFee()), "#FFFFFF"))
                .append(color(2, "center", 12, nul(quarterStr), "#FFFFFF"))
                .append(color(2, "center", 12, date(model.occStartDate()), "#FFFFFF"))
                .append(color(2, "center", 12, date(model.occCloseDate()), "#FFFFFF"))
                .append(color(2, "center", 12, num(model.occDays()), "#FFFFFF"))
                .append(color(3, "right", 12, num(nz(model.occFee()) + nz(model.chargeFee())), "#FFFFFF"))
                .append(color(3, "right", 12, num(model.occFee()), "#FFFFFF"))
                .append(color(3, "right", 12, num(model.chargeFee()), "#FFFF00"))
                .append(TR_CLOSE);
        t.append(TR).append(empty(20)).append(TR_CLOSE);
        t.append(TR).append(stNone(20, "left", 12, "펀드발생금액(B)")).append(TR_CLOSE);
        t.append(TR).append(stColor(15, "center", 12, "펀드명", "#FFFFFF")).append(stColor(5, "center", 12, "발생액", "#FFFFFF")).append(TR_CLOSE);
        for (BizFeeChargeDtlRes d : list) {
            t.append(TR).append(color(15, "ledt", 12, nul(d.fundName()), "#FFFFFF")).append(color(5, "right", 12, num(d.occFee()), "#FFFFFF")).append(TR_CLOSE);
        }
        t.append(TR).append(stColor(15, "center", 12, "총 합계", "#FFFFFF")).append(color(5, "right", 12, num(model.occFee()), "#FFFF00")).append(TR_CLOSE);
        return t.append(TBODY_CLOSE).append(TABLE_CLOSE).toString();
    }

    /** 그 밖의 운영구분 — 일별 보수현황 */
    static String content2(BizFeeChargeRes model, List<BizFeeChargeDtlRes> list) {
        StringBuilder t = new StringBuilder(TABLE_START).append(TBODY_START).append(widthRow());
        t.append(TR).append(stNone(20, "center", 14, nul(model.corpNm()) + " 일별 보수현황")).append(TR_CLOSE);
        t.append(TR)
                .append(empty(5))
                .append(none(10, "center", 12, (model.chargeDate() == null ? "" : model.chargeDate().format(KOR)) + "현재"))
                .append(none(5, "right", 12, "(금액:원,부가세별도)"))
                .append(TR_CLOSE);
        // AS-IS 는 여기서 `<tr>` 을 열지 않고 머리 셀을 바로 이어 쓴다(HTML 정리가 한 줄로 묶는다)
        t.append(stColor(2, "center", 12, "발생일자", "#FFFFFF"))
                .append(stColor(3, "center", 12, "보수구분", "#FFFFFF"))
                .append(stColor(2, "center", 12, "대 상<br>계좌수", "#FFFFFF"))
                .append(stColor(2, "center", 12, "당일변동<br>계좌수", "#FFFFFF"))
                .append(stColor(4, "center", 12, "순자산액", "#FFFFFF"))
                .append(stColor(2, "center", 12, "보수율<br>(BP)", "#FFFFFF"))
                .append(stColor(3, "center", 12, "일보수액<br>전표생성액", "#FFFFFF"))
                .append(stColor(2, "center", 12, "비고", "#FFFFFF"))
                .append(TR_CLOSE);

        String yearText = null;
        String monthText = null;
        long sum = 0;
        long totalSum = 0;
        DateTimeFormatter yyyy = DateTimeFormatter.ofPattern("yyyy");
        DateTimeFormatter mm = DateTimeFormatter.ofPattern("MM");
        for (BizFeeChargeDtlRes d : list) {
            if (monthText != null && !monthText.equals(d.occDate().format(mm))) {
                t.append(TR).append(stColor(15, "right", 12, yearText + "." + monthText + "월 합계", "#E6E6FA"))
                        .append(stColor(3, "right", 12, num(sum), "#E6E6FA"))
                        .append(stColor(2, "center", 12, " ", "#E6E6FA")).append(TR_CLOSE);
                sum = 0;
            }
            sum += nz(d.occFee());
            totalSum += nz(d.occFee());
            t.append(TR)
                    .append(color(2, "center", 12, date(d.occDate()), "#FFFFFF"))
                    .append(color(3, "center", 12, nul(d.feeTypeName()), "#FFFFFF"))
                    .append(color(2, "center", 12, num(d.targetAccountCnt()), "#FFFFFF"))
                    .append(color(2, "center", 12, num(d.changeAccountCnt()), "#FFFFFF"))
                    .append(color(4, "right", 12, num(d.totalNetAsset()), "#FFFFFF"))
                    .append(color(2, "center", 12, dbl(d.feeRate()), "#FFFFFF"))
                    .append(color(3, "right", 12, num(d.occFee()), "#FFFFFF"))
                    .append(color(2, "center", 12, " ", "#FFFFFF"))
                    .append(TR_CLOSE);
            yearText = d.occDate().format(yyyy);
            monthText = d.occDate().format(mm);
        }
        t.append(TR).append(stColor(15, "right", 12, yearText + "." + monthText + "월 합계", "#E6E6FA"))
                .append(stColor(3, "right", 12, num(sum), "#E6E6FA"))
                .append(stColor(2, "center", 12, " ", "#E6E6FA")).append(TR_CLOSE);
        t.append(TR).append(stColor(15, "center", 12, model.corpNm() + " 청구 보수금액 합계", "#FFCF9C"))
                .append(stColor(3, "right", 12, num(totalSum), "#FFCF9C"))
                .append(stColor(2, "center", 12, " ", "#FFCF9C")).append(TR_CLOSE);
        return t.append(TBODY_CLOSE).append(TABLE_CLOSE).toString();
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.format(DOT);
    }
}

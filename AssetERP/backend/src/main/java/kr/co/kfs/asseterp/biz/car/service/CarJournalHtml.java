package kr.co.kfs.asseterp.biz.car.service;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;

import kr.co.kfs.asseterp.biz.car.dto.CarJournalRes;

/**
 * 차량 운행일지 PDF 본문 HTML — AS-IS client/htmlData/CarJournalHtmlData.getHtmlListContent 를 그대로 옮겼다(V35).
 * 값은 이스케이프하지 않는다(AS-IS도 그대로 이어 붙임).
 */
final class CarJournalHtml {

    private CarJournalHtml() {
    }

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yy.MM.dd");

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 2.7) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdStNoneColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:none; border-width:0px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 2.7) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 2.7) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + (colspan * 2.7) + "%;\">"
                + "<span></span></td>";
    }

    private static String checkNull(String text) {
        return text == null || "undefined".equals(text) || "null".equals(text) ? " " : text;
    }

    private static String checkLongNull(Long num) {
        return num == null ? "- " : new DecimalFormat("###,###,###").format(num);
    }

    /**
     * @param list 운행일지(날짜순) — 비어 있으면 안 된다. 주행거리·첫 행의 주행 전 거리가 null이면 AS-IS는 NullPointerException이라 이 메서드도 던진다(호출한 쪽이 파일을 안 만든다)
     */
    static String html(List<CarJournalRes> list) {
        // AS-IS는 static totalMileage에 더하고 다 만든 뒤 null로 둬서 같은 서버에서 두 번째 호출은 NullPointerException이다 — 지역 합계로 만든다(이상한점 #84)
        long totalMileage = 0L;
        for (CarJournalRes m : list) {
            totalMileage += m.mileage();
        }
        CarJournalRes first = list.get(0);
        CarJournalRes last = list.get(list.size() - 1);

        StringBuilder text = new StringBuilder();
        text.append("<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>")
                .append("<tbody>").append("<tr>");
        for (int i = 0; i < 36; i++) {
            text.append(tdEmpty(1, 1, 0));
        }
        text.append("</tr>")
                .append("<tr>").append(tdEmpty(36, 1, 0)).append("</tr>")
                .append("<tr>").append(tdStNoneColor(36, 1, 0, "center", 16, "차 량 운 행 일 지", "#FFFFFF")).append("</tr>")
                .append("<tr>").append(tdEmpty(36, 1, 0)).append("</tr>")
                .append("<tr>").append(tdEmpty(36, 1, 0)).append("</tr>")
                .append("<tr>").append(tdEmpty(36, 1, 0)).append("</tr>")
                .append("<tr>").append(tdStNoneColor(36, 1, 0, "left", 8, "1.기본사항", "#FFFFFF")).append("</tr>")
                .append("<tr>")
                .append(tdStColor(10, 2, 1, "center", 8, "차량번호", "#EAEFF4"))
                .append(tdStColor(8, 2, 1, "center", 8, "운행기간", "#EAEFF4"))
                .append(tdStColor(18, 1, 1, "center", 8, "운행거리", "#EAEFF4"))
                .append("</tr>")
                .append("<tr>")
                .append(tdStColor(6, 1, 1, "center", 8, "최초거리(월초)", "#EAEFF4"))
                .append(tdStColor(6, 1, 1, "center", 8, "누적거리(월말)", "#EAEFF4"))
                .append(tdStColor(6, 1, 1, "center", 8, "월간 운행거리", "#EAEFF4"))
                .append("</tr>")
                .append("<tr>")
                .append(tdColor(10, 1, 1, "center", 8, checkNull(Html.esc(first.infoNm())), "none"))
                .append(tdColor(8, 1, 1, "center", 8, checkNull(first.date().format(DATE) + " ~ " + last.date().format(DATE)), "none"))
                .append(tdColor(6, 1, 1, "center", 8, checkLongNull(first.beforeMileage()), "none"))
                .append(tdColor(6, 1, 1, "center", 8, checkLongNull(first.beforeMileage() + totalMileage), "none"))
                .append(tdColor(6, 1, 1, "center", 8, checkLongNull(totalMileage), "none"))
                .append("</tr>")
                .append("<tr>").append(tdEmpty(36, 1, 0)).append("</tr>")
                .append("<tr>").append(tdStNoneColor(36, 1, 0, "left", 8, "2.운행기록", "#FFFFFF")).append("</tr>")
                .append("<tr>")
                .append(tdStColor(3, 3, 1, "center", 8, "사용일자<br>(요일)", "#EAEFF4"))
                .append(tdStColor(3, 1, 1, "center", 8, "사용자", "#EAEFF4"))
                .append(tdStColor(18, 1, 1, "center", 8, "운 행 내 역", "#EAEFF4"))
                .append(tdStColor(12, 1, 1, "center", 8, "사 유", "#EAEFF4"))
                .append("</tr>")
                .append("<tr>")
                .append(tdStColor(3, 2, 1, "center", 8, "성명", "#EAEFF4"))
                .append(tdStColor(3, 2, 1, "center", 8, "주행 전<br>계기판의 거리<br>(km)", "#EAEFF4"))
                .append(tdStColor(3, 2, 1, "center", 8, "주행 후<br>계기판의 거리<br>(km)", "#EAEFF4"))
                .append(tdStColor(3, 2, 1, "center", 8, "주행거리<br>(km)", "#EAEFF4"))
                .append(tdStColor(6, 1, 1, "center", 8, "업무용 사용거리(km)", "#EAEFF4"))
                .append(tdStColor(3, 2, 1, "center", 8, "비업무용<br>사용거리<br>(km)", "#EAEFF4"))
                .append(tdStColor(4, 2, 1, "center", 8, "행선지", "#EAEFF4"))
                .append(tdStColor(8, 2, 1, "center", 8, "목적", "#EAEFF4"))
                .append("</tr>")
                .append("<tr>")
                .append(tdStColor(3, 1, 1, "center", 8, "출 퇴근용<br>(km)", "#EAEFF4"))
                .append(tdStColor(3, 1, 1, "center", 8, "일반 업무용<br>(km)", "#EAEFF4"))
                .append("</tr>");

        for (CarJournalRes m : list) {
            text.append("<tr>")
                    .append(tdColor(3, 1, 1, "center", 8, checkNull(m.date().format(DATE)), "none"))
                    .append(tdColor(3, 1, 1, "center", 8, checkNull(Html.esc(m.infoPersonNm())), "none"))
                    .append(tdColor(3, 1, 1, "center", 8, checkLongNull(m.beforeMileage()), "none"))
                    .append(tdColor(3, 1, 1, "center", 8, checkLongNull(m.afterMileage()), "none"))
                    .append(tdColor(3, 1, 1, "center", 8, checkLongNull(m.mileage()), "none"));
            // AS-IS는 `"1".equals(journalModel.getCloseYnText())` 인데 getCloseYnText()는 "마감" 또는 " "라 항상 아래 갈래다(이상한점 #85)
            text.append(tdColor(3, 1, 1, "center", 8, checkLongNull(0L), "none"))
                    .append(tdColor(3, 1, 1, "center", 8, checkLongNull(m.mileage()), "none"))
                    .append(tdColor(3, 1, 1, "center", 8, checkLongNull(0L), "none"));
            text.append(tdColor(4, 1, 1, "center", 8, checkNull(Html.esc(m.destination())), "none"))
                    .append(tdColor(8, 1, 1, "center", 8, checkNull(Html.esc(m.reason())), "none"))
                    .append("</tr>");
        }

        text.append("<tr>").append(tdStNoneColor(36, 1, 0, "left", 8, "※ 법인세법에 따라 작성한 의무화 / 불성실한 기재로 인하여 비용 불인정시 개인 소득처분이 될 수 있음", "#FFFFFF")).append("</tr>")
                .append("<tr>").append(tdStNoneColor(36, 1, 0, "left", 8, "※ 업무용 사용 시 목적은 정보교류, 거래처 방문, 출퇴근 등을 기준으로 기재하며 비업무용 사용 시 행선지 및 목적 기재 불필요", "#FFFFFF")).append("</tr>")
                .append("</tbody>").append("</table>");
        return text.toString();
    }
}

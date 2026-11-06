package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.TransportLinkRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprEmpLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A42 여비교통비 신청 (Apr01_Edit_ApprDoc.insertLinkApprovals L3305-3328, 본문 TransportListHtmlData.getHtmlContent).
 * 제목 `여비교통비 신청서 (기준년월) - 사용자#신청번호`(고칠 수 있음), 시행일자 오늘.
 * args.ids = 그리드 전체 행의 여비교통비 ID 쉼표 목록(그리드 순서), args.regNo = 신청번호, args.regDate = 기준년월.
 */
@Component
@RequiredArgsConstructor
public class TransportLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final AprEmpLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A42");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String ids = args.get("ids");
        List<TransportLinkRow> list = new ArrayList<>();
        if (ids != null && !ids.isBlank()) {
            for (String id : ids.split(",")) {
                TransportLinkRow row = mapper.selectTransportLink(user.getCompanyId(), user.getUserId(), Long.valueOf(id.trim()));
                if (row == null) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "여비교통비 정보를 찾을 수 없습니다.");
                }
                list.add(row);
            }
        }
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신할 내용이 없습니다.");
        }
        String title = "여비교통비 신청서 (" + args.get("regDate") + ") - " + user.getName() + "#" + args.get("regNo");
        return new Seed(title, contents(list), null, false, false);
    }

    // ───── TransportListHtmlData.getHtmlContent (원본 마크업 순서 그대로 — 이상한점 #87) ─────

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + colspan + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + colspan + "%;\">"
                + "<span></span></td>";
    }

    /** AS-IS는 여는 <strong> 없이 </strong>만 닫는다 — 그대로 */
    private static String tdStNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String checkNull(String text) {
        return text == null || "undefined".equals(text) || "null".equals(text) ? " " : text;
    }

    private static String checkLongNull(Long num) {
        return num == null ? "- " : new DecimalFormat("#,###").format(num);
    }

    static String contents(List<TransportLinkRow> list) {
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr>")
                .append(tdStColor(11, 2, 1, "center", 12, "일자", "#EAEFF4"))
                .append(tdStColor(36, 1, 1, "center", 12, "행선지", "#EAEFF4"))
                .append(tdStColor(16, 1, 1, "center", 12, "시간", "#EAEFF4"))
                .append(tdStColor(13, 2, 1, "center", 12, "금액", "#EAEFF4"))
                .append(tdStColor(11, 2, 1, "center", 12, "교통수단", "#EAEFF4"))
                .append(tdStColor(13, 2, 1, "center", 12, "비고<br>(비밀번호)", "#EAEFF4"))
                .append("</tr><tr>")
                .append(tdStColor(18, 1, 1, "center", 12, "출발지", "#EAEFF4"))
                .append(tdStColor(18, 1, 1, "center", 12, "도착지", "#EAEFF4"))
                .append(tdStColor(8, 1, 1, "center", 12, "출발", "#EAEFF4"))
                .append(tdStColor(8, 1, 1, "center", 12, "도착", "#EAEFF4"))
                .append("</tr>");
        long amtSum = 0L;
        for (TransportLinkRow m : list) {
            amtSum += m.amt() == null ? 0L : m.amt();
            t.append("<tr>")
                    .append(tdColor(11, 1, 1, "center", 12, m.date() == null ? "" : m.date().format(DATE), "none"))
                    .append(tdColor(18, 1, 1, "center", 12, checkNull(Html.esc(m.startPoint())), "none"))
                    .append(tdColor(18, 1, 1, "center", 12, checkNull(Html.esc(m.closePoint())), "none"))
                    .append(tdColor(8, 1, 1, "center", 12, checkNull(Html.esc(m.startTime())), "none"))
                    .append(tdColor(8, 1, 1, "center", 12, checkNull(Html.esc(m.closeTime())), "none"))
                    .append(tdColor(13, 1, 1, "right", 12, checkLongNull(m.amt()) + "&nbsp;", "none"))
                    .append(tdColor(11, 1, 1, "center", 12, checkNull(Html.esc(m.transportName())), "none"))
                    .append(tdColor(13, 1, 1, "left", 12, checkNull(Html.esc(m.note())), "none"))
                    .append("</tr>");
        }
        TransportLinkRow first = list.get(0);
        t.append("<tr>")
                .append(tdColor(63, 1, 1, "center", 12, "합 계", "none"))
                .append(tdColor(13, 1, 1, "right", 12, checkLongNull(amtSum) + "&nbsp;", "none"))
                .append(tdColor(24, 1, 1, "left", 12, "", "none"))
                .append("</tr><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr>").append(tdStNone(100, 1, "left", 13, "상기와 여하 업무차 여비 및 교통비를 신청합니다."))
                .append("</tr>")
                // 여기서부터 AS-IS는 <tr>를 여닫는 위치가 어긋나 있다(#87) — 순서 그대로
                .append(tdEmpty(100, 1, 0)).append("<tr>").append("</tr>")
                .append(tdEmpty(100, 1, 0)).append("<tr>").append("</tr>")
                .append(tdStNone(100, 1, "center", 13, "사용자 &nbsp;<span style=\"font-size:15px;\"><strong> " + Html.esc(first.orgName()) + "</strong></span> "
                        + "<span style=\"font-size:15px;\"><strong>" + Html.esc(first.personName()) + "</strong></span> &nbsp;(전자결재)"))
                .append("<tr>").append("</tr>")
                .append("</tbody></table>");
        return t.toString();
    }
}

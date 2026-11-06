package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.BookDepnGroupRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprExpenseLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A65 비품관리대장 (Apr01_Edit_ApprDoc.insertLinkApprovals L3480-3500, 본문 BookDepnHtmlData.getOfficeAssetsHtmlContent).
 * 제목 `비품대장_yyyy-MM-dd`(고칠 수 있음), 시행일자 = 오늘. args.stdDate = 호출 화면의 기준일자(AS-IS TempData.getStartDate = holdDate).
 * 구분별 취득금액은 호출 화면이 넘기던 행(ast13_book_depn.selectOfficeAssetsGroup)을 서버가 같은 질의로 다시 읽는다.
 * 호출 화면 `Ast13_Tab_OfficeAssets`(메뉴 1397)는 아직 TOBE에 없어 제공자만 있다(V20 Biz60과 같음).
 */
@Component
@RequiredArgsConstructor
public class BookDepnLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter KOR = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

    private final AprExpenseLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A65");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        LocalDate std;
        try {
            std = LocalDate.parse(args.getOrDefault("stdDate", ""));
        } catch (DateTimeParseException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일자 정보가 없습니다.", e);
        }
        List<BookDepnGroupRow> list = mapper.selectOfficeAssetsGroup(user.getCompanyId(), std);
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신할 비품대장의 내용이 없습니다");
        }
        return new Seed("비품대장_" + std.format(DATE), content(list, std), null, false, false);
    }

    // ───── BookDepnHtmlData (colspan*4.4 % 폭은 GWT 숫자 문자열과 같게 .0을 뗀다) ─────

    private static String pct(int colspan) {
        double w = colspan * 4.4;
        return w == Math.floor(w) ? String.valueOf((long) w) : String.valueOf(w);
    }

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + pct(colspan) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + pct(colspan) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:1px; width:" + pct(colspan) + "%;\">"
                + "<span></span></td>";
    }

    private static String checkNull(String text) {
        return text == null || "undefined".equals(text) || "null".equals(text) ? " " : text;
    }

    private static String checkLongNull(Long num) {
        return num == null ? "- " : String.format(Locale.US, "%,d", num);
    }

    static String content(List<BookDepnGroupRow> list, LocalDate std) {
        StringBuilder t = new StringBuilder();
        t.append(TABLE_START).append("<tbody>")
                .append("<tr>").append(tdEmpty(20, 1, 0)).append("</tr>")
                .append("<tr>").append(tdStColor(20, 1, 0, "left", 12, std.format(KOR) + " 기준 비품내역입니다.", "#FFFFFF")).append("</tr>")
                .append("<tr>").append(tdEmpty(20, 1, 0)).append("</tr>")
                .append("<tr>").append(tdStColor(7, 1, 1, "center", 12, "구분", "#EAEFF4"))
                .append(tdStColor(7, 1, 1, "center", 12, "취득금액", "#EAEFF4"))
                .append(tdEmpty(6, 1, 0)).append("</tr>");
        long purAmt = 0;
        for (BookDepnGroupRow m : list) {
            purAmt += m.purAmt() == null ? 0 : m.purAmt();
            t.append("<tr>").append(tdColor(7, 1, 1, "center", 12, checkNull(Html.esc(m.itemType())), "none"))
                    .append(tdColor(7, 1, 1, "right", 12, checkLongNull(m.purAmt()), "none"))
                    .append(tdEmpty(6, 1, 0)).append("</tr>");
        }
        t.append("<tr>").append(tdStColor(7, 1, 1, "center", 12, " 합   계 ", "none"))
                .append(tdStColor(7, 1, 1, "right", 12, checkLongNull(purAmt), "none"))
                .append(tdEmpty(6, 1, 0)).append("</tr>")
                .append("<tr>").append(tdEmpty(20, 1, 0)).append("</tr>")
                .append("<tr>").append(tdStColor(20, 1, 0, "left", 12, "* 상세내역은 '고유자산 > 30. 고유자산 현황 > 비품관리대장' 화면에서 확인 가능합니다.", "#FFFFFF")).append("</tr>")
                .append("</tbody></table>");
        return t.toString();
    }
}

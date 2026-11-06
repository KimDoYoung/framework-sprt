package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.ast.dto.DepnBookGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetGroupRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookDepnMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A65 비품관리대장 (Apr01_Edit_ApprDoc.insertLinkApprovals L3480-3500, 본문 BookDepnHtmlData.getOfficeAssetsHtmlContent L137, 호출 Ast13_Tab_OfficeAssets W16).
 * AS-IS는 호출 화면이 `ast.Ast13_BookDepn.selectOfficeAssetsGroup`(구분별 취득금액)을 읽어 넘긴 목록으로 본문을 만든다 → TOBE는 args.stdDate(기준일)로 서버가 같은 SQL을 읽는다.
 * 제목 `비품대장_yyyy-MM-dd`(고칠 수 있음), 작성일·시행일은 오늘, 본문은 20칸 표(구분 7 · 취득금액 7 + 합계 + 안내 문구).
 */
@Component
@RequiredArgsConstructor
public class OfficeAssetsLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter KOR = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
    private static final DecimalFormat NUMBER = new DecimalFormat("###,###,###", DecimalFormatSymbols.getInstance(Locale.KOREA));

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";

    private final AstBookDepnMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A65", "A29");
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
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일 정보가 없습니다.", e);
        }
        if ("A29".equals(linkCode)) {
            return new Seed("감가상각대장_" + std.format(DATE), depnHtml(std, mapper.selectDepnDate2Group(user.getCompanyId(), std)), LocalDate.now(), false, false);
        }
        List<OfficeAssetGroupRes> list = mapper.selectOfficeAssetsGroup(user.getCompanyId(), std);
        return new Seed("비품대장_" + std.format(DATE), html(std, list), LocalDate.now(), false, false);
    }

    // ───── BookDepnHtmlData ─────

    private static String tdStColor(int colspan, int border, String align, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg
                + "; text-align:" + align + "; height:25px; width:" + (colspan * 4.4) + "%;\"><strong><span style=\"font-size:12px;\">" + text + "</span></strong></td>";
    }

    private static String tdColor(int colspan, String align, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:1px;border-color:black; border-style:solid; border-width:1px; background-color:none; text-align:"
                + align + "; height:25px; width:" + (colspan * 4.4) + "%;\"><span style=\"font-size:12px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:0px; height:1px; width:" + (colspan * 4.4) + "%;\"><span></span></td>";
    }

    private static String num(Long v) {
        return v == null ? "- " : NUMBER.format(v);
    }

    /** A29 감가상각대장 (BookDepnHtmlData.getHtmlContent L80) — 구분 · 취득금액 · 당기감가상각비 · 감가상각누계액 · 잔여상각액 (각 4칸) */
    static String depnHtml(LocalDate std, List<DepnBookGroupRes> list) {
        long pur = 0, depn = 0, acm = 0, rem = 0;
        StringBuilder sb = new StringBuilder(TABLE_START).append("<tbody><tr>").append(tdEmpty(20)).append("</tr><tr>")
                .append(tdStColor(20, 0, "left", std.format(KOR) + " 기준 감가상각내역입니다.", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20)).append("</tr><tr>")
                .append(tdStColor(4, 1, "center", "구분", "#EAEFF4"))
                .append(tdStColor(4, 1, "center", "취득금액", "#EAEFF4"))
                .append(tdStColor(4, 1, "center", "당기감가상각비", "#EAEFF4"))
                .append(tdStColor(4, 1, "center", "감가상각누계액", "#EAEFF4"))
                .append(tdStColor(4, 1, "center", "잔여상각액", "#EAEFF4"))
                .append("</tr>");
        for (DepnBookGroupRes b : list) {
            pur += b.purAmt() == null ? 0L : b.purAmt();
            depn += b.depnCost() == null ? 0L : b.depnCost();
            acm += b.acmDepnCost() == null ? 0L : b.acmDepnCost();
            rem += b.remDepnCost() == null ? 0L : b.remDepnCost();
            sb.append("<tr>")
                    .append(tdColor(4, "center", b.itemType() == null ? " " : Html.esc(b.itemType())))
                    .append(tdColor(4, "right", num(b.purAmt())))
                    .append(tdColor(4, "right", num(b.depnCost())))
                    .append(tdColor(4, "right", num(b.acmDepnCost())))
                    .append(tdColor(4, "right", num(b.remDepnCost())))
                    .append("</tr>");
        }
        sb.append("<tr>")
                .append(tdStColor(4, 1, "center", " 합   계 ", "none"))
                .append(tdStColor(4, 1, "right", num(pur), "none"))
                .append(tdStColor(4, 1, "right", num(depn), "none"))
                .append(tdStColor(4, 1, "right", num(acm), "none"))
                .append(tdStColor(4, 1, "right", num(rem), "none"))
                .append("</tr><tr>").append(tdEmpty(20)).append("</tr><tr>")
                .append(tdStColor(20, 0, "left", "* 상세내역은 '고유자산 > 30. 고유자산 현황 > 감가상각대장' 화면에서 확인 가능합니다.", "#FFFFFF"))
                .append("</tr></tbody></table>");
        return sb.toString();
    }

    static String html(LocalDate std, List<OfficeAssetGroupRes> list) {
        long pur = 0;
        StringBuilder sb = new StringBuilder(TABLE_START).append("<tbody><tr>").append(tdEmpty(20)).append("</tr><tr>")
                .append(tdStColor(20, 0, "left", std.format(KOR) + " 기준 비품내역입니다.", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20)).append("</tr><tr>")
                .append(tdStColor(7, 1, "center", "구분", "#EAEFF4"))
                .append(tdStColor(7, 1, "center", "취득금액", "#EAEFF4"))
                .append(tdEmpty(6))
                .append("</tr>");
        for (OfficeAssetGroupRes b : list) {
            pur += b.purAmt() == null ? 0L : b.purAmt();
            sb.append("<tr>")
                    .append(tdColor(7, "center", b.itemType() == null ? " " : Html.esc(b.itemType())))
                    .append(tdColor(7, "right", num(b.purAmt())))
                    .append(tdEmpty(6))
                    .append("</tr>");
        }
        sb.append("<tr>")
                .append(tdStColor(7, 1, "center", " 합   계 ", "none"))
                .append(tdStColor(7, 1, "right", num(pur), "none"))
                .append(tdEmpty(6))
                .append("</tr><tr>").append(tdEmpty(20)).append("</tr><tr>")
                .append(tdStColor(20, 0, "left", "* 상세내역은 '고유자산 > 30. 고유자산 현황 > 비품관리대장' 화면에서 확인 가능합니다.", "#FFFFFF"))
                .append("</tr></tbody></table>");
        return sb.toString();
    }
}

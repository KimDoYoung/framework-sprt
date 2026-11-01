package kr.co.kfs.asseterp.biz.apr.service.link;

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

import kr.co.kfs.asseterp.biz.ast.dto.FinanceGroupRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A30 금융상품 보유내역 (Apr01_Edit_ApprDoc.insertLinkApprovals L3218-3238, 본문 FinanceBookHtmlData.getHtmlContent, 호출 Ast09_Tab_FinanceBook W12).
 * AS-IS는 호출 화면이 `ast.Ast09_Book.getHoldDate`(종목유형별 합계)를 읽어 넘긴 목록으로 본문을 만든다 → TOBE는 args.stdDate(보유일자)로 서버가 같은 SQL을 읽는다.
 * 제목 `금융상품 보유내역_yyyy-MM-dd`(고칠 수 있음), 작성일·시행일은 오늘, 본문은 20칸 표(종목유형·취득금액·장부금액·평가금액·평가손익 + 합계 + 안내 문구).
 */
@Component
@RequiredArgsConstructor
public class FinanceBookLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter KOR = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
    private static final DecimalFormat NUMBER = new DecimalFormat("###,###,###", DecimalFormatSymbols.getInstance(Locale.KOREA));

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";

    private final AstBookMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A30");
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
            throw new BusinessException(ErrorCode.INVALID_INPUT, "보유일자 정보가 없습니다.");
        }
        List<FinanceGroupRes> list = mapper.selectFinanceGroup(user.getCompanyId(), std);
        return new Seed("금융상품 보유내역_" + std.format(DATE), html(std, list), LocalDate.now(), false, false);
    }

    // ───── FinanceBookHtmlData ─────

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

    private static long nz(Long v) {
        return v == null ? 0L : v;
    }

    static String html(LocalDate std, List<FinanceGroupRes> list) {
        long pur = 0, book = 0, eval = 0, pl = 0;
        StringBuilder sb = new StringBuilder(TABLE_START).append("<tbody><tr>");
        for (int i = 0; i < 20; i++) sb.append(tdEmpty(1));
        sb.append("</tr><tr>")
                .append(tdStColor(20, 0, "left", std.format(KOR) + " 기준 금융상품 보유내역입니다.", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20)).append("</tr><tr>")
                .append(tdStColor(4, 1, "center", "종목유형", "#EAEFF4"))
                .append(tdStColor(4, 1, "center", "취득금액", "#EAEFF4"))
                .append(tdStColor(4, 1, "center", "장부금액", "#EAEFF4"))
                .append(tdStColor(4, 1, "center", "평가금액", "#EAEFF4"))
                .append(tdStColor(4, 1, "center", "평가손익", "#EAEFF4"))
                .append("</tr>");
        for (FinanceGroupRes b : list) {
            pur += nz(b.purAmt());
            book += nz(b.bookAmt());
            eval += nz(b.evalAmt());
            pl += nz(b.evalPl());
            sb.append("<tr>")
                    .append(tdColor(4, "center", b.astClassName() == null ? " " : b.astClassName()))
                    .append(tdColor(4, "right", num(b.purAmt())))
                    .append(tdColor(4, "right", num(b.bookAmt())))
                    .append(tdColor(4, "right", num(b.evalAmt())))
                    .append(tdColor(4, "right", num(b.evalPl())))
                    .append("</tr>");
        }
        sb.append("<tr>")
                .append(tdStColor(4, 1, "center", " 합   계 ", "none"))
                .append(tdStColor(4, 1, "right", num(pur), "none"))
                .append(tdStColor(4, 1, "right", num(book), "none"))
                .append(tdStColor(4, 1, "right", num(eval), "none"))
                .append(tdStColor(4, 1, "right", num(pl), "none"))
                .append("</tr><tr>").append(tdEmpty(20)).append("</tr><tr>")
                .append(tdStColor(20, 0, "left", "* 상세내역은 '자산관리 > 03. 고유자산 현황관리 > 금융상품 보유내역' 화면에서 확인 가능합니다.", "#FFFFFF"))
                .append("</tr></tbody></table>");
        return sb.toString();
    }
}

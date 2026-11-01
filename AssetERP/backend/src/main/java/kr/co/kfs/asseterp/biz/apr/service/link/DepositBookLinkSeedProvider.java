package kr.co.kfs.asseterp.biz.apr.service.link;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.ast.dto.DepositDiffRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A39 예금잔고대사 (Apr01_Edit_ApprDoc.insertLinkApprovals L329 — 본문 DepositIoListHtmlData.getHtmlContent(BookList, FxYn), 호출 Ast09_Tab_DepositBook).
 * AS-IS는 화면 그리드의 행(Ast09_BookModel 목록)과 외화 통화 목록(FxYn)을 넘기지만, TOBE는 기준일(args.stdDate)·검색어(args.searchText)로 같은 조회를 서버에서 다시 한다.
 * 제목 `예금대사 결과보고 (yyyy.MM)`(고칠 수 있음). 외화 통화 이름은 AS-IS가 HashSet 순서라 TOBE는 조회 순서대로 이어 붙인다.
 */
@Component
@RequiredArgsConstructor
public class DepositBookLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter YM = DateTimeFormatter.ofPattern("yyyy.MM");

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private final AstBookMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A39");
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
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일자 정보가 없습니다.");
        }
        String text = "%" + args.getOrDefault("searchText", "") + "%";
        List<DepositDiffRes> list = mapper.selectDepositDiff(user.getCompanyId(), std, "1", text);
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신할 예금잔고 내역이 없습니다.");
        }
        Set<String> fx = new LinkedHashSet<>();
        for (DepositDiffRes m : list) {
            if (!"KRW".equals(m.curCode())) {
                fx.add(m.curCode());
            }
        }
        String fxYn = fx.isEmpty() ? null : String.join(", ", fx);
        return new Seed("예금대사 결과보고 (" + std.format(YM) + ")", html(list, std, fxYn), null, false, false);
    }

    // ───── DepositIoListHtmlData ─────

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

    private static String tdStNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String checkNull(String text) {
        if (text == null || "null".equals(text)) {
            return " - ";
        }
        if ("undefined".equals(text)) {
            return " ";
        }
        return text;
    }

    private static String checkDoubleNull(Double num) {
        if (num == null) {
            return "- ";
        }
        return new DecimalFormat("#,###.######", DecimalFormatSymbols.getInstance(Locale.US)).format(num);
    }

    /** DepositIoListHtmlData.getHtmlContent L105-226 */
    static String html(List<DepositDiffRes> list, LocalDate std, String fxYn) {
        StringBuilder sb = new StringBuilder();
        sb.append(TABLE_START).append(TBODY_START)
                .append(TR_START).append(tdEmpty(100, 1, 0)).append(TR_CLOSE)
                .append(TR_START)
                .append(tdStNone(100, 1, "left", 14, "아래와 같이 " + String.format("%02d월 ", std.getMonthValue()) + " " + String.format("%02d일자", std.getDayOfMonth()) + " 예금대사 결과 보고 드립니다."))
                .append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(100, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdStNone(100, 1, "center", 14, "- 아 래 -")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(100, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(TR_CLOSE);
        if (fxYn != null) {
            sb.append(TR_START).append(tdStNone(10, 1, "left", 12, "1. 원화")).append(tdStNone(90, 1, "right", 12, "(단위 : 원)")).append(TR_CLOSE);
        } else {
            sb.append(TR_START).append(tdStNone(100, 1, "right", 12, "(단위 : 원)")).append(TR_CLOSE);
        }
        sb.append(TR_START)
                .append(tdColor(10, 1, 1, "center", 12, "구분", "#EAEFF4"))
                .append(tdColor(13, 1, 1, "center", 12, "금융기관", "#EAEFF4"))
                .append(tdColor(17, 1, 1, "center", 12, "계좌번호", "#EAEFF4"))
                .append(tdColor(15, 1, 1, "center", 12, "ERP잔액", "#EAEFF4"))
                .append(tdColor(15, 1, 1, "center", 12, "잔고증명서", "#EAEFF4"))
                .append(tdColor(16, 1, 1, "center", 12, "차액", "#EAEFF4"))
                .append(tdColor(14, 1, 1, "center", 12, "비고", "#EAEFF4"))
                .append(TR_CLOSE);
        double holdQtySum = 0.0;
        double realAmtSum = 0.0;
        for (DepositDiffRes m : list) {
            if ("KRW".equals(m.curCode())) {
                holdQtySum += m.holdQty() == null ? 0 : m.holdQty();
                realAmtSum += m.realAmt() == null ? 0 : m.realAmt();
                sb.append(TR_START)
                        .append(tdColor(10, 1, 1, "center", 12, checkNull(m.astSClassName()), "none"))
                        .append(tdColor(13, 1, 1, "left", 12, checkNull(m.corpName()), "none"))
                        .append(tdColor(17, 1, 1, "left", 12, checkNull(m.accountNo()), "none"))
                        .append(tdColor(15, 1, 1, "right", 12, checkDoubleNull(m.holdQty()), "none"))
                        .append(tdColor(15, 1, 1, "right", 12, checkDoubleNull(m.realAmt()), "none"))
                        .append(tdColor(16, 1, 1, "right", 12, checkDoubleNull(m.diffAmt()), "none"))
                        .append(tdColor(14, 1, 1, "left", 12, "", "none"))
                        .append(TR_CLOSE);
            }
        }
        sb.append(TR_START)
                .append(tdColor(40, 1, 1, "center", 12, "합 계", "none"))
                .append(tdColor(15, 1, 1, "right", 12, checkDoubleNull(holdQtySum), "none"))
                .append(tdColor(15, 1, 1, "right", 12, checkDoubleNull(realAmtSum), "none"))
                .append(tdColor(30, 1, 1, "left", 12, "", "none"))
                .append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(100, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(100, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(100, 1, 0)).append(TR_CLOSE);
        if (fxYn != null) {
            sb.append(TR_START).append(tdStNone(10, 1, "left", 12, "2. 외화")).append(tdStNone(90, 1, "right", 12, "(단위 : " + fxYn + ")"))
                    // AS-IS는 여기서 TR_CLOSE 없이 새 TR_START를 이어 쓴다(원본 그대로)
                    .append(TR_START)
                    .append(tdColor(11, 1, 1, "center", 12, "구분", "#EAEFF4"))
                    .append(tdColor(13, 1, 1, "center", 12, "금융기관", "#EAEFF4"))
                    .append(tdColor(18, 1, 1, "center", 12, "계좌번호", "#EAEFF4"))
                    .append(tdColor(11, 1, 1, "center", 12, "ERP잔액", "#EAEFF4"))
                    .append(tdColor(11, 1, 1, "center", 12, "잔고증명서", "#EAEFF4"))
                    .append(tdColor(11, 1, 1, "center", 12, "차액", "#EAEFF4"))
                    .append(tdColor(5, 1, 1, "center", 12, "통화", "#EAEFF4"))
                    .append(tdColor(8, 1, 1, "center", 12, "환율", "#EAEFF4"))
                    .append(tdColor(12, 1, 1, "center", 12, "비고", "#EAEFF4"))
                    .append(TR_CLOSE);
            for (DepositDiffRes m : list) {
                if (!"KRW".equals(m.curCode())) {
                    sb.append(TR_START)
                            .append(tdColor(11, 1, 1, "center", 12, checkNull(m.astSClassName()), "none"))
                            .append(tdColor(13, 1, 1, "left", 12, checkNull(m.corpName()), "none"))
                            .append(tdColor(18, 1, 1, "left", 12, checkNull(m.accountNo()), "none"))
                            .append(tdColor(11, 1, 1, "right", 12, checkDoubleNull(m.holdQty()), "none"))
                            .append(tdColor(11, 1, 1, "right", 12, checkDoubleNull(m.realAmt()), "none"))
                            .append(tdColor(11, 1, 1, "right", 12, checkDoubleNull(m.diffAmt()), "none"))
                            .append(tdColor(5, 1, 1, "center", 12, checkNull(m.curCode()), "none"))
                            .append(tdColor(8, 1, 1, "right", 12, checkDoubleNull(m.fxRate()), "none"))
                            .append(tdColor(12, 1, 1, "left", 12, "", "none"))
                            .append(TR_CLOSE);
                }
            }
        }
        sb.append(TBODY_CLOSE).append(TABLE_CLOSE);
        return sb.toString();
    }
}

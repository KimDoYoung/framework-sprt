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

import kr.co.kfs.asseterp.biz.apr.dto.DepositIoPrintRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprAstLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A17 일일자금관리 (Apr01_Edit_ApprDoc.insertLinkApproval L454-478, 본문 sys.Sys99_Print.getHtmlContent → PrintHtmlData.getHtmlDepositIoList, 호출 Act02_Tab_DepositIoList).
 * 호출 화면이 [상신]에서 먼저 `Sys99_Print.insertRdDepositIoList`로 출력 자료를 쌓고(TOBE `POST act/deposit-ios/rd-print`) 그 묶음 번호(groupId)를 넘긴다 → refId = groupId.
 * 제목 `일일자금현황_yyyy-MM-dd`(고칠 수 있음), 본문 `1. yyyy년 MM월 dd일 일일자금현황<br>` + 통화가 KRW인 줄 → 그 밖 통화 줄 표. args.stdDate = 호출 화면의 기준일자(printModel.date01).
 */
@Component
@RequiredArgsConstructor
public class DepositIoLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter KOR = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private final AprAstLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A17");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        if (refId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "일일자금 출력 자료 번호가 없습니다.");
        }
        LocalDate std;
        try {
            std = LocalDate.parse(args.getOrDefault("stdDate", ""));
        } catch (DateTimeParseException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일자 정보가 없습니다.", e);
        }
        List<DepositIoPrintRow> list = mapper.selectDepositIoPrint(user.getCompanyId(), refId);
        String content = "1. " + std.format(KOR) + " 일일자금현황<br>" + html(list);
        return new Seed("일일자금현황_" + std.format(DATE), content, null, false, false);
    }

    // ───── PrintHtmlData ─────

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:1px; width:" + (colspan * 3.3) + "%;\">"
                + "<span></span></td>";
    }

    private static String checkNull(String text) {
        if (text == null || "undefined".equals(text) || "null".equals(text)) {
            return " ";
        }
        return text;
    }

    private static String checkDoubleNull(Double num) {
        if (num == null) {
            return "- ";
        }
        return new DecimalFormat("###,###,###.##", DecimalFormatSymbols.getInstance(Locale.US)).format(num);
    }

    private static String row(DepositIoPrintRow m) {
        return TR_START
                + tdColor(3, 1, 1, "center", 12, checkNull(Html.esc(m.className())), "none")
                + tdColor(3, 1, 1, "center", 12, checkNull(Html.esc(m.accountName())), "none")
                + tdColor(2, 1, 1, "right", 12, checkDoubleNull(m.preDayAmt()), "none")
                + tdColor(2, 1, 1, "right", 12, checkDoubleNull(m.inAmt()), "none")
                + tdColor(2, 1, 1, "right", 12, checkDoubleNull(m.outAmt()), "none")
                + tdColor(2, 1, 1, "right", 12, checkDoubleNull(m.holdQty()), "none")
                + TR_CLOSE;
    }

    /** PrintHtmlData.getHtmlDepositIoList L71-140 — KRW 줄, 빈 줄, 그 밖 통화 줄, 보고사항 */
    static String html(List<DepositIoPrintRow> list) {
        StringBuilder sb = new StringBuilder();
        sb.append(TABLE_START).append(TBODY_START)
                .append(TR_START).append(tdEmpty(14, 1, 0)).append(TR_CLOSE)
                .append(TR_START)
                .append(tdStColor(3, 1, 1, "center", 12, "예금구분", "#EAEFF4"))
                .append(tdStColor(3, 1, 1, "center", 12, "금융기관", "#EAEFF4"))
                .append(tdStColor(2, 1, 1, "center", 12, "기초잔액<br>(전일잔액)", "#EAEFF4"))
                .append(tdStColor(2, 1, 1, "center", 12, "입금금액", "#EAEFF4"))
                .append(tdStColor(2, 1, 1, "center", 12, "출금금액", "#EAEFF4"))
                .append(tdStColor(2, 1, 1, "center", 12, "당일잔액<br>(마감잔액)", "#EAEFF4"))
                .append(TR_CLOSE);
        for (DepositIoPrintRow m : list) {
            if ("KRW".equals(m.curCode())) {
                sb.append(row(m));
            }
        }
        sb.append(TR_START).append(tdEmpty(14, 1, 0)).append(TR_CLOSE);
        for (DepositIoPrintRow m : list) {
            if (!"KRW".equals(m.curCode())) {
                sb.append(row(m));
            }
        }
        sb.append(TR_START).append(tdEmpty(14, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdColor(14, 1, 0, "left", 16, "2. 보고사항", "#FFFFFF")).append(TR_CLOSE)
                .append(TR_START).append(tdColor(14, 1, 1, "left", 12, "<br><br><br>", "none")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(14, 1, 0)).append(TR_CLOSE)
                .append(TR_START)
                .append(tdColor(14, 1, 0, "left", 16, " * 계좌별 입/출금 상세내역은 \"자산관리 > 02.고유자산 현황관리 > 일일자금관리\" 화면에서 확인 가능합니다.", "#FFFFFF"))
                .append(TR_CLOSE)
                .append(TBODY_CLOSE).append(TABLE_CLOSE);
        return sb.toString();
    }
}

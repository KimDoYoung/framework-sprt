package kr.co.kfs.asseterp.biz.apr.service.link;

import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizFundPriceModiLinkRow;
import kr.co.kfs.asseterp.biz.biz.mapper.BizFundPriceModiMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A75·A76 기준가 정정내역 보고 (Apr01_Edit_ApprDoc.insertLinkApproval L1576-1590),
 * A77 기준가 정정내역 월보고 (insertLinkApprovals L3009-3029) — client/htmlData/FundPriceModiHtmlData.
 * <ul>
 * <li>A75·A76: refId = 기준가정정보고 ID. 제목 `운용사 + " 기준가 정정의 건"` 읽기전용, 시행일자 = 기준가 변경일, 보고서구분 1 → 오류 발생 보고서, 그 밖 → 변경 발생 보고서.</li>
 * <li>A77: args `ids` = 화면 그리드의 행 ID를 쉼표로 이은 것(AS-IS `linkParam.gridList`). 제목 `yyyy년 MM월 기준가 정정 내역 보고`(첫 행의 변경일, 제목 편집 가능), 시행일자 오늘.</li>
 * </ul>
 * 저장 직후 처리는 V32(호출 화면 Biz60) — 첨부 복사 `copyFileLine`은 `PUT biz/fund-price-modis/{id}/appr-id`(BizFundPriceModiService)가,
 * A77 문서 자동등록 `insertRelateApprIdList`는 이 제공자의 `relateApprs`(새 문서의 연관문서 탭, A43과 같은 방식)가,
 * `Biz61_ModiRptRelateAppr.updateApprId`는 `PUT biz/fund-price-modis/month`가 한다.
 */
@Component
@RequiredArgsConstructor
public class FundPriceModiLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"Malgun Gothic\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";
    private static final String HEAD = "#EAEFF4";

    private static final DateTimeFormatter DOT_DATE = DateTimeFormatter.ofPattern("yyyy.MM.dd");
    private static final DateTimeFormatter YEAR_MONTH = DateTimeFormatter.ofPattern("yyyy년 MM월");

    private final BizFundPriceModiMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A75", "A76", "A77");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        if ("A77".equals(linkCode)) {
            return monthly(user, args.get("ids"));
        }
        BizFundPriceModiLinkRow m = refId == null ? null : mapper.selectLinkById(user.getCompanyId(), refId);
        if (m == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "기준가 정정 보고 내역을 찾을 수 없습니다.");
        }
        String title = m.amCorpName() + " 기준가 정정의 건";
        String content = "1".equals(m.reportType()) ? content01(m) : content02(m);
        return new Seed(title, content, m.modiDate(), true, false);
    }

    private Seed monthly(UserPrincipal user, String ids) {
        List<BizFundPriceModiLinkRow> list = new ArrayList<>();
        List<Long> idList = new ArrayList<>();
        if (ids != null && !ids.isBlank()) {
            for (String id : ids.split(",")) {
                BizFundPriceModiLinkRow row = mapper.selectLinkById(user.getCompanyId(), Long.valueOf(id.trim()));
                if (row == null) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "기준가 정정 보고 내역을 찾을 수 없습니다.");
                }
                list.add(row);
                idList.add(Long.valueOf(id.trim()));
            }
        }
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "기준가 정정 보고 내역을 찾을 수 없습니다.");
        }
        String title = ym(list.get(0).modiDate()) + " 기준가 정정 내역 보고";
        // L3832-3844 문서 자동등록: 행의 결재문서를 새 문서의 연관문서로 (저장은 연관 탭의 [저장]·[결재요청] 때)
        return new Seed(title, contents(list), null, false, false).withRelateApprs(mapper.selectRelateApprs(user.getCompanyId(), idList));
    }

    private static String ym(LocalDate date) {
        return date == null ? "" : date.format(YEAR_MONTH);
    }

    // ───── FundPriceModiHtmlData ─────

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    /** 배경·높이 없는 기본형: 테두리 2px, 높이 25px, 너비 colspan*5 % */
    private static String td(int colspan, int rowspan, int border, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; text-align:"
                + align + "; height:25px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String td(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String td(int colspan, int rowspan, int border, String align, int size, int height, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; text-align:"
                + align + "; height:" + height + "px; width:" + (colspan * 3.3) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String td(int colspan, int rowspan, int border, String align, int size, int height, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + ";text-align:"
                + align + "; height:" + height + "px; width:" + (colspan * 3.3) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + (colspan * 5) + "%;\"><span></span></td>";
    }

    private static String emptyRow(int cells) {
        StringBuilder sb = new StringBuilder(TR_START);
        for (int i = 0; i < cells; i++) {
            sb.append(tdEmpty(1, 1, 0));
        }
        return sb.append(TR_CLOSE).toString();
    }

    private static String checkNull(String text) {
        return text == null || "undefined".equals(text) || "null".equals(text) ? " " : text;
    }

    private static String checkFileNull(String text) {
        return text == null || "undefined".equals(text) || "null".equals(text) ? "없음" : text;
    }

    private static String fmt(double n) {
        DecimalFormat f = new DecimalFormat("###,###,###,###.##", DecimalFormatSymbols.getInstance(Locale.US));
        f.setRoundingMode(RoundingMode.HALF_UP);
        return f.format(n);
    }

    private static String checkDouble(Double n) {
        return n == null ? "- " : fmt(n);
    }

    private static String checkDouble(Double a, Double b) {
        return a == null || b == null ? "- " : fmt(a - b);
    }

    private static String checkDate(LocalDate d) {
        return d == null ? "- " : "&nbsp;" + d.format(DOT_DATE) + "&nbsp;";
    }

    /** AS-IS는 Boolean을 unbox해 쓰므로 비어 있으면 원본은 오류다 — 여기서는 N으로 둔다 */
    private static String checkBoolean(String yn) {
        return "true".equalsIgnoreCase(yn) ? "Y" : "N";
    }

    /** getHtmlContents(list) — A77 월보고 */
    static String contents(List<BizFundPriceModiLinkRow> list) {
        StringBuilder text = new StringBuilder();
        text.append(TABLE_START).append(TBODY_START).append(emptyRow(20));
        text.append(TR_START).append(td(20, 1, 0, "left", 12, ym(list.get(0).modiDate()) + " 기준가 정정 내역을 다음과 같이 보고합니다.", "#FFFFFF")).append(TR_CLOSE);
        text.append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE);
        text.append(TR_START).append(td(20, 1, 0, "center", 12, "- 다 음 -")).append(TR_CLOSE);
        text.append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE);
        text.append(TR_START).append(td(20, 1, 0, "left", 12, "1. 기준가 변경 내역 총 " + list.size() + "건")).append(TR_CLOSE);
        text.append(TR_START)
                .append(tdStColor(1, 1, 1, "center", 12, "No.", HEAD))
                .append(tdStColor(6, 1, 1, "center", 12, "운용사명", HEAD))
                .append(tdStColor(7, 1, 1, "center", 12, "펀드명", HEAD))
                .append(tdStColor(3, 1, 1, "center", 12, "기준가 산출일", HEAD))
                .append(tdStColor(3, 1, 1, "center", 12, "기준가 변경일", HEAD))
                .append(TR_CLOSE);
        int i = 1;
        for (BizFundPriceModiLinkRow m : list) {
            text.append(TR_START)
                    .append(td(1, 1, 1, "center", 12, i + ""))
                    .append(td(6, 1, 1, "left", 12, checkNull(m.amCorpName())))
                    .append(td(7, 1, 1, "left", 12, checkNull(m.fundName())))
                    .append(td(3, 1, 1, "center", 12, checkDate(m.priceStdDate())))
                    .append(td(3, 1, 1, "center", 12, checkDate(m.modiDate())))
                    .append(TR_CLOSE);
            i++;
        }
        return text.append(TBODY_CLOSE).append(TABLE_CLOSE).toString();
    }

    /** 변경 전/후/차이 4칸 한 줄 */
    private static String diffRow(String label, Double bef, Double aft) {
        return TR_START
                + td(4, 1, 1, "center", 14, label)
                + td(4, 1, 1, "right", 14, checkDouble(bef))
                + td(4, 1, 1, "right", 14, checkDouble(aft))
                + td(4, 1, 1, "right", 14, checkDouble(aft, bef))
                + TR_CLOSE;
    }

    /** 평일(결산유무 칸 4줄 병합) 4줄 / 결산 4줄 — 두 보고서 공통 */
    private static void priceRows(StringBuilder t, BizFundPriceModiLinkRow m) {
        t.append(TR_START)
                .append(td(3, 4, 1, "center", 14, checkBoolean(m.fundCloseYn())))
                .append(td(3, 4, 1, "center", 14, "평일"))
                .append(td(4, 1, 1, "center", 14, "기준가"))
                .append(td(4, 1, 1, "right", 14, checkDouble(m.befPrice())))
                .append(td(4, 1, 1, "right", 14, checkDouble(m.aftPrice())))
                .append(td(4, 1, 1, "right", 14, checkDouble(m.aftPrice(), m.befPrice())))
                .append(TR_CLOSE);
        t.append(diffRow("FULL기준가", m.befFullPrice(), m.aftFullPrice()));
        t.append(diffRow("과표기준가", m.befTaxPrice(), m.aftTaxPrice()));
        t.append(diffRow("FULL과표기준가", m.befFullTaxPrice(), m.aftFullTaxPrice()));
        t.append(TR_START)
                .append(td(3, 4, 1, "center", 14, checkBoolean(m.fundCloseYn())))
                .append(td(3, 4, 1, "center", 14, "결산"))
                .append(td(4, 1, 1, "center", 14, "기준가"))
                .append(td(4, 1, 1, "right", 14, checkDouble(m.befClosePrice())))
                .append(td(4, 1, 1, "right", 14, checkDouble(m.aftClosePrice())))
                .append(td(4, 1, 1, "right", 14, checkDouble(m.aftClosePrice(), m.befClosePrice())))
                .append(TR_CLOSE);
        t.append(diffRow("FULL기준가", m.befCloseFullPrice(), m.aftCloseFullPrice()));
        t.append(diffRow("과표기준가", m.befCloseTaxPrice(), m.aftCloseTaxPrice()));
        t.append(diffRow("FULL과표기준가", m.befCloseFullTaxPrice(), m.aftCloseFullTaxPrice()));
    }

    /** 제목부터 "- 기준가 변경내역" 표 머리까지 (AS-IS는 "- 기준가 변경내역" td를 tr 밖에 둔다 — 그대로) */
    private static void head(StringBuilder t, BizFundPriceModiLinkRow m, String title) {
        t.append(TABLE_START).append(TBODY_START).append(emptyRow(22));
        t.append(TR_START).append(tdStColor(22, 1, 0, "center", 22, title, "#FFFFFF")).append(TR_CLOSE);
        t.append(TR_START).append(tdEmpty(22, 1, 0)).append(TR_CLOSE);
        t.append(TR_START)
                .append(td(4, 1, 1, "center", 14, "운용사명", HEAD))
                .append(td(7, 1, 1, "center", 14, checkNull(m.amCorpName())))
                .append(td(4, 1, 1, "center", 14, "펀드명", HEAD))
                .append(td(7, 1, 1, "center", 14, checkNull(m.fundName())))
                .append(TR_CLOSE);
        t.append(TR_START)
                .append(td(4, 1, 1, "center", 14, "기준가 산출일", HEAD))
                .append(td(7, 1, 1, "center", 14, checkDate(m.priceStdDate())))
                .append(td(4, 1, 1, "center", 14, "기준가 변경일", HEAD))
                .append(td(7, 1, 1, "center", 14, checkDate(m.modiDate())))
                .append(TR_CLOSE);
        t.append(td(22, 1, 1, "left", 14, "-  기준가 변경내역"));
        t.append(TR_START)
                .append(td(3, 1, 1, "center", 14, "결산유무", HEAD))
                .append(td(3, 1, 1, "center", 14, "결산구분", HEAD))
                .append(td(4, 1, 1, "center", 14, "기준가", HEAD))
                .append(td(4, 1, 1, "center", 14, "변경전", HEAD))
                .append(td(4, 1, 1, "center", 14, "변경후", HEAD))
                .append(td(4, 1, 1, "center", 14, "차이", HEAD))
                .append(TR_CLOSE);
        priceRows(t, m);
        t.append(TR_START)
                .append(td(3, 1, 1, "center", 14, "최초발견자", HEAD))
                .append(td(3, 1, 1, "center", 14, checkNull(m.firstPersonName())))
                .append(td(4, 1, 1, "center", 14, "발견 경위", HEAD))
                .append(td(12, 1, 1, "center", 14, checkNull(m.discCause())))
                .append(TR_CLOSE);
    }

    private static void fileRow(StringBuilder t, BizFundPriceModiLinkRow m) {
        t.append(TR_START)
                .append(td(3, 1, 1, "center", 14, 40, "첨부파일", HEAD))
                .append(td(19, 1, 1, "left", 14, 40, checkFileNull(m.fileListHtmlStr())))
                .append(TR_CLOSE);
        t.append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE);
        t.append(TBODY_CLOSE).append(TABLE_CLOSE);
    }

    /** getHtmlContent01 — 기준가격 오류 발생 보고서 */
    static String content01(BizFundPriceModiLinkRow m) {
        StringBuilder t = new StringBuilder();
        head(t, m, "기준가격 오류 발생 보고서");
        t.append(TR_START).append(td(22, 1, 1, "left", 14, 90, "- 기준가 변경사유<br>" + checkNull(m.modiReason()))).append(TR_CLOSE);
        t.append(TR_START).append(td(22, 1, 1, "left", 14, 90, "- 재발 방지 대책<br>" + checkNull(m.prevPlan()))).append(TR_CLOSE);
        t.append(TR_START).append(td(22, 1, 1, "left", 14, "- 기준가 변경 공시 유무 ")).append(TR_CLOSE);
        t.append(TR_START)
                .append(td(3, 1, 1, "center", 14, "예탁원", HEAD))
                .append(td(3, 1, 1, "center", 14, checkBoolean(m.ksdNoticeYn())))
                .append(td(4, 1, 1, "center", 14, "금융투자협회", HEAD))
                .append(td(4, 1, 1, "center", 14, checkBoolean(m.kofiaNoticeYn())))
                .append(td(4, 1, 1, "center", 14, "배상금액", HEAD))
                .append(td(4, 1, 1, "right", 14, checkDouble(m.cmpsAmt())))
                .append(TR_CLOSE);
        fileRow(t, m);
        return t.toString();
    }

    /** getHtmlContent02 — 기준가격 변경 발생 보고서 */
    static String content02(BizFundPriceModiLinkRow m) {
        StringBuilder t = new StringBuilder();
        head(t, m, "기준가격 변경 발생 보고서");
        t.append(TR_START).append(td(22, 1, 1, "left", 14, 180, "- 기준가 변경사유<br>" + checkNull(m.modiReason()))).append(TR_CLOSE);
        t.append(TR_START).append(td(22, 1, 1, "left", 14, "- 기준가 변경 공시 유무 ")).append(TR_CLOSE);
        t.append(TR_START)
                .append(td(3, 1, 1, "center", 14, "예탁원", HEAD))
                .append(td(3, 1, 1, "center", 14, checkBoolean(m.ksdNoticeYn())))
                .append(td(4, 1, 1, "center", 14, "금융투자협회", HEAD))
                .append(td(12, 1, 1, "center", 14, checkBoolean(m.kofiaNoticeYn())))
                .append(TR_CLOSE);
        fileRow(t, m);
        return t.toString();
    }
}

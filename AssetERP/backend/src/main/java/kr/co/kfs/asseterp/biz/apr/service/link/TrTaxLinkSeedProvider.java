package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.AstTrLinkRow;
import kr.co.kfs.asseterp.biz.apr.dto.Tr4InsureLinkRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprAstLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A66 원천세 납부 · A67 부가세 납부 · A68 4대보험 납부 (Apr01_Edit_ApprDoc.insertLinkApproval L782-826, 호출 Ast06_Tab_TrTax.searchDcr 거래코드 5050·5051·5052).
 * refId = 세금/4대보험 등록 그리드에서 고른 행의 거래 번호(trId). 제목은 모두 고칠 수 있다(`title.setReadOnly(false)`).
 * - A66 `원천세 납부의 건`, A67 `부가세 납부의 건`: 본문은 없다 → 문서분류의 대표 양식(AS-IS도 `checkContent(linkHtmlContent)`에 null).
 * - A68 `yyyy.MM월분 사대보험 납부`: 본문 `TrTaxHtmlData.getHtmlContent(고지 내역 목록, 거래 행)`(지출결의서 + 보험별 고지 내역 표).
 *   시행일자는 AS-IS가 `oprModel.getDemandDate()`(빈 공모주 모델 → null)를 넣어 비게 되는데 TOBE는 오늘로 둔다(이상한점 #76).
 */
@Component
@RequiredArgsConstructor
public class TrTaxLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter TITLE = DateTimeFormatter.ofPattern("yyyy.MM월분");
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private final AprAstLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A66", "A67", "A68");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        if ("A66".equals(linkCode)) {
            return new Seed("원천세 납부의 건", null, null, false, false);
        }
        if ("A67".equals(linkCode)) {
            return new Seed("부가세 납부의 건", null, null, false, false);
        }
        if (refId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신할 거래를 선택해주세요.");
        }
        AstTrLinkRow tr = mapper.selectTrLink(user.getCompanyId(), refId);
        if (tr == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신할 거래 정보를 찾을 수 없습니다.");
        }
        List<Tr4InsureLinkRow> list = mapper.selectInsureExpense(user.getCompanyId(), tr.date());
        String orgName = mapper.selectUserOrgName(user.getUserId());
        String title = (tr.date() == null ? "" : tr.date().format(TITLE)) + " 사대보험 납부";
        return new Seed(title, html(list, tr, orgName), null, false, false);
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        return seed(user, linkCode, refId);
    }

    // ───── TrTaxHtmlData (폭은 colspan %) ─────

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:20px; width:" + colspan + "%;\">"
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

    private static String tdStNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:2px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdStNoneStrong(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + colspan + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    /** AS-IS checkNull — 비어 있으면 " - " */
    private static String checkNull(String text) {
        if (isBlankLike(text)) {
            return " - ";
        }
        return text;
    }

    /** AS-IS checkNull2 — 비어 있으면 " " */
    private static String checkNull2(String text) {
        if (isBlankLike(text)) {
            return " ";
        }
        return text;
    }

    private static boolean isBlankLike(String text) {
        return text == null || "undefined".equals(text) || "null".equals(text) || " ".equals(text) || text.isEmpty();
    }

    private static String checkLongNull(Long num) {
        return num == null ? "- " : String.format(java.util.Locale.US, "%,d", num);
    }

    private static String checkDateNull(LocalDate date) {
        return date == null ? " " : date.format(DATE);
    }

    private static long nz(Long n) {
        return n == null ? 0L : n;
    }

    /** TrTaxHtmlData.NumberToKorean — 자리마다 한글 숫자·단위, 만·억·조·경 */
    static String numberToKorean(Long amt) {
        String numStr = String.valueOf(nz(amt));
        String[] han1 = {"", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"};
        String[] han2 = {"", "십", "백", "천"};
        String[] han3 = {"", "만", "억", "조", "경"};
        StringBuilder result = new StringBuilder();
        int len = numStr.length();
        boolean hasHan3 = false;
        for (int i = len; i > 0; i--) {
            int nowInt = Integer.parseInt(numStr.substring(len - i, len - i + 1));
            int han2Pick = (i - 1) % 4;
            if (nowInt > 0) {
                result.append(han1[nowInt]).append(han2[han2Pick]);
                if (han2Pick > 0) {
                    hasHan3 = false;
                }
            }
            if (!hasHan3 && han2Pick == 0) {
                result.append(han3[(i - 1) / 4]);
                hasHan3 = true;
            }
        }
        return result.toString();
    }

    private static String tr(String... tds) {
        return TR_START + String.join("", tds) + TR_CLOSE;
    }

    /** TrTaxHtmlData.getHtmlContent L161-279 */
    static String html(List<Tr4InsureLinkRow> list, AstTrLinkRow t, String orgName) {
        StringBuilder sb = new StringBuilder();
        sb.append(TABLE_START).append(TBODY_START)
                .append(tr(tdStNoneStrong(100, 1, "center", 25, "지 출 결 의 서")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "1. 발생부서 : " + orgName)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "2. 계정과목 : " + checkNull2(t.insureAccountName()))))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "3. 일 &nbsp;&nbsp;&nbsp;&nbsp; 금 : " + numberToKorean(t.amt()) + "원 ( ₩ " + checkLongNull(t.amt()) + " )")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "4. 지출일자 :&nbsp;" + checkDateNull(t.date()))))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "5. 내 &nbsp;&nbsp;&nbsp;&nbsp; 역 : " + checkNull2(t.note()))))
                .append(tr(
                        tdStColor(12, 1, 1, "center", 13, "고지 내역", "#EAEFF4"),
                        tdStColor(12, 1, 1, "center", 13, "고지년월", "#EAEFF4"),
                        tdStColor(12, 1, 1, "center", 13, "고지인원", "#EAEFF4"),
                        tdStColor(13, 1, 1, "center", 13, "당월 납부금액<br>(회사분)", "#EAEFF4"),
                        tdStColor(13, 1, 1, "center", 13, "당월 납부금액<br>(임직원)", "#EAEFF4"),
                        tdStColor(13, 1, 1, "center", 13, "납부금액", "#EAEFF4"),
                        tdStColor(12, 1, 1, "center", 13, "기타금액", "#EAEFF4"),
                        tdStColor(13, 1, 1, "center", 13, "실 납부금액", "#EAEFF4")));
        long companyAmtSum = 0;
        long empAmtSum = 0;
        long payAmtSum = 0;
        long etcAmtSum = 0;
        long realPayAmtSum = 0;
        for (Tr4InsureLinkRow m : list) {
            companyAmtSum += nz(m.companyAmt());
            empAmtSum += nz(m.empAmt());
            payAmtSum += nz(m.payAmt());
            etcAmtSum += nz(m.etcAmt());
            realPayAmtSum += nz(m.realPayAmt());
            sb.append(tr(
                    tdColor(12, 1, 1, "center", 13, checkNull(m.typeName()), "none"),
                    tdColor(12, 1, 1, "center", 13, checkNull(m.noticeMonth()), "none"),
                    tdColor(12, 1, 1, "center", 13, checkLongNull(m.empCnt()) + "명", "none"),
                    tdColor(13, 1, 1, "right", 13, checkLongNull(m.companyAmt()) + "&nbsp;", "none"),
                    tdColor(13, 1, 1, "right", 13, checkLongNull(m.empAmt()) + "&nbsp;", "none"),
                    tdColor(13, 1, 1, "right", 13, checkLongNull(m.payAmt()) + "&nbsp;", "none"),
                    tdColor(12, 1, 1, "right", 13, checkLongNull(m.etcAmt()) + "&nbsp;", "none"),
                    tdColor(13, 1, 1, "right", 13, checkLongNull(m.realPayAmt()) + "&nbsp;", "none")));
        }
        sb.append(tr(
                tdColor(36, 1, 1, "center", 13, "합 계", "none"),
                tdColor(13, 1, 1, "right", 13, checkLongNull(companyAmtSum) + "&nbsp;", "none"),
                tdColor(13, 1, 1, "right", 13, checkLongNull(empAmtSum) + "&nbsp;", "none"),
                tdColor(13, 1, 1, "right", 13, checkLongNull(payAmtSum) + "&nbsp;", "none"),
                tdColor(12, 1, 1, "right", 13, checkLongNull(etcAmtSum) + "&nbsp;", "none"),
                tdColor(13, 1, 1, "right", 13, checkLongNull(realPayAmtSum) + "&nbsp;", "none")));
        sb.append(tr(tdEmpty(100, 1, 0)));
        for (String note : new String[] {t.npEtcNote(), t.hiEtcNote(), t.eiEtcNote(), t.ohEtcNote()}) {
            if (!" - ".equals(checkNull(note))) {
                sb.append(tr(tdStNone(100, 1, "left", 13, "&nbsp;" + "- " + note)));
            }
        }
        sb.append(TBODY_CLOSE).append(TABLE_CLOSE);
        return sb.toString();
    }
}

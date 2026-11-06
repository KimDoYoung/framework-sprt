package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.PayIncomeTaxPrintRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprPayLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxWithholdingRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayTaxWithholdingMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * X01 갑근세원천징수확인서 발급 (Apr01_Edit_ApprDoc.insertLinkApproval L2746-2755 · client/htmlData/PayIncomeTaxWithholdingHtmlData.getHtmlListContent).
 * refId = 갑근세확인서 발급 행(pay40_income_tax_withholding_id). AS-IS 호출 화면이 `sys.Sys99_Print.getIncomeTaxWithholding`로 읽어 넘기던 행을 서버가 다시 읽는다.
 * 제목은 편집할 수 있고(`title.setReadOnly(false)`), 수신은 신청 사원 이름, [저장]은 숨김(기본). 본문 표는 원본 문자열 순서까지 그대로 만든다.
 */
@Component
@RequiredArgsConstructor
public class PayIncomeTaxLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";
    private static final DateTimeFormatter MONTH = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final DateTimeFormatter KOR_DATE = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

    private final PayTaxWithholdingMapper taxMapper;
    private final AprPayLinkSeedMapper linkMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("X01");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        PayTaxWithholdingRes row = refId == null ? null : taxMapper.selectById(user.getCompanyId(), refId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "갑근세확인서 발급 내역을 찾을 수 없습니다.");
        }
        // AS-IS: stdYear + "%" (LIKE) — 발급 행의 기준연도
        PayIncomeTaxPrintRow m = linkMapper.selectIncomeTaxPrint(user.getCompanyId(), row.personId(), row.incomeTaxWithholdingId(), row.stdYear() + "%");
        if (m == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "갑근세확인서 발급 내역을 찾을 수 없습니다.");
        }
        String title = "갑근세원천징수확인서 발급 (" + m.string01() + ")#" + m.text02();
        // 제목 편집 가능, [저장] 숨김, 수신 = 신청 사원 이름
        return new Seed(title, html(m), null, false, false, m.string01(), null);
    }

    // ───── PayIncomeTaxWithholdingHtmlData ─────

    private static String tdHeaderColor(int colspan, int rowspan, int border, String align, int size, String text) {
        text = pad(align, text);
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; text-align:"
                + align + "; height:60px; width:" + (colspan * 2.94) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text) {
        text = pad(align, text);
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; text-align:"
                + align + "; height:30px; width:" + (colspan * 2.94) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String tdBorderColor(int colspan, int rowspan, int border1, int border2, int border3, int border4, String align, int size, String text) {
        text = pad(align, text);
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\""
                + "border-top: " + border1 + "px solid black; "
                + "border-right: " + border2 + "px solid black; "
                + "border-bottom: " + border3 + "px solid black; "
                + "border-left: " + border4 + "px solid black; "
                + "text-align:" + align
                + "; height:30px; width:" + (colspan * 2.94) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:1px; width:" + (colspan * 2.94) + "%;\">"
                + "<span></span></td>";
    }

    /** 왼쪽 정렬은 앞에, 오른쪽 정렬은 뒤에 작은 공백을 붙인다 */
    private static String pad(String align, String text) {
        if ("left".equals(align)) {
            return "<span style=\"font-size: 0.5em;\">&nbsp;</span>" + text;
        }
        if ("right".equals(align)) {
            return text + "<span style=\"font-size: 0.5em;\">&nbsp;</span>";
        }
        return text;
    }

    private static String checkNull(String text) {
        if (text == null || "undefined".equals(text) || "null".equals(text)) {
            return " ";
        }
        return text;
    }

    private static String num(long n) {
        return NumberFormat.getIntegerInstance(Locale.US).format(n);
    }

    /** checkLongNull(Long) — 합계 칸. 비면 " " */
    private static String checkLongNull(Long n) {
        return n == null ? " " : num(n);
    }

    /** checkLongNull(Date, Long) — 달 칸의 연월이 없으면 " ", 있으면 금액(모델의 long은 비면 0) */
    private static String checkLongNull(LocalDate date, Long n) {
        return date == null ? " " : num(n == null ? 0L : n);
    }

    private static String checkMonthNull(LocalDate d) {
        return d == null ? " " : d.format(MONTH);
    }

    private static String checkDateNull(LocalDate d) {
        return d == null ? " " : d.toString();
    }

    private static String checkDateKorNull(LocalDate d) {
        return d == null ? "- " : d.format(KOR_DATE);
    }

    private static long z(Long n) {
        return n == null ? 0L : n; // 모델의 long 필드는 값이 없으면 0
    }

    private static String html(PayIncomeTaxPrintRow m) {
        String title = "<b>갑종근로소득에 대한 소득세원천징수확인서</b><br>"
                + "<span style=\"font-size:13px;\">"
                + checkNull(Html.esc(m.text01()))
                + "</span>";

        long basicPay = z(m.long01()) + z(m.long03()) + z(m.long05()) + z(m.long07()) + z(m.long09()) + z(m.long11())
                + z(m.long13()) + z(m.long15()) + z(m.long17()) + z(m.long19()) + z(m.long21()) + z(m.long23());
        long taxPay = z(m.long02()) + z(m.long04()) + z(m.long06()) + z(m.long08()) + z(m.long10()) + z(m.long12())
                + z(m.long14()) + z(m.long16()) + z(m.long18()) + z(m.long20()) + z(m.long22()) + z(m.long24());

        StringBuilder t = new StringBuilder();
        t.append(TABLE_START).append(TBODY_START);
        // 폭 기준 빈 줄 (1칸 × 34)
        t.append(TR_START).append(tdEmpty(1, 1, 0).repeat(34)).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdHeaderColor(5, 1, 1, "center", 12, "발급번호"))
                .append(tdHeaderColor(24, 2, 1, "center", 18, title))
                .append(tdHeaderColor(5, 1, 1, "center", 12, "관리번호"))
                .append(TR_CLOSE);
        t.append(TR_START)
                .append(tdColor(5, 1, 1, "center", 12, checkNull(Html.esc(m.text02()))))
                .append(tdColor(5, 1, 1, "center", 12, " "))
                .append(TR_CLOSE);
        t.append(TR_START)
                .append(tdColor(2, 2, 1, "center", 12, "납<br>세<br>자"))
                .append(tdColor(6, 1, 1, "left", 12, "① 성 명"))
                .append(tdColor(8, 1, 1, "center", 12, checkNull(Html.esc(m.string01()))))
                .append(tdColor(7, 1, 1, "left", 12, "② 주민등록번호"))
                .append(tdColor(11, 1, 1, "center", 12, checkNull(Html.esc(m.string02()))))
                .append(TR_CLOSE);
        t.append(TR_START)
                .append(tdColor(6, 1, 1, "left", 12, "③ 주소또는거소"))
                .append(tdColor(26, 1, 1, "left", 12, checkNull(Html.esc(m.string03()))))
                .append(TR_CLOSE);
        t.append(TR_START)
                .append(tdColor(2, 3, 1, "center", 12, "징<br>수<br>의<br>무<br>자"))
                .append(tdColor(6, 1, 1, "left", 12, "④ 상호또는명칭"))
                .append(tdColor(8, 1, 1, "center", 12, checkNull(Html.esc(m.string04()))))
                .append(tdColor(9, 1, 1, "left", 12, "⑤ 사업자등록번호"))
                .append(tdColor(9, 1, 1, "center", 12, checkNull(Html.esc(m.string05()))))
                .append(TR_CLOSE);
        t.append(TR_START)
                .append(tdColor(6, 1, 1, "left", 12, "⑥ 사업장소재지"))
                .append(tdColor(26, 1, 1, "left", 12, checkNull(Html.esc(m.string06()))))
                .append(TR_CLOSE);
        t.append(TR_START)
                .append(tdColor(6, 1, 1, "left", 12, "⑦ 대 표 자"))
                .append(tdColor(8, 1, 1, "center", 12, checkNull(Html.esc(m.string07()))))
                .append(tdColor(9, 1, 1, "left", 12, "⑧ 주민(법인)등록번호"))
                .append(tdColor(9, 1, 1, "center", 12, checkNull(Html.esc(m.string08()))))
                .append(TR_CLOSE);
        t.append(TR_START)
                .append(tdColor(8, 1, 1, "left", 12, "⑨ 확인서의 사용목적"))
                .append(tdColor(6, 1, 1, "center", 12, checkNull(Html.esc(m.string09()))))
                .append(tdColor(4, 1, 1, "left", 12, "⑩ 제출처"))
                .append(tdColor(7, 1, 1, "center", 12, checkNull(Html.esc(m.string10()))))
                .append(tdColor(5, 1, 1, "left", 12, "⑪ 소요수량"))
                .append(tdColor(4, 1, 1, "center", 12, checkNull(Html.esc(m.string11()))))
                .append(TR_CLOSE);
        t.append(TR_START)
                .append(tdColor(4, 1, 1, "center", 12, "연 월"))
                .append(tdColor(4, 1, 1, "center", 12, "⑫급여액"))
                .append(tdColor(3, 1, 1, "center", 12, "⑬세  액"))
                .append(tdColor(6, 1, 1, "center", 12, "⑭납부(예정)연월일"))
                .append(tdColor(4, 1, 1, "center", 12, "연 월"))
                .append(tdColor(4, 1, 1, "center", 12, "⑫급여액"))
                .append(tdColor(3, 1, 1, "center", 12, "⑬세  액"))
                .append(tdColor(6, 1, 1, "center", 12, "⑭납부(예정)연월일"))
                .append(TR_CLOSE);
        // 1월~12월 (오른쪽 반은 빈 칸)
        LocalDate[] d = {
                m.date01(), m.date02(), m.date03(), m.date04(), m.date05(), m.date06(), m.date07(), m.date08(),
                m.date09(), m.date10(), m.date11(), m.date12(), m.date13(), m.date14(), m.date15(), m.date16(),
                m.date17(), m.date18(), m.date19(), m.date20(), m.date21(), m.date22(), m.date23(), m.date24() };
        Long[] l = {
                m.long01(), m.long02(), m.long03(), m.long04(), m.long05(), m.long06(), m.long07(), m.long08(),
                m.long09(), m.long10(), m.long11(), m.long12(), m.long13(), m.long14(), m.long15(), m.long16(),
                m.long17(), m.long18(), m.long19(), m.long20(), m.long21(), m.long22(), m.long23(), m.long24() };
        for (int i = 0; i < 12; i++) {
            LocalDate month = d[i * 2];
            t.append(TR_START)
                    .append(tdColor(4, 1, 1, "center", 12, checkMonthNull(month)))
                    .append(tdColor(4, 1, 1, "right", 12, checkLongNull(month, l[i * 2])))
                    .append(tdColor(3, 1, 1, "right", 12, checkLongNull(month, l[i * 2 + 1])))
                    .append(tdColor(6, 1, 1, "center", 12, checkDateNull(d[i * 2 + 1])))
                    .append(tdColor(4, 1, 1, "center", 12, " "))
                    .append(tdColor(4, 1, 1, "right", 12, " "))
                    .append(tdColor(3, 1, 1, "right", 12, " "))
                    .append(tdColor(6, 1, 1, "center", 12, " "))
                    .append(TR_CLOSE);
        }
        // 빈 줄 하나
        t.append(TR_START)
                .append(tdColor(4, 1, 1, "center", 12, " "))
                .append(tdColor(4, 1, 1, "center", 12, " "))
                .append(tdColor(3, 1, 1, "center", 12, " "))
                .append(tdColor(6, 1, 1, "center", 12, " "))
                .append(tdColor(4, 1, 1, "center", 12, " "))
                .append(tdColor(4, 1, 1, "center", 12, " "))
                .append(tdColor(3, 1, 1, "center", 12, " "))
                .append(tdColor(6, 1, 1, "center", 12, " "))
                .append(TR_CLOSE);
        // 계
        t.append(TR_START)
                .append(tdColor(4, 1, 1, "center", 12, " "))
                .append(tdColor(4, 1, 1, "center", 12, " "))
                .append(tdColor(3, 1, 1, "center", 12, " "))
                .append(tdColor(6, 1, 1, "center", 12, " "))
                .append(tdColor(4, 1, 1, "center", 12, "계"))
                .append(tdColor(4, 1, 1, "right", 12, checkLongNull(basicPay)))
                .append(tdColor(3, 1, 1, "right", 12, checkLongNull(taxPay)))
                .append(tdColor(6, 1, 1, "center", 12, " "))
                .append(TR_CLOSE);
        // 확인 문구와 서명 (신청인 / 확인자)
        t.append(TR_START)
                .append(tdBorderColor(2, 1, 1, 0, 0, 1, "center", 12, " "))
                .append(tdBorderColor(32, 1, 1, 1, 0, 0, "left", 12, "발급일 현재 위와 같이 원천징수하였음을 확인하여 주시기 바랍니다."))
                .append(TR_CLOSE);
        t.append(TR_START).append(tdBorderColor(34, 1, 0, 1, 0, 1, "center", 12, checkDateKorNull(m.date25()))).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdBorderColor(4, 1, 0, 0, 0, 1, "center", 12, " "))
                .append(tdBorderColor(10, 1, 0, 0, 0, 0, "right", 12, "신청인"))
                .append(tdBorderColor(12, 1, 0, 0, 0, 0, "right", 12, checkNull(Html.esc(m.string01()))))
                .append(tdBorderColor(8, 1, 0, 1, 0, 0, "left", 12, "(서명 또는 인)"))
                .append(TR_CLOSE);
        t.append(TR_START).append(tdBorderColor(34, 1, 0, 1, 1, 1, "center", 12, " ")).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdBorderColor(2, 1, 1, 0, 0, 1, "center", 12, " "))
                .append(tdBorderColor(32, 1, 1, 1, 0, 0, "left", 12, "위와 같이 원천징수하였음을 확인합니다."))
                .append(TR_CLOSE);
        t.append(TR_START).append(tdBorderColor(34, 1, 0, 1, 0, 1, "center", 12, checkDateKorNull(m.date25()))).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdBorderColor(4, 1, 0, 0, 0, 1, "center", 12, " "))
                .append(tdBorderColor(10, 1, 0, 0, 0, 0, "right", 12, "확인자(원천징수의무자)"))
                .append(tdBorderColor(12, 1, 0, 0, 0, 0, "right", 12, checkNull(Html.esc(m.string04())) + " " + checkNull(Html.esc(m.string07()))))
                .append(tdBorderColor(8, 1, 0, 1, 0, 0, "left", 12, "(서명 또는 인)"))
                .append(TR_CLOSE);
        t.append(TR_START).append(tdBorderColor(34, 1, 0, 1, 1, 1, "center", 12, " ")).append(TR_CLOSE);
        t.append(TBODY_CLOSE).append(TABLE_CLOSE);
        return t.toString();
    }
}

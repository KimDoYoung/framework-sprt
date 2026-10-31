package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.PayExpenseLinkRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprExpenseLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A63 지출결의서 · A64 자금집행결의서 (Apr01_Edit_ApprDoc.insertLinkApprovals L3425-3478, 본문 ExpenseHtmlData).
 * 호출 화면이 그리드에서 고른 행(AS-IS expenseList)은 `ids`(쉼표, 호출 화면이 정한 순서 — A63은 발생일자 순)로 받아 서버가 다시 읽는다.
 * - A63: `refId` = 고른 첫 행(AS-IS selectedItems.get(0), 시행일자 = 그 행의 발생일자). 제목 `지출결의서(적요)` / 여러 건이면 `지출결의서(마지막 행 적요 외 N)`.
 *   한 건이면 getHtmlContent(승인자 줄 포함 — 호출 화면 Pay50_Tab_ExpenseManager가 isManager=true), 여러 건이면 getHtmlContents. 제목은 고칠 수 있다.
 *   문서 자동등록(insertPay50RelateApprList) = 응답 `relateApprs`(저장은 연관 탭의 [저장]·[결재요청] 때). 파일 자동등록은 문서 ID 기록 API(PayExpenseService.updateExpenseApprId)가 한다.
 * - A64: 제목 `자금집행결의서-yyyy-MM-dd`(자금집행일), 시행일자 = 오늘, 본문 getHtmlContentsExpensePay. 문서 자동등록(insertPay50PayRelateApprList) = 지출결의서 상신문서.
 */
@Component
@RequiredArgsConstructor
public class ExpenseLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final AprExpenseLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A63", "A64");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        List<Long> ids = parseIds(args.get("ids"));
        if (ids.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신할 내용을 선택해주세요");
        }
        boolean pay = "A64".equals(linkCode);
        List<PayExpenseLinkRow> list = ordered(ids, mapper.selectExpenseRows(user.getCompanyId(), ids, pay));
        if (list.size() != ids.size()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신할 지출요청 정보를 찾을 수 없습니다.");
        }
        return pay ? seedPay(list, ids) : seedExpense(list, ids, refId);
    }

    // ───── A63 ─────

    private Seed seedExpense(List<PayExpenseLinkRow> list, List<Long> ids, Long refId) {
        PayExpenseLinkRow first = list.get(0);
        if (refId != null) {
            for (PayExpenseLinkRow r : list) {
                if (refId.equals(r.expenseId())) {
                    first = r;
                }
            }
        }
        int cnt = list.size();
        String title;
        String content;
        if (cnt > 1) {
            title = "지출결의서(" + list.get(cnt - 1).desc() + " 외 " + (cnt - 1) + ")";
            content = contents(list, first.orgName(), first.accountName());
        } else {
            title = "지출결의서(" + first.desc() + ")";
            content = content(list, true);
        }
        List<AprLinkRelateApprRes> relates = mapper.selectRelateApprsByExpenseIds(ids);
        return new Seed(title, content, first.occDate(), false, false).withRelateApprs(relates);
    }

    // ───── A64 ─────

    private Seed seedPay(List<PayExpenseLinkRow> list, List<Long> ids) {
        LocalDate settleDate = list.get(0).settleDate();
        String date = settleDate == null ? "null" : settleDate.format(DATE);
        String title = "자금집행결의서-" + date;
        List<AprLinkRelateApprRes> relates = mapper.selectExpenseApprsByExpenseIds(ids);
        return new Seed(title, contentsExpensePay(list, date), null, false, false).withRelateApprs(relates);
    }

    // ───── 공통 ─────

    private static List<Long> parseIds(String text) {
        List<Long> ids = new ArrayList<>();
        if (text != null) {
            for (String t : text.split(",")) {
                if (!t.isBlank()) {
                    ids.add(Long.valueOf(t.trim()));
                }
            }
        }
        return ids;
    }

    /** 호출 화면이 정한 순서(ids)대로 */
    private static List<PayExpenseLinkRow> ordered(List<Long> ids, List<PayExpenseLinkRow> rows) {
        List<PayExpenseLinkRow> out = new ArrayList<>();
        for (Long id : ids) {
            for (PayExpenseLinkRow r : rows) {
                if (id.equals(r.expenseId())) {
                    out.add(r);
                    break;
                }
            }
        }
        return out;
    }

    // ───── ExpenseHtmlData ─────

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
                + "\" style=\"border-style:none; border-width:2px; text-align:" + align + "; height:2px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdStNoneStrong(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:" + align + "; height:1px; width:" + colspan + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String checkNull(String text) {
        return text == null || "undefined".equals(text) || "null".equals(text) ? " " : text;
    }

    private static String checkLongNull(Long num) {
        return num == null ? "- " : String.format(Locale.US, "%,d", num);
    }

    private static String checkDateNull(LocalDate date) {
        return date == null ? " " : date.format(DATE);
    }

    private static long nz(Long n) {
        return n == null ? 0L : n;
    }

    private static String tr(String... tds) {
        return "<tr>" + String.join("", tds) + "</tr>";
    }

    /** getHtmlContent — 한 건 */
    static String content(List<PayExpenseLinkRow> list, boolean isManager) {
        PayExpenseLinkRow e = list.get(0);
        String confirmer = isManager
                ? tdEmpty(2, 1, 0) + tdStNone(98, 1, "left", 13, checkNull("- 승 인 자 : " + e.confirmerTitleName() + " " + e.confirmerOrgName()))
                : "";
        StringBuilder t = new StringBuilder();
        t.append(TABLE_START).append("<tbody>")
                .append(tr(tdStNoneStrong(100, 1, "center", 25, "지 출 결 의 서")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "1. 발생부서")))
                .append(tr(tdEmpty(2, 1, 0), tdStNone(98, 1, "left", 13, checkNull("- 발 생 자 : " + e.regEmpTitleName() + " " + e.regEmpOrgName()))))
                .append(tr(confirmer))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "2. 계정과목 : " + e.accountName())))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "3. 내 &nbsp;&nbsp;&nbsp;&nbsp; 역")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStColor(12, 1, 1, "center", 13, "발생일자", "#EAEFF4"),
                        tdStColor(16, 1, 1, "center", 13, "지출처", "#EAEFF4"),
                        tdStColor(20, 1, 1, "center", 13, "적요", "#EAEFF4"),
                        tdStColor(13, 1, 1, "center", 13, "금액", "#EAEFF4"),
                        tdStColor(7, 1, 1, "center", 13, "과세", "#EAEFF4"),
                        tdStColor(20, 1, 1, "center", 13, "지급예정일", "#EAEFF4"),
                        tdStColor(12, 1, 1, "center", 13, "비고", "#EAEFF4")));
        long settleSum = 0;
        for (PayExpenseLinkRow m : list) {
            settleSum += nz(m.settleAmt());
            t.append(tr(tdColor(12, 1, 1, "center", 13, checkDateNull(m.occDate()), "none"),
                    tdColor(16, 1, 1, "left", 13, checkNull(m.corpName()), "none"),
                    tdColor(20, 1, 1, "left", 13, checkNull(m.desc()), "none"),
                    tdColor(13, 1, 1, "right", 13, checkLongNull(m.settleAmt()) + "&nbsp;", "none"),
                    tdColor(7, 1, 1, "center", 13, checkNull(m.taxTypeName()), "none"),
                    tdColor(20, 1, 1, "left", 13, checkNull(checkDateNull(m.dueDate()) + " (" + m.payMethodName() + ")"), "none"),
                    tdColor(12, 1, 1, "left", 13, checkNull(m.note()), "none")));
        }
        t.append(tr(tdColor(48, 1, 1, "center", 13, "합 계", "none"),
                tdColor(13, 1, 1, "right", 13, checkLongNull(settleSum) + "&nbsp;", "none"),
                tdColor(39, 1, 1, "center", 13, " ", "none")))
                .append(tr(tdEmpty(100, 1, 0)));
        if ("10".equals(e.payMethodCode())) {
            t.append(tr(tdStNone(100, 1, "left", 13, "4. 계좌번호")))
                    .append(tr(tdEmpty(3, 1, 0), tdStNone(97, 1, "left", 13, checkNull(e.payAccountInfo()))))
                    .append(tr(tdEmpty(100, 1, 0)))
                    .append(tr(tdStNone(100, 1, "left", 13, "5. 세부내역")))
                    .append(tr(tdEmpty(3, 1, 0), tdStNone(97, 1, "left", 13, checkNull(e.content()))));
        } else {
            t.append(tr(tdStNone(100, 1, "left", 13, "4. 세부내역")))
                    .append(tr(tdEmpty(3, 1, 0), tdStNone(97, 1, "left", 13, checkNull(e.content()))));
        }
        return t.append("</tbody></table>").toString();
    }

    /** getHtmlContents — 여러 건 */
    static String contents(List<PayExpenseLinkRow> list, String orgName, String accountName) {
        StringBuilder t = new StringBuilder();
        t.append(TABLE_START).append("<tbody>")
                .append(tr(tdStNoneStrong(100, 1, "center", 25, "지 출 결 의 서")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "1. 발생부서 : " + orgName)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "2. 계정과목 : " + accountName)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "3. 내 &nbsp;&nbsp;&nbsp;&nbsp; 역")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStColor(4, 1, 1, "center", 13, "No.", "#EAEFF4"),
                        tdStColor(12, 1, 1, "center", 13, "발생일자", "#EAEFF4"),
                        tdStColor(15, 1, 1, "center", 13, "지출처", "#EAEFF4"),
                        tdStColor(19, 1, 1, "center", 13, "적요", "#EAEFF4"),
                        tdStColor(13, 1, 1, "center", 13, "금액", "#EAEFF4"),
                        tdStColor(5, 1, 1, "center", 13, "과세", "#EAEFF4"),
                        tdStColor(12, 1, 1, "center", 13, "지급예정일", "#EAEFF4"),
                        tdStColor(10, 1, 1, "center", 13, "지급방법", "#EAEFF4"),
                        tdStColor(10, 1, 1, "center", 13, "비고", "#EAEFF4")));
        long settleSum = 0;
        long cnt = 0;
        long method10Cnt = 0;
        for (PayExpenseLinkRow m : list) {
            settleSum += nz(m.settleAmt());
            cnt += 1;
            if ("10".equals(m.payMethodCode())) {
                method10Cnt += 1;
            }
            t.append(tr(tdColor(4, 1, 1, "center", 13, checkLongNull(cnt), "none"),
                    tdColor(12, 1, 1, "center", 13, checkDateNull(m.occDate()), "none"),
                    tdColor(15, 1, 1, "left", 13, checkNull(m.corpName()), "none"),
                    tdColor(19, 1, 1, "left", 13, checkNull(m.desc()), "none"),
                    tdColor(13, 1, 1, "right", 13, checkLongNull(m.settleAmt()) + "&nbsp;", "none"),
                    tdColor(5, 1, 1, "center", 13, checkNull(m.taxTypeName()), "none"),
                    tdColor(12, 1, 1, "center", 13, checkNull(checkDateNull(m.dueDate())), "none"),
                    tdColor(10, 1, 1, "left", 13, checkNull(m.payMethodName()), "none"),
                    tdColor(10, 1, 1, "left", 13, checkNull(m.note()), "none")));
        }
        cnt = 0;
        t.append(tr(tdColor(50, 1, 1, "center", 13, "합 계", "none"),
                tdColor(13, 1, 1, "right", 13, checkLongNull(settleSum) + "&nbsp;", "none"),
                tdColor(37, 1, 1, "center", 13, " ", "none")));
        if (method10Cnt != 0) {
            t.append(tr(tdEmpty(100, 1, 0))).append(tr(tdStNone(100, 1, "left", 13, "4. 계좌번호")));
            for (PayExpenseLinkRow m : list) {
                cnt += 1;
                if (!"10".equals(m.payMethodCode())) {
                    continue;
                }
                t.append(tr(tdEmpty(3, 1, 0), tdStNone(97, 1, "left", 13, "&nbsp;" + cnt + " : " + m.payAccountInfo())));
            }
        }
        return t.append("</tbody></table>").toString();
    }

    /**
     * getHtmlContentsExpensePay — 출금계좌별로 묶는다. AS-IS는 HashMap(GWT)이라 묶음 순서가 정해져 있지 않고,
     * 여기서는 처음 나온 순서(LinkedHashMap)로 한다.
     */
    static String contentsExpensePay(List<PayExpenseLinkRow> list, String settleDate) {
        long settleSum = 0;
        for (PayExpenseLinkRow m : list) {
            settleSum += nz(m.settleAmt());
        }
        Map<String, Long> payMethodSum = new LinkedHashMap<>();
        for (PayExpenseLinkRow m : list) {
            payMethodSum.merge(checkNull(m.payMethodName()), nz(m.settleAmt()), Long::sum);
        }
        StringBuilder t = new StringBuilder();
        t.append(TABLE_START).append("<tbody>")
                .append(tr(tdStNoneStrong(100, 1, "center", 25, "자금집행결의서")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "1. 지급일자 : " + settleDate)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "2. 지급총액 : ₩" + checkLongNull(settleSum))))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "3. 지급내역")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStColor(5, 1, 1, "center", 13, "순번", "#EAEFF4"),
                        tdStColor(14, 1, 1, "center", 13, "발생일자", "#EAEFF4"),
                        tdStColor(19, 1, 1, "center", 13, "지급처", "#EAEFF4"),
                        tdStColor(24, 1, 1, "center", 13, "적요", "#EAEFF4"),
                        tdStColor(14, 1, 1, "center", 13, "금액", "#EAEFF4"),
                        tdStColor(24, 1, 1, "center", 13, "지급방법", "#EAEFF4")));
        Map<String, List<PayExpenseLinkRow>> grouped = new LinkedHashMap<>();
        for (PayExpenseLinkRow m : list) {
            grouped.computeIfAbsent(m.depositName(), k -> new ArrayList<>()).add(m);
        }
        int cnt = 1;
        for (Map.Entry<String, List<PayExpenseLinkRow>> g : grouped.entrySet()) {
            long depositSum = 0;
            for (PayExpenseLinkRow m : g.getValue()) {
                depositSum += nz(m.settleAmt());
                String payAccountInfo = m.payAccountInfo() != null ? "(" + m.payAccountInfo() + ")" : "";
                t.append(tr(tdColor(5, 1, 1, "center", 13, (cnt++) + "", "none"),
                        tdColor(14, 1, 1, "center", 13, checkDateNull(m.occDate()), "none"),
                        tdColor(19, 1, 1, "left", 13, checkNull(m.corpName()), "none"),
                        tdColor(24, 1, 1, "left", 13, checkNull(m.desc()), "none"),
                        tdColor(14, 1, 1, "right", 13, checkLongNull(m.settleAmt()) + "&nbsp;", "none"),
                        tdColor(24, 1, 1, "left", 13, checkNull(m.payMethodName() + payAccountInfo), "none")));
            }
            t.append(tr(tdStColor(62, 1, 1, "center", 13, "출금계좌(" + g.getKey() + ") 합계", "#FFF79D"),
                    tdStColor(14, 1, 1, "right", 13, checkLongNull(depositSum) + "&nbsp;", "#FFF79D"),
                    tdStColor(24, 1, 1, "center", 13, " ", "#FFF79D")));
        }
        for (Map.Entry<String, Long> e : payMethodSum.entrySet()) {
            t.append(tr(tdStColor(62, 1, 1, "center", 13, e.getKey() + " 합계", "#DAF2D0"),
                    tdStColor(14, 1, 1, "right", 13, checkLongNull(e.getValue()) + "&nbsp;", "#DAF2D0"),
                    tdStColor(24, 1, 1, "center", 13, " ", "#DAF2D0")));
        }
        t.append(tr(tdStColor(62, 1, 1, "center", 13, "전 체 합 계", "#EAEFF4"),
                tdStColor(14, 1, 1, "right", 13, checkLongNull(settleSum) + "&nbsp;", "#EAEFF4"),
                tdStColor(24, 1, 1, "center", 13, " ", "#EAEFF4")))
                .append(tr(tdEmpty(100, 1, 0)));
        return t.append("</tbody></table>").toString();
    }
}

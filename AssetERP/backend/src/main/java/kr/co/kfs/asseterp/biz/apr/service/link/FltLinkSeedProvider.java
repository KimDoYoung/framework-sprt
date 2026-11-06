package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.HrLinkUserRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprHrLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AccountCloseRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdRes;
import kr.co.kfs.asseterp.biz.flt.dto.LinkBookInitRes;
import kr.co.kfs.asseterp.biz.flt.dto.LinkBookRes;
import kr.co.kfs.asseterp.biz.flt.dto.RealTrRes;
import kr.co.kfs.asseterp.biz.flt.mapper.FltAccountMapper;
import kr.co.kfs.asseterp.biz.flt.mapper.FltBookMapper;
import kr.co.kfs.asseterp.biz.flt.mapper.FltCompanyStdMapper;
import kr.co.kfs.asseterp.biz.flt.mapper.FltTrMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * 임직원 자기매매 신고 상신 (Apr01_Edit_ApprDoc.insertLinkApprovals — A09 L3089-3135, B05 L3657-3684, B06 L3685-3708)
 * - A09 개인별 매매 및 보유내역 신고서: `TrRealHtmlData.getHtmlContent` (호출 Flt10_Tab_RealTransaction.insertLinkApprovals L2099-2134)
 * - B05 계좌개설 신고서: `AccountHtmlData.getHtmlContent` (호출 Flt03_Tab_AccountReport.insertLinkApproval L627-695)
 * - B06 계좌폐쇄 신고서: `AccountCloseHtmlData.getHtmlContent` (호출 Flt06_TabPage_AccountClose.insertLinkApproval L253-289)
 * - A06 법규준수서약서: 본문 없음 — 문서분류 대표 양식 (L1912-1916, 호출 Flt02_Lookup_Emp.insertLinkApproval, EE45)
 * 호출 화면이 GWT 모델 목록을 `linkParam`으로 넘기던 것을 `args.ids`(고른 행 ID, 고른 순서)로 받고 서버가 행을 다시 읽는다(본인 행만).
 * 제목은 읽기전용, [저장]은 감춘다(기본). 본문 표는 원본 문자열 순서·스타일 그대로 만든다.
 * A08(자기매매 사전신고)은 원본에서도 호출하는 화면이 없어 만들지 않았다.
 */
@Component
@RequiredArgsConstructor
public class FltLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter KOR_DATE = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

    private final FltTrMapper trMapper;
    private final FltBookMapper bookMapper;
    private final FltCompanyStdMapper companyStdMapper;
    private final FltAccountMapper accountMapper;
    private final AprApprNewMapper newMapper;
    private final AprHrLinkSeedMapper hrMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A06", "A09", "B05", "B06");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        // A06 법규준수서약서 (Apr01_Edit_ApprDoc L1912-1916): 제목·본문 없이 문서분류의 대표 양식(checkContent(null)), 제목은 고칠 수 있고 [저장]은 감춘다 — 호출 Flt02_Lookup_Emp.insertLinkApproval
        if ("A06".equals(linkCode)) {
            return new Seed(null, null, null, false, false);
        }
        // A09는 고른 매매내역이 없어도 열린다("선택된 매매내역이 없습니다. 매매내역 없이 진행하시겠습니까?" → 예) — 거래내역 없음(O)으로 쓴다
        List<Long> ids = ids(args, !"A09".equals(linkCode));
        return switch (linkCode) {
            case "A09" -> realTr(user, ids, args);
            case "B05" -> accountOpen(user, ids, args);
            default -> accountClose(user, ids);
        };
    }

    // ───── A09 자기매매 실거래 보고 ─────
    private Seed realTr(UserPrincipal user, List<Long> ids, Map<String, String> args) {
        LocalDate closeDate = date(args, "closeDate");
        String periodString = args.get("periodString");
        Long companyId = user.getCompanyId();

        // gridList1: 고른 거래, 거래일 순(`flt10List.sort(Comparator.comparing(getTrDate))` — 안정 정렬이라 같은 날은 고른 순서)
        Map<Long, RealTrRes> byId = new java.util.HashMap<>();
        if (!ids.isEmpty()) {
            for (RealTrRes r : trMapper.selectRealTrsByIds(companyId, user.getUserId(), closeDate.toString(), ids)) {
                byId.put(r.trId(), r);
            }
        }
        List<RealTrRes> trList = new ArrayList<>();
        for (Long id : ids) {
            RealTrRes r = byId.get(id);
            if (r == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "매매내역을 찾을 수 없습니다.");
            }
            trList.add(r);
        }
        trList.sort(java.util.Comparator.comparing(RealTrRes::trDate, java.util.Comparator.nullsFirst(java.util.Comparator.naturalOrder())));

        // gridList2: 기준일 보유내역(flt11_book.selectByDate), familyAcoountYn: 가족계좌가 있으면 "true"(flt03_account.getFamilyAccount 상태 1)
        List<LinkBookRes> bookList = bookMapper.selectLinkBooks(companyId, user.getUserId(), closeDate.toString());
        boolean family = accountMapper.countFamilyAccount(companyId, user.getUserId()) > 0;
        CompanyStdRes std = companyStdMapper.selectByDate(companyId, closeDate.toString());
        if (std == null) {
            // 원본은 결과가 없으면 본문을 비워 둔다(checkContent(null)이 아닌 linkHtmlContent 없음) — 문서분류 대표 양식으로 대신한다
            return new Seed(title("개인별 매매 및 보유내역 신고서(" + closeDate.getYear() + "년 " + periodString + ") / ", user), null, closeDate, true, false);
        }
        String content = realTrHtml(user, bookList, trList, family, std.apprValidDays(), "true".equals(std.trFileEvidYn()), closeDate, periodString);
        return new Seed(title("개인별 매매 및 보유내역 신고서(" + closeDate.getYear() + "년 " + periodString + ") / ", user), content, closeDate, true, false);
    }

    // ───── B05 계좌개설 신고 ─────
    private Seed accountOpen(UserPrincipal user, List<Long> ids, Map<String, String> args) {
        String checkCycle = args.get("checkCycle");
        if (checkCycle == null || checkCycle.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "보고주기를 먼저 입력해주세요");
        }
        // setupDate·regReason은 고른 행 중 첫 행(`grid.getSelectionModel().getSelectedItem()`)의 값
        AccountRes first = accountMapper.selectById(ids.get(0));
        if (first == null || !user.getCompanyId().equals(first.companyId()) || !user.getUserId().equals(first.personId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "계좌 정보를 찾을 수 없습니다.");
        }
        List<LinkBookInitRes> bookInitList = accountMapper.selectBookInitInfo(user.getCompanyId(), user.getUserId(), ids);
        if (bookInitList.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "계좌 정보를 찾을 수 없습니다.");
        }
        LocalDate setupDate = first.setupDate() == null ? null : LocalDate.parse(first.setupDate());
        String content = accountOpenHtml(orgName(user), user.getName(), checkCycle, first.regReason(), setupDate, bookInitList);
        return new Seed(title("금융투자상품 계좌개설 신고서 / ", user), content, null, true, false);
    }

    // ───── B06 계좌폐쇄 신고 ─────
    private Seed accountClose(UserPrincipal user, List<Long> ids) {
        Map<Long, AccountCloseRes> byId = new java.util.HashMap<>();
        for (AccountCloseRes r : accountMapper.selectCloseByPersonId(user.getCompanyId(), user.getUserId())) {
            byId.put(r.accountCloseId(), r);
        }
        List<AccountCloseRes> list = new ArrayList<>();
        for (Long id : ids) {
            AccountCloseRes r = byId.get(id);
            if (r == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "폐쇄 계좌 정보를 찾을 수 없습니다.");
            }
            list.add(r);
        }
        return new Seed(title("임직원자기매매 계좌폐쇄 신고서 / ", user), accountCloseHtml(list), null, true, false);
    }

    // ───── 공통 ─────
    /** `접두어 + 사원명 + " " + 직급` (직급이 없으면 자바처럼 "null") */
    private String title(String prefix, UserPrincipal user) {
        HrLinkUserRow u = hrMapper.selectUserInfo(user.getUserId());
        return prefix + user.getName() + " " + (u == null ? null : u.posName());
    }

    private String orgName(UserPrincipal user) {
        Long orgCodeId = newMapper.selectOrgCodeId(user.getUserId());
        return orgCodeId == null ? null : newMapper.selectOrgName(orgCodeId);
    }

    private static List<Long> ids(Map<String, String> args, boolean required) {
        String v = args.get("ids");
        List<Long> list = new ArrayList<>();
        if (v == null || v.isBlank()) {
            if (required) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "상신할 행이 없습니다.");
            }
            return list;
        }
        try {
            for (String s : v.split(",")) {
                if (!s.isBlank()) {
                    list.add(Long.valueOf(s.trim()));
                }
            }
        } catch (NumberFormatException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "행 번호 형식이 올바르지 않습니다.", e);
        }
        if (list.isEmpty() && required) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신할 행이 없습니다.");
        }
        return list;
    }

    private static LocalDate date(Map<String, String> args, String key) {
        try {
            return LocalDate.parse(args.get(key));
        } catch (DateTimeParseException | NullPointerException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일자 정보가 올바르지 않습니다: " + key, e);
        }
    }

    // ───── HTML (client/htmlData) — 원본 문자열 그대로. unit = td 너비 % 곱(TrRealHtmlData·AccountHtmlData 4, AccountCloseHtmlData 5) ─────
    private static final DecimalFormat NUMBER = new DecimalFormat("#,###", DecimalFormatSymbols.getInstance(Locale.US));
    private static final DecimalFormat DOUBLE = new DecimalFormat("#,###.######", DecimalFormatSymbols.getInstance(Locale.US));
    private static final String HEIGHT = "25";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";
    private static final String BG = "#EAEFF4";

    private static String tableStart() {
        return "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    }

    /** tdStrongCreate / (AccountHtmlData의) 배경색 있는 tdStCreate */
    private static String tdStrong(int unit, int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; background-color:" + bg + "; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * unit) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdStNone(int unit, int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * unit) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    /** AccountHtmlData.tdNone — 굵지 않은 글자, 테두리 없음 */
    private static String tdNone(int unit, int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * unit) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdCreate(int unit, int colspan, int rowspan, int border, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * unit) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    /** 배경색 없는 tdStCreate(굵은 `<b>`) */
    private static String tdSt(int unit, int colspan, int rowspan, int border, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; text-align:"
                + align + "; height:" + HEIGHT + "px; width:" + (colspan * unit) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\"><b>" + text + "</b></span></td>";
    }

    private static String tdEmpty(int unit, int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:" + HEIGHT + "px; width:" + (colspan * unit) + "%;\">"
                + "<span></span></td>";
    }

    private static String emptyRow(int unit, int colspan) {
        return TR_START + tdEmpty(unit, colspan, 1, 0) + TR_CLOSE;
    }

    private static String checkNull(String text) {
        if (text == null || "undefined".equals(text) || "null".equals(text)) {
            return " ";
        }
        return "&nbsp;" + text + "&nbsp;";
    }

    private static String checkLongNull(Long num) {
        return num == null ? "- " : "&nbsp;" + NUMBER.format(num) + "&nbsp;";
    }

    private static String checkDoubleNull(Double num) {
        return num == null ? "- " : "&nbsp;" + DOUBLE.format(num) + "&nbsp;";
    }

    private static String firstRow(int unit, int cells) {
        StringBuilder sb = new StringBuilder(TR_START);
        for (int i = 0; i < cells; i++) {
            sb.append(tdEmpty(unit, 1, 1, 0));
        }
        return sb.append(TR_CLOSE).toString();
    }

    /** TrRealHtmlData.getHtmlContent */
    String realTrHtml(UserPrincipal user, List<LinkBookRes> bookList, List<RealTrRes> trList, boolean family,
                      Long apprValidDays, boolean trFileEvid, LocalDate closeDate, String periodString) {
        final int u = 4;
        String space = "&nbsp;&nbsp;&nbsp;&nbsp;";
        StringBuilder t = new StringBuilder(tableStart()).append("<tbody>");
        t.append(firstRow(u, 24));
        t.append(TR_START).append(tdEmpty(u, 1, 1, 0))
                .append(tdStNone(u, 22, 2, "center", 20, "&nbsp;&nbsp;개인별 매매 및 보유내역 신고서 (" + closeDate.getYear() + "년 " + periodString + ")"))
                .append(tdEmpty(u, 1, 1, 0)).append(TR_CLOSE);
        t.append(emptyRow(u, 24)).append(emptyRow(u, 24));
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 13, "본인은 자본시장법 및 내부통제기준에 의거 아래와 같이 자기계좌(가족계좌)의 개인투자행위 현황을 신고하며")).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 13, "신고한 매매내역과 관련하여 일체의 불공정 매매가 없음을 확인합니다.")).append(TR_CLOSE);
        t.append(emptyRow(u, 24));
        t.append(TR_START).append(tdSt(u, 12, 1, 0, "left", 14, "1. 신고인 인적사항")).append(tdEmpty(u, 12, 1, 0)).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdStrong(u, 6, 1, 1, "center", 13, "본 부", BG))
                .append(tdCreate(u, 6, 1, 1, "center", 13, checkNull(orgName(user))))
                .append(tdStrong(u, 6, 1, 1, "center", 13, "성  명", BG))
                .append(tdCreate(u, 6, 1, 1, "center", 13, checkNull(user.getName())))
                .append(TR_CLOSE);
        t.append(emptyRow(u, 24));
        t.append(TR_START).append(tdSt(u, 12, 1, 0, "left", 14, "2. 보유내역 (신고월말 기준)")).append(tdEmpty(u, 12, 1, 0)).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdStrong(u, 6, 1, 1, "center", 13, "계좌번호", BG))
                .append(tdStrong(u, 2, 1, 1, "center", 13, "관계", BG))
                .append(tdStrong(u, 6, 1, 1, "center", 13, "보유종목", BG))
                .append(tdStrong(u, 3, 1, 1, "center", 13, "수량", BG))
                .append(tdStrong(u, 3, 1, 1, "center", 13, "평가금액", BG))
                .append(tdStrong(u, 4, 1, 1, "center", 13, "종목유형", BG))
                .append(TR_CLOSE);
        if (bookList.isEmpty()) {
            t.append(TR_START)
                    .append(tdCreate(u, 6, 1, 1, "center", 12, "- ")).append(tdCreate(u, 2, 1, 1, "center", 12, "- "))
                    .append(tdCreate(u, 6, 1, 1, "center", 12, "- ")).append(tdCreate(u, 3, 1, 1, "center", 12, "- "))
                    .append(tdCreate(u, 3, 1, 1, "center", 12, "- ")).append(tdCreate(u, 4, 1, 1, "center", 12, "- "))
                    .append(TR_CLOSE);
        } else {
            for (LinkBookRes b : bookList) {
                t.append(TR_START)
                        .append(tdCreate(u, 6, 1, 1, "left", 12, checkNull(Html.esc(b.accountNo()))))
                        .append(tdCreate(u, 2, 1, 1, "center", 12, checkNull(Html.esc(b.accountRelateName()))))
                        .append(tdCreate(u, 6, 1, 1, "left", 12, checkNull(Html.esc(b.itemName()))))
                        .append(tdCreate(u, 3, 1, 1, "right", 12, checkDoubleNull(b.bookQty())))
                        .append(tdCreate(u, 3, 1, 1, "right", 12, checkLongNull(b.bookAmt())))
                        .append(tdCreate(u, 4, 1, 1, "left", 12, checkNull(Html.esc(b.itemTypeName()))))
                        .append(TR_CLOSE);
            }
        }
        String bookCheckYn = bookList.isEmpty() ? "O" : " ";
        String trCheckYn = trList.isEmpty() ? "O" : " ";
        String familyYn = family ? " " : "O";
        String ment1 = trFileEvid ? "※ 첨부: 잔고내역 증빙, 거래내역 증빙자료" : "※ 첨부: 잔고내역 증빙, 거래내역 증빙자료(거래내역 없으면 불필요)";
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 13, "본인은 개인적으로 보유하고 있는 신고대상 금융투자상품(타사펀드/ETF 제외)이 없음 (" + bookCheckYn + ")")).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 13, "본인은 배우자 및 미성년 자녀 명의의 계좌가 없음 (" + familyYn + ")")).append(TR_CLOSE);
        t.append(emptyRow(u, 24));
        t.append(TR_START).append(tdSt(u, 12, 1, 0, "left", 14, "3. 거래내역 (신고기간중)")).append(tdEmpty(u, 12, 1, 0)).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 13, "본인은 해당기간 동안 거래내역이 없음 (" + trCheckYn + ")")).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 13, "본인은 배우자 및 미성년 자녀는 해당기간 동안 거래내역이 없음 (" + trCheckYn + ")")).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 13, ment1)).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdStrong(u, 5, 1, 1, "center", 13, "계좌번호", BG))
                .append(tdStrong(u, 3, 1, 1, "center", 13, "거래일", BG))
                .append(tdStrong(u, 4, 1, 1, "center", 13, "종목명", BG))
                .append(tdStrong(u, 2, 1, 1, "center", 13, "구분", BG))
                .append(tdStrong(u, 2, 1, 1, "center", 13, "수량", BG))
                .append(tdStrong(u, 2, 1, 1, "center", 13, "금액", BG))
                .append(tdStrong(u, 4, 1, 1, "center", 13, "종목유형", BG))
                .append(tdStrong(u, 2, 1, 1, "center", 13, "비고", BG))
                .append(TR_CLOSE);
        if (trList.isEmpty()) {
            t.append(TR_START)
                    .append(tdCreate(u, 5, 1, 1, "center", 12, "- ")).append(tdCreate(u, 3, 1, 1, "center", 12, "- "))
                    .append(tdCreate(u, 4, 1, 1, "center", 12, "- ")).append(tdCreate(u, 2, 1, 1, "center", 12, "- "))
                    .append(tdCreate(u, 2, 1, 1, "center", 12, "- ")).append(tdCreate(u, 2, 1, 1, "center", 12, "- "))
                    .append(tdCreate(u, 4, 1, 1, "center", 12, "- ")).append(tdCreate(u, 2, 1, 1, "center", 12, "- "))
                    .append(TR_CLOSE);
        } else {
            for (RealTrRes r : trList) {
                t.append(TR_START)
                        .append(tdCreate(u, 5, 1, 1, "left", 12, checkNull(Html.esc(r.accountNo()))))
                        .append(tdCreate(u, 3, 1, 1, "center", 12, r.trDate() == null ? "" : Html.esc(r.trDate())))
                        .append(tdCreate(u, 4, 1, 1, "left", 12, checkNull(Html.esc(r.trItemName()))))
                        .append(tdCreate(u, 2, 1, 1, "center", 12, checkNull(Html.esc(r.trTypeName()))))
                        .append(tdCreate(u, 2, 1, 1, "right", 12, checkDoubleNull(r.trQty())))
                        .append(tdCreate(u, 2, 1, 1, "right", 12, checkLongNull(r.trAmt())))
                        .append(tdCreate(u, 4, 1, 1, "left", 12, checkNull(Html.esc(r.trItemTypeName()))))
                        .append(tdCreate(u, 2, 1, 1, "left", 12, checkNull(Html.esc(r.trNote()))))
                        .append(TR_CLOSE);
            }
        }
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 12,
                "&nbsp;* 승인 후 매매주문은 " + apprValidDays + "영업일(승인일 포함)이내에 이루어져야 하고 " + apprValidDays
                        + "영업일을 초과한 경우에는 다시 승인서를 제출하여 승인을<br>&nbsp;&nbsp;&nbsp;받아야 함")).append(TR_CLOSE);
        t.append(emptyRow(u, 24)).append(emptyRow(u, 24));
        LocalDate today = newMapper.selectToday();
        t.append(TR_START).append(tdEmpty(u, 12, 1, 0)).append(tdCreate(u, 11, 1, 0, "right", 13, today.format(KOR_DATE))).append(tdEmpty(u, 1, 1, 0)).append(TR_CLOSE);
        t.append(emptyRow(u, 24));
        t.append(TR_START).append(tdEmpty(u, 12, 1, 0)).append(tdCreate(u, 11, 1, 0, "right", 13, "임직원명(제출자): " + user.getName() + " (전자서명)")).append(tdEmpty(u, 1, 1, 0)).append(TR_CLOSE);
        t.append(emptyRow(u, 24)).append(emptyRow(u, 24));
        t.append(TR_START).append(tdSt(u, 12, 1, 0, "left", 12, "<주의 사항>")).append(tdEmpty(u, 12, 1, 0)).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 12, space + "➀ 운용부서 임직원은 월별, 매월 말일을 기준으로 다음달 말일까지 신고하며, 운용부서")).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 12, space + space + "외의 임직원(가족계좌 포함) 분기종료일을 기준으로 다음달 말일까지  신고")).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 12, space + "➁ 거래내역이 없는 경우 신청내용에 거래내역 없음으로 기재하여 제출")).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 24, 1, 0, "left", 12, space + "③ 본 보고서의 보유내역은 매매일 기준으로 작성됨")).append(TR_CLOSE);
        t.append(emptyRow(u, 24));
        return t.append("</tbody></table>").toString();
    }

    /** AccountHtmlData.getHtmlContent */
    String accountOpenHtml(String orgName, String userName, String checkCycle, String regReason, LocalDate setupDate,
                           List<LinkBookInitRes> bookInitList) {
        final int u = 4;
        StringBuilder t = new StringBuilder(tableStart()).append("<tbody>");
        t.append(firstRow(u, 24));
        t.append(TR_START).append(tdEmpty(u, 5, 1, 0)).append(tdStNone(u, 14, 1, "center", 20, "자기매매 계좌 및 보유내역 신고서")).append(tdEmpty(u, 5, 1, 0)).append(TR_CLOSE);
        t.append(emptyRow(u, 24));
        t.append(TR_START).append(tdNone(u, 24, 1, "left", 12, "「임직원의 금융투자상품 개인투자규정」에 따라 본인 계산의 지분증권등의 매매를 위한 매매계좌 및 보유내역을 아래와 같이 신고합니다.")).append(TR_CLOSE);
        t.append(emptyRow(u, 24));
        t.append(TR_START).append(tdSt(u, 14, 1, 0, "left", 14, "1. 신고자")).append(tdEmpty(u, 10, 1, 0)).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdStrong(u, 4, 1, 1, "center", 12, "성 명", BG))
                .append(tdCreate(u, 8, 1, 1, "center", 12, checkNull(userName)))
                .append(tdStrong(u, 4, 1, 1, "center", 12, "소속", BG))
                .append(tdCreate(u, 8, 1, 1, "center", 12, checkNull(orgName)))
                .append(TR_CLOSE);
        t.append(TR_START).append(tdStrong(u, 4, 1, 1, "center", 12, "구분", BG));
        t.append("2".equals(checkCycle)
                ? tdCreate(u, 8, 1, 1, "center", 12, "월별 점검대상자 (O)<br>분기별 점검대상자 ( )")
                : tdCreate(u, 8, 1, 1, "center", 12, "월별 점검대상자 ( )<br>분기별 점검대상자 (O)"));
        t.append(tdStrong(u, 4, 1, 1, "center", 12, "신고사유", BG));
        t.append("1".equals(regReason)
                ? tdCreate(u, 8, 1, 1, "center", 12, "신규 입사 (O)<br>계좌 개설 ( )")
                : tdCreate(u, 8, 1, 1, "center", 12, "신규 입사 ( )<br>계좌 개설 (O)"));
        t.append(TR_CLOSE);
        t.append(emptyRow(u, 24));
        t.append(TR_START).append(tdSt(u, 24, 1, 0, "left", 14,
                "2. 신고일자 (입사일, 계좌 개설일) : " + checkNull(setupDate == null ? null : setupDate.format(KOR_DATE)))).append(TR_CLOSE);
        t.append(emptyRow(u, 24));
        t.append(TR_START).append(tdSt(u, 24, 1, 0, "left", 14, "3. 자기매매 계좌 및 보유내역")).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdStrong(u, 2, 1, 1, "center", 12, "관계", BG))
                .append(tdStrong(u, 2, 1, 1, "center", 12, "계좌명의", BG))
                .append(tdStrong(u, 3, 1, 1, "center", 12, "거래 증권회사", BG))
                .append(tdStrong(u, 5, 1, 1, "center", 12, "계좌번호", BG))
                .append(tdStrong(u, 5, 1, 1, "center", 12, "종목명", BG))
                .append(tdStrong(u, 3, 1, 1, "center", 12, "수량", BG))
                .append(tdStrong(u, 4, 1, 1, "center", 12, "비고", BG))
                .append(TR_CLOSE);
        for (LinkBookInitRes b : bookInitList) {
            t.append(TR_START)
                    .append(tdCreate(u, 2, 1, 1, "center", 12, checkNull(Html.esc(b.accountRelateName()))))
                    .append(tdCreate(u, 2, 1, 1, "center", 12, checkNull(Html.esc(b.accountName()))))
                    .append(tdCreate(u, 3, 1, 1, "left", 12, checkNull(Html.esc(b.accountBankName()))))
                    .append(tdCreate(u, 5, 1, 1, "left", 12, checkNull(Html.esc(b.accountNo()))))
                    .append(tdCreate(u, 5, 1, 1, "center", 12, checkNull(Html.esc(b.itemName()))))
                    .append(tdCreate(u, 3, 1, 1, "center", 12, checkDoubleNull(b.bookQty())))
                    .append(tdCreate(u, 4, 1, 1, "left", 12, checkNull(Html.esc(b.accountNote()))))
                    .append(TR_CLOSE);
        }
        t.append(TR_START).append(tdCreate(u, 20, 1, 0, "left", 12, "□ 상기 신고자는 자기계산으로 보유하고 있는 모든 내역을 신고하였습니다.")).append(TR_CLOSE);
        t.append(emptyRow(u, 20));
        t.append(TR_START).append(tdCreate(u, 20, 1, 0, "left", 12, "※ 자기매매 계좌 범위 : 자기의 계산으로 매매가 이루어지는 모든 계좌")).append(TR_CLOSE);
        t.append(TR_START).append(tdCreate(u, 20, 1, 0, "left", 12, "※ 첨부 : 증권회사 제공 계좌 및 보유내역 증빙자료(HTS 화면출력 가능)")).append(TR_CLOSE);
        t.append(emptyRow(u, 20)).append(emptyRow(u, 20));
        return t.append("</tbody></table>").toString();
    }

    /** AccountCloseHtmlData.getHtmlContent */
    String accountCloseHtml(List<AccountCloseRes> list) {
        final int u = 5;
        StringBuilder t = new StringBuilder(tableStart()).append("<tbody>");
        t.append(firstRow(u, 20));
        t.append(TR_START).append(tdEmpty(u, 5, 1, 0)).append(tdStNone(u, 10, 2, "center", 20, "임직원자기매매 계좌폐쇄 신고서")).append(tdEmpty(u, 5, 1, 0)).append(TR_CLOSE);
        t.append(emptyRow(u, 20)).append(emptyRow(u, 20));
        t.append(TR_START).append(tdSt(u, 20, 1, 0, "center", 14, "다음과 같이 계좌 폐쇄를 신고합니다.")).append(TR_CLOSE);
        t.append(emptyRow(u, 20));
        t.append(TR_START)
                .append(tdStrong(u, 4, 1, 1, "center", 14, "폐쇄일", BG))
                .append(tdStrong(u, 4, 1, 1, "center", 14, "개설기관", BG))
                .append(tdStrong(u, 5, 1, 1, "center", 14, "계좌번호", BG))
                .append(tdStrong(u, 3, 1, 1, "center", 14, "관계", BG))
                .append(tdStrong(u, 4, 1, 1, "center", 14, "계좌명의", BG))
                .append(TR_CLOSE);
        for (AccountCloseRes r : list) {
            t.append(TR_START)
                    .append(tdCreate(u, 4, 1, 1, "center", 14, checkNull(Html.esc(r.closeDate()))))
                    .append(tdCreate(u, 4, 1, 1, "left", 14, checkNull(Html.esc(r.corpName()))))
                    .append(tdCreate(u, 5, 1, 1, "left", 14, checkNull(Html.esc(r.accountNoDec()))))
                    .append(tdCreate(u, 3, 1, 1, "left", 14, checkNull(Html.esc(r.familyRelateName()))))
                    .append(tdCreate(u, 4, 1, 1, "center", 14, checkNull(Html.esc(r.accountName()))))
                    .append(TR_CLOSE);
        }
        t.append(emptyRow(u, 20));
        return t.append("</tbody></table>").toString();
    }
}

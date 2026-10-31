package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateApprRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpRelateApprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A43 여비교통비 관리 (Apr01_Edit_ApprDoc.insertLinkApprovals L3329-3354, 본문 TransportMngListHtmlData.getHtmlContent,
 * 연관문서 자동등록 Apr03_Page_Relate.insertRelateApprList L517-552).
 * 제목 `yy년도 MM월분 직원경비 내역 (여비교통비)`(고칠 수 있음), 시행일자 = 기준월 말일.
 * args.yyyymm = 기준년월(yyyy.MM, 호출 화면의 년도·월 칸), args.accountName = 계정과목 이름(호출 화면이 act.Act13_RealAccountMap.getAccountName으로 읽은 값).
 * 그리드 행(AS-IS gridList)은 서버가 같은 질의(emp51_relate_appr.selectByCompanyId)로 다시 읽는다.
 */
@Component
@RequiredArgsConstructor
public class TransportMngLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final DateTimeFormatter DOT = DateTimeFormatter.ofPattern("yyyy.MM.dd");
    private static final DateTimeFormatter TITLE_YM = DateTimeFormatter.ofPattern("yy년도 MM월분");

    private final EmpRelateApprMapper mapper;
    private final AprApprNewMapper newMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A43");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String yyyymm = args.get("yyyymm");
        YearMonth ym;
        try {
            ym = YearMonth.parse(yyyymm == null ? "" : yyyymm.trim().replace('.', '-'));
        } catch (DateTimeParseException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년월 정보가 없습니다.");
        }
        List<RelateApprRes> list = mapper.selectByCompanyId(user.getCompanyId(), yyyymm.trim());
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신할 내용이 없습니다.");
        }
        LocalDate std = ym.atDay(1);
        LocalDate close = ym.atEndOfMonth();
        long total = 0;
        for (RelateApprRes m : list) {
            total += m.regAmt() == null ? 0 : m.regAmt();
        }
        String title = std.format(TITLE_YM) + " 직원경비 내역 (여비교통비)";
        String content = contents(list, total, args.getOrDefault("accountName", ""), orgName(user), std, close);

        // insertRelateApprList: 신청번호(숫자) 순으로 연관문서 탭에 넣는다
        List<RelateApprRes> sorted = new ArrayList<>(list);
        sorted.sort(Comparator.comparingInt(m -> Integer.parseInt(m.regNo())));
        List<AprLinkRelateApprRes> relates = new ArrayList<>();
        for (RelateApprRes m : sorted) {
            relates.add(new AprLinkRelateApprRes(m.apprId(), m.regDate(), m.apprTitle(), m.inoutCode()));
        }
        return new Seed(title, content, close, false, false).withRelateApprs(relates);
    }

    private String orgName(UserPrincipal user) {
        Long orgCodeId = newMapper.selectOrgCodeId(user.getUserId());
        return orgCodeId == null ? "" : newMapper.selectOrgName(orgCodeId);
    }

    // ───── TransportMngListHtmlData ─────

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
        return num == null ? "- " : String.format("%,d", num);
    }

    static String contents(List<RelateApprRes> list, long total, String accountName, String orgName, LocalDate std, LocalDate close) {
        StringBuilder t = new StringBuilder();
        t.append(TABLE_START).append("<tbody>")
                .append("<tr>").append(tdStNoneStrong(100, 1, "center", 25, "지 출 결 의 서")).append("</tr>")
                .append("<tr>").append(tdEmpty(100, 1, 0)).append("</tr>")
                .append("<tr>").append(tdEmpty(100, 1, 0)).append("</tr>")
                .append("<tr>").append(tdStNone(100, 1, "left", 13, "1. 발생부서 : " + orgName)).append("</tr>")
                .append("<tr>").append(tdStNone(100, 1, "left", 13, "2. 계정과목 : " + accountName)).append("</tr>")
                .append("<tr>").append(tdStNone(100, 1, "left", 13, "3. 일 &nbsp;&nbsp;&nbsp;&nbsp; 금 : " + checkLongNull(total) + "원")).append("</tr>")
                .append("<tr>").append(tdStNone(100, 1, "left", 13, "4. 발생일자 : " + std.format(DOT) + " ~ " + close.format(DOT))).append("</tr>")
                .append("<tr>").append(tdStNone(100, 1, "left", 13, "5. 지출일자 :&nbsp;")).append("</tr>")
                .append("<tr>").append(tdStNone(100, 1, "left", 13, "6. 내 &nbsp;&nbsp;&nbsp;&nbsp; 역 : " + std.format(DateTimeFormatter.ofPattern("yyyy년도")) + " "
                        + std.format(DateTimeFormatter.ofPattern("MM월분 여비교통비 지급")))).append("</tr>")
                .append("<tr>")
                .append(tdEmpty(5, 1, 0))
                .append(tdStColor(12, 1, 1, "center", 13, "신청번호", "#EAEFF4"))
                .append(tdStColor(24, 1, 1, "center", 13, "부서", "#EAEFF4"))
                .append(tdStColor(16, 1, 1, "center", 13, "직위", "#EAEFF4"))
                .append(tdStColor(16, 1, 1, "center", 13, "성명", "#EAEFF4"))
                .append(tdStColor(18, 1, 1, "center", 13, "여비교통비", "#EAEFF4"))
                .append(tdEmpty(5, 1, 0))
                .append("</tr>");
        for (RelateApprRes m : list) {
            t.append("<tr>")
                    .append(tdEmpty(5, 1, 0))
                    .append(tdColor(12, 1, 1, "center", 13, checkNull(m.regNo()), "none"))
                    .append(tdColor(24, 1, 1, "left", 13, "&nbsp;" + checkNull(m.orgName()), "none"))
                    .append(tdColor(16, 1, 1, "center", 13, checkNull(m.posName()), "none"))
                    .append(tdColor(16, 1, 1, "center", 13, checkNull(m.personName()), "none"))
                    .append(tdColor(18, 1, 1, "right", 13, checkLongNull(m.regAmt()) + "&nbsp;", "none"))
                    .append(tdEmpty(5, 1, 0))
                    .append("</tr>");
        }
        t.append("<tr>")
                .append(tdEmpty(5, 1, 0))
                .append(tdColor(68, 1, 1, "center", 13, "합 계&nbsp;", "none"))
                .append(tdColor(18, 1, 1, "right", 13, checkLongNull(total) + "&nbsp;", "none"))
                .append(tdEmpty(5, 1, 0))
                .append("</tr><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr>").append(tdEmpty(5, 1, 0)).append(tdStNone(95, 1, "left", 13, "# 상세내역은 연관문서 참조"))
                .append("</tr>");
        return t.append("</tbody></table>").toString();
    }
}

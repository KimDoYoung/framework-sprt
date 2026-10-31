package kr.co.kfs.asseterp.biz.apr.service.link;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.UnLeaveLinkRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprEmpLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A15 미사용 연차·월차 휴가 사용 시기 지정통보서 (Apr01_Edit_ApprDoc.insertLinkApproval L1925-1966,
 * 본문 Emp21_UnLeave.getHtmlContent02_1/02_2 → UnLeaveHtmlData). 호출 화면 Emp21_Tab_PersonList(Y03)의 그리드 행을 서버가 다시 읽는다.
 * refId = 미사용휴가 ID, args.stdYear = 화면의 해당 연도(기간 계산에 쓴다). 구분 01은 연차, 그 밖은 월차.
 */
@Component
@RequiredArgsConstructor
public class UnLeaveLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_KOR = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

    private final AprEmpLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A15");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String stdYear = args.get("stdYear");
        if (refId == null || stdYear == null || stdYear.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "미사용휴가 정보가 없습니다.");
        }
        UnLeaveLinkRow row = mapper.selectUnLeaveLink(user.getCompanyId(), refId, stdYear.trim());
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "미사용휴가 정보를 찾을 수 없습니다.");
        }
        if (row.dutyRt() == null || row.totalDays() == null || row.useDays() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "발생휴가·사용휴가·의무사용 비율이 없어 통보서를 만들 수 없습니다.");
        }
        // 구분 01 = 연차, 그 밖 = 월차 (AS-IS 제목은 "연차유급휴가"/"월차유급휴가" 뒤에 " 사용 시기 지정통보서_사원_구분명")
        String kind = "01".equals(row.unLeaveCode()) ? "연차" : "월차";
        String title = "미사용 " + kind + "유급휴가 사용 시기 지정통보서_" + row.personName() + "_" + row.unLeaveName();
        return new Seed(title, contents(row, kind, LocalDate.now()), null, false, false);
    }

    // ───── UnLeaveHtmlData.getHtmlContent02_1 / 02_2 (두 양식은 연차/월차 낱말만 다르다) ─────

    static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:1px; width:" + (colspan * 3.3) + "%;\">"
                + "<span></span></td>";
    }

    static String checkNull(String text) {
        return text == null || "undefined".equals(text) || "null".equals(text) ? " " : text;
    }

    static String checkDoubleNull(Double num) {
        return num == null ? "- " : new DecimalFormat("###,###,###.##").format(num);
    }

    private static String period(LocalDate start, LocalDate close) {
        return start.format(DATE) + "부터<br>" + close.format(DATE);
    }

    private static String monthRow(String month) {
        return "<tr>" + tdEmpty(1, 1, 0)
                + tdColor(4, 1, 1, "center", 12, month, "none")
                + tdColor(11, 1, 1, "center", 12, "", "none")
                + tdColor(3, 1, 1, "right", 12, "일", "none")
                + tdEmpty(1, 1, 0) + "</tr>";
    }

    static String contents(UnLeaveLinkRow m, String kind, LocalDate today) {
        double must = m.totalDays() * (m.dutyRt() * 0.01);
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody><tr>");
        for (int i = 0; i < 20; i++) {
            t.append(tdEmpty(1, 1, 0));
        }
        t.append("</tr><tr>").append(tdStColor(20, 1, 0, "center", 20, "미사용 " + kind + "유급휴가 사용 시기 지정통보서", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20, 1, 0))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0))
                .append(tdStColor(3, 1, 1, "center", 12, "성 명", "#EAEFF4"))
                .append(tdColor(3, 1, 1, "center", 12, checkNull(m.personName()), "none"))
                .append(tdStColor(3, 1, 1, "center", 12, "소 속", "#EAEFF4"))
                .append(tdColor(3, 1, 1, "center", 12, checkNull(m.orgName()), "none"))
                .append(tdStColor(3, 1, 1, "center", 12, "입사일자", "#EAEFF4"))
                .append(tdColor(3, 1, 1, "center", 12, m.hireDate().format(DATE), "none"))
                .append(tdEmpty(1, 1, 0))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0))
                .append(tdStColor(19, 1, 0, "left", 12, m.noticeDate().format(DATE) + " 통지받은 \" 미사용 " + kind + "유급휴가일수\" 및 \"휴가사용 시기지정 통보 촉구\"에", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0))
                .append(tdStColor(19, 1, 0, "left", 12, "의거하여 아래와 같이 본인의 미사용 " + kind + " 유급휴가 사용 시기를 지정하여 통보드립니다.", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20, 1, 0))
                .append("</tr><tr>").append(tdStColor(20, 1, 0, "center", 12, "- 아 래 -", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0))
                .append(tdStColor(19, 1, 0, "left", 12, "1. 통지받은 내역", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0))
                .append(tdStColor(4, 1, 1, "center", 12, "휴가 발생대상 기간", "#EAEFF4"))
                .append(tdStColor(4, 1, 1, "center", 12, "휴가 사용대상 기간", "#EAEFF4"))
                .append(tdStColor(2, 1, 1, "center", 12, "발생휴가<br>(A)", "#EAEFF4"))
                .append(tdStColor(3, 1, 1, "center", 12, "의무사용" + kind + "<br>(B=A*" + m.dutyRt() + "%)", "#EAEFF4"))
                .append(tdStColor(2, 1, 1, "center", 12, "사용휴가<br>(C)", "#EAEFF4"))
                .append(tdStColor(3, 1, 1, "center", 12, "미사용휴가<br>(B-C)", "#EAEFF4"))
                .append(tdEmpty(1, 1, 0))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0))
                .append(tdColor(4, 2, 1, "center", 12, period(m.leaveOccurStartDate(), m.leaveOccurCloseDate()), "none"))
                .append(tdColor(4, 2, 1, "center", 12, period(m.leaveTargetStartDate(), m.leaveTargetCloseDate()), "none"))
                .append(tdColor(2, 2, 1, "center", 12, checkDoubleNull(m.totalDays()), "none"))
                .append(tdColor(3, 2, 1, "center", 12, checkDoubleNull(must), "none"))
                .append(tdColor(2, 2, 1, "center", 12, checkDoubleNull(m.useDays()), "none"))
                .append(tdColor(3, 2, 1, "center", 12, checkDoubleNull(must - m.useDays()), "none"))
                .append(tdEmpty(1, 1, 0))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0)).append(tdEmpty(1, 1, 0))
                .append("</tr><tr>").append(tdEmpty(20, 1, 0))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0))
                .append(tdStColor(19, 1, 0, "left", 12, "※ 의무사용" + kind + "를 초과하여 발생" + kind + "까지는 모두 사용 가능합니다.", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20, 1, 0))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0))
                .append(tdStColor(19, 1, 0, "left", 12, "2. 미사용 " + kind + "유급휴가 사용 시기 지정 통보내역 (월별 날짜 기재)", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(1, 1, 0))
                .append(tdStColor(4, 1, 1, "center", 12, "해 당 월", "#EAEFF4"))
                .append(tdStColor(11, 1, 1, "center", 12, "사 용 시 기 지 정 일", "#EAEFF4"))
                .append(tdStColor(3, 1, 1, "center", 12, "사 용 일 수", "#EAEFF4"))
                .append(tdEmpty(1, 1, 0)).append("</tr>")
                .append(monthRow(m.month01())).append(monthRow(m.month02())).append(monthRow(m.month03()))
                .append(monthRow(m.month04())).append(monthRow(m.month05())).append(monthRow(m.month06()))
                .append("<tr>").append(tdEmpty(20, 1, 0))
                .append("</tr><tr>").append(tdStColor(20, 1, 0, "center", 16, today.format(DATE_KOR), "#FFFFFF"))
                .append("</tr><tr>").append(tdStColor(20, 1, 0, "center", 20, m.companyName(), "#FFFFFF"))
                .append("</tr></tbody></table>");
        return t.toString();
    }
}

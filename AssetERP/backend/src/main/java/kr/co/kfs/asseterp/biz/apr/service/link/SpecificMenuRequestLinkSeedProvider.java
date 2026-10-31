package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.format.DateTimeFormatter;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRequestRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysSpecificMenuRequestMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A80 특정화면 사용요청 (Apr01_Edit_ApprDoc.insertLinkApproval L2353-2367, 본문 SpecificMenuRequestHtmlData.getHtmlContent).
 * 제목 `특정화면 사용요청_특정업무명_(기준일:yyyy-MM-dd)`(고칠 수 있음, 기준일 = 신청일), [저장] 감춤. refId = 특정화면 사용요청 ID.
 */
@Component
@RequiredArgsConstructor
public class SpecificMenuRequestLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter ISO = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";

    private final SysSpecificMenuRequestMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A80");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        SpecificMenuRequestRes m = refId == null ? null : mapper.selectById(refId);
        if (m == null || !user.getCompanyId().equals(m.companyId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "특정화면 사용요청 내역을 찾을 수 없습니다.");
        }
        String title = "특정화면 사용요청_" + m.specificWorkNm() + "_(기준일:" + (m.regDate() == null ? null : ISO.format(m.regDate())) + ")";
        return new Seed(title, contents(m), null, false, false);
    }

    // ───── SpecificMenuRequestHtmlData — 원본 문자열 그대로 (tdStNone의 닫는 태그 `</strong>` 짝 없음도 그대로) ─────

    private static String tdStNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + (colspan * 5) + "%;\">"
                + "<span></span></td>";
    }

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + (colspan * 5) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:2px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String checkNull(String text) {
        if (text == null || "undefined".equals(text) || "null".equals(text)) {
            return " ";
        }
        return text;
    }

    static String contents(SpecificMenuRequestRes m) {
        String tr = "<tr>" + tdEmpty(20, 1, 0) + "</tr>";
        return TABLE_START + "<tbody>"
                + tr
                + "<tr>" + tdStNone(20, 1, "left", 13, "다음과 같이 Asset-ERP 업무관리자를 지정하고 한국펀드서비스에 변경을 지시하고자 합니다.") + "</tr>"
                + tr + tr
                + "<tr>" + tdStNone(20, 1, "center", 13, "- 다 음 -") + "</tr>"
                + tr + tr
                + "<tr>" + tdStColor(4, 2, 1, "center", 13, "권한구분", "#EAEFF4") + tdStColor(16, 1, 1, "center", 13, "담당자", "#EAEFF4") + "</tr>"
                + "<tr>" + tdStColor(8, 1, 1, "center", 13, "현행", "#EAEFF4") + tdStColor(8, 1, 1, "center", 13, "변경", "#EAEFF4") + "</tr>"
                + "<tr>" + tdColor(4, 1, 1, "center", 13, checkNull(m.specificWorkNm()), "none") + tdColor(8, 1, 1, "left", 13, "", "none") + tdColor(8, 1, 1, "left", 13, "", "none") + "</tr>"
                + tr
                + "</tbody></table>";
    }
}

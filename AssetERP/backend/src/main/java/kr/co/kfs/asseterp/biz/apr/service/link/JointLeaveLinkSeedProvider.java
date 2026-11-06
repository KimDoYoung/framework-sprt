package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpJointLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A24 공동연차관리 (Apr01_Edit_ApprDoc.insertLinkApprovals L3176-3196, 본문 JointLeaveHtmlData.getHtmlContent).
 * 제목 `공동연차 품의서`(고칠 수 있음), 시행일자 오늘. args.ids = 고른 공동연차 ID 쉼표 목록(AS-IS linkParam.gridList).
 */
@Component
@RequiredArgsConstructor
public class JointLeaveLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";

    private final EmpJointLeaveMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A24");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String ids = args.get("ids");
        List<JointLeaveRes> list = new ArrayList<>();
        if (ids != null && !ids.isBlank()) {
            for (String id : ids.split(",")) {
                JointLeaveRes row = mapper.selectById(user.getCompanyId(), Long.valueOf(id.trim()));
                if (row == null) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "공동연차 정보를 찾을 수 없습니다.");
                }
                list.add(row);
            }
        }
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "공동연차 정보를 찾을 수 없습니다.");
        }
        return new Seed("공동연차 품의서", contents(list), null, false, false);
    }

    // ───── JointLeaveHtmlData.getHtmlContent ─────

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + (colspan * 5) + "%;\">"
                + "<span></span></td>";
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.toString();
    }

    static String contents(List<JointLeaveRes> list) {
        StringBuilder t = new StringBuilder();
        t.append(TABLE_START).append("<tbody><tr>");
        for (int i = 0; i < 20; i++) {
            t.append(tdEmpty(1, 1, 0));
        }
        t.append("</tr><tr>")
                .append(tdColor(20, 1, 0, "left", 12, "아래와 같이 품의하오니 검토 후 재가하여 주시기 바랍니다.", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20, 1, 0))
                .append("</tr><tr>").append(tdColor(20, 1, 0, "center", 12, "- 아 래 -", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20, 1, 0))
                .append("</tr><tr>")
                .append(tdColor(3, 1, 1, "center", 14, "시작일", "#EAEFF4"))
                .append(tdColor(3, 1, 1, "center", 14, "종료일", "#EAEFF4"))
                .append(tdColor(14, 1, 1, "center", 14, "사유", "#EAEFF4"))
                .append("</tr>");
        for (JointLeaveRes m : list) {
            t.append("<tr>")
                    .append(tdColor(3, 1, 1, "center", 14, date(m.startDate()), "none"))
                    .append(tdColor(3, 1, 1, "center", 14, date(m.closeDate()), "none"))
                    .append(tdColor(14, 1, 1, "left", 14, m.reason() == null ? "null" : Html.esc(m.reason()), "none"))
                    .append("</tr>");
        }
        return t.append("</tbody></table>").toString();
    }
}

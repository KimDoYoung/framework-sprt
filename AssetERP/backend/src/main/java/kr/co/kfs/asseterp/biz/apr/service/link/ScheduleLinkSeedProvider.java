package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04LinkRow;
import kr.co.kfs.asseterp.biz.sch.mapper.SchListMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A31 데일리체크리스트 (Apr01_Edit_ApprDoc.insertLinkApprovals L3239-3261, 본문 DailyCheckListHtmlData.getHtmlContent).
 * 제목 `일일업무체크 (조직명-사원명)`(고칠 수 있음), 시행일자 오늘, [저장] 감춤. args.ids = 호출 화면 그리드 전체 행의 listId(쉼표, 그리드 순서) —
 * AS-IS는 그리드 모델 목록(linkParam.gridList)을 넘겼고 TOBE는 같은 열을 다시 읽는다. 본문 첫 줄의 날짜는 첫 행의 마감일이다.
 */
@Component
@RequiredArgsConstructor
public class ScheduleLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter DOT_DATE = DateTimeFormatter.ofPattern("yyyy.MM.dd");
    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";

    private final SchListMapper schMapper;
    private final AprApprNewMapper newMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A31");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        List<Long> ids = ids(args.get("ids"));
        List<Sch04LinkRow> found = schMapper.selectLinkRows(user.getCompanyId(), ids);
        List<Sch04LinkRow> rows = new ArrayList<>();
        for (Long id : ids) { // 호출 화면 그리드 순서
            found.stream().filter(r -> id.equals(r.listId())).findFirst().ifPresent(rows::add);
        }
        if (rows.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상신할 체크 내역을 찾을 수 없습니다.");
        }
        Long orgCodeId = newMapper.selectOrgCodeId(user.getUserId());
        String orgName = orgCodeId == null ? null : newMapper.selectOrgName(orgCodeId);
        // 자바 문자열 이음처럼 조직명이 없으면 "null"
        String title = "일일업무체크 (" + orgName + "-" + user.getName() + ")";
        return new Seed(title, contents(rows), null, false, false);
    }

    private static List<Long> ids(String v) {
        List<Long> list = new ArrayList<>();
        if (v != null) {
            try {
                for (String s : v.split(",")) {
                    if (!s.isBlank()) {
                        list.add(Long.valueOf(s.trim()));
                    }
                }
            } catch (NumberFormatException e) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "행 번호 형식이 올바르지 않습니다.", e);
            }
        }
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신할 행이 없습니다.");
        }
        return list;
    }

    // ───── DailyCheckListHtmlData.getHtmlContent — 원본 문자열 그대로 (값이 null이면 자바처럼 "null") ─────

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

    static String contents(List<Sch04LinkRow> list) {
        StringBuilder t = new StringBuilder();
        t.append(TABLE_START).append("<tbody><tr>");
        for (int i = 0; i < 20; i++) {
            t.append(tdEmpty(1, 1, 0));
        }
        t.append("</tr><tr>")
                .append(tdColor(20, 1, 0, "left", 12, DOT_DATE.format(list.get(0).closeDate()) + " 일일업무 체크리스트를 아래와 같이 보고합니다.", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20, 1, 0))
                .append("</tr><tr>").append(tdColor(20, 1, 0, "center", 12, "- 아 래 -", "#FFFFFF"))
                .append("</tr><tr>").append(tdEmpty(20, 1, 0))
                .append("</tr><tr>")
                .append(tdColor(4, 1, 1, "center", 12, "구분", "#EAEFF4"))
                .append(tdColor(9, 1, 1, "center", 12, "체크항목", "#EAEFF4"))
                .append(tdColor(3, 1, 1, "center", 12, "결과", "#EAEFF4"))
                .append(tdColor(4, 1, 1, "center", 12, "체크내용", "#EAEFF4"))
                .append("</tr>");
        for (Sch04LinkRow r : list) {
            t.append("<tr>")
                    .append(tdColor(4, 1, 1, "center", 12, Html.esc(r.className()), "none"))
                    .append(tdColor(9, 1, 1, "left", 12, Html.esc(r.title()), "none"))
                    .append(tdColor(3, 1, 1, "center", 12, Html.esc(r.statusName()), "none"))
                    .append(tdColor(4, 1, 1, "left", 12, Html.esc(r.note()), "none"))
                    .append("</tr>");
        }
        return t.append("</tbody></table>").toString();
    }
}

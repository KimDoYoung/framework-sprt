package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamUserMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A34 미사용ID 권한정지 신청 (Apr01_Edit_ApprDoc.insertLinkApprovals L3262-3282 — 본문 IcamUserIdListHtmlData.getHtmlContent, 호출 Icam55_Tab_UserStopAuthAppr).
 * AS-IS는 화면 그리드의 행 목록을 넘기지만 TOBE는 기준일(args.stdDate = 선택 분기의 마지막 날)·검색어(args.searchText)로 같은 조회를 서버에서 다시 한다.
 * 제목 `ICAM 미사용ID 권한 정지 신청서 (분기 첫날~마지막 날 미접속자)`(고칠 수 있음).
 */
@Component
@RequiredArgsConstructor
public class IcamUserStopLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter YMD = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";

    private final IcamUserMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A34");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        LocalDate close;
        try {
            close = LocalDate.parse(args.getOrDefault("stdDate", ""));
        } catch (DateTimeParseException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일자 정보가 없습니다.", e);
        }
        // getStdDate(): 분기 첫날(1·4·7·10월 1일) ~ 마지막 날
        LocalDate start = LocalDate.of(close.getYear(), ((close.getMonthValue() - 1) / 3) * 3 + 1, 1);
        String text = "%" + args.getOrDefault("searchText", "") + "%";
        List<IcamStopRes> list = mapper.selectStops(text, close, close, "2");
        for (IcamStopRes m : list) {
            if ("10".equals(m.apprStatusCode()) || "20".equals(m.apprStatusCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "결재 중인 문서이거나, 상신올린 문서가 포함되어있습니다.");
            }
        }
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신할 내용이 없습니다. 내용을 확인해주세요.");
        }
        String title = "ICAM 미사용ID 권한 정지 신청서 (" + start.format(YMD) + "~" + close.format(YMD) + " 미접속자)";
        return new Seed(title, html(list, start, close), null, false, false);
    }

    // ───── IcamUserIdListHtmlData ─────

    private static String tdSt(int colspan, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:0px;border-color:black; border-style:solid; border-width:1px; background-color:#FFFFFF; text-align:center; height:15px; width:"
                + (colspan * 3.3) + "%;\"><strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String td(int colspan, int border, String align, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg
                + "; text-align:" + align + "; height:25px; width:" + (colspan * 5) + "%;\"><span style=\"font-size:14px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:0px; height:15px; width:" + (colspan * 5) + "%;\"><span></span></td>";
    }

    /** checkNull — 없거나 "undefined"·"null"이면 공백 한 칸 */
    private static String nz(String text) {
        return (text == null || "undefined".equals(text) || "null".equals(text)) ? " " : text;
    }

    private static String html(List<IcamStopRes> list, LocalDate start, LocalDate close) {
        StringBuilder sb = new StringBuilder(TABLE_START).append("<tbody><tr>");
        for (int i = 0; i < 20; i++) {
            sb.append(tdEmpty(1));
        }
        sb.append("</tr><tr>").append(tdSt(20, 20, "ICAM 미사용 사용자ID 리스트")).append("</tr>");
        sb.append("<tr>").append(tdEmpty(20)).append("</tr>");
        sb.append("<tr>").append(td(20, 0, "center", "(미접속기간 : " + start.format(YMD) + " ~ " + close.format(YMD) + ")", "#FFFFFF")).append("</tr>");
        sb.append("<tr>").append(tdEmpty(20)).append("</tr>");
        sb.append("<tr>");
        for (String h : new String[] {"소속회사", "사용자ID", "사용자명", "이메일", "비고"}) {
            sb.append(td(4, 1, "center", h, "#EAEFF4"));
        }
        sb.append("</tr>");
        for (IcamStopRes m : list) {
            sb.append("<tr>")
                    .append(td(4, 1, "left", nz(Html.esc(m.companyName())), "none"))
                    .append(td(4, 1, "left", nz(Html.esc(m.userId())), "none"))
                    .append(td(4, 1, "left", nz(Html.esc(m.userName())), "none"))
                    .append(td(4, 1, "left", nz(Html.esc(m.email())), "none"))
                    .append(td(4, 1, "left", nz(Html.esc(m.note())), "none"))
                    .append("</tr>");
        }
        return sb.append("</tbody></table>").toString();
    }
}

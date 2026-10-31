package kr.co.kfs.asseterp.biz.apr.service.link;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.mapper.AprEmpLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalAdminRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEvalTargetMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A70 인사평가 수행결과 보고 · A71 인사평가결과 최종보고 (Apr01_Edit_ApprDoc.insertLinkApprovals L3542-3585,
 * 본문 EvalTargetListHtmlData.getHtmlContent / getFinalHtmlContent). 호출 화면 Emp43_Tab_FirstAppr·FinalAppr의 그리드 전체 행
 * (검색어 "%")을 서버가 다시 읽는다. args.stdYear, args.stdTermCode(반기별 회사가 아니면 "10"). 제목은 고칠 수 있고 시행일자는 오늘.
 */
@Component
@RequiredArgsConstructor
public class EvalLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";

    private final EmpEvalTargetMapper evalMapper;
    private final AprEmpLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A70", "A71");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String stdYear = args.get("stdYear");
        String stdTermCode = args.get("stdTermCode");
        if (stdYear == null || stdYear.isBlank() || stdTermCode == null || stdTermCode.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "평가기간 정보가 없습니다.");
        }
        List<EvalAdminRes> list = evalMapper.selectByTextAdmin(user.getCompanyId(), stdYear.trim(), stdTermCode.trim(), "%%", null);
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "인사평가 내역이 없습니다.");
        }
        String head = stdYear.trim() + "년도 " + mapper.selectEvalTermName(user.getCompanyId(), stdTermCode.trim());
        boolean fin = "A71".equals(linkCode);
        String title = head + (fin ? " 인사평가결과 최종보고" : " 인사평가 수행결과 보고");
        return new Seed(title, fin ? finalContents(head, list) : contents(head, list), null, false, false);
    }

    // ───── EvalTargetListHtmlData (원본 마크업 순서 그대로 — 이상한점 #89) ─────

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

    /** AS-IS는 여는 <strong> 없이 </strong>만 닫는다 — 그대로 */
    private static String tdStNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String checkNull(String text) {
        if (text == null || "null".equals(text)) {
            return " - ";
        }
        return "undefined".equals(text) ? " " : text;
    }

    private static String checkLongNull(Long num) {
        return num == null ? "- " : new DecimalFormat("#,###").format(num);
    }

    private static String checkDoubleNull(BigDecimal num) {
        return num == null ? "- " : new DecimalFormat("#,###.######").format(num);
    }

    private static long nz(Long n) {
        return n == null ? 0L : n;
    }

    /** 평정사유 줄 (1차·2차 공통) */
    private static void reasons(StringBuilder t, List<EvalAdminRes> list) {
        for (EvalAdminRes m : list) {
            if (m.firstEvalReason() != null) {
                t.append("<tr>").append(tdStNone(100, 1, "left", 13, " - <b>" + m.personNm() + "</b>(1차 평가등급 " + m.firstEvalGrade()
                        + " - 평가자 " + m.firstPersonNm() + ")<br>&nbsp; : " + m.firstEvalReason()))
                        .append("</tr><tr>").append(tdEmpty(100, 1, 0)).append("</tr>");
            }
            if (m.secondEvalReason() != null) {
                t.append("<tr>").append(tdStNone(100, 1, "left", 13, " - <b>" + m.personNm() + "</b>(2차 평가등급 " + m.secondEvalGrade()
                        + " - 평가자 " + m.secondPersonNm() + ")<br>&nbsp; : " + m.secondEvalReason()))
                        .append("</tr><tr>").append(tdEmpty(100, 1, 0)).append("</tr>");
            }
        }
    }

    static String contents(String head, List<EvalAdminRes> list) {
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr>").append(tdStNone(100, 1, "left", 14, head + " 인사평가 수행결과를 다음과 같이 보고합니다."))
                .append("</tr><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr>").append(tdStNone(100, 1, "center", 14, "- 다 음 -"))
                .append("</tr><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr></tr><tr>")   // 원본의 빈 <tr></tr>
                .append(tdColor(35, 1, 1, "center", 12, "인사평가대상자", "#EAEFF4"))
                .append(tdColor(15, 1, 1, "center", 12, "1차 평가", "#EAEFF4"))
                .append(tdColor(15, 1, 1, "center", 12, "2차 평가", "#EAEFF4"))
                .append(tdColor(12, 1, 1, "center", 12, "상벌가감", "#EAEFF4"))
                .append(tdColor(8, 2, 1, "center", 12, "평정사유<br>가감", "#EAEFF4"))
                .append(tdColor(15, 1, 1, "center", 12, "평가결과", "#EAEFF4"))
                .append("</tr><tr>")
                .append(tdColor(25, 1, 1, "center", 12, "소속", "#EAEFF4"))
                .append(tdColor(10, 1, 1, "center", 12, "성명", "#EAEFF4"))
                .append(tdColor(8, 1, 1, "center", 12, "점수", "#EAEFF4"))
                .append(tdColor(7, 1, 1, "center", 12, "등급", "#EAEFF4"))
                .append(tdColor(8, 1, 1, "center", 12, "점수", "#EAEFF4"))
                .append(tdColor(7, 1, 1, "center", 12, "등급", "#EAEFF4"))
                .append(tdColor(6, 1, 1, "center", 12, "상", "#EAEFF4"))
                .append(tdColor(6, 1, 1, "center", 12, "벌", "#EAEFF4"))
                .append(tdColor(8, 1, 1, "center", 12, "점수", "#EAEFF4"))
                .append(tdColor(7, 1, 1, "center", 12, "등급", "#EAEFF4"))
                .append("</tr>");
        for (EvalAdminRes m : list) {
            t.append("<tr>")
                    .append(tdColor(25, 1, 1, "left", 12, checkNull(m.orgNm()), "none"))
                    .append(tdColor(10, 1, 1, "center", 12, checkNull(m.personNm()), "none"))
                    .append(tdColor(8, 1, 1, "center", 12, checkDoubleNull(m.firstEvalScore()), "none"))
                    .append(tdColor(7, 1, 1, "center", 12, checkNull(m.firstEvalGrade()), "none"))
                    .append(tdColor(8, 1, 1, "center", 12, checkDoubleNull(m.secondEvalScore()), "none"))
                    .append(tdColor(7, 1, 1, "center", 12, checkNull(m.secondEvalGrade()), "none"))
                    .append(tdColor(6, 1, 1, "center", 12, checkLongNull(m.plusScore()), "none"))
                    .append(tdColor(6, 1, 1, "center", 12, checkLongNull(m.minusScore()), "none"))
                    .append(tdColor(8, 1, 1, "center", 12, checkLongNull(m.reasonAdjustScore()), "none"))
                    .append(tdColor(8, 1, 1, "center", 12, checkDoubleNull(m.adjustEvalScore()), "none"))
                    .append(tdColor(7, 1, 1, "center", 12, checkNull(m.adjustEvalGrade()), "none"))
                    .append("</tr>");
        }
        t.append("<tr>").append(tdStNone(100, 1, "left", 12, "* 자세한 내역은 [경영관리 > 인사평가 > 인사평가 결과조회] 메뉴에서 조회하실 수 있습니다"))
                .append("</tr><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr>").append(tdStNone(100, 1, "left", 14, "## 평정사유 ##")).append("</tr>");
        reasons(t, list);
        return t.append("</tbody></table>").toString();
    }

    static String finalContents(String head, List<EvalAdminRes> list) {
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr>").append(tdStNone(100, 1, "left", 14, head + " 인사평가 최종 결과를 다음과 같이 보고합니다."))
                .append("</tr><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr>").append(tdStNone(100, 1, "center", 14, "- 다 음 -"))
                .append("</tr><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr></tr><tr>")
                .append(tdColor(60, 1, 1, "center", 12, "인사평가대상자", "#EAEFF4"))
                .append(tdColor(15, 1, 1, "center", 12, "평가결과<br>(상벌가감후)", "#EAEFF4"))
                .append(tdColor(10, 2, 1, "center", 12, "대표이사<br>평가", "#EAEFF4"))
                .append(tdColor(15, 1, 1, "center", 12, "최종 평가결과", "#EAEFF4"))
                .append("</tr><tr>")
                .append(tdColor(21, 1, 1, "center", 12, "소속", "#EAEFF4"))
                .append(tdColor(13, 1, 1, "center", 12, "성명", "#EAEFF4"))
                .append(tdColor(13, 1, 1, "center", 12, "직위", "#EAEFF4"))
                .append(tdColor(13, 1, 1, "center", 12, "구분", "#EAEFF4"))
                .append(tdColor(8, 1, 1, "center", 12, "점수", "#EAEFF4"))
                .append(tdColor(7, 1, 1, "center", 12, "등급", "#EAEFF4"))
                .append(tdColor(8, 1, 1, "center", 12, "점수", "#EAEFF4"))
                .append(tdColor(7, 1, 1, "center", 12, "등급", "#EAEFF4"))
                .append("</tr>");
        for (EvalAdminRes m : list) {
            t.append("<tr>")
                    .append(tdColor(21, 1, 1, "left", 12, checkNull(m.orgNm()), "none"))
                    .append(tdColor(13, 1, 1, "center", 12, checkNull(m.personNm()), "none"))
                    .append(tdColor(13, 1, 1, "center", 12, checkNull(m.posNm()), "none"))
                    .append(tdColor(13, 1, 1, "center", 12, checkNull(m.orgHeadNm()), "none"))
                    .append(tdColor(8, 1, 1, "center", 12, checkDoubleNull(m.adjustEvalScore()), "none"))
                    .append(tdColor(7, 1, 1, "center", 12, checkNull(m.adjustEvalGrade()), "none"))
                    .append(tdColor(10, 1, 1, "center", 12, checkLongNull(nz(m.ceoEvalBonus()) + nz(m.ceoEvalPenalty())), "none"))
                    .append(tdColor(8, 1, 1, "center", 12, checkDoubleNull(m.finalEvalScore()), "none"))
                    // AS-IS는 최종 평가결과의 등급 칸에 getFirstEvalGrade()를 쓴다 (#89)
                    .append(tdColor(7, 1, 1, "center", 12, checkNull(m.firstEvalGrade()), "none"))
                    .append("</tr>");
        }
        t.append("<tr>").append(tdStNone(100, 1, "left", 12, "* 자세한 내역은 [경영관리 > 인사평가 > 인사평가 결과조회] 메뉴에서 조회하실 수 있습니다"))
                .append("</tr><tr>").append(tdEmpty(100, 1, 0))
                .append("</tr><tr>").append(tdStNone(100, 1, "left", 14, "# 평정사유 ##")).append("</tr>");
        reasons(t, list);
        return t.append("</tbody></table>").toString();
    }
}

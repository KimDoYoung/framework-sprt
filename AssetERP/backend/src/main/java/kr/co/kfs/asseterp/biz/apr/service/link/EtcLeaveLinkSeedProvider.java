package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveManageRes;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeavePersonRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEtcLeaveMapper;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEtcLeavePersonMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A25 포상휴가관리 (Apr01_Edit_ApprDoc.insertLinkApproval L2035-2068 · client/htmlData/EtcLeaveHtmlData.getHtmlContent).
 * 제목은 고칠 수 있다(`title.setReadOnly(false)`). 본문 표는 원본 문자열 순서 그대로 만든다 — 원본은 `tr`을 여닫는 위치가 일부 어긋나 있다(원본 이상한점 #40).
 */
@Component
@RequiredArgsConstructor
public class EtcLeaveLinkSeedProvider implements AprLinkSeedProvider {

    private static final String TABLE_START = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"Malgun Gothic\"; font-size:12px; margin:0px; padding:0px; width:100%;'>";
    private static final String TABLE_CLOSE = "</table>";
    private static final String TBODY_START = "<tbody>";
    private static final String TBODY_CLOSE = "</tbody>";
    private static final String TR_START = "<tr>";
    private static final String TR_CLOSE = "</tr>";

    private final EmpEtcLeaveMapper leaveMapper;
    private final EmpEtcLeavePersonMapper personMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A25");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        EtcLeaveManageRes leave = refId == null ? null : leaveMapper.selectById(user.getCompanyId(), refId);
        if (leave == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "포상휴가 정보를 찾을 수 없습니다.");
        }
        List<EtcLeavePersonRes> persons = personMapper.selectByEtcLeaveId(user.getCompanyId(), refId);
        String title = "포상휴가 품의서 (" + dot(leave.startDate()) + " ~ " + dot(leave.closeDate()) + " / " + leave.days() + "일)";
        return new Seed(title, html(persons, leave), null, false, false);
    }

    private static String dot(LocalDate d) {
        return d == null ? "" : d.toString().replace('-', '.');
    }

    private static String dash(LocalDate d) {
        return d == null ? "" : d.toString();
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:10px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String tdNoneSlim(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></strong></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + (colspan * 5) + "%;\">"
                + "<span></span></td>";
    }

    /** EtcLeaveHtmlData.getHtmlContent L49-117 — 문자열을 잇는 순서까지 원본 그대로 */
    static String html(List<EtcLeavePersonRes> list, EtcLeaveManageRes model) {
        StringBuilder text = new StringBuilder();
        text.append(TABLE_START).append(TBODY_START).append(TR_START);
        for (int i = 0; i < 20; i++) {
            text.append(tdEmpty(1, 1, 0));
        }
        text.append(TR_CLOSE)
                .append(TR_START).append(tdNoneSlim(20, 1, "left", 12, "아래와 같이 품의하오니 검토 후 재가하여 주시기 바랍니다.")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(TR_START).append(tdNoneSlim(20, 1, "center", 12, "- 아 래 -")).append(TR_CLOSE)
                .append(TR_START).append(tdEmpty(20, 1, 0)).append(TR_CLOSE)
                .append(tdNoneSlim(20, 1, "left", 14, "- 사유 : " + model.reason()))
                .append(TR_START)
                .append(tdNoneSlim(20, 1, "left", 14, "- 사용기간 : " + dash(model.startDate()) + " ~ " + dash(model.closeDate())))
                .append(TR_CLOSE)
                .append(tdNoneSlim(20, 1, "left", 14, "- 사용일수 : " + model.days() + "일"))
                .append(TR_START)
                .append(TR_CLOSE)
                .append(tdEmpty(20, 1, 0))
                .append(TR_START)
                .append(tdEmpty(5, 1, 0))
                .append(tdColor(5, 1, 1, "center", 14, "부서", "#EAEFF4"))
                .append(tdColor(5, 1, 1, "center", 14, "사원명", "#EAEFF4"))
                .append(tdEmpty(5, 1, 0))
                .append(TR_CLOSE);
        for (EtcLeavePersonRes p : list) {
            text.append(TR_START)
                    .append(tdEmpty(5, 1, 0))
                    .append(tdColor(5, 1, 1, "center", 14, p.orgName(), "none"))
                    .append(tdColor(5, 1, 1, "center", 14, p.personName(), "none"))
                    .append(tdEmpty(5, 1, 0))
                    .append(TR_CLOSE);
        }
        text.append(TBODY_CLOSE).append(TABLE_CLOSE);
        return text.toString();
    }
}

package kr.co.kfs.asseterp.biz.apr.service.link;

import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.TABLE_START;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tdColor;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tdEmpty;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tdStColor;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tdStNone;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tr;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.DirectorRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpDirectorMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A44 임원선임보고 / A62 임원해임보고 (Apr01_Edit_ApprDoc.insertLinkApproval L3356-3376·L3404-3424, 본문 DirectorListHtmlData.getHtmlContent / getEndHtmlContent).
 * 호출 창 Emp31_Lookup_Rd_Director(RDViewer.openEmp31)의 [결재]가 보고 대상 임원 행(gridList)을 넘긴다 → `ids`(사원 ID, 쉼표 구분, 그리드 순서).
 * 제목 `임원선임보고`·`임원해임보고`(고칠 수 있음), 시행일자 = 오늘, [저장] 숨김.
 */
@Component
@RequiredArgsConstructor
public class DirectorLinkSeedProvider implements AprLinkSeedProvider {

    private final EmpDirectorMapper directorMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A44", "A62");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        List<Long> ids = new ArrayList<>();
        String text = args.get("ids");
        if (text != null) {
            for (String t : text.split(",")) {
                if (!t.isBlank()) {
                    ids.add(Long.valueOf(t.trim()));
                }
            }
        }
        if (ids.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신할 내용이 없습니다.");
        }
        // 해임된 임원도 보고 대상이 될 수 있어 해임 포함(endCheck=true)으로 읽고, 고른 순서로 줄인다
        List<DirectorRes> all = directorMapper.selectByText(user.getCompanyId(), "%", true);
        List<DirectorRes> list = new ArrayList<>();
        for (Long id : ids) {
            for (DirectorRes d : all) {
                if (id.equals(d.personId())) {
                    list.add(d);
                    break;
                }
            }
        }
        if (list.size() != ids.size()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "임원 정보를 찾을 수 없습니다.");
        }
        boolean end = "A62".equals(linkCode);
        return new Seed(end ? "임원해임보고" : "임원선임보고", content(list, end), LocalDate.now(), false, false);
    }

    private static String nul(String s) {
        return s == null || "undefined".equals(s) || "null".equals(s) ? " " : s;
    }

    private static String dt(LocalDate d) {
        return d == null ? " " : d.toString();
    }

    /** DirectorListHtmlData.getHtmlContent(선임) / getEndHtmlContent(해임) */
    static String content(List<DirectorRes> list, boolean end) {
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody>")
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, end ? "다음과 같이 임원해임보고를 하고자 합니다." : "다음과 같이 임원선임보고를 하고자 합니다.")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "center", 13, "- 다 음 -")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, end ? "1. 해임" : "1. 선임")))
                .append("<tr></tr>")
                .append(tr(tdEmpty(2, 1, 0),
                        tdStColor(20, 1, 1, "center", 13, "직위", "#EAEFF4"),
                        tdStColor(20, 1, 1, "center", 13, "성명", "#EAEFF4"),
                        tdStColor(20, 1, 1, "center", 13, "선임일", "#EAEFF4"),
                        tdStColor(20, 1, 1, "center", 13, end ? "해임일" : "만료일", "#EAEFF4"),
                        tdEmpty(18, 1, 0)));
        for (DirectorRes d : list) {
            t.append(tr(tdEmpty(2, 1, 0),
                    tdColor(20, 1, 1, "center", 13, nul(d.posName()), "none"),
                    tdColor(20, 1, 1, "center", 13, nul(d.personName()), "none"),
                    tdColor(20, 1, 1, "center", 13, dt(d.rcntAssingDate()), "none"),
                    tdColor(20, 1, 1, "center", 13, dt(end ? d.endDate() : d.expireDate()), "none"),
                    tdEmpty(18, 1, 0)));
        }
        return t.append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "2. 보고처 : 금융감독원")))
                .append("</tbody></table>").toString();
    }
}

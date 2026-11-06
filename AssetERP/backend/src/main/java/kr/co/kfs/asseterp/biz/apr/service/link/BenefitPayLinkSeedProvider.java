package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.TABLE_START;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.checkDateNull;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.checkLongNull;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.checkNull;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.nz;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tdColor;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tdEmpty;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tdStColor;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tdStNone;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tdStNoneStrong;
import static kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider.tr;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.BenefitPayLinkRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprBenefitLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A46·A47·A48·A50·A51 복리후생비 지출결의서 (Apr01_Edit_ApprDoc.insertLinkApproval L3377-3403, 본문 BenefitManagerHtmlData.getHtmlContent).
 * 호출 화면 Emp17_Tab_BenefitManager의 지출결의내역 그리드 전체를 `ids`(그리드 순서)로 받아 서버가 다시 읽는다.
 * args: yyyy(년)·mm(월)·benefitName(신청구분 콤보 이름)·benefitCode(계정과목 이름을 읽는 구분 코드). 제목 `yyyy년 mm월 직원 이름 지급결의서`는 고칠 수 있다.
 * 시행일자 = 오늘. 문서 자동등록(Apr03_Page_Relate.insertEmp17RelateApprList) = 응답 `relateApprs`(복리후생비 신청 문서, 저장은 연관 탭의 [저장]·[결재요청] 때).
 */
@Component
@RequiredArgsConstructor
public class BenefitPayLinkSeedProvider implements AprLinkSeedProvider {

    private final AprBenefitLinkSeedMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A46", "A47", "A48", "A50", "A51");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        List<Long> ids = parseIds(args.get("ids"));
        if (ids.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신할 내용이 없습니다.");
        }
        String year = args.get("yyyy");
        String month = args.get("mm");
        if (year == null || month == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년월이 없습니다.");
        }
        String benefitName = args.getOrDefault("benefitName", "");
        List<BenefitPayLinkRow> list = ordered(ids, mapper.selectPayRows(user.getCompanyId(), ids));
        if (list.size() != ids.size()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "복리후생비 지출결의 내역을 찾을 수 없습니다.");
        }
        String accountName = mapper.selectAccountName(user.getCompanyId(), args.get("benefitCode"));
        long total = 0;
        for (BenefitPayLinkRow r : list) {
            total += nz(r.issueAmt());
        }
        String title = year + "년 " + month + "월 직원 " + benefitName + " 지급결의서";
        String content = content(list, total, year, month, benefitName, accountName == null ? "" : accountName,
                mapper.selectOrgName(user.getUserId()));
        List<AprLinkRelateApprRes> relates = new ArrayList<>();
        for (BenefitPayLinkRow r : list) {
            if (r.apprId() != null) {
                relates.add(new AprLinkRelateApprRes(r.apprId(), r.apprRegDate(), r.apprTitleName(), r.apprInoutCode()));
            }
        }
        return new Seed(title, content, LocalDate.now(), false, false).withRelateApprs(relates);
    }

    private static List<Long> parseIds(String text) {
        List<Long> ids = new ArrayList<>();
        if (text != null) {
            for (String t : text.split(",")) {
                if (!t.isBlank()) {
                    ids.add(Long.valueOf(t.trim()));
                }
            }
        }
        return ids;
    }

    private static List<BenefitPayLinkRow> ordered(List<Long> ids, List<BenefitPayLinkRow> rows) {
        List<BenefitPayLinkRow> out = new ArrayList<>();
        for (Long id : ids) {
            for (BenefitPayLinkRow r : rows) {
                if (id.equals(r.benefitId())) {
                    out.add(r);
                    break;
                }
            }
        }
        return out;
    }

    /** BenefitManagerHtmlData.getHtmlContent */
    static String content(List<BenefitPayLinkRow> list, long totalIssueAmt, String year, String month, String benefitName,
                          String accountName, String orgName) {
        StringBuilder t = new StringBuilder(TABLE_START).append("<tbody>")
                .append(tr(tdStNoneStrong(100, 1, "center", 25, "지 출 결 의 서")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "1. 발생부서 : " + orgName)))
                .append(tr(tdStNone(100, 1, "left", 13, "2. 계정과목 : " + accountName)))
                .append(tr(tdStNone(100, 1, "left", 13, "3. 일 &nbsp;&nbsp;&nbsp;&nbsp; 금 : " + checkLongNull(totalIssueAmt) + "원")))
                .append(tr(tdStNone(100, 1, "left", 13, "4. 발생일자 : " + year + "년도 " + month + "월")))
                .append(tr(tdStNone(100, 1, "left", 13, "5. 지출일자 :&nbsp;")))
                .append(tr(tdStNone(100, 1, "left", 13, "6. 내 &nbsp;&nbsp;&nbsp;&nbsp; 역 : " + year + "년 " + month + "월 임직원 " + benefitName + " 지급")))
                .append(tr(tdEmpty(5, 1, 0),
                        tdStColor(15, 1, 1, "center", 13, "성명", "#EAEFF4"),
                        tdStColor(15, 1, 1, "center", 13, "금액", "#EAEFF4"),
                        tdStColor(15, 1, 1, "center", 13, "발생일자", "#EAEFF4"),
                        tdStColor(30, 1, 1, "center", 13, "비고", "#EAEFF4"),
                        tdEmpty(20, 1, 0)));
        long amtSum = 0;
        for (BenefitPayLinkRow m : list) {
            amtSum += nz(m.issueAmt());
            t.append(tr(tdEmpty(5, 1, 0),
                    tdColor(15, 1, 1, "center", 13, checkNull(Html.esc(m.personName())), "none"),
                    tdColor(15, 1, 1, "right", 13, checkLongNull(m.issueAmt()) + "&nbsp;", "none"),
                    tdColor(15, 1, 1, "center", 13, checkDateNull(m.occDate()), "none"),
                    tdColor(30, 1, 1, "left", 13, checkNull(Html.esc(m.benefitDetail())), "none"),
                    tdEmpty(20, 1, 0)));
        }
        t.append(tr(tdEmpty(5, 1, 0),
                tdColor(15, 1, 1, "center", 13, "합 계" + "&nbsp;", "none"),
                tdColor(15, 1, 1, "right", 13, checkLongNull(amtSum) + "&nbsp;", "none"),
                tdColor(45, 1, 1, "center", 13, " ", "none"),
                tdEmpty(20, 1, 0)))
                .append(tr(tdEmpty(100, 1, 0)));
        return t.append("</tbody></table>").toString();
    }
}

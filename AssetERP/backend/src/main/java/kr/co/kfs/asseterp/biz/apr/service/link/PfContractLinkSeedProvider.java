package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.est.dto.PfContractLinkRow;
import kr.co.kfs.asseterp.biz.est.dto.PfHistoryRes;
import kr.co.kfs.asseterp.biz.est.mapper.EstPfContractMapper;
import kr.co.kfs.asseterp.biz.est.mapper.EstPfHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A60 용역계약체결(용역수행 계획서) · A61 용역결과보고서 (Apr01_Edit_ApprDoc.insertLinkApproval L2240-2302).
 * 제목 `용역수행 계획서 (사업장명)` / `용역 결과보고서 (사업장명)`(읽기전용, [저장] 숨김, 시행일자 오늘).
 * 본문 = `com.Com11_FormMappingMulti.selectByDetailCode(kind EstPfFeeCode, 수수료 코드, 링크코드)` 양식의 `#{키}` 치환 —
 * 값은 호출 화면(`Est02_Tab_PfContract.createMapping`·`Est02_Tab_PfResultReport.createMapping`)이 만들던 것을 서버가 만든다.
 * 양식이 없으면 본문 null → 문서분류 대표 양식(checkContent). refId = 용역계약 ID.
 */
@Component
@RequiredArgsConstructor
public class PfContractLinkSeedProvider implements AprLinkSeedProvider {

    private static final String KIND_CODE = "EstPfFeeCode";

    private final EstPfContractMapper contractMapper;
    private final EstPfHistoryMapper historyMapper;
    private final FormMappingLinkSeedSupport support;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A60", "A61");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        PfContractLinkRow m = refId == null ? null : contractMapper.selectLinkById(refId, user.getCompanyId());
        if (m == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "용역계약 내역을 찾을 수 없습니다.");
        }
        boolean plan = "A60".equals(linkCode);
        String title = (plan ? "용역수행 계획서 (" : "용역 결과보고서 (") + m.projectSiteName() + ")";

        Map<String, String> mapping = new LinkedHashMap<>();
        mapping.put("용역수행회사", FormMappingLinkSeedSupport.str(m.borrower()));
        mapping.put("사업장명", FormMappingLinkSeedSupport.str(m.projectSiteName()));
        mapping.put("사업장 주소지", FormMappingLinkSeedSupport.str(m.projectSiteAddr()));
        mapping.put("수수료명", FormMappingLinkSeedSupport.str(m.feeName()));
        mapping.put("용역 수행기간", FormMappingLinkSeedSupport.date(m.startDate(), false) + " ~ " + FormMappingLinkSeedSupport.date(m.closeDate(), false));
        mapping.put("문의처", FormMappingLinkSeedSupport.str(m.managerInfo()));
        if (plan) {
            mapping.put("용역 수행계획", FormMappingLinkSeedSupport.str(m.plan()));
            mapping.put("첨부파일", FormMappingLinkSeedSupport.str(m.fileListHtml()));
        } else {
            mapping.put("용역 수행내역", FormMappingLinkSeedSupport.str(historyHtml(user.getCompanyId(), m.pfContractId())));
            mapping.put("첨부파일", FormMappingLinkSeedSupport.str(m.fileListResultHtml()));
        }
        String content = support.fillMulti(user.getCompanyId(), KIND_CODE, m.feeCode(), linkCode, mapping);
        return Seed.of(title, content);
    }

    /** Est03_TabPage_PfHistoryList.getListHtml L92-124 — 호출 화면 그리드(연번 순)의 수행내역 표 */
    private String historyHtml(Long companyId, Long pfContractId) {
        List<PfHistoryRes> list = historyMapper.selectByPfContractId(companyId, pfContractId);
        StringBuilder sb = new StringBuilder();
        sb.append("<table border='1' style='border-collapse:collapse; width:100%; text-align:center;'>");
        sb.append("<thead><tr><th>연번</th><th>수행기간</th><th>용역 수행 내역</th><th>용역 수행 내역 상세</th><th>담당부서</th></tr></thead>");
        sb.append("<tbody>");
        int index = 1;
        for (PfHistoryRes h : list) {
            sb.append("<tr>");
            sb.append("<td>").append(index++).append("</td>");
            sb.append("<td>").append(FormMappingLinkSeedSupport.date(h.startDate(), false)).append(" ~ ").append(FormMappingLinkSeedSupport.date(h.closeDate(), false)).append("</td>");
            sb.append("<td>").append(h.content()).append("</td>");
            sb.append("<td>").append(h.detail()).append("</td>");
            sb.append("<td>").append(h.orgName()).append("</td>");
            sb.append("</tr>");
        }
        sb.append("</tbody></table>");
        return sb.toString();
    }
}

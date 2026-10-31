package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkChckJobHtmlRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkChckJobRow;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmApprLinkMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A94 책무이행점검보고서 (Apr01_Edit_ApprDoc.insertLinkApprovals L3626-3655, 호출 Tdm50_TabPage_CheckJob).
 * 제목 `yyyy년 MM월 책무 이행 점검 보고서_보고CEO직책`(수정 가능, 월은 점검시작일), 본문 = 직책·임원별 점검 현황 표(`ChckJobHtmlData`). 현황이 없으면 대표 양식.
 * refId = 이행점검 작업 ID(chckJobId), args `roleId` = 탭의 보고CEO 직책.
 */
@Component
@RequiredArgsConstructor
public class CheckJobLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter YM = DateTimeFormatter.ofPattern("yyyy년 MM월");

    private final TdmApprLinkMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A94");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        throw new BusinessException(ErrorCode.INVALID_INPUT, "보고CEO 직책 정보가 없습니다.");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String roleIdText = args == null ? null : args.get("roleId");
        if (refId == null || roleIdText == null || roleIdText.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "보고CEO 직책 정보가 없습니다.");
        }
        Long roleId = Long.valueOf(roleIdText.trim());
        TdmLinkChckJobRow job = mapper.selectChckJob(refId, user.getCompanyId());
        if (job == null || job.startDate() == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "이행점검 작업을 찾을 수 없습니다.");
        }
        String roleName = mapper.selectRoleName(roleId, user.getCompanyId());
        String stdDate = job.startDate().format(YM);
        String title = stdDate + " 책무 이행 점검 보고서_" + roleName;
        List<TdmLinkChckJobHtmlRow> rows = mapper.selectApprContent(user.getCompanyId(), roleId, job.checkYm());
        return new Seed(title, rows.isEmpty() ? null : TdmLinkHtml.chckJob(rows, stdDate), null, false, false);
    }
}

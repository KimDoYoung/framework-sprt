package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleAllcDetailRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkTaskDetailRow;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmApprLinkMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A90 임원책무동의서 (Apr01_Edit_ApprDoc.insertLinkApprovals L3602-3624, 호출 Tdm34_TabPage_RoleAllcDetail).
 * 제목 `임원책무동의서_임원(직책)`(수정 가능), 시행·상신일자 오늘, 본문 = 직책에 연결된 책무 세부내용 표(`RoleAllcHtmlData`). refId = 책무배분 상세(tdm34) ID.
 */
@Component
@RequiredArgsConstructor
public class RoleAllcLinkSeedProvider implements AprLinkSeedProvider {

    private final TdmApprLinkMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A90");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        TdmLinkRoleAllcDetailRow d = refId == null ? null : mapper.selectRoleAllcDetail(refId, user.getCompanyId());
        if (d == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "책무배분 내역을 찾을 수 없습니다.");
        }
        List<TdmLinkTaskDetailRow> tasks = mapper.selectTaskDetails(user.getCompanyId(), d.roleId(), d.roleAllcDate());
        if (tasks.isEmpty()) {
            // 호출 화면 getHtmlData L444-450 "관련 책무가 존재하지 않습니다"
            throw new BusinessException(ErrorCode.INVALID_INPUT, "관련 책무가 존재하지 않습니다");
        }
        String roleName = d.roleName() == null ? "" : d.roleName().trim();
        String title = "임원책무동의서_" + d.personName() + "(" + roleName + ")";
        return new Seed(title, TdmLinkHtml.roleAllc(tasks), null, false, false);
    }
}

package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgLinkRow;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlOrgMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A93 책무매뉴얼 보고(부서별) (Apr01_Edit_ApprDoc.insertLinkApproval L2426-2447).
 * 제목 `책무매뉴얼_부서명(책무명)`(읽기전용), 본문 `책무명 부서명 책무매뉴얼을 보고합니다.`, 사내문서(20)로 고정(인감 끔). refId = 부서 책무매뉴얼 ID.
 */
@Component
@RequiredArgsConstructor
public class ManlOrgLinkSeedProvider implements AprLinkSeedProvider {

    private final TdmManlOrgMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A93");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        ManlOrgLinkRow m = refId == null ? null : mapper.selectLinkById(refId, user.getCompanyId());
        if (m == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "부서 책무매뉴얼 내역을 찾을 수 없습니다.");
        }
        String title = "책무매뉴얼_" + m.orgName() + "(" + m.roleName() + ")";
        String content = m.roleName() + " " + m.orgName() + " 책무매뉴얼을 보고합니다.";
        return Seed.of(title, content).withInOutType("20");
    }
}

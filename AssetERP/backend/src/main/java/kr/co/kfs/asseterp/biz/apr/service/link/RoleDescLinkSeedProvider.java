package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleDescRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleDescTaskRow;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmApprLinkMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A91 임원별 책무기술서 (Apr01_Edit_ApprDoc.insertLinkApproval L2369-2395, 호출 Tdm31_Tab_RoleDesc).
 * 제목 `임원별 책무기술서(직책 임원)`(읽기전용), 본문 = 임원의 직책별 책무 표(`RoleDescHtmlData`, 책무배분기준일 기준). 배분 내역이 없으면 본문을 안 정해 대표 양식. refId = 책무기술서 ID.
 */
@Component
@RequiredArgsConstructor
public class RoleDescLinkSeedProvider implements AprLinkSeedProvider {

    private final TdmApprLinkMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A91");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        TdmLinkRoleDescRow d = refId == null ? null : mapper.selectRoleDesc(refId, user.getCompanyId());
        if (d == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "책무기술서 내역을 찾을 수 없습니다.");
        }
        String title = "임원별 책무기술서(" + d.roleName() + " " + d.personName() + ")";
        List<TdmLinkRoleDescTaskRow> rows = mapper.selectRoleAllcByPersonId(user.getCompanyId(), d.personId(), d.allcStdDate());
        return Seed.of(title, rows.isEmpty() ? null : TdmLinkHtml.roleDesc(rows));
    }
}

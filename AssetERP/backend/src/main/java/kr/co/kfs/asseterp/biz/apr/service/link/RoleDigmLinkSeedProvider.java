package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleDigmRow;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmApprLinkMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A92 책무체계도 (Apr01_Edit_ApprDoc.insertLinkApproval L2397-2424, 호출 Tdm32_Tab_RoleDigm).
 * 제목 `책무체계도`(수정 가능), 본문 = 책무배분기준일의 직책·임원·직위·겸직여부 표(`RoleDigmHtmlData`). 배분 내역이 없으면 대표 양식. refId = 책무체계도 ID.
 */
@Component
@RequiredArgsConstructor
public class RoleDigmLinkSeedProvider implements AprLinkSeedProvider {

    private final TdmApprLinkMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A92");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        LocalDate allcStdDate = refId == null ? null : mapper.selectRoleDigmAllcStdDate(refId, user.getCompanyId());
        if (allcStdDate == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "책무체계도 내역을 찾을 수 없습니다.");
        }
        List<TdmLinkRoleDigmRow> rows = mapper.selectRoleAllcByAllcStdDate(user.getCompanyId(), allcStdDate);
        return new Seed("책무체계도", rows.isEmpty() ? null : TdmLinkHtml.roleDigm(rows), null, false, false);
    }
}

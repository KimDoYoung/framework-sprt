package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprStampRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprStampMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/apr/Apr10_Stamp.java selectBySearchText2 L36 (Apr10_Lookup_DocStamp, flag=true) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprStampService {

    private final AprStampMapper mapper;

    /**
     * 검색어 "%…%" → 문서분류에서 제외하지 않은 인감 중, 모두 사용 가능하거나 사용자 조직에 역할로 준 것.
     * 사용자 조직(AS-IS LoginUser.getOrgCodeId)은 회사관리자(userId &lt; 0)면 0, 직원이면 가장 최근 발령(겸직 제외)의 조직
     */
    public List<AprStampRes> searchDocStamp(UserPrincipal user, Long classTreeId, String searchText) {
        Long orgId = 0L;
        if (user.getUserId() != null && user.getUserId() > 0) {
            Long org = mapper.selectOrgCodeId(user.getUserId());
            orgId = org == null ? 0L : org;
        }
        return mapper.selectBySearchText2(user.getCompanyId(), classTreeId, orgId, "%" + (searchText == null ? "" : searchText) + "%");
    }
}

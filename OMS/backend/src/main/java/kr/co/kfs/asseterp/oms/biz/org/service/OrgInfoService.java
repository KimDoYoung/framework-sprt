package kr.co.kfs.asseterp.oms.biz.org.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgInfoRes;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgInfoSearchParam;
import kr.co.kfs.asseterp.oms.biz.org.mapper.OrgInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 조직정보 (AS-IS server/org/Org00_OrgInfo) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrgInfoService {

    private final OrgInfoMapper orgInfoMapper;

    /** AS-IS selectByKorName (조직 Lookup) */
    public List<OrgInfoRes> searchOrgInfos(UserPrincipal user, String korNm, LocalDate baseDate) {
        return orgInfoMapper.searchByKorName(new OrgInfoSearchParam(
                user.getCompanyId(),
                baseDate == null ? LocalDate.now() : baseDate,
                "%" + (korNm == null ? "" : korNm.trim()) + "%"));
    }
}

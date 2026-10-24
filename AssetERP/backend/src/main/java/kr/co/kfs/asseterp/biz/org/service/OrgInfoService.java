package kr.co.kfs.asseterp.biz.org.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoSearchParam;
import kr.co.kfs.asseterp.biz.org.dto.OrgTdmRes;
import kr.co.kfs.asseterp.biz.org.mapper.OrgInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/org/Org00_OrgInfo.java (selectByKorName / selectByOrgCodeId) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrgInfoService {

    private final OrgInfoMapper orgInfoMapper;

    /** AS-IS selectByKorName: 조직명이 null이면 '%', 아니면 '%이름%' */
    public List<OrgInfoRes> searchOrgInfos(UserPrincipal user, String korName, LocalDate baseDate) {
        String like = korName == null ? "%" : "%" + korName + "%";
        return orgInfoMapper.searchOrgInfos(new OrgInfoSearchParam(user.getCompanyId(), like, baseDate, null));
    }

    /** AS-IS selectByTdmYn: 기준일의 책무 대상 조직(로그인 회사). 검색어는 조직코드/조직명 */
    public List<OrgTdmRes> searchTdmOrgs(UserPrincipal user, LocalDate stdDate, String searchText, Long roleId) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return orgInfoMapper.selectByTdmYn(user.getCompanyId(), stdDate, like, roleId);
    }

    /** AS-IS selectByIgnoreStamp (G06 인감대장): 로그인 사용자 조직이 인감무시 조직인가. 회사관리자는 조직이 없어 false */
    public boolean hasIgnoreStamp(UserPrincipal user) {
        return user.getUserId() != null && user.getUserId() > 0 && orgInfoMapper.countIgnoreStamp(user.getUserId()) > 0;
    }

    /** AS-IS selectByOrgCodeId: 기준일의 조직 (없으면 null — 화면이 조직을 채우지 않는다) */
    public OrgInfoRes getOrgInfo(UserPrincipal user, Long orgCodeId, LocalDate baseDate) {
        return orgInfoMapper.selectOrgInfo(new OrgInfoSearchParam(user.getCompanyId(), null, baseDate, orgCodeId));
    }
}

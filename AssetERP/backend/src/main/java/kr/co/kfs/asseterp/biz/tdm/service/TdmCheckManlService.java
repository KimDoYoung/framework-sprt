package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCheckerReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgBaseRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckManlMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckOrgMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 이행점검 항목 — 목록·점검자 지정 (AS-IS Tdm51_TabPage_CheckOrg, N21) → server/tdm/Tdm52_ChckManl */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmCheckManlService {

    private final TdmCheckManlMapper mapper;
    private final TdmCheckOrgMapper orgMapper;

    /** AS-IS tdm.Tdm52_ChckManl.selectByChckOrgId — searchText는 '%글자%'를 서버가 만든다 */
    public List<CheckManlRes> search(UserPrincipal user, Long chckOrgId, boolean unspecYn, String searchText) {
        CheckOrgBaseRes org = orgMapper.selectById(chckOrgId);
        if (org == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!org.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByChckOrgId(chckOrgId, unspecYn, like);
    }

    /** AS-IS tdm.Tdm52_ChckManl.updateCheckerId — 로그인 회사 행만, 하나라도 없으면 DATA_NOT_FOUND */
    @Transactional
    public void updateChecker(UserPrincipal user, CheckCheckerReq req) {
        for (Long chckManlId : req.chckManlIds()) {
            if (mapper.updateCheckerId(chckManlId, user.getCompanyId(), req.personId(), user.getName()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
    }
}

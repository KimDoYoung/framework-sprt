package kr.co.kfs.asseterp.biz.org.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgStateRdReq;
import kr.co.kfs.asseterp.biz.org.mapper.OrgStateRdMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrgStateRdService {

    private static final String RD_WINDOW = "Org02_Rd_OrgState";

    private final OrgStateRdMapper mapper;

    /** AS-IS Sys99_Print.insertRdOrgState (T17) — 지난 자료를 지우고 기준일 현재 조직(최하위, 사용 중인 등급)을 만든다 → 묶음 ID(rdGroupId) */
    @Transactional
    public Long printRd(UserPrincipal user, OrgStateRdReq req) {
        if (req == null || req.baseDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        mapper.deleteRdPrint(user.getCompanyId(), user.getUserId(), RD_WINDOW);
        long groupId = mapper.selectNextId();
        mapper.insertRdOrgState(user.getCompanyId(), user.getUserId(), RD_WINDOW, groupId, req.baseDate());
        return groupId;
    }
}

package kr.co.kfs.asseterp.biz.frm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.frm.dto.FrmNoticeCntRes;
import kr.co.kfs.asseterp.biz.frm.mapper.FrmListMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/frm/Frm01_List.java (getNoticeCnt L59-68) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FrmListService {

    private final FrmListMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** AS-IS getNoticeCnt: 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
    public FrmNoticeCntRes getNoticeCnt(UserPrincipal user) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectNoticeCnt(user.getCompanyId(), user.getUserId(), orgId);
    }
}

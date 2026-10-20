package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsManagerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/ics/Ics02_Manager.java (selectByCompanyId L28) + Ics04_Share.java (selectByManagerId L25) — H08 관리그룹 조회창·공유 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsManagerService {

    private final IcsManagerMapper mapper;

    /** AS-IS Ics02_Manager.selectByCompanyId: 로그인 회사의 관리그룹 */
    public List<IcsManagerRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS Ics04_Share.selectByManagerId: 관리그룹의 공유(직원/부서) */
    public List<IcsShareRes> searchShares(UserPrincipal user, Long managerId) {
        return mapper.selectSharesByManagerId(user.getCompanyId(), managerId);
    }
}

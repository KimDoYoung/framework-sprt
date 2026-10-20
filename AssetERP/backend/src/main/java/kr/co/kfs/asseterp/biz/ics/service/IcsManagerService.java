package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRow;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRow;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareSaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsManagerMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/ics/Ics02_Manager.java (selectByCompanyId L28·checkRelateIcs L64·update L148·delete L153) + Ics04_Share.java (selectByManagerId L25·update L36·delete L41)
 * — H08 관리그룹 조회창·공유, H10 관리그룹 등록(Ics02_Tab_Manager·Ics04_Page_Share)
 */
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

    /** AS-IS Ics02_Manager.update: UpdateDataModel — id가 없는(≤ 0) 행은 INSERT, 있으면 그룹명 UPDATE. 저장한 행을 요청 순서로 돌려준다 */
    @Transactional
    public List<IcsManagerRes> save(UserPrincipal user, List<IcsManagerSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<IcsManagerRes> saved = new ArrayList<>();
        for (IcsManagerSaveReq req : rows) {
            Long managerId = req.managerId();
            if (managerId == null || managerId <= 0) {
                managerId = mapper.selectNextId();
                mapper.insertManager(new IcsManagerRow(managerId, companyId, req.managerGroupName()));
            } else {
                requireManager(companyId, managerId);
                mapper.updateManager(companyId, managerId, req.managerGroupName());
            }
            saved.add(mapper.selectById(companyId, managerId));
        }
        return saved;
    }

    /** AS-IS Ics02_Manager.checkRelateIcs: 고른 관리그룹 중 하나라도 법규에 연결돼 있으면 사용중 */
    public boolean inUse(List<Long> managerIds) {
        return managerIds.stream().anyMatch(id -> mapper.countRelate(id) > 0);
    }

    /** AS-IS Ics02_Manager.delete: UpdateDataModel.deleteModel → 지운 수 (로그인 회사 것만) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> managerIds) {
        if (managerIds == null || managerIds.isEmpty()) {
            return 0;
        }
        return mapper.deleteManagers(user.getCompanyId(), managerIds);
    }

    /** AS-IS Ics04_Share.update: 새 공유(부서) INSERT, 있는 행은 UPDATE. 관리그룹은 경로, 회사는 로그인 회사 */
    @Transactional
    public List<IcsShareRes> saveShares(UserPrincipal user, Long managerId, List<IcsShareSaveReq> rows) {
        Long companyId = user.getCompanyId();
        requireManager(companyId, managerId);
        List<IcsShareRes> saved = new ArrayList<>();
        for (IcsShareSaveReq req : rows) {
            Long shareId = req.shareId();
            if (shareId == null || shareId <= 0) {
                shareId = mapper.selectNextId();
                mapper.insertShare(new IcsShareRow(shareId, companyId, managerId, req.shareCode(), req.orgId()));
            } else {
                mapper.updateShare(new IcsShareRow(shareId, companyId, managerId, req.shareCode(), req.orgId()));
            }
            saved.add(mapper.selectShareById(companyId, shareId));
        }
        return saved;
    }

    /** AS-IS Ics04_Share.delete: UpdateDataModel.deleteModel → 지운 수 */
    @Transactional
    public int deleteShares(UserPrincipal user, Long managerId, List<Long> shareIds) {
        if (shareIds == null || shareIds.isEmpty()) {
            return 0;
        }
        requireManager(user.getCompanyId(), managerId);
        return mapper.deleteShares(user.getCompanyId(), managerId, shareIds);
    }

    /** 관리그룹이 로그인 회사 것인지 (AS-IS에는 없는 보안 확인) */
    private void requireManager(Long companyId, Long managerId) {
        if (mapper.selectById(companyId, managerId) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}

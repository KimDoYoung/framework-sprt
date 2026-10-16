package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuPersonRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuPersonSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysSpecificMenuPersonMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys51_SpecificMenuPerson.java (selectBySpecificMenuId / updateGroup / update / delete) — sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysSpecificMenuPersonService {

    private final SysSpecificMenuPersonMapper sysSpecificMenuPersonMapper;

    /** AS-IS selectBySpecificMenuId L24 */
    public List<SpecificMenuPersonRes> search(UserPrincipal user, Long companyId, Long specificMenuId, String specificWorkCd) {
        requireSysAdmin(user);
        requireMenu(companyId, specificMenuId);
        return sysSpecificMenuPersonMapper.selectBySpecificMenuId(specificMenuId, specificWorkCd);
    }

    /**
     * AS-IS update(UpdateDataModel) L55: 신규(임시 ID 0 이하)면 INSERT(화면이 넣은 specificMenuId·personId·useYn·specificWorkCd),
     * 아니면 화면이 바꾸는 useYn·note만 UPDATE → selectById로 다시 읽어 요청 순서대로.
     */
    @Transactional
    public List<SpecificMenuPersonRes> update(UserPrincipal user, Long companyId, Long specificMenuId, List<SpecificMenuPersonSaveReq> rows) {
        requireSysAdmin(user);
        requireMenu(companyId, specificMenuId);
        List<SpecificMenuPersonRes> saved = new ArrayList<>();
        for (SpecificMenuPersonSaveReq req : rows) {
            boolean isNew = req.specificMenuPersonId() == null || req.specificMenuPersonId() <= 0;
            Long id = req.specificMenuPersonId();
            if (isNew) {
                if (req.personId() == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "사원을 선택하세요.");
                }
                id = sysSpecificMenuPersonMapper.selectNextId();
                sysSpecificMenuPersonMapper.insertSpecificMenuPerson(id, specificMenuId, req);
            } else if (sysSpecificMenuPersonMapper.updateSpecificMenuPerson(companyId, specificMenuId, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysSpecificMenuPersonMapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) L60 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long companyId, Long specificMenuId, List<Long> ids) {
        requireSysAdmin(user);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return sysSpecificMenuPersonMapper.deleteSpecificMenuPersons(companyId, specificMenuId, ids);
    }

    /**
     * AS-IS updateGroup L33-53: 이 매뉴의 사원권한 목록을 읽고, 그 회사·특정업무의 모든 사원권한을 지운 뒤,
     * 읽어 둔 사원(사용여부·비고 포함)을 그 회사·특정업무의 모든 매뉴에 넣는다.
     */
    @Transactional
    public void updateGroup(UserPrincipal user, Long companyId, Long specificMenuId, String specificWorkCd) {
        requireSysAdmin(user);
        requireMenu(companyId, specificMenuId);
        List<SpecificMenuPersonRes> list = sysSpecificMenuPersonMapper.selectBySpecificMenuId(specificMenuId, specificWorkCd);
        sysSpecificMenuPersonMapper.deleteByWork(companyId, specificWorkCd);
        for (SpecificMenuPersonRes model : list) {
            sysSpecificMenuPersonMapper.insertByWork(companyId, specificWorkCd, model.personId(), model.useYn(), model.note());
        }
    }

    /** 이 매뉴가 그 회사 것이어야 한다 (회사 범위 보강) */
    private void requireMenu(Long companyId, Long specificMenuId) {
        if (sysSpecificMenuPersonMapper.countMenu(companyId, specificMenuId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}

package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuLinkRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuLinkSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysSpecificMenuLinkMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys52_SpecificMenuLink.java (selectBySpecificWorkCode / update / delete) — sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysSpecificMenuLinkService {

    private final SysSpecificMenuLinkMapper sysSpecificMenuLinkMapper;

    /** AS-IS selectBySpecificWorkCode L23 (특정업무 코드 그대로 =) */
    public List<SpecificMenuLinkRes> search(UserPrincipal user, Long companyId, String specificWorkCd) {
        requireSysAdmin(user);
        return sysSpecificMenuLinkMapper.selectBySpecificWorkCode(companyId, specificWorkCd);
    }

    /** AS-IS update(UpdateDataModel) L32: 신규(임시 ID 0 이하)면 INSERT, 아니면 UPDATE → selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<SpecificMenuLinkRes> update(UserPrincipal user, Long companyId, List<SpecificMenuLinkSaveReq> rows) {
        requireSysAdmin(user);
        List<SpecificMenuLinkRes> saved = new ArrayList<>();
        for (SpecificMenuLinkSaveReq req : rows) {
            boolean isNew = req.specificMenuLinkId() == null || req.specificMenuLinkId() <= 0;
            Long id = isNew ? sysSpecificMenuLinkMapper.selectNextId() : req.specificMenuLinkId();
            if (isNew) {
                sysSpecificMenuLinkMapper.insertSpecificMenuLink(id, companyId, req);
            } else if (sysSpecificMenuLinkMapper.updateSpecificMenuLink(companyId, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysSpecificMenuLinkMapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) L37 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long companyId, List<Long> ids) {
        requireSysAdmin(user);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return sysSpecificMenuLinkMapper.deleteSpecificMenuLinks(companyId, ids);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}

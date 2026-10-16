package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysSpecificMenuMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys50_SpecificMenu.java (selectBySpecificWorkCode / update / delete) — 고객별 시스템정보(admin 회사 메뉴)라 sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysSpecificMenuService {

    private final SysSpecificMenuMapper sysSpecificMenuMapper;

    /** AS-IS selectBySpecificWorkCode L31: 특정업무 구분 콤보 '%'(전체) 또는 코드 → LIKE */
    public List<SpecificMenuRes> search(UserPrincipal user, Long companyId, String specificWorkCd) {
        requireSysAdmin(user);
        String work = specificWorkCd == null || specificWorkCd.isEmpty() ? "%" : specificWorkCd;
        return sysSpecificMenuMapper.selectBySpecificWorkCode(companyId, work);
    }

    /**
     * AS-IS update(UpdateDataModel) L40-43 + 화면 update() L259-278 필수 검사(문구 그대로).
     * 행마다 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로.
     */
    @Transactional
    public List<SpecificMenuRes> update(UserPrincipal user, Long companyId, List<SpecificMenuSaveReq> rows) {
        requireSysAdmin(user);
        List<SpecificMenuRes> saved = new ArrayList<>();
        for (SpecificMenuSaveReq req : rows) {
            if (req.specificWorkCd() == null || req.specificWorkCd().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "특정업무 구분은 필수선택 항목입니다");
            }
            if (req.menuId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "매뉴는 필수선택 항목입니다");
            }
            boolean isNew = req.specificMenuId() == null || req.specificMenuId() <= 0;
            Long id = isNew ? sysSpecificMenuMapper.selectNextId() : req.specificMenuId();
            if (isNew) {
                sysSpecificMenuMapper.insertSpecificMenu(id, companyId, req);
            } else if (sysSpecificMenuMapper.updateSpecificMenu(companyId, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysSpecificMenuMapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) L45: ID로 지우기(사원권한·문서권한 행은 원본도 남긴다) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long companyId, List<Long> specificMenuIds) {
        requireSysAdmin(user);
        if (specificMenuIds == null || specificMenuIds.isEmpty()) {
            return 0;
        }
        return sysSpecificMenuMapper.deleteSpecificMenus(companyId, specificMenuIds);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}

package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveSettingReq;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveSettingRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveYearRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveYearSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysLeaveYearMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/sys/Sys30_LeaveYear.java (selectByAll L21 / update L48 / delete L53) + Sys01_Company.selectById·update(휴가 열만).
 * 모두 로그인 회사 것
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysLeaveYearService {

    private final SysLeaveYearMapper mapper;

    public LeaveSettingRes getSetting(UserPrincipal user) {
        return mapper.selectLeaveSetting(user.getCompanyId());
    }

    /** AS-IS Sys01_Company.update(UpdateDataModel) — 저장된 회사 행을 다시 읽어 돌려준다 */
    @Transactional
    public LeaveSettingRes updateSetting(UserPrincipal user, LeaveSettingReq req) {
        if (mapper.updateLeaveSetting(user.getCompanyId(), req.leaveYn(), req.leaveMonthCode()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectLeaveSetting(user.getCompanyId());
    }

    public List<LeaveYearRes> search(UserPrincipal user) {
        return mapper.selectByAll(user.getCompanyId());
    }

    /** AS-IS update(UpdateDataModel): 새 행(화면 임시 ID 0 이하)이면 INSERT, 아니면 UPDATE → selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<LeaveYearRes> update(UserPrincipal user, List<LeaveYearSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<LeaveYearRes> saved = new ArrayList<>();
        for (LeaveYearSaveReq req : rows) {
            boolean isNew = req.leaveYearId() == null || req.leaveYearId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.leaveYearId();
            if (isNew) {
                mapper.insertLeaveYear(id, companyId, req);
            } else if (mapper.updateLeaveYear(companyId, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteLeaveYears(user.getCompanyId(), ids);
    }
}

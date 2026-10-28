package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveExceptRes;
import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveExceptSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpJointLeaveExceptMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 공동연차 제외사원 (AS-IS Emp28_JointLeaveExcept) — Emp24_Tab_JointLeave 아래 그리드 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpJointLeaveExceptService {

    private final EmpJointLeaveExceptMapper mapper;

    /** AS-IS emp.Emp28_JointLeaveExcept.selectByJointLeaveId */
    public List<JointLeaveExceptRes> search(UserPrincipal user, Long jointLeaveId) {
        return mapper.selectByJointLeaveId(user.getCompanyId(), jointLeaveId);
    }

    /**
     * AS-IS emp.Emp28_JointLeaveExcept.update(UpdateDataModel): 새 행(ID 0 이하)은 채번해 INSERT, 나머지는 UPDATE(제외사유).
     * AS-IS는 공동연차가 로그인 회사 것인지 보지 않지만 TOBE는 확인한다(다른 회사 ID는 404).
     */
    @Transactional
    public List<JointLeaveExceptRes> save(UserPrincipal user, List<JointLeaveExceptSaveReq> rows) {
        List<JointLeaveExceptRes> saved = new ArrayList<>();
        for (JointLeaveExceptSaveReq row : rows) {
            Long id = row.jointLeaveExceptId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                if (mapper.insertJointLeaveExcept(user.getCompanyId(), id, row.jointLeaveId(), row.personId(), row.reason()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            } else if (mapper.updateJointLeaveExcept(user.getCompanyId(), id, row.reason()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(user.getCompanyId(), id));
        }
        return saved;
    }

    /** AS-IS emp.Emp28_JointLeaveExcept.delete */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteJointLeaveExcepts(user.getCompanyId(), ids);
    }
}

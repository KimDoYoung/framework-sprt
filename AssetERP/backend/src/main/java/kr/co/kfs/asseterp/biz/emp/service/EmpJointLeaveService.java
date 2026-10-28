package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpJointLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 공동연차관리 (AS-IS Emp24_Tab_JointLeave) — 1단계: [승인신청]의 결재문서 생성(Apr01_Edit_ApprDoc)·상세보기는 다음 단계 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpJointLeaveService {

    private final EmpJointLeaveMapper mapper;

    /** AS-IS emp.Emp24_JointLeave.selectByYear */
    public List<JointLeaveRes> search(UserPrincipal user, String stdYear) {
        return mapper.selectByYear(user.getCompanyId(), stdYear);
    }

    /** AS-IS emp.Emp24_JointLeave.update(UpdateDataModel): 새 행(ID 0 이하)은 채번해 INSERT, 나머지는 UPDATE → 저장한 행을 요청 순서대로 돌려준다 */
    @Transactional
    public List<JointLeaveRes> save(UserPrincipal user, List<JointLeaveSaveReq> rows) {
        List<JointLeaveRes> saved = new ArrayList<>();
        for (JointLeaveSaveReq row : rows) {
            Long id = row.jointLeaveId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertJointLeave(user.getCompanyId(), id, row.startDate(), row.closeDate(), row.reason());
            } else if (mapper.updateJointLeave(user.getCompanyId(), id, row.startDate(), row.closeDate(), row.reason()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(user.getCompanyId(), id));
        }
        return saved;
    }

    /**
     * AS-IS emp.Emp24_JointLeave.deleteApprId + delete — 상신된 결재문서는 폐기문서로 옮기고 지운 뒤 공동연차를 지운다.
     * (AS-IS는 제외사원 emp28 행을 따로 지우지 않는다)
     */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        for (Long id : ids) {
            JointLeaveRes row = mapper.selectById(user.getCompanyId(), id);
            if (row != null && row.apprId() != null) {
                mapper.insertApprDel(row.apprId(), user.getUserId());
                mapper.deleteAppr(row.apprId());
            }
        }
        return mapper.deleteJointLeaves(user.getCompanyId(), ids);
    }
}

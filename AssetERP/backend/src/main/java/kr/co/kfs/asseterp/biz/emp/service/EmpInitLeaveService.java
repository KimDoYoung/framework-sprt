package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.InitLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.InitLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpInitLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp26_InitLeave.java (selectByYear / update / delete) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpInitLeaveService {

    private final EmpInitLeaveMapper mapper;

    /** AS-IS selectByYear(companyId, year, personId) */
    public List<InitLeaveRes> search(UserPrincipal user, String year, Long personId) {
        return mapper.selectInitLeaves(user.getCompanyId(), year, personId);
    }

    /**
     * AS-IS update(UpdateDataModel): 새 행(ID 0 이하)은 채번해 INSERT, 나머지는 UPDATE → 저장한 행을 다시 읽어 요청 순서대로 돌려준다.
     * AS-IS는 사원이 로그인 회사 소속인지 보지 않지만 TOBE는 새 행에서 소속을 확인한다.
     */
    @Transactional
    public List<InitLeaveRes> save(UserPrincipal user, List<InitLeaveSaveReq> rows) {
        List<InitLeaveRes> saved = new ArrayList<>();
        for (InitLeaveSaveReq row : rows) {
            if (row.year() == null || row.year().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용일수는 필수입력 항목입니다.");
            }
            Long id = row.initLeaveId();
            if (id == null || id <= 0) {
                if (mapper.countPerson(user.getCompanyId(), row.personId()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                id = mapper.selectNextId();
                mapper.insertInitLeave(user.getCompanyId(), id, row.personId(), row.year(), row.useDays());
            } else if (mapper.updateInitLeave(user.getCompanyId(), id, row.year(), row.useDays()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectInitLeaveById(user.getCompanyId(), id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) — 로그인 회사 행만 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            count += mapper.deleteInitLeave(user.getCompanyId(), id);
        }
        return count;
    }
}

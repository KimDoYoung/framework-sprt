package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpApprStepExceptRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpApprStepExceptSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpApprStepExceptMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/emp/Emp30_ApprStepExcept.java (G10 Emp30_Tab_ApprStepExcept) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpApprStepExceptService {

    private final EmpApprStepExceptMapper mapper;

    /** AS-IS Emp30_ApprStepExcept.selectByCompanyId L23: 로그인 회사의 결재선 예외 */
    public List<EmpApprStepExceptRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /**
     * AS-IS Emp30_ApprStepExcept.update L28 → UpdateDataModel(화면 검사 없음).
     * 새 행(apprStepExceptId 없음·0 이하)은 새 ID로 INSERT. 저장한 행을 요청과 같은 순서로 돌려준다
     */
    @Transactional
    public List<EmpApprStepExceptRes> save(UserPrincipal user, List<EmpApprStepExceptSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(r -> {
            boolean isNew = r.apprStepExceptId() == null || r.apprStepExceptId() <= 0;
            long id = isNew ? mapper.selectNextId() : r.apprStepExceptId();
            EmpApprStepExceptSaveReq row = new EmpApprStepExceptSaveReq(id, r.regDate(), r.personId(), r.useYn(), r.note());
            if (isNew) {
                mapper.insertApprStepExcept(companyId, row);
            } else if (mapper.updateApprStepExcept(companyId, row) == 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "결재선 예외를 찾을 수 없습니다");
            }
            return mapper.selectById(companyId, id);
        }).toList();
    }

    /** AS-IS Emp30_ApprStepExcept.delete L33 → UpdateDataModel.deleteModel. 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteApprStepExcept(user.getCompanyId(), id)).sum();
    }
}

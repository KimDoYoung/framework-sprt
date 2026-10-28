package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalWriteGradeReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalWriteRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEvalWriteMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/emp/Emp44_EvalWrite.java (getEvalTargetList L52 / getEmpEvalGrade L58 / updateEvalGradeId L64) — 인사평가표 작성(Emp44_Lookup_Write).
 * 평가자는 늘 로그인 사원이다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpEvalWriteService {

    private final EmpEvalWriteMapper mapper;

    /** AS-IS getEvalTargetList */
    public List<EvalWriteRes> search(UserPrincipal user, Long evalListStdId, Long evalTargetId) {
        return mapper.selectEvalTargetList(evalListStdId, evalTargetId, user.getUserId());
    }

    /** AS-IS getEmpEvalGrade — 내가 매긴 점수 합계의 등급(없으면 null) */
    public String getGrade(UserPrincipal user, Long evalListStdId, Long evalTargetId) {
        return mapper.selectEmpEvalGrade(evalListStdId, evalTargetId, user.getUserId());
    }

    /** AS-IS updateEvalGradeId: 이미 작성한 항목이면 등급·환산점수(소수 첫째 자리 버림)를 고치고, 처음이면 새로 만든다 */
    @Transactional
    public void updateGrade(UserPrincipal user, EvalWriteGradeReq req) {
        if (mapper.countTargetByCompany(req.evalTargetId(), user.getCompanyId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        String orgHeadYn = String.valueOf(req.orgHead());
        if (mapper.countEvalWrite(user.getUserId(), req.evalTargetId(), req.evalListId()) > 0) {
            mapper.updateEvalGradeId(user.getUserId(), req.evalTargetId(), req.evalListId(), req.evalGradeId(), orgHeadYn);
        } else {
            mapper.insertEvalWrite(mapper.selectNextId(), user.getUserId(), req.evalTargetId(), req.evalListId(), req.evalGradeId(), orgHeadYn);
        }
    }
}

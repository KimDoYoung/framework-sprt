package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEvalGradeMapper;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEvalListStdMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/emp/Emp42_EvalGrade.java (selectByEvalListStdId L24 / updateList L31)
 * — emp42에는 회사 열이 없어 적용기준(emp40)이 로그인 회사 것인지로 회사 범위를 건다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpEvalGradeService {

    private final EmpEvalGradeMapper mapper;
    private final EmpEvalListStdMapper stdMapper;

    /** AS-IS selectByEvalListStdId (등급기준점수 큰 순) */
    public List<EvalGradeRes> search(UserPrincipal user, Long evalListStdId) {
        checkOwner(user, evalListStdId);
        return mapper.selectByEvalListStdId(evalListStdId);
    }

    /** AS-IS updateList(UpdateDataModel): 새 행(ID 없음·0 이하)은 INSERT, 아니면 UPDATE, 삭제대기는 DELETE → 저장한 건수 */
    @Transactional
    public int update(UserPrincipal user, EvalGradeSaveReq req) {
        checkOwner(user, req.evalListStdId());
        int count = 0;
        for (EvalGradeSaveReq.Row row : req.rows() == null ? List.<EvalGradeSaveReq.Row>of() : req.rows()) {
            if (row.evalGradeId() == null || row.evalGradeId() <= 0) {
                mapper.insert(mapper.selectNextId(), req.evalListStdId(), row);
            } else if (mapper.update(req.evalListStdId(), row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            count++;
        }
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) {
            mapper.deleteByIds(req.evalListStdId(), req.deleteIds());
        }
        return count;
    }

    private void checkOwner(UserPrincipal user, Long evalListStdId) {
        if (evalListStdId == null || stdMapper.countByIdAndCompany(evalListStdId, user.getCompanyId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}

package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvaluationRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvaluationSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEvaluationMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/emp09_evaluation.xml */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpEvaluationService {

    private final EmpEvaluationMapper empEvaluationMapper;

    public List<EvaluationRes> getEvaluations(UserPrincipal user, Long personId) {
        return empEvaluationMapper.selectEvaluations(user.getCompanyId(), personId);
    }

    @Transactional
    public List<EvaluationRes> updateEvaluations(UserPrincipal user, List<EvaluationSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (EvaluationSaveReq req : rows) {
            if (req.evaluationId() == null || req.evaluationId() <= 0) {
                Long newId = empEvaluationMapper.selectNextEvaluationId();
                empEvaluationMapper.insertEvaluation(newId, companyId, req);
                resultIds.add(newId);
            } else {
                int cnt = empEvaluationMapper.updateEvaluation(req.evaluationId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.evaluationId());
            }
        }
        return resultIds.stream().map(empEvaluationMapper::selectEvaluationById).toList();
    }

    @Transactional
    public int deleteEvaluations(UserPrincipal user, List<Long> evaluationIds) {
        if (evaluationIds == null || evaluationIds.isEmpty()) return 0;
        return empEvaluationMapper.deleteEvaluations(evaluationIds, user.getCompanyId());
    }
}

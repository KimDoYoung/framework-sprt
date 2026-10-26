package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanDeleteReq;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanRes;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndPlanMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/** AS-IS server/fnd/Fnd20_Plan.java (기획일정, P03) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndPlanService {

    /** 이 상태의 상신 문서가 붙은 일정은 지울 수 없다 (Fnd20_TabPage_Plan.deleteRow L184-191) */
    private static final Set<String> UNDELETABLE = Set.of("상신", "결재중", "완료", "반려");

    private final FndPlanMapper mapper;

    /** AS-IS fnd.Fnd20_Plan.selectByFundId L50 */
    public List<PlanRes> search(UserPrincipal user, Long fundId) {
        return mapper.selectByFundId(fundId, user.getCompanyId());
    }

    /**
     * AS-IS fnd.Fnd20_Plan.update L181 (UpdateDataModel). 바뀐 행만 받는다 — 새 행(planId 0 이하)은 서버가 ID를 매기고 관리자ID를 로그인 사용자로,
     * 있던 행은 만든 사람만 고칠 수 있다(화면 update() L166 검사를 서버에서도). 펀드는 로그인 회사 것이어야 한다. 저장된 행을 요청 순서대로 되돌린다
     */
    @Transactional
    public List<PlanRes> save(UserPrincipal user, List<PlanSaveReq> rows) {
        List<PlanRes> saved = new ArrayList<>();
        if (rows == null) {
            return saved;
        }
        for (PlanSaveReq req : rows) {
            boolean isNew = req.planId() == null || req.planId() <= 0;
            Long planId = req.planId();
            if (isNew) {
                if (req.fundId() == null || req.classTreeId() == null || mapper.countFund(req.fundId(), user.getCompanyId()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "펀드를 찾을 수 없습니다.");
                }
                planId = mapper.selectNextId();
                mapper.insertPlan(planId, user.getUserId(), req);
            } else {
                PlanRes old = mapper.selectById(planId, user.getCompanyId());
                if (old == null) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "기획일정을 찾을 수 없습니다.");
                }
                if (!user.getUserId().equals(old.managerId())) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "해당 내용을 생성한 자만 수정가능합니다");
                }
                mapper.updatePlan(req);
            }
            saved.add(mapper.selectById(planId, user.getCompanyId()));
        }
        return saved;
    }

    /**
     * AS-IS fnd.Fnd20_Plan.delete L186: 상신 문서가 있으면 그 문서(관련 펀드·첨부 행·결재선·문서)를 먼저 지우고 일정을 지운다.
     * 만든 사람만, 상신·결재중·완료·반려 문서가 붙은 일정은 못 지운다(화면 deleteRow() L180-191 검사를 서버에서도)
     */
    @Transactional
    public void delete(UserPrincipal user, List<PlanDeleteReq> rows) {
        if (rows == null) {
            return;
        }
        for (PlanDeleteReq req : rows) {
            PlanRes plan = mapper.selectById(req.planId(), user.getCompanyId());
            if (plan == null) {
                continue;
            }
            if (!user.getUserId().equals(plan.managerId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "해당 내용을 생성한 자만 삭제가능합니다");
            }
            if (plan.closeYn() != null && UNDELETABLE.contains(plan.closeYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "해당 보고서는 삭제할 수 없습니다");
            }
            if (plan.apprId() != null) {
                mapper.deleteRelateFund(plan.apprId());
                mapper.deleteFiles(plan.apprId());
                mapper.deleteApprSteps(plan.apprId());
                mapper.deleteAppr(plan.apprId());
            }
            mapper.deletePlan(plan.planId());
        }
    }
}

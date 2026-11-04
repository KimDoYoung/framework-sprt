package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprNewRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprRelateReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewStepRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprWriteMapper;
import kr.co.kfs.asseterp.biz.apr.service.AprApprNewService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanDeleteReq;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanRes;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanTodoRes;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndPlanMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private final AprApprNewService aprNewService;
    private final AprApprWriteMapper aprWriteMapper;

    /** AS-IS Fnd20_Lookup_ToDoList.retrieve: [전체보기]면 selectByPersonId(내 일정 중 기준일이 기간에 드는 것), 아니면 selectById(그 일정 한 건) */
    public List<PlanTodoRes> searchTodo(UserPrincipal user, Long planId, LocalDate startDate, boolean all) {
        if (all) return mapper.selectTodoByPersonId(user.getUserId(), user.getCompanyId(), startDate);
        return mapper.selectTodoById(planId, user.getCompanyId());
    }

    /**
     * AS-IS Fnd20_Plan.insertAppr L93 — [결재요청]: 상신 문서가 없으면(결재 상태가 없으면) 임시저장(99) 문서를 만들고(제목 " ", 문서분류 기본 서식, 내부문서),
     * 연관펀드 한 줄 · 기본 결재선을 넣고 일정에 문서 ID를 기록한다. 이미 있으면 그 문서 ID를 돌려준다. 호출한 화면이 그 문서를 연다
     */
    @Transactional
    public Long requestAppr(UserPrincipal user, Long planId) {
        Long companyId = user.getCompanyId();
        PlanRes plan = mapper.selectById(planId, companyId);
        if (plan == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        Long apprId = plan.closeYn() == null ? null : plan.apprId();
        if (apprId != null) return apprId;

        AprApprNewRes open = aprNewService.open(user, plan.classTreeId());  // 문서 번호·기본 서식·기본 결재선(createApprovalTypeCd)
        apprId = open.apprId();
        LocalDateTime regDate = LocalDate.now().atStartOfDay();
        AprApprSaveReq req = new AprApprSaveReq("save", plan.classTreeId(), null, " ", open.content(), null, null, regDate, null, null, null,
                "20", null, null, null, null, null, false, List.of());
        String dcrIdWord = aprWriteMapper.selectDcrIdWord(companyId, plan.personId(), regDate);
        aprWriteMapper.insertAppr(apprId, companyId, plan.personId(), "99", dcrIdWord, null, req);
        aprWriteMapper.insertRelateFund(aprWriteMapper.selectNextId(), apprId, new AprApprRelateReq.Fund(null, plan.fundId(), null, null));
        for (AprNewStepRes st : open.steps()) {
            aprWriteMapper.insertStep(st.apprStepId(), apprId, st.stepTypeCode(), st.seq(), st.stepStatusCode(), st.stepEmpId(), st.apprEmpId(),
                    null, null, String.valueOf(st.lockYn()), null, null);
        }
        mapper.updateApprId(planId, apprId);
        return apprId;
    }

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

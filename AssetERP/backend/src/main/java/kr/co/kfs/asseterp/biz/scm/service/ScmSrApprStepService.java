package kr.co.kfs.asseterp.biz.scm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.scm.dto.SrApprStepReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrApprStepRes;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmSrApprStepMapper;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmSrMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Scm02_Grid_ApprStep·Scm02_Edit_ApprStep·Scm02_Edit_NoteMessage·Scm01_Edit_Sr 의 결재 처리(EE15) → server/scm/Scm02_SrApprStep.java
 * (selectBySrId L25 / modelUpdate L37 / updateList L51)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScmSrApprStepService {

    private final ScmSrApprStepMapper mapper;
    private final ScmSrMapper srMapper;

    /** AS-IS selectBySrId */
    public List<SrApprStepRes> search(Long srId) {
        return mapper.selectBySrId(srId);
    }

    /**
     * AS-IS updateList — 그 의뢰의 결재단계를 모두 지우고 보낸 줄로 다시 넣는다. 번호가 0 이하인 줄은 새 줄이라 번호를 받는다.
     * (AS-IS 의 sms 인자는 서버에서 쓰지 않는다)
     */
    @Transactional
    public List<SrApprStepRes> saveAll(Long srId, List<SrApprStepReq> steps) {
        mapper.deleteBySrId(srId);
        if (steps != null) {
            for (SrApprStepReq s : steps) {
                long id = s.srApprStepId() == null || s.srApprStepId() <= 0 ? mapper.selectNextId() : s.srApprStepId();
                mapper.insertStep(id, srId, s);
            }
        }
        return mapper.selectBySrId(srId);
    }

    /**
     * AS-IS Scm01_Edit_Sr.updateApprStep — 승인 '20' / 반려 '30'. 결재단계를 바꾸고(결재일 = 지금, 실결재자 = 로그인 사원),
     * 마지막 결재자면 의뢰의 승인상태를 승인 '30' / 반려 '40'으로 바꾼다. 화면은 내 차례인 결재자에게만 버튼을 켜므로 같은 조건을 서버도 본다
     */
    @Transactional
    public List<SrApprStepRes> decide(UserPrincipal user, Long srApprStepId, String stepStatusCd, boolean last) {
        if (!"20".equals(stepStatusCd) && !"30".equals(stepStatusCd)) throw new BusinessException(ErrorCode.INVALID_INPUT);
        SrApprStepRes step = mapper.selectByStepId(srApprStepId);
        if (step == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        if (!user.getUserId().equals(step.stepEmpId())) throw new BusinessException(ErrorCode.ACCESS_DENIED);
        mapper.updateDecision(srApprStepId, stepStatusCd, user.getUserId());
        if (last) srMapper.updateApprStatus(step.srId(), "20".equals(stepStatusCd) ? "30" : "40");
        return mapper.selectBySrId(step.srId());
    }

    /** AS-IS Scm02_Edit_NoteMessage.update — 결재의견·반려사유는 실결재자만 고친다(창이 [저장]을 그 사원에게만 보인다) */
    @Transactional
    public void updateNote(UserPrincipal user, Long srApprStepId, String note, String rejectReason) {
        SrApprStepRes step = mapper.selectByStepId(srApprStepId);
        if (step == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        if (!user.getUserId().equals(step.apprEmpId())) throw new BusinessException(ErrorCode.ACCESS_DENIED);
        mapper.updateNote(srApprStepId, note, rejectReason);
    }
}

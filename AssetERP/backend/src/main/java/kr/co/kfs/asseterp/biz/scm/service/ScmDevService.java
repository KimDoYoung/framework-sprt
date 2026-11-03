package kr.co.kfs.asseterp.biz.scm.service;

import kr.co.kfs.asseterp.biz.scm.dto.DevRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepListReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepRuleListReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepRuleRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepRuleSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.ExpectProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.ExpectProgramSaveReq;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmDevMapper;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmDevStepMapper;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmDevStepRuleMapper;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmExpectProgramMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Scm01_Edit_DevMng 아래 그리드들(EE16) → server/scm/Scm10_Dev(selectBySrId L42 / updateList L50 / delete L96) ·
 * Scm03_ExpectProgram(L23/31/36) · Scm11_DevStep(selectByDevId L26 / updateResult L147 / deleteByDevId L161 / inUpdateProgress L190 / delete L217) ·
 * Scm12_DevStepRule(getList L21 / updateList L26 / delete L37)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScmDevService {

    private final ScmDevMapper devMapper;
    private final ScmExpectProgramMapper expectMapper;
    private final ScmDevStepMapper stepMapper;
    private final ScmDevStepRuleMapper ruleMapper;

    // ---- 개발자 (Scm10_Dev) ----

    public List<DevRes> searchDevs(Long srId) {
        return devMapper.selectBySrId(srId);
    }

    /**
     * AS-IS Scm10_Dev.updateList — 개발자 줄을 저장(새 줄은 번호가 0 이하 → INSERT)하고, 그 개발자에게 진행단계가 하나도 없으면
     * 기본설정(scm12) 규칙마다 진행단계를 만든다(구분 '10' 개발 단계의 담당자는 그 개발자).
     */
    @Transactional
    public void saveDevs(List<DevSaveReq> devs) {
        if (devs == null) return;
        List<DevStepRuleRes> rules = null;
        for (DevSaveReq req : devs) {
            long devId = req.devId() == null ? 0 : req.devId();
            if (devId <= 0 || devMapper.countById(devId) == 0) {
                if (devId <= 0) devId = devMapper.selectNextId();
                if (req.srId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "개발의뢰가 없습니다");
                devMapper.insertDev(devId, req);
            } else {
                devMapper.updateDev(req);
            }
            if (devMapper.countStepsByDevId(devId) == 0) {
                if (rules == null) rules = devMapper.selectRules();
                for (DevStepRuleRes rule : rules) {
                    devMapper.insertDevStep(devMapper.selectNextId(), devId, rule.devStepSeq(), rule.devStepCd(),
                            "10".equals(rule.devStepCd()) ? req.personId() : null);
                }
            }
        }
    }

    /** AS-IS Scm10_Grid_Dev.deleteRow — 진행단계를 먼저 지우고(deleteByDevId) 개발자를 지운다 */
    @Transactional
    public int deleteDevs(List<Long> devIds) {
        if (devIds == null || devIds.isEmpty()) return 0;
        for (Long devId : devIds) devMapper.deleteStepsByDevId(devId);
        return devMapper.deleteDevs(devIds);
    }

    // ---- 예상프로그램 (Scm03_ExpectProgram) ----

    public List<ExpectProgramRes> searchExpectPrograms(Long srId) {
        return expectMapper.selectBySrId(srId);
    }

    /** AS-IS Scm03_ExpectProgram.update — 새 줄(번호 0 이하)만 INSERT (편집 열이 없다) */
    @Transactional
    public void saveExpectPrograms(List<ExpectProgramSaveReq> rows) {
        if (rows == null) return;
        for (ExpectProgramSaveReq r : rows) {
            long id = r.expectProgramId() == null ? 0 : r.expectProgramId();
            if (id > 0) continue;  // 이미 저장된 줄은 바꿀 열이 없다
            expectMapper.insert(expectMapper.selectNextId(), r.srId(), r.programId());
        }
    }

    @Transactional
    public int deleteExpectPrograms(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        return expectMapper.delete(ids);
    }

    // ---- 진행단계 (Scm11_DevStep) ----

    public List<DevStepRes> searchSteps(Long devId) {
        return stepMapper.selectByDevId(devId);
    }

    /** AS-IS Scm11_Lookup_DevStep.update — 삭제 목록(delete) + 그리드 전체(inUpdateProgress). 한 트랜잭션 */
    @Transactional
    public void saveSteps(Long devId, DevStepListReq req) {
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) stepMapper.deleteSteps(req.deleteIds());
        if (req.steps() == null) return;
        for (DevStepSaveReq s : req.steps()) {
            stepMapper.upsertProgress(s.devStepId(), devId, s.devStepSeq(), s.devStepCd(), s.personId());
        }
    }

    /** AS-IS Scm11_Lookup_Result.update → updateResult */
    @Transactional
    public void updateStepResult(Long devStepId, String result) {
        stepMapper.updateResult(devStepId, result);
    }

    // ---- 진행단계 기본설정 (Scm12_DevStepRule) ----

    public List<DevStepRuleRes> searchRules() {
        return ruleMapper.getList();
    }

    @Transactional
    public void saveRules(DevStepRuleListReq req) {
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) ruleMapper.delete(req.deleteIds());
        if (req.rules() == null) return;
        for (DevStepRuleSaveReq r : req.rules()) ruleMapper.upsert(r.devStepRuleId(), r.devStepSeq(), r.devStepCd());
    }
}

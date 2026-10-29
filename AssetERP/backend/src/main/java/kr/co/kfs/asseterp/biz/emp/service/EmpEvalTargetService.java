package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalAdminRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalCandidateRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalCeoScoreReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalExecuteRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalRelateApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalScoreReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalSettingRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetDeleteReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetEvaluatorsReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetRow;
import kr.co.kfs.asseterp.biz.emp.dto.HighInfoRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEvalTargetMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * AS-IS server/emp/Emp43_EvalTarget.java (selectByTermCode L32 / updateEval L89 / updateList L125 / deleteList L163 / update L199)
 * + Emp44_EvalWrite.selectByEvaluatorId L34 · Emp45_EvalRelateAppr.selectByTermCode L25 · Emp00_TransInfo.selectByEvalText L72·getHighInfo L610
 * — 인사평가 대상자(Emp43_Tab_EvalTarget). 로그인 회사 것만 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpEvalTargetService {

    private final EmpEvalTargetMapper mapper;

    /** AS-IS sys.Sys01_Company.selectById 중 인사평가 설정 (Emp43_Tab_EvalTarget settings L150) */
    public EvalSettingRes getSetting(UserPrincipal user) {
        EvalSettingRes setting = mapper.selectEvalSetting(user.getCompanyId());
        return setting != null ? setting : new EvalSettingRes(null, null);
    }

    /** AS-IS selectByTermCode */
    public List<EvalTargetRes> search(UserPrincipal user, String stdYear, String stdTermCode, Long orgId) {
        return mapper.selectByTermCode(user.getCompanyId(), stdYear, stdTermCode, orgId);
    }

    /** AS-IS Emp45_EvalRelateAppr.selectByTermCode — 최종 결재 상태 코드(결재 행이 없으면 null) */
    public String getFinalApprStatusCode(UserPrincipal user, String stdYear, String stdTermCode) {
        List<String> codes = mapper.selectFinalApprStatusCodes(user.getCompanyId(), stdYear, stdTermCode);
        return codes.isEmpty() ? null : codes.get(0);
    }

    /** AS-IS Emp00_TransInfo.selectByEvalText — 서버가 기준일을 오늘로 정한다 */
    public List<EvalCandidateRes> searchCandidates(UserPrincipal user, String searchText) {
        return mapper.selectByEvalText(user.getCompanyId(), "%" + nvl(searchText) + "%", LocalDate.now().toString());
    }

    /** AS-IS Emp00_TransInfo.getHighInfo */
    public List<HighInfoRes> getHighInfos(UserPrincipal user, Long personId, Long orgCodeId, LocalDate transDate) {
        return mapper.getHighInfo(user.getCompanyId(), personId, orgCodeId, transDate.toString());
    }

    /** AS-IS Emp43_EvalTarget.selectByText (Emp43_Tab_EvalExecute) — 로그인 사원이 평가자인 대상자 */
    public List<EvalExecuteRes> searchExecutes(UserPrincipal user, String stdYear, String stdTermCode, String searchText) {
        return mapper.selectByText(user.getCompanyId(), stdYear, stdTermCode, "%" + nvl(searchText) + "%", user.getUserId());
    }

    /** AS-IS Emp43_EvalTarget.getWrite (Emp44_Lookup_Write refresh) — 평가상태('완료'·'작성중'·'') */
    public String getWriteStatus(UserPrincipal user, Long evalTargetId) {
        return mapper.selectWriteStatus(evalTargetId, user.getCompanyId(), user.getUserId());
    }

    /** AS-IS Emp45_EvalRelateAppr.selectByTermCode 중 1차보고 상신문서 상태 코드(상신 행이 없으면 null) */
    public String getApprStatusCode(UserPrincipal user, String stdYear, String stdTermCode) {
        List<String> codes = mapper.selectApprStatusCodes(user.getCompanyId(), stdYear, stdTermCode);
        return codes.isEmpty() ? null : codes.get(0);
    }

    /** AS-IS Emp43_EvalTarget.updateReason — 내가 평가자인 대상자의 평정사유만 */
    @Transactional
    public void updateReason(UserPrincipal user, Long evalTargetId, String reason, String orderEvalName) {
        mapper.updateReason(user.getCompanyId(), user.getUserId(), evalTargetId, reason, orderEvalName);
    }

    /** AS-IS Emp43_EvalTarget.updateEndYn — 평가완료(내 작성 점수 합계가 점수)·평가취소(점수 비움) */
    @Transactional
    public void updateEndYn(UserPrincipal user, Long evalTargetId, boolean endYn, String orderEvalName) {
        mapper.updateEndYn(user.getCompanyId(), user.getUserId(), evalTargetId, String.valueOf(endYn), orderEvalName);
    }

    /** AS-IS Emp43_EvalTarget.selectByTextAdmin (Emp43_Tab_FirstAppr·Emp43_Tab_FinalAppr) — 회사 전체 대상자 */
    public List<EvalAdminRes> searchAdmin(UserPrincipal user, String stdYear, String stdTermCode, String searchText, Long targetPersonId) {
        return mapper.selectByTextAdmin(user.getCompanyId(), stdYear, stdTermCode, "%" + nvl(searchText) + "%", targetPersonId);
    }

    /** AS-IS Emp43_EvalTarget.selectByTextAdminAll (Emp43_Tab_EvalResult "기간조건 제외") — 평가기간 조건 없이 전체 */
    public List<EvalAdminRes> searchAdminAll(UserPrincipal user, String searchText, Long targetPersonId) {
        return mapper.selectByTextAdminAll(user.getCompanyId(), "%" + nvl(searchText) + "%", targetPersonId);
    }

    /** AS-IS Emp45_EvalRelateAppr.selectByTermCode — 상신 상태(1차·최종). 상신 행이 없으면 null */
    public EvalRelateApprRes getRelateAppr(UserPrincipal user, String stdYear, String stdTermCode) {
        List<EvalRelateApprRes> list = mapper.selectRelateAppr(user.getCompanyId(), stdYear, stdTermCode);
        return list.isEmpty() ? null : list.get(0);
    }

    /** AS-IS Emp43_EvalTarget.modelUpdate (Emp43_Edit_Score) — 상점·벌점·평정사유가감 */
    @Transactional
    public void updateScore(UserPrincipal user, Long evalTargetId, EvalScoreReq req) {
        mapper.updateScore(user.getCompanyId(), evalTargetId, req.plusScore(), req.minusScore(), req.reasonAdjustScore());
    }

    /** AS-IS Emp43_EvalTarget.modelUpdate (Emp43_Edit_CeoScore) — 대표이사 가점·감점 */
    @Transactional
    public void updateCeoScore(UserPrincipal user, Long evalTargetId, EvalCeoScoreReq req) {
        mapper.updateCeoScore(user.getCompanyId(), evalTargetId, req.ceoEvalBonus(), req.ceoEvalPenalty());
    }

    /** AS-IS Emp44_EvalWrite.selectByEvaluatorId — 그 평가자의 작성 내역이 있는가 */
    public boolean hasWrite(UserPrincipal user, Long evalTargetId, Long personId) {
        return mapper.countWriteByEvaluatorId(user.getCompanyId(), evalTargetId, personId) > 0;
    }

    /**
     * AS-IS update / updateList: 신규(ID ≤ 0)는 INSERT, 그 밖은 평가자·비중 UPDATE 뒤 selectById로 다시 읽어 요청 순서로 돌려준다.
     * deleteWrites(updateList)면 DB와 평가자가 달라진 대상자의 이전 평가자 작성 내역(emp44)을 먼저 지운다
     */
    @Transactional
    public List<EvalTargetRes> save(UserPrincipal user, List<EvalTargetRow> rows, boolean deleteWrites) {
        Long companyId = user.getCompanyId();
        List<EvalTargetRes> saved = new ArrayList<>();
        for (EvalTargetRow row : rows) {
            Long id = row.evalTargetId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertEvalTarget(companyId, withId(row, id));
            } else {
                if (deleteWrites) {
                    deleteChangedWrites(companyId, id, row.firstEvaluatorId(), row.secondEvaluatorId());
                }
                if (mapper.updateEvalTarget(companyId, row) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            }
            saved.add(mapper.selectById(id, companyId));
        }
        return saved;
    }

    /** AS-IS deleteList: 화면 값과 DB의 평가자가 다르면 이전 평가자의 작성 내역을 지우고, 대상자를 지운다 */
    @Transactional
    public int delete(UserPrincipal user, List<EvalTargetDeleteReq.Row> rows) {
        Long companyId = user.getCompanyId();
        int count = 0;
        for (EvalTargetDeleteReq.Row row : rows) {
            deleteChangedWrites(companyId, row.evalTargetId(), row.firstEvaluatorId(), row.secondEvaluatorId());
            count += mapper.deleteEvalTarget(companyId, row.evalTargetId());
        }
        return count;
    }

    /** AS-IS updateEval: 고른 대상자들의 1·2차 평가자와 비중을 바꾼다 */
    @Transactional
    public void changeEvaluators(UserPrincipal user, EvalTargetEvaluatorsReq req) {
        for (Long evalTargetId : req.evalTargetIds()) {
            mapper.updateEval(user.getCompanyId(), evalTargetId, req.firstPersonId(), req.firstEvalWeight(),
                    req.secondPersonId(), req.secondEvalWeight());
        }
    }

    /** AS-IS updateList·deleteList의 emp44_eval_write.deleteByPersonId 두 번 (2차는 DB에 2차 평가자가 있을 때만) */
    private void deleteChangedWrites(Long companyId, Long evalTargetId, Long firstEvaluatorId, Long secondEvaluatorId) {
        EvalTargetRes db = mapper.selectById(evalTargetId, companyId);
        if (db == null) {
            return;
        }
        if (!Objects.equals(db.firstEvaluatorId(), firstEvaluatorId) && db.firstEvaluatorId() != null) {
            mapper.deleteWriteByPersonId(companyId, db.stdYear(), db.stdTermCd(), db.personId(), db.firstEvaluatorId());
        }
        if (db.secondEvaluatorId() != null && !db.secondEvaluatorId().equals(secondEvaluatorId)) {
            mapper.deleteWriteByPersonId(companyId, db.stdYear(), db.stdTermCd(), db.personId(), db.secondEvaluatorId());
        }
    }

    private EvalTargetRow withId(EvalTargetRow r, Long id) {
        return new EvalTargetRow(id, r.personId(), r.stdYear(), r.stdTermCd(), r.evalListStdId(), r.evalStartDate(),
                r.evalCloseDate(), r.firstEvaluatorId(), r.firstEvalWeight(), r.secondEvaluatorId(), r.secondEvalWeight());
    }

    private String nvl(String s) {
        return s == null ? "" : s;
    }
}

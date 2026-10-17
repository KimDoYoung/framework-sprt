package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceAnswerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceAnswerSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceDateRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceSaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsComplianceMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Ics30_Tab_Compliance·Ics30_Lookup_Insert·Ics33_TabPage_ComplianceAnswer → server/ics/Ics30_Compliance.java
 * (groupByStartDate L87 / selectByStartDate L60 / updateDateFixYn L93 / insert L107 / checkDate L148 / deleteByDate L174 / updateList L203)
 * + Ics31_ComplianceWrite.selectByStartDate L28 + Ics33_ComplianceAnswer (selectByCompanyId L24 / update L36 / delete L41).
 * 회사는 로그인 회사로 채우고, 수정·삭제도 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsComplianceService {

    private static final String KIND_CODE = "IcsComplianceType";

    private final IcsComplianceMapper mapper;

    /** AS-IS groupByStartDate: 기준 적용일 목록 */
    public List<IcsComplianceDateRes> dates(UserPrincipal user) {
        return mapper.selectDates(user.getCompanyId());
    }

    /** AS-IS selectByStartDate: 그 기준 적용일의 준수항목 */
    public List<IcsComplianceRes> list(UserPrincipal user, LocalDate startDate) {
        return mapper.selectByStartDate(user.getCompanyId(), startDate, KIND_CODE);
    }

    /**
     * AS-IS Ics30_Compliance.insert: 오늘 이전 가장 늦은 기준 적용일의 준수항목과 답변을 새 기준 적용일로 복사한다.
     * 아무것도 없으면 준수구분 "0"(임시) 한 행만 만든다
     */
    @Transactional
    public void createDate(UserPrincipal user, LocalDate startDate) {
        Long companyId = user.getCompanyId();
        List<IcsComplianceRes> latest = mapper.selectLatest(companyId);
        if (latest.isEmpty()) {
            mapper.insert(companyId, mapper.selectNextId(), startDate, "0", null, null, null, null, null, null, null);
            return;
        }
        for (IcsComplianceRes r : latest) {
            mapper.insert(companyId, mapper.selectNextId(), startDate, r.complianceType(), r.subNum(), r.content(),
                    r.naUseYn(), r.useYn(), r.useCloseDate(), r.note(), null);
            mapper.copyAnswers(companyId, startDate, r.complianceType());
        }
    }

    /** AS-IS Ics31_ComplianceWrite.selectByStartDate: 기준 적용일 이후 작성 기록이 있으면 true (확정 전 검사) */
    public boolean hasWriteAfter(UserPrincipal user, LocalDate startDate) {
        return mapper.countWriteByStartDate(user.getCompanyId(), startDate) > 0;
    }

    /** AS-IS Ics30_Compliance.checkDate: 그 기준 적용일의 준수항목에 작성 기록이 있으면 true (확정취소 전 검사) */
    public boolean hasWrite(UserPrincipal user, LocalDate startDate) {
        return mapper.selectByStartDate(user.getCompanyId(), startDate, KIND_CODE).stream()
                .anyMatch(r -> mapper.countWriteByComplianceId(r.complianceId()) > 0);
    }

    /** AS-IS updateDateFixYn: 확정('true')·확정취소('false') */
    @Transactional
    public void updateDateFixYn(UserPrincipal user, LocalDate startDate, String dateFixYn) {
        mapper.updateDateFixYn(user.getCompanyId(), startDate, dateFixYn);
    }

    /** AS-IS deleteByDate: 작성 기록이 있으면 못 지운다. 지우면 그 기준 적용일의 준수답변도 지운다 */
    @Transactional
    public void deleteDate(UserPrincipal user, LocalDate startDate) {
        if (hasWrite(user, startDate)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "삭제 불가능한 내용이 포함되어있습니다");
        }
        mapper.deleteByDate(user.getCompanyId(), startDate);
        mapper.deleteAnswersByDate(user.getCompanyId(), startDate);
    }

    /**
     * AS-IS updateList(actionCode "check"): 1 = 그대로 저장, 1 초과 = 이미 작성 기록이 있는 항목을 고침(확인 창),
     * 1 미만 = 작성 기록이 있는 항목을 지우려 함(못 지운다)
     */
    public int saveCheck(IcsComplianceSaveReq req) {
        int i = 1;
        int e = 1;
        for (IcsComplianceSaveReq.Row row : nullToEmpty(req.rows())) {
            if (row.complianceId() != null && mapper.countWriteByComplianceId(row.complianceId()) > 0) {
                i++;
            }
        }
        for (Long id : nullToEmpty(req.deleteIds())) {
            if (mapper.countWriteByComplianceId(id) > 0) {
                i++;
                e--;
            }
        }
        return e != 1 ? e : i;
    }

    /**
     * AS-IS updateList(actionCode "yes") → UpdateDataModel: 고친 행은 고치고(없으면 넣고), 지울 행은 지운다.
     * 준수구분은 DB 필수라 비면 미리 막는다(원본은 DB 오류)
     */
    @Transactional
    public int save(UserPrincipal user, IcsComplianceSaveReq req) {
        Long companyId = user.getCompanyId();
        int count = 0;
        for (IcsComplianceSaveReq.Row r : nullToEmpty(req.rows())) {
            if (r.complianceType() == null || r.complianceType().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "준수항목은 필수선택 항목입니다");
            }
            long id = (r.complianceId() == null || r.complianceId() <= 0) ? mapper.selectNextId() : r.complianceId();
            IcsComplianceSaveReq.Row row = new IcsComplianceSaveReq.Row(id, r.startDate(), r.complianceType(), r.subNum(), r.content(),
                    r.naUseYn(), r.useYn(), r.useCloseDate(), r.note());
            if (mapper.update(companyId, row) == 0) {
                mapper.insert(companyId, id, row.startDate(), row.complianceType(), row.subNum(), row.content(),
                        row.naUseYn(), row.useYn(), row.useCloseDate(), row.note(), "false");
            }
            count++;
        }
        for (Long id : nullToEmpty(req.deleteIds())) {
            count += mapper.deleteById(companyId, id);
        }
        return count;
    }

    // ── Ics33 준수답변 ──

    /** AS-IS Ics33_ComplianceAnswer.selectByCompanyId */
    public List<IcsComplianceAnswerRes> answers(UserPrincipal user, LocalDate startDate, String complianceType) {
        return mapper.selectAnswers(user.getCompanyId(), startDate, complianceType);
    }

    /** AS-IS Ics33_ComplianceAnswer.update(UpdateDataModel): 고친 행은 고치고(없으면 넣고) → 저장 건수 */
    @Transactional
    public int saveAnswers(UserPrincipal user, List<IcsComplianceAnswerSaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (IcsComplianceAnswerSaveReq r : rows) {
            long id = (r.complianceAnswerId() == null || r.complianceAnswerId() <= 0) ? mapper.selectNextId() : r.complianceAnswerId();
            IcsComplianceAnswerSaveReq row = new IcsComplianceAnswerSaveReq(id, r.startDate(), r.complianceType(), r.caseNo(),
                    r.answer1Cd(), r.answer2Cd(), r.answer3Cd(), r.answer4Cd(), r.answer5Cd());
            if (mapper.updateAnswer(companyId, row) == 0) {
                mapper.insertAnswer(companyId, row);
            }
        }
        return rows.size();
    }

    /** AS-IS Ics33_ComplianceAnswer.delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int deleteAnswers(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteAnswerById(user.getCompanyId(), id)).sum();
    }

    private static <T> List<T> nullToEmpty(List<T> list) {
        return list == null ? List.of() : list;
    }
}

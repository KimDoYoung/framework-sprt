package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteAnswerReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteCreateReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteFixReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteItem;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsChecklistWriteMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Ics15_Tab_ChecklistWrite·Ics15_Edit_Reason → server/ics/Ics10_Checklist.selectByPersonId L53 +
 * Ics15_ChecklistWrite (selectById L23 / updateAnswerCode L29 / modelUpdate L137 / updateFixYn L150 / deleteByPersonId L166) — K05 내부통제 체크리스트 작성.
 * 회사·사원은 로그인 사용자로 채우고, 수정·삭제도 내 작성 행만(보안 보강). stdDate = 기준 분기(월)의 말일
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsChecklistWriteService {

    private final IcsChecklistWriteMapper mapper;

    /** AS-IS settings()의 Sys01_Company.selectById — 체크주기 M(월)/Q(분기), 설정이 없으면 null */
    public String cycleType(UserPrincipal user) {
        return mapper.selectCycleType(user.getCompanyId());
    }

    /** AS-IS Ics10_Checklist.selectByPersonId (searchText는 "%검색어%") */
    public List<IcsChecklistWriteRes> list(UserPrincipal user, LocalDate stdDate, String cycleType, Long checklistLClassId, Long checklistMClassId,
                                           String searchText, boolean checkBox) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), stdDate, checklistLClassId, checklistMClassId,
                "%" + (searchText == null ? "" : searchText) + "%", checkBox, cycleType);
    }

    /** AS-IS Ics15_ChecklistWrite.updateAnswerCode: 그 달 작성 행이 있으면 답변만 바꾸고, 없으면 새로 만든다 */
    @Transactional
    public IcsChecklistWriteItem updateAnswerCode(UserPrincipal user, IcsChecklistWriteAnswerReq req) {
        IcsChecklistWriteItem found = mapper.selectByChecklist(user.getCompanyId(), user.getUserId(), req.checklistId(), req.yyyymm(), req.cycleType());
        if (found != null) {
            mapper.updateAnswerCode(user.getCompanyId(), user.getUserId(), found.checklistWriteId(), req.answerCode());
            return mapper.selectById(user.getCompanyId(), user.getUserId(), found.checklistWriteId());
        }
        return insert(user, req.checklistId(), req.yyyymm(), req.cycleType(), req.answerCode());
    }

    /** AS-IS Ics15_Tab_ChecklistWrite 수정 아이콘: 작성 행이 없으면 답변 없이 먼저 만든다(modelUpdate) */
    @Transactional
    public IcsChecklistWriteItem create(UserPrincipal user, IcsChecklistWriteCreateReq req) {
        IcsChecklistWriteItem found = mapper.selectByChecklist(user.getCompanyId(), user.getUserId(), req.checklistId(), req.yyyymm(), req.cycleType());
        if (found != null) {
            return found;
        }
        return insert(user, req.checklistId(), req.yyyymm(), req.cycleType(), null);
    }

    /** AS-IS Ics15_ChecklistWrite.selectById — 사유 창을 열 때 */
    public IcsChecklistWriteItem get(UserPrincipal user, Long checklistWriteId) {
        return required(mapper.selectById(user.getCompanyId(), user.getUserId(), checklistWriteId));
    }

    /** AS-IS Ics15_Edit_Reason.update → modelUpdate */
    @Transactional
    public IcsChecklistWriteItem updateReason(UserPrincipal user, Long checklistWriteId, String reason) {
        required(mapper.selectById(user.getCompanyId(), user.getUserId(), checklistWriteId));
        mapper.updateReason(user.getCompanyId(), user.getUserId(), checklistWriteId, reason);
        return mapper.selectById(user.getCompanyId(), user.getUserId(), checklistWriteId);
    }

    /** AS-IS Ics15_ChecklistWrite.updateFixYn — 그리드 행들의 작성 행을 제출('true')·제출취소('false') */
    @Transactional
    public int updateFixYn(UserPrincipal user, IcsChecklistWriteFixReq req) {
        String fixYn = Boolean.TRUE.equals(req.fixYn()) ? "true" : "false";
        int count = 0;
        for (Long id : req.writeIds() == null ? List.<Long>of() : req.writeIds()) {
            count += mapper.updateFixYn(user.getCompanyId(), user.getUserId(), id, fixYn);
        }
        return count;
    }

    /** AS-IS Ics15_ChecklistWrite.deleteByPersonId — 작성내역이 없거나 확인이 끝난 내역이 있으면 지우지 않는다 */
    @Transactional
    public int deleteByPersonId(UserPrincipal user, LocalDate stdDate, String cycleType) {
        List<IcsChecklistWriteItem> list = mapper.selectWrite(user.getCompanyId(), user.getUserId(), stdDate, cycleType);
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "작성내역이 존재하지 않습니다");
        }
        for (IcsChecklistWriteItem model : list) {
            if (Boolean.TRUE.equals(model.confirmYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "확인이 완료된 내역이 존재합니다.");
            }
        }
        int count = 0;
        for (IcsChecklistWriteItem model : list) {
            count += mapper.deleteById(user.getCompanyId(), user.getUserId(), model.checklistWriteId());
        }
        return count;
    }

    private IcsChecklistWriteItem insert(UserPrincipal user, Long checklistId, String yyyymm, String cycleType, String answerCode) {
        long id = mapper.selectNextId();
        mapper.insert(user.getCompanyId(), user.getUserId(), id, checklistId, yyyymm, answerCode, cycleType);
        return mapper.selectById(user.getCompanyId(), user.getUserId(), id);
    }

    private static IcsChecklistWriteItem required(IcsChecklistWriteItem item) {
        if (item == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "작성 내역을 찾을 수 없습니다");
        }
        return item;
    }
}

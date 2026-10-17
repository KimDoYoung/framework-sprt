package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistClassCodeRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistSaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsChecklistMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Ics10_Tab_ChecklistAdmin·Ics10_Edit_Checklist → server/ics/Ics10_Checklist.java (selectByAdmin L40 / modelUpdate L69 / delete L121)
 * + server/sys/Sys09_Code.selectByIcs21 L213·selectByIcs23 L222 (분류 콤보). 회사는 로그인 회사로 채우고, 조회·수정·삭제도 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsChecklistService {

    private final IcsChecklistMapper mapper;

    /** AS-IS selectByAdmin: 대분류·중분류 없으면 전체, useYn '%'·'true'·'false', 검색어는 %…%, 기준일 오늘 */
    public List<IcsChecklistRes> search(UserPrincipal user, Long checklistLClassId, Long checklistMClassId, String useYn, String searchText) {
        String yn = (useYn == null || useYn.isBlank()) ? "%" : useYn;
        return mapper.selectByAdmin(user.getCompanyId(), checklistLClassId, checklistMClassId, yn,
                "%" + (searchText == null ? "" : searchText) + "%", LocalDate.now());
    }

    /** 새 체크리스트를 열 때 받는 id (AS-IS GridInsertRow가 getSeq로 미리 받아 넣던 id — 연결 법규를 저장 전에 붙이려면 필요) */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /**
     * AS-IS modelUpdate: 중분류·체크대상이 있어야 한다. id가 있으면 고치고(없으면 그 id로 넣는다), 공통 회사(0)가 아니면 고객사별 설정(ics11)의 사용여부도 같이 고친다.
     * → 저장된 행(selectById)
     */
    @Transactional
    public IcsChecklistRes save(UserPrincipal user, IcsChecklistSaveReq req) {
        if (req.checklistMClassId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "중분류는 필수선택 항목입니다");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "체크대상은 필수입력 항목입니다");
        }
        Long companyId = user.getCompanyId();
        long id = (req.checklistId() == null || req.checklistId() <= 0) ? mapper.selectNextId() : req.checklistId();
        IcsChecklistSaveReq row = new IcsChecklistSaveReq(id, req.content(), req.criterion(), req.useYn(), req.checklistMClassId(), req.seq());
        if (companyId != 0L) {
            mapper.updateCompanyUseYn(companyId, id, row.useYn());
        }
        if (mapper.update(companyId, row) == 0) {
            mapper.insert(companyId, row);
        }
        return mapper.selectById(id, companyId);
    }

    /** AS-IS delete(UpdateDataModel.deleteModel): ID로 지운다(작성 기록은 원본도 그대로 둔다) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> checklistIds) {
        return checklistIds.stream().mapToInt(id -> mapper.deleteById(id, user.getCompanyId())).sum();
    }

    /** AS-IS sys.Sys09_Code.selectByIcs21: 사용 중인 대분류 */
    public List<IcsChecklistClassCodeRes> lCodes(UserPrincipal user) {
        return mapper.selectLCodes(user.getCompanyId(), LocalDate.now());
    }

    /** AS-IS sys.Sys09_Code.selectByIcs23: 사용 중인 중분류(대분류를 주면 그 아래만) */
    public List<IcsChecklistClassCodeRes> mCodes(UserPrincipal user, Long checklistLClassId) {
        return mapper.selectMCodes(user.getCompanyId(), LocalDate.now(), checklistLClassId);
    }
}

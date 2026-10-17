package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistLClassRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistLClassSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistMClassRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistMClassSaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsChecklistClassMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Ics21_Lookup_CheckList·Ics23_TabPage_CheckList → server/ics/Ics21_ChecklistLClass.java (selectByCompanyId L27 / deleteCheck L33 / update L82 / delete L121)
 * + server/ics/Ics23_ChecklistMClass.java (selectByCompanyId L27 / deleteCheck L38 / update L64 / delete L98).
 * 공통(회사 0) 분류는 관리자 회사만 고칠 수 있고, 고객사는 사용여부·종료일만 고객사별 설정(ics22·ics24)으로 덮는다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsChecklistClassService {

    private final IcsChecklistClassMapper mapper;

    // ── 대분류 ──

    /** AS-IS selectByCompanyId */
    public List<IcsChecklistLClassRes> searchL(UserPrincipal user) {
        return mapper.selectLClasses(user.getCompanyId());
    }

    /**
     * AS-IS update: 새 행(id 없음/0 이하)은 로그인 회사로 넣고, 있는 행은 로그인 회사 것이면 고친다. 공통 회사가 아니면 모든 행의 사용여부·종료일을 고객사별 설정(ics22)에 UPSERT
     * (공통 분류는 그것만). 사용여부가 true면 종료일은 비운다 → 저장된 행들
     */
    @Transactional
    public List<IcsChecklistLClassRes> saveL(UserPrincipal user, List<IcsChecklistLClassSaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (IcsChecklistLClassSaveReq r : rows) {
            validate(r.checklistLClassName(), r.seq(), r.useYn(), r.closeDate());
            LocalDate closeDate = "true".equals(r.useYn()) ? null : r.closeDate();
            boolean isNew = r.checklistLClassId() == null || r.checklistLClassId() <= 0;
            long id;
            IcsChecklistLClassSaveReq row;
            if (isNew) {
                id = mapper.selectNextId();
                row = new IcsChecklistLClassSaveReq(id, r.checklistLClassName(), r.note(), r.seq(), r.useYn(), closeDate);
                mapper.insertLClass(id, companyId, row);
            } else {
                id = r.checklistLClassId();
                Long rowCompany = mapper.selectLClassCompany(id);
                if (rowCompany == null || (rowCompany != 0L && !rowCompany.equals(companyId))) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "분류를 찾을 수 없습니다.");
                }
                row = new IcsChecklistLClassSaveReq(id, r.checklistLClassName(), r.note(), r.seq(), r.useYn(), closeDate);
                if (rowCompany.equals(companyId)) {
                    mapper.updateLClass(companyId, row);
                }
            }
            if (companyId != 0L) {
                mapper.upsertLClassCompany(companyId, id, r.useYn(), closeDate);
            }
        }
        return mapper.selectLClasses(companyId);
    }

    /** AS-IS deleteCheck: 이 대분류의 체크리스트를 쓴 작성 기록이 있는 분류의 수 (0이면 지울 수 있다) */
    public int countLInUse(UserPrincipal user, List<Long> checklistLClassIds) {
        return (int) checklistLClassIds.stream().filter(id -> mapper.countLClassWrites(id, user.getCompanyId()) > 0).count();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 (로그인 회사 행만) */
    @Transactional
    public int deleteL(UserPrincipal user, List<Long> checklistLClassIds) {
        return checklistLClassIds.stream().mapToInt(id -> mapper.deleteLClass(id, user.getCompanyId())).sum();
    }

    // ── 중분류 ──

    /** AS-IS selectByCompanyId(checklistLClassId, companyId) */
    public List<IcsChecklistMClassRes> searchM(UserPrincipal user, Long checklistLClassId) {
        return mapper.selectMClasses(user.getCompanyId(), checklistLClassId);
    }

    /** AS-IS update (대분류와 같은 규칙, 새 행은 대분류 ID 필요) → 그 대분류의 중분류 목록 */
    @Transactional
    public List<IcsChecklistMClassRes> saveM(UserPrincipal user, List<IcsChecklistMClassSaveReq> rows) {
        Long companyId = user.getCompanyId();
        Long lClassId = null;
        for (IcsChecklistMClassSaveReq r : rows) {
            validate(r.checklistMClassName(), r.seq(), r.useYn(), r.closeDate());
            LocalDate closeDate = "true".equals(r.useYn()) ? null : r.closeDate();
            boolean isNew = r.checklistMClassId() == null || r.checklistMClassId() <= 0;
            long id;
            IcsChecklistMClassSaveReq row;
            if (isNew) {
                if (r.checklistLClassId() == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "좌측 대분류를 먼저 선택해주세요");
                }
                id = mapper.selectNextId();
                row = new IcsChecklistMClassSaveReq(id, r.checklistLClassId(), r.checklistMClassName(), r.note(), r.seq(), r.useYn(), closeDate);
                mapper.insertMClass(id, companyId, row);
            } else {
                id = r.checklistMClassId();
                Long rowCompany = mapper.selectMClassCompany(id);
                if (rowCompany == null || (rowCompany != 0L && !rowCompany.equals(companyId))) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "분류를 찾을 수 없습니다.");
                }
                row = new IcsChecklistMClassSaveReq(id, r.checklistLClassId(), r.checklistMClassName(), r.note(), r.seq(), r.useYn(), closeDate);
                if (rowCompany.equals(companyId)) {
                    mapper.updateMClass(companyId, row);
                }
            }
            if (companyId != 0L) {
                mapper.upsertMClassCompany(companyId, id, r.useYn(), closeDate);
            }
            if (r.checklistLClassId() != null) {
                lClassId = r.checklistLClassId();
            }
        }
        return lClassId == null ? List.of() : mapper.selectMClasses(companyId, lClassId);
    }

    /** AS-IS deleteCheck (중분류) */
    public int countMInUse(UserPrincipal user, List<Long> checklistMClassIds) {
        return (int) checklistMClassIds.stream().filter(id -> mapper.countMClassWrites(id, user.getCompanyId()) > 0).count();
    }

    /** AS-IS delete (중분류) */
    @Transactional
    public int deleteM(UserPrincipal user, List<Long> checklistMClassIds) {
        return checklistMClassIds.stream().mapToInt(id -> mapper.deleteMClass(id, user.getCompanyId())).sum();
    }

    /** AS-IS update() 검사 — 뒤의 검사가 앞의 메시지를 덮는다: 분류명 → 순서 → 사용종료일 (사용여부가 false면 종료일 필수) */
    private static void validate(String name, Long seq, String useYn, LocalDate closeDate) {
        String msg = null;
        if (name == null || name.isEmpty()) msg = "분류명은 필수입력사항입니다.";
        if (seq == null) msg = "순서는 필수입력사항입니다.";
        if (!"true".equals(useYn) && closeDate == null) msg = "사용종료일은 필수선택항목입니다.";
        if (msg != null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
        }
    }
}

package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineCopyReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch03DeadlineTemplateRes;
import kr.co.kfs.asseterp.biz.sch.mapper.SchDeadlineMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * AS-IS Sch03_Lookup_Ics·Sch03_Lookup_Cycle·Sch03_Lookup_Short → server/sch/Sch03_Deadline.java
 * (selectByClassTreeId L27 / selectDeadlineName L43 / updateModel L50 / insertModel L76 / delete L108) + server/sys/Sys00_Common.selectDeadLine L21.
 * 기한(sch03_deadline)은 로그인 회사의 것만 읽고 고친다(보안 보강 — 원본은 회사 조건이 없다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchDeadlineService {

    /** 스케줄 구분: 1 스케줄 / 2 내부통제-반복 / 3 내부통제-수시 / 6 내규담당 / 7 문서작성(내규) */
    private static final Set<String> SCHEDULE_CODES = Set.of("1", "2", "3", "6", "7");
    /** 기본 기한 복사(updateModel)가 쓰는 스케줄 구분: 스케줄 "1"(Sch01_Lookup_Info.load, O01), 법규 "2", 내규 "6" (Sch03_Lookup_Ics·Sch03_Lookup_Icr.load) */
    private static final Set<String> COPY_SCHEDULE_CODES = Set.of("1", "2", "6");

    private final SchDeadlineMapper mapper;

    /** AS-IS selectByClassTreeId */
    public List<Sch03DeadlineRes> search(UserPrincipal user, Long infoId) {
        return mapper.selectByClassTreeId(infoId, user.getCompanyId());
    }

    /** AS-IS sch03_deadline.selectById: 기한 한 건(법규 정보 창 Ics01_Lookup_Info의 기한·비고). 읽기 전용이라 회사 조건은 걸지 않는다 */
    public Sch03DeadlineRes get(Long deadlineId) {
        Sch03DeadlineRes row = mapper.selectById(deadlineId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "기한을 찾을 수 없습니다.");
        }
        return row;
    }

    /** AS-IS Sys00_Common.selectDeadLine: 기본 기한 콤보 */
    public List<Sch03DeadlineTemplateRes> templates() {
        return mapper.selectTemplates();
    }

    /** AS-IS selectDeadlineName: 법규의 기한 이름(Ics01_Edit_ClassTree "수시알림" 칸) */
    public String deadlineName(UserPrincipal user, Long infoId) {
        return mapper.selectDeadlineName(infoId, user.getCompanyId());
    }

    /**
     * AS-IS insertModel: deadlineId가 없거나 0 이하면 새 id로 넣고, 아니면 고친다 → 저장된 행(selectById).
     * 회사는 로그인 회사로 채운다. 일회성(99)에서 "지정일(01)"이면 일자가 있어야 한다(Sch03_Lookup_Short.update)
     */
    @Transactional
    public Sch03DeadlineRes save(UserPrincipal user, Sch03DeadlineSaveReq req) {
        if (req.infoId() == null || !SCHEDULE_CODES.contains(req.scheduleCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "법규와 스케줄 구분이 필요합니다.");
        }
        if (req.cycleCode() == null || req.cycleCalcType() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "주기를 선택하세요.");
        }
        if ("99".equals(req.cycleCode()) && "01".equals(req.cycleCalcType()) && req.fixDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "일자를 선택하세요");
        }
        Long companyId = user.getCompanyId();
        Long id = req.deadlineId();
        if (id == null || id <= 0) {
            id = mapper.selectNextId();
            mapper.insert(id, companyId, req);
        } else if (mapper.update(id, companyId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "기한을 찾을 수 없습니다.");
        }
        return mapper.selectById(id);
    }

    /** AS-IS updateModel(Sch03_Lookup_Ics·Sch03_Lookup_Icr.load): 기본 기한을 이 법규·내규에 복사해 새 행으로 (스케줄 구분 "2", 내규는 "6") → 새 행 */
    @Transactional
    public Sch03DeadlineRes copy(UserPrincipal user, Sch03DeadlineCopyReq req) {
        if (req.deadlineId() == null || req.infoId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상단 메뉴바의 좌측구분값을 선택해주세요");
        }
        String scheduleCode = req.scheduleCode() == null ? "2" : req.scheduleCode();
        if (!COPY_SCHEDULE_CODES.contains(scheduleCode)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "스케줄 구분이 올바르지 않습니다.");
        }
        long newId = mapper.selectNextId();
        if (mapper.insertCopy(newId, req.deadlineId(), req.infoId(), user.getCompanyId(), scheduleCode) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "기본 기한을 찾을 수 없습니다.");
        }
        return mapper.selectById(newId);
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> deadlineIds) {
        return deadlineIds.stream().mapToInt(id -> mapper.deleteById(id, user.getCompanyId())).sum();
    }
}

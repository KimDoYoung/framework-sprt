package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListStdRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEvalGradeMapper;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEvalListMapper;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEvalListStdMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/emp/Emp40_EvalListStd.java (selectByCompanyId L30 / deleteByEvalListStdId L42 / insert L60 / updateFixYn L154)
 * + emp.Emp43_EvalTarget.getEventChk L62 — 인사평가 항목리스트 기준 적용일. 로그인 회사 것만 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpEvalListStdService {

    private final EmpEvalListStdMapper mapper;
    private final EmpEvalListMapper listMapper;
    private final EmpEvalGradeMapper gradeMapper;

    /** AS-IS selectByCompanyId */
    public List<EvalListStdRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /**
     * AS-IS insert: 같은 적용일이 있으면(-1) 이미 생성, 평가기간이 걸친 대상자가 있으면(-2) 안내, 아니면 새 적용일을 만들고
     * 가장 최근 항목·등급을 복사(로그인 회사에 없으면 관리자 회사(0)의 것) → 새 ID. 읽는 순서까지 원본 그대로
     */
    @Transactional
    public Long create(UserPrincipal user, LocalDate startDate) {
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = user.getCompanyId();
        boolean exists = mapper.countByStartDate(companyId, startDate) > 0;
        boolean inUse = mapper.countDateChk(companyId, startDate) > 0;
        List<EvalListRes> lists = listMapper.selectByMaxCompanyId(companyId);
        List<EvalGradeRes> grades = gradeMapper.selectByMaxCompanyId(companyId);

        if (exists) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 생성된 기준 적용일입니다");
        }
        if (inUse) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "해당 적용일 범위에 등록된 인사평가 내역이 존재합니다. 삭제 후 진행바랍니다");
        }

        Long stdId = mapper.selectNextId();
        mapper.insert(stdId, companyId, startDate);

        if (lists.isEmpty()) {
            lists = listMapper.selectByMaxCompanyIdAdmin();
        }
        for (EvalListRes src : lists) {
            listMapper.insert(listMapper.selectNextId(), stdId,
                    new EvalListSaveReq.Row(null, src.evalClassCode(), src.content(), src.weightMember(), src.weightLeader(), src.seq()));
        }

        if (grades.isEmpty()) {
            grades = gradeMapper.selectByMaxCompanyIdAdmin();
        }
        for (EvalGradeRes src : grades) {
            gradeMapper.insert(gradeMapper.selectNextId(), stdId,
                    new EvalGradeSaveReq.Row(null, src.grade(), src.gradeWeight(), src.gradeScore(), src.compareCode(), src.reasonYn()));
        }
        return stdId;
    }

    /** AS-IS updateFixYn: 확정(true)할 때 이전 적용일로 평가중인 내역이 있으면 막는다 */
    @Transactional
    public void updateFixYn(UserPrincipal user, LocalDate startDate, boolean fixYn) {
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = user.getCompanyId();
        if (fixYn && mapper.countEventChk2(companyId, startDate) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이전 기준적용일로 평가중인 내역이 존재합니다.");
        }
        mapper.updateFixYn(companyId, startDate, String.valueOf(fixYn));
    }

    /** AS-IS deleteByEvalListStdId: 사용중(평가 대상자가 있음)이면 막고, 아니면 적용일·항목·등급을 지운다 */
    @Transactional
    public void delete(UserPrincipal user, Long evalListStdId) {
        if (mapper.countByIdAndCompany(evalListStdId, user.getCompanyId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (mapper.countEventChk(evalListStdId) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 사용중인 적용일입니다");
        }
        mapper.deleteByEvalListStdId(user.getCompanyId(), evalListStdId);
        listMapper.deleteByEvalListStdId(evalListStdId);
        gradeMapper.deleteByEvalListStdId(evalListStdId);
    }

    /** AS-IS emp.Emp43_EvalTarget.getEventChk: 이 적용일로 작성중·완료된 평가 대상자가 있는가 */
    public boolean inUse(Long evalListStdId) {
        return mapper.countEventChk(evalListStdId) > 0;
    }

    /** AS-IS emp.Emp40_EvalListStd.getEvalListStdId (Emp43_Tab_EvalTarget [등록]) — 평가 종료일 기준 적용기준 ID, 없으면 null */
    public Long getAppliedId(UserPrincipal user, LocalDate startDate) {
        return mapper.selectAppliedId(user.getCompanyId(), startDate);
    }
}

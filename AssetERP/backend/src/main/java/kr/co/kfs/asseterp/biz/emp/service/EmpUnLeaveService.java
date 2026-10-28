package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpUnLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 연차휴가 사용촉진 (AS-IS Emp21_Tab_UnLeaveList) — 1단계: 상신(Emp21_UnLeave.insertAppr)·문자발송(sendMessage)은 다음 단계 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpUnLeaveService {

    private final EmpUnLeaveMapper mapper;

    /** AS-IS emp.Emp21_UnLeave.selectByUnLeaveCode (연차 탭) */
    public List<UnLeaveRes> searchYearList(UserPrincipal user, String stdYear, String unLeaveCode) {
        checkYear(stdYear);
        return mapper.selectYearList(user.getCompanyId(), stdYear, unLeaveCode);
    }

    /** AS-IS emp.Emp21_UnLeave.selectByUnLeaveCode2 (월차 탭) */
    public List<UnLeaveRes> searchMonthList(UserPrincipal user, String stdYear, String unLeaveCode) {
        checkYear(stdYear);
        return mapper.selectMonthList(user.getCompanyId(), stdYear, unLeaveCode);
    }

    /** AS-IS emp.Emp21_UnLeave.insert — 만든 건수(0이면 AS-IS status -1 "생성가능한 사원이 없습니다") */
    @Transactional
    public int createYear(UserPrincipal user, UnLeaveCreateReq req) {
        checkYear(req.stdYear());
        if (req.unLeaveCode() == null || req.unLeaveCode().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return mapper.insertYear(user.getCompanyId(), req.stdYear(), req.unLeaveCode());
    }

    /** AS-IS emp.Emp21_UnLeave.insert2 */
    @Transactional
    public int createMonth(UserPrincipal user, UnLeaveCreateReq req) {
        checkYear(req.stdYear());
        return mapper.insertMonth(user.getCompanyId(), req.stdYear());
    }

    /** AS-IS emp.Emp21_UnLeave.update — 저장한 건수 */
    @Transactional
    public int save(UserPrincipal user, List<UnLeaveSaveReq> rows) {
        int count = 0;
        for (UnLeaveSaveReq r : rows) {
            if (r.unLeaveId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }
            count += mapper.updateUnLeave(user.getCompanyId(), r.unLeaveId(), r.totalDays(), r.useDays(), r.remainDays());
        }
        return count;
    }

    /** AS-IS emp.Emp21_UnLeave.delete */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteUnLeaves(user.getCompanyId(), ids);
    }

    private static void checkYear(String stdYear) {
        if (stdYear == null || !stdYear.matches("\\d{4}")) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
    }
}

package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MyUnLeaveRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpMyUnLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Y03 연월차휴가 지정통보 (AS-IS Emp21_Tab_PersonList → server/emp/Emp21_UnLeave.selectByPersonId · update) — 본인 것만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpMyUnLeaveService {

    private final EmpMyUnLeaveMapper mapper;

    /** AS-IS emp.Emp21_UnLeave.selectByPersonId(companyId, personId, stdYear) */
    public List<MyUnLeaveRes> search(UserPrincipal user, String stdYear) {
        if (stdYear == null || !stdYear.matches("\\d{4}")) throw new BusinessException(ErrorCode.INVALID_INPUT, "해당 연도를 확인해주세요");
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), stdYear);
    }

    /**
     * AS-IS Emp21_Tab_PersonList.updateApprId → emp.Emp21_UnLeave.update(expectApprId).
     * 화면이 막는 조건(진행 중인 지정통보 문서가 있으면 상신 불가)을 서버도 확인한다.
     */
    @Transactional
    public void updateExpectApprId(UserPrincipal user, Long unLeaveId, Long apprId) {
        if (apprId == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        MyUnLeaveRes row = unLeaveId == null ? null : mapper.selectMineById(user.getCompanyId(), user.getUserId(), unLeaveId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        // Emp21_Tab_PersonList.findLinkCode L215-218: 지정통보 문서가 진행 중(10)·승인(20)·완료(30)이면 새로 상신하지 않는다
        if (row.expectApprStatusCode() != null && java.util.Set.of("10", "20", "30").contains(row.expectApprStatusCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상신 진행 중인 공지구분입니다");
        }
        mapper.updateExpectApprId(user.getCompanyId(), user.getUserId(), unLeaveId, apprId);
    }
}

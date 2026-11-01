package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveListRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpLeaveListMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** Y02 휴가신청조회 (AS-IS Emp20_Tab_LeaveList → server/emp/Emp20_Leave.selectByPersonName · sys/Sys99_Print.insertRdLeaveList) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpLeaveListService {

    private static final String WINDOW_CLASS_NAME = "Emp20_Tab_LeaveList";

    private final EmpLeaveListMapper mapper;

    /** AS-IS selectByPersonName — 사원명이 비어 있으면 '%', 아니면 '%이름%' (Emp20_Leave.selectByPersonName L64-75) */
    public List<LeaveListRes> search(UserPrincipal user, String personName, LocalDate startDate, LocalDate closeDate) {
        if (startDate == null || closeDate == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        return mapper.selectByPersonName(user.getCompanyId(), like(personName), startDate, closeDate);
    }

    /** AS-IS Sys99_Print.insertRdLeaveList L4390: ① 내 출력 자료 정리 ② 같은 조건의 목록을 sys99_print 에 삽입 ③ 새 groupId 반환 */
    @Transactional
    public String insertRdDownload(UserPrincipal user, String personName, LocalDate startDate, LocalDate closeDate) {
        if (startDate == null || closeDate == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId, like(personName), startDate, closeDate);
        return String.valueOf(groupId);
    }

    private String like(String personName) {
        return personName == null || personName.isEmpty() ? "%" : "%" + personName + "%";
    }
}

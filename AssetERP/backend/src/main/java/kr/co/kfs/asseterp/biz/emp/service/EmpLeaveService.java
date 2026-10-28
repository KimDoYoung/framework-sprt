package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveDaysRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveDownloadReq;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveOptionRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveOverConfirmReq;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/** AS-IS server/emp/Emp20_Leave.java (selectByPersonId·selectByDays·updateOverConfirm) · Emp22_EtcLeave · sys/Sys99_Print.insertRdLeaveManager */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpLeaveService {

    private static final String WINDOW_CLASS_NAME = "Emp20_Tab_LeaveManager";
    /** 초과휴가 승인상태 (10:신청/20:승인/30:반려) */
    private static final Set<String> OVER_STATUS = Set.of("10", "20", "30");

    private final EmpLeaveMapper mapper;

    /** AS-IS selectByPersonId(personId, stdYear, managerYn=true) */
    public List<LeaveRes> searchLeaves(UserPrincipal user, Long personId, String stdYear) {
        checkPerson(user, personId);
        return mapper.selectLeaves(personId, stdYear);
    }

    /** AS-IS Emp20_Leave.selectByDays + Emp22_EtcLeave.selectByDays (apprCheckYn=true) — 사원 정보가 없으면 null */
    public LeaveDaysRes getDays(UserPrincipal user, Long personId, String stdYear) {
        checkPerson(user, personId);
        return mapper.selectDays(personId, stdYear);
    }

    /** 로그인 회사의 초과휴가 설정 (setOverConfirmVer 의 LoginUser.getCompanyModel()) */
    public LeaveOptionRes getOption(UserPrincipal user) {
        return mapper.selectOption(user.getCompanyId());
    }

    /** AS-IS Emp20_Leave.updateOverConfirm: 승인 상태 갱신 뒤 selectById 로 그 행을 다시 읽는다 */
    @Transactional
    public LeaveRes updateOverConfirm(UserPrincipal user, Long leaveId, LeaveOverConfirmReq req) {
        if (req == null || !OVER_STATUS.contains(req.confirmStatusCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "승인상태가 올바르지 않습니다");
        }
        if (mapper.updateOverConfirm(user.getCompanyId(), leaveId, req.confirmStatusCode(), user.getUserId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectLeaveById(user.getCompanyId(), leaveId);
    }

    /** AS-IS Sys99_Print.insertRdLeaveManager L4244: ① 내 출력 자료 정리 ② 선택 사원의 휴가 목록을 sys99_print 에 삽입 ③ 새 groupId 반환 */
    @Transactional
    public String insertRdDownload(UserPrincipal user, LeaveDownloadReq req) {
        checkPerson(user, req.personId());
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId, req.personId(), req.stdYear());
        return String.valueOf(groupId);
    }

    /** AS-IS Emp22_EtcLeave.selectByPersonId(companyId, personId, stdYear) */
    public List<EtcLeaveRes> searchEtcLeaves(UserPrincipal user, Long personId, String stdYear) {
        checkPerson(user, personId);
        return mapper.selectEtcLeaves(user.getCompanyId(), personId, stdYear);
    }

    /** AS-IS는 클라이언트가 보낸 personId 를 그대로 쓰지만 TOBE는 로그인 회사 소속 사원인지 확인한다 */
    private void checkPerson(UserPrincipal user, Long personId) {
        if (personId == null || mapper.countPerson(user.getCompanyId(), personId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}

package kr.co.kfs.asseterp.biz.att.service;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteBatchReq;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteFlags;
import kr.co.kfs.asseterp.biz.att.dto.AttMyCommuteLastRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyCommuteRes;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteRes;
import kr.co.kfs.asseterp.biz.att.mapper.AttCommuteMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Att02_Tab_CommuteAdmin·Att02_Lookup_InsertBatch(T06) → server/att/Att02_Commute.java
 * (selectByTextAdmin L39 / insertBatch L139 / adminCheck L173). 쓰기는 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttCommuteService {

    private final AttCommuteMapper mapper;

    /** AS-IS selectByTextAdmin: 검색어는 `%…%`. baseDate가 있으면 그날만, 없으면 시작~종료 */
    public List<AttCommuteRes> searchAdmin(UserPrincipal user, Long personId, LocalDate baseDate, LocalDate startDate,
                                           LocalDate closeDate, String searchText) {
        if (baseDate == null && (startDate == null || closeDate == null)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "근무일자를 선택해주세요");
        }
        return mapper.selectByTextAdmin(user.getCompanyId(), personId, baseDate, startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS adminCheck: 확인필요 해제 */
    @Transactional
    public int adminCheck(UserPrincipal user, Long commuteId) {
        if (mapper.countInCompany(user.getCompanyId(), commuteId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return mapper.adminCheck(commuteId);
    }

    /** AS-IS insertBatch: 사원마다 기간 출퇴근 생성(이미 있거나 휴가·휴일이면 건너뜀) → 사원 수 */
    @Transactional
    public int insertBatch(UserPrincipal user, AttCommuteBatchReq req) {
        if (req.startDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "시작일은 필수입력 항목입니다");
        if (req.closeDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "종료일은 필수입력 항목입니다");
        if (req.personIds() == null) return 0;
        for (Long personId : req.personIds()) {
            mapper.insertBatch(user.getCompanyId(), personId, req.startDate(), req.closeDate());
        }
        return req.personIds().size();
    }

    // ── 로그인 사원 본인의 출퇴근 (Att02_Lookup_Commute · MainFrame.checkCommute, EE50) ──

    /** AS-IS getLastInfo + 회사 근태 설정. last는 기록이 없으면 null */
    public AttMyCommuteLastRes getLastInfo(UserPrincipal user) {
        AttCommuteFlags flags = mapper.selectCommuteFlags(user.getCompanyId());
        boolean popupYn = flags != null && Boolean.TRUE.equals(flags.popupYn());
        boolean lockYn = flags != null && Boolean.TRUE.equals(flags.lockYn());
        return new AttMyCommuteLastRes(popupYn, lockYn, mapper.selectLastInfo(user.getCompanyId(), user.getUserId()));
    }

    /** AS-IS selectByDate — 그날 한 건(없으면 빈 목록) */
    public List<AttMyCommuteRes> searchByDate(UserPrincipal user, LocalDate baseDate) {
        return mapper.selectByDate(user.getCompanyId(), user.getUserId(), baseDate == null ? LocalDate.now() : baseDate);
    }

    /**
     * AS-IS insert — on: 출근(이미 있으면 -1) / 퇴근(출근 기록 없으면 -2). 성공 1.
     * TOBE 보안 보강: baseDate는 오늘이거나 본인 마지막 근무일만 받는다(AS-IS는 클라이언트 값을 그대로 씀)
     */
    @Transactional
    public int checkInOut(UserPrincipal user, boolean on, LocalDate baseDate) {
        LocalDate date = checkBaseDate(user, baseDate);
        Long commuteId = mapper.checkWorkDate(user.getCompanyId(), user.getUserId(), date);
        if (on) {
            if (commuteId != null) return -1;
            mapper.insertCheckIn(user.getCompanyId(), user.getUserId(), date);
            return 1;
        }
        if (commuteId == null) return -2;
        mapper.updateOff(commuteId);
        return 1;
    }

    /** AS-IS insertOffWork — 출근 기록이 없으면 -2, 성공 1 */
    @Transactional
    public int offWork(UserPrincipal user, LocalDate baseDate) {
        LocalDate date = checkBaseDate(user, baseDate);
        Long commuteId = mapper.checkWorkDate(user.getCompanyId(), user.getUserId(), date);
        if (commuteId == null) return -2;
        mapper.updateOffWork(commuteId);
        return 1;
    }

    /** AS-IS updateReason (지각·조기퇴근·외근 후 퇴근 사유) */
    @Transactional
    public int updateReason(UserPrincipal user, Long commuteId, String actionCode, String reason) {
        checkMine(user, commuteId);
        return mapper.updateReason(commuteId, actionCode, reason);
    }

    /** AS-IS updateCheckOutTime (미등록 퇴근시간 제출 — 관리자 확인필요로 표시) */
    @Transactional
    public int updateCheckOutTime(UserPrincipal user, Long commuteId, LocalDate checkOutTime, String checkOutTimeStr) {
        if (checkOutTime == null || checkOutTimeStr == null || checkOutTimeStr.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "퇴근시간을 입력해주세요");
        }
        if (!checkOutTimeStr.matches("^([01]\\d|2[0-3]):([0-5]\\d)$")) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "퇴근시간 형식은 HH:mm 입니다.");
        }
        checkMine(user, commuteId);
        return mapper.updateCheckOutTime(commuteId, checkOutTime, checkOutTimeStr);
    }

    private void checkMine(UserPrincipal user, Long commuteId) {
        if (mapper.countMine(user.getCompanyId(), user.getUserId(), commuteId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private LocalDate checkBaseDate(UserPrincipal user, LocalDate baseDate) {
        LocalDate today = LocalDate.now();
        if (baseDate == null || baseDate.equals(today)) return today;
        AttMyCommuteRes last = mapper.selectLastInfo(user.getCompanyId(), user.getUserId());
        if (last != null && baseDate.equals(last.workDate())) return baseDate;
        throw new BusinessException(ErrorCode.INVALID_INPUT, "근무일자가 올바르지 않습니다");
    }
}

package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveSmsTarget;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpUnLeaveMapper;
import kr.co.kfs.asseterp.biz.apr.service.AlertService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** 연차휴가 사용촉진 (AS-IS Emp21_Tab_UnLeaveList) — 조회·생성·저장·삭제·문자발송. 상신(insertAppr)은 EmpUnLeaveApprService(V39) */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpUnLeaveService {

    private final EmpUnLeaveMapper mapper;
    private final AlertService alert;

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

    /**
     * AS-IS emp.Emp21_UnLeave.sendMessage L615-648 ([문자발송], 연차·월차 탭 같은 서버 메서드) — 고른 행의 사원마다 통합알림 M04
     * "이름님의 미사용 연차유급휴가일수 통지서가 도착했습니다. …"(원본 98d5afdd6, CH-0258: 앞의 "[Asset-ERP] "가 빠지고 회사 문자발신 신청 검사(-1)가 없어졌다 —
     * M코드라 회사 설정과 상관없이 앱알림·메일·SMS). 반환은 늘 1. 보낼 수 없는 종류는 건너뛰고 실패는 로그만(원본도 같다)
     */
    @Transactional
    public int sendMessage(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 1;
        }
        Map<Long, UnLeaveSmsTarget> byId = new HashMap<>();
        for (UnLeaveSmsTarget t : mapper.selectSmsTargets(user.getCompanyId(), ids)) {
            byId.put(t.unLeaveId(), t);
        }
        // L639-649: 제출 기한 = 오늘 + 10일
        String due = LocalDate.now().plusDays(10).format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일"));
        for (Long id : ids) {   // L635: 고른 행 순서대로
            UnLeaveSmsTarget t = byId.get(id);
            if (t == null) {
                continue;
            }
            // L645-649 문구 그대로 (두 번째 줄바꿈은 원본도 글자 "\r\n"이다)
            String msg = t.korName()
                    + "님의 미사용 연차유급휴가일수 통지서가 도착했습니다.\r\n"
                    + due
                    + "까지 미사용 연차유급휴가일수의 사용시기를 제출하여 주실 것을 촉구드리는 바입니다.\r\n\\r\\n"
                    + "※ 잔여휴가 사용시기 지정통보서 제출안내 : Asset-ERP > 신청 > 03.휴가 > 연차휴가 지정통보";
            alert.alert("M04", t.personId(), user.getCompanyId(), Map.of("content", msg));
        }
        return 1;
    }

    private static void checkYear(String stdYear) {
        if (stdYear == null || !stdYear.matches("\\d{4}")) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
    }
}

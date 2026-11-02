package kr.co.kfs.asseterp.biz.rpt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekConfirmReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekConfirmRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekConfirmerRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekPrintRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekPrintRow;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekRes;
import kr.co.kfs.asseterp.biz.rpt.mapper.RptWeekConfirmMapper;
import kr.co.kfs.asseterp.biz.rpt.mapper.RptWeekMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/rpt/Rpt04_WeekConfirm.java, Rpt03_Week.selectByCompanyId, Sys99_Print.insertRdWeekConfirm (Z12 주간업무보고 확인) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RptWeekConfirmService {

    /** AS-IS Rpt04_Tab_WeekConfirm.lookUpRd — insertRdWeekConfirm의 windowClassName */
    private static final String WINDOW = "Rpt04_Tab_WeekConfirm";

    private final RptWeekConfirmMapper mapper;
    private final RptWeekMapper weekMapper;

    /** AS-IS Rpt03_Week.selectByCompanyId L45 */
    public List<WeekConfirmRes> search(UserPrincipal user, LocalDate startDate, Long orgCodeId, boolean confirmYn) {
        return mapper.selectByCompanyId(user.getCompanyId(), startDate, orgCodeId, confirmYn);
    }

    /** AS-IS Rpt04_Tab_WeekConfirm.fixCheck L336-365 — 그 사원 보고의 제출여부(건의사항을 뺀 첫 줄) */
    public boolean isFixed(UserPrincipal user, Long personId, LocalDate startDate, LocalDate closeDate) {
        List<WeekRes> rows = weekMapper.selectByStartDate(user.getCompanyId(), personId, startDate, closeDate, false);
        return !rows.isEmpty() && Boolean.TRUE.equals(rows.get(0).fixYn());
    }

    /** AS-IS Rpt04_WeekConfirm.selectByConfirmerId L35 — 없으면 null */
    public WeekConfirmerRes getMyConfirm(UserPrincipal user, Long personId, LocalDate startDate) {
        return mapper.selectByConfirmerId(user.getCompanyId(), personId, startDate, user.getUserId());
    }

    /** AS-IS Rpt04_Lookup_WeekConfirm.update L180-200 → Rpt04_WeekConfirm.updateNote L65 */
    @Transactional
    public int saveNote(UserPrincipal user, WeekConfirmReq req) {
        assertMine(user, req, "확인자 본인만 삭제 및 수정이 가능합니다.");
        return mapper.updateNote(user.getCompanyId(), req.personId(), req.startDate(), req.confirmNote());
    }

    /** AS-IS Rpt04_Lookup_WeekConfirm.confirmUpdate L202-223 → Rpt04_WeekConfirm.confirmUpdate L46 */
    @Transactional
    public int confirm(UserPrincipal user, WeekConfirmReq req) {
        assertMine(user, req, "확인자 본인만 삭제 및 수정이 가능합니다.");
        return mapper.confirmUpdate(user.getCompanyId(), req.personId(), req.startDate(), user.getUserId());
    }

    /** AS-IS Rpt04_Lookup_WeekConfirm.confirmCancel L225-245 → Rpt04_WeekConfirm.updateByPersonId L82 */
    @Transactional
    public int cancel(UserPrincipal user, WeekConfirmReq req) {
        assertMine(user, req, "확인자 본인만 취소 및 수정이 가능합니다.");
        return mapper.updateByPersonId(user.getCompanyId(), req.personId(), req.startDate(), req.confirmNote());
    }

    /**
     * AS-IS Rpt04_Tab_WeekConfirm.lookUpRd L243-306 — ① 그 사원의 지난주 보고(getLastWeek) 기간 ② Sys99_Print.insertRdWeekConfirm(L3903):
     * 그 사원 이름으로 쌓인 출력 자료를 지우고 지난주·이번 주 비교 행을 새 그룹 ID로 담는다
     */
    @Transactional
    public WeekPrintRes insertRdWeekConfirm(UserPrincipal user, WeekConfirmReq req) {
        WeekRes last = weekMapper.selectLastWeek(user.getCompanyId(), req.personId(), req.startDate());
        long groupId = weekMapper.selectNextId();
        weekMapper.deletePrint(user.getCompanyId(), req.personId(), WINDOW);
        for (WeekPrintRow row : weekMapper.selectPrintRows(user.getCompanyId(), req.personId(), req.startDate())) {
            weekMapper.insertPrint(weekMapper.selectNextId(), user.getCompanyId(), req.personId(), WINDOW, groupId, row);
        }
        return new WeekPrintRes(String.valueOf(groupId), last == null ? null : last.weekStartDate(), last == null ? null : last.weekCloseDate());
    }

    /** 화면 검사(확인자 본인만)를 서버도 지킨다 — 지금 저장된 확인자가 다른 사람이면 거부 */
    private void assertMine(UserPrincipal user, WeekConfirmReq req, String message) {
        if (req.personId() == null || req.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long confirmerId = weekMapper.selectConfirmerId(user.getCompanyId(), req.personId(), req.startDate());
        if (confirmerId != null && !confirmerId.equals(user.getUserId())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, message);
        }
    }
}

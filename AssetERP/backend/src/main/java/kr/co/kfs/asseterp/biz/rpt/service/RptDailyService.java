package kr.co.kfs.asseterp.biz.rpt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyConfirmRes;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyPrintReq;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyRes;
import kr.co.kfs.asseterp.biz.rpt.dto.DailySaveReq;
import kr.co.kfs.asseterp.biz.rpt.mapper.RptDailyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/rpt/Rpt01_Daily.java (Z08 일일업무 입력) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RptDailyService {

    private final RptDailyMapper mapper;

    /** AS-IS selectByText L26 — 내 일일업무만, 검색어는 '%…%' (Rpt01_Tab_DailyWrite.retrieve L176-191) */
    public List<DailyRes> searchByText(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectByText(user.getCompanyId(), user.getUserId(), startDate, closeDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS modelUpdate L54 — ID가 없으면 getSeq로 채번해 INSERT(회사·사원 = 로그인 값), 있으면 UPDATE 뒤 selectById로 다시 읽는다.
     * 수정 창은 확인된 글이면 일자·업무내용 칸을 잠근다(Rpt01_Edit_DailyWrite.edit L63-71) → 서버도 그 두 값은 원래 값을 쓴다.
     */
    @Transactional
    public DailyRes save(UserPrincipal user, DailySaveReq req) {
        // Rpt01_Edit_DailyWrite.update L136-143
        if (req.date() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "일자는 필수작성 항목입니다");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "업무내용은 필수작성 항목입니다");
        }
        Long id = req.dailyId();
        if (id == null) {
            id = mapper.selectNextId();
            mapper.insertDaily(user.getCompanyId(), user.getUserId(), id, req);
        } else {
            DailyRes old = mapper.selectById(user.getCompanyId(), id);
            if (old == null || !user.getUserId().equals(old.personId())) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            DailySaveReq use = Boolean.TRUE.equals(old.confirmYn()) ? new DailySaveReq(id, old.date(), old.content(), req.note()) : req;
            mapper.updateDaily(user.getCompanyId(), user.getUserId(), use);
        }
        return mapper.selectById(user.getCompanyId(), id);
    }

    /** AS-IS delete L105 + 화면 검사(Rpt01_Tab_DailyWrite.deleteRow L203-218): 확인처리된 글이 있으면 "이미 확인처리된 업무가 있습니다." */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            DailyRes row = mapper.selectById(user.getCompanyId(), id);
            if (row == null) {
                continue;
            }
            if (Boolean.TRUE.equals(row.confirmYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 확인처리된 업무가 있습니다.");
            }
            count += mapper.deleteDaily(user.getCompanyId(), user.getUserId(), id);
        }
        return count;
    }

    // ===== Z09 Rpt01_Tab_DailyConfirm =====

    /** AS-IS Rpt01_Tab_DailyConfirm.settings — [출력/다운로드]의 windowClassName */
    private static final String CONFIRM_WINDOW = "Rpt01_Tab_DailyConfirm";

    /** AS-IS selectByConfirmText L39 — 로그인 사원의 조직과 그 아래 조직 소속 사원의 일일업무. unconfirmedOnly = "미확인건만 조회" */
    public List<DailyConfirmRes> searchByConfirmText(UserPrincipal user, LocalDate startDate, LocalDate closeDate, boolean unconfirmedOnly, String searchText) {
        return mapper.selectByConfirmText(user.getCompanyId(), startDate, closeDate, String.valueOf(unconfirmedOnly), orgId(user), like(searchText));
    }

    /** AS-IS confirmModelUpdate L69 — 확인자 비고 (Rpt01_Edit_DailyConfirm.update) → 다시 읽은 행 */
    @Transactional
    public DailyConfirmRes saveConfirmNote(UserPrincipal user, Long dailyId, String confirmNote) {
        if (mapper.updateConfirmNote(user.getCompanyId(), dailyId, confirmNote == null || confirmNote.isEmpty() ? null : confirmNote) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectConfirmById(user.getCompanyId(), dailyId);
    }

    /**
     * AS-IS confirmUpdate L83 + 화면 검사(Rpt01_Tab_DailyConfirm.updateConfirmYn L292-332) — 확인이면 이미 확인된 건이 있을 때 "이미 확인완료된 업무가 있습니다.",
     * 확인취소면 확인 전 건이 있을 때 "확인전인 업무가 있습니다." 확인자 = 로그인 사원(취소면 비움)
     */
    @Transactional
    public int confirm(UserPrincipal user, List<Long> dailyIds, boolean confirmYn) {
        List<DailyConfirmRes> rows = new java.util.ArrayList<>();
        for (Long id : dailyIds) {
            DailyConfirmRes row = mapper.selectConfirmById(user.getCompanyId(), id);
            if (row == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (confirmYn && Boolean.TRUE.equals(row.confirmYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 확인완료된 업무가 있습니다.");
            }
            if (!confirmYn && !Boolean.TRUE.equals(row.confirmYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "확인전인 업무가 있습니다.");
            }
            rows.add(row);
        }
        int count = 0;
        for (DailyConfirmRes row : rows) {
            count += mapper.updateConfirm(user.getCompanyId(), row.dailyId(), String.valueOf(confirmYn), confirmYn ? user.getUserId() : null);
        }
        return count;
    }

    /** AS-IS sys.Sys99_Print.insertRdDaily L1272 — ① 내 출력 자료 지움 ② 같은 조건의 조회 결과를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID(RD 리포트의 rdGroupId) */
    @Transactional
    public String insertRdDaily(UserPrincipal user, DailyPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), CONFIRM_WINDOW);
        for (DailyConfirmRes row : mapper.selectByConfirmText(user.getCompanyId(), req.startDate(), req.closeDate(), String.valueOf(req.unconfirmedOnly()),
                orgId(user), like(req.searchText()))) {
            mapper.insertPrint(mapper.selectNextId(), user.getCompanyId(), user.getUserId(), CONFIRM_WINDOW, groupId, row);
        }
        return String.valueOf(groupId);
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }

    /** LoginUser.getOrgCodeId() — 로그인 사원의 조직(없으면 -1: 조회 결과 없음) */
    private static Long orgId(UserPrincipal user) {
        try {
            return user.getDeptId() == null ? -1L : Long.valueOf(user.getDeptId());
        } catch (NumberFormatException e) {
            return -1L;
        }
    }
}

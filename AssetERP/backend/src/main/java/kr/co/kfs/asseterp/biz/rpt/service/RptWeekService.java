package kr.co.kfs.asseterp.biz.rpt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekBizClassRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekBizClassSaveReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekCodeRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekCopyReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekDaysRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekFixReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekPrintReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekPrintRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekPrintRow;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekRequestSaveReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekSaveReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekSeqReq;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekStateRes;
import kr.co.kfs.asseterp.biz.rpt.mapper.RptWeekMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/** AS-IS server/rpt/Rpt03_Week.java·Rpt04_WeekConfirm.selectByCompanyId·Rpt05_WeekBizClass.java (Z11 주간업무보고) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RptWeekService {

    /** AS-IS Rpt03_Tab_WeekWrite.settings — [출력/다운로드]의 windowClassName */
    private static final String WINDOW = "Rpt03_Tab_WeekWrite";
    private static final String SUGGESTION = "999";

    private final RptWeekMapper mapper;

    /** AS-IS selectByStartDate L33 — 내 주간업무. suggestion = true면 건의사항 및 기타 요청사항(999)만 */
    public List<WeekRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, boolean suggestion) {
        return mapper.selectByStartDate(user.getCompanyId(), user.getUserId(), startDate, closeDate, suggestion);
    }

    /**
     * AS-IS fixCheck(Rpt03_Tab_WeekWrite L709-737)·confirmCheck(L739-765)·confirmRetrieve(L384-407) —
     * 제출 여부 = 건의사항을 뺀 첫 줄의 제출여부, 확인자 = rpt04_week_confirm
     */
    public WeekStateRes getState(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        List<WeekRes> rows = mapper.selectByStartDate(user.getCompanyId(), user.getUserId(), startDate, closeDate, false);
        boolean fix = !rows.isEmpty() && Boolean.TRUE.equals(rows.get(0).fixYn());
        Long confirmerId = mapper.selectConfirmerId(user.getCompanyId(), user.getUserId(), startDate);
        return new WeekStateRes(fix, confirmerId, confirmerId == null ? null : mapper.selectConfirmerName(confirmerId));
    }

    /** AS-IS getWeekDays L161 — 기준일이 속한 주의 월~금 */
    public WeekDaysRes getWeekDays(LocalDate toDay) {
        int weekNumber = toDay.get(WeekFields.of(Locale.getDefault()).weekOfMonth());
        return new WeekDaysRes(weekNumber, toDay.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)),
                toDay.with(TemporalAdjusters.nextOrSame(DayOfWeek.FRIDAY)));
    }

    /** AS-IS Sys00_Common.selectWeekListByMonth L191 — 그 달의 주차(월~금) 목록, code = "시작일|종료일" */
    public List<WeekCodeRes> getWeekList(int year, int month) {
        List<WeekCodeRes> list = new ArrayList<>();
        LocalDate startDate = LocalDate.of(year, month, 1).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        if (startDate.plusDays(4).getMonthValue() != month) {
            startDate = startDate.plusDays(7);
        }
        long no = 0;
        while (true) {
            no++;
            LocalDate closeDate = startDate.plusDays(4);
            list.add(new WeekCodeRes(startDate + "|" + closeDate, no + "주차 (" + startDate + " ~ " + closeDate + ")"));
            startDate = closeDate.plusDays(3);
            if (startDate.getMonthValue() != month) {
                break;
            }
        }
        return list;
    }

    /** AS-IS Sys00_Common.selectWeekBizClass L181 — 내가 사용으로 정한 업무구분 */
    public List<WeekCodeRes> getBizTypes(UserPrincipal user) {
        return mapper.selectWeekBizClass(user.getCompanyId(), user.getUserId(), LocalDate.now());
    }

    /** AS-IS getBeforeWeek L56 — 직전 보고 1건(없으면 null) */
    public WeekRes getBeforeWeek(UserPrincipal user, LocalDate startDate) {
        return mapper.selectBeforeWeek(user.getCompanyId(), user.getUserId(), startDate);
    }

    /** AS-IS insertBeforeWeek L91 — 직전 보고를 이번 주로 복사. 이번 주에 이미 있으면 거부(화면 검사 lastWeekCheck L527-539) */
    @Transactional
    public int copyBeforeWeek(UserPrincipal user, WeekCopyReq req) {
        assertEditable(user, req.startDate(), req.closeDate());
        if (!mapper.selectByStartDate(user.getCompanyId(), user.getUserId(), req.startDate(), req.closeDate(), false).isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "현재 주차에 데이터가 있어서 가져올 수 없습니다. 데이터를 비우고 다시 시도해주시길 바랍니다.");
        }
        return mapper.insertBeforeWeek(user.getCompanyId(), user.getUserId(), req.startDate(), req.closeDate(), req.beforeStartDate());
    }

    /** AS-IS modelUpsert L110 (Rpt03_Lookup_WeekWrite.update L172-192) — ID가 없으면 채번해 INSERT, 있으면 UPDATE. 저장한 행을 돌려준다 */
    @Transactional
    public WeekRes save(UserPrincipal user, WeekSaveReq req) {
        if (req.bizType() == null || req.bizType().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "업무구분을 선택해주세요");
        }
        assertEditable(user, req.weekStartDate(), req.weekCloseDate());
        return upsert(user, req);
    }

    /** AS-IS Rpt03_Week.update L204 (Rpt03_Page_WeekWrite.update) — 건의사항(999) 행들을 INSERT/UPDATE. 0 이하 ID는 새 행 */
    @Transactional
    public List<WeekRes> saveRequests(UserPrincipal user, WeekRequestSaveReq req) {
        List<WeekRes> saved = new ArrayList<>();
        for (WeekSaveReq item : req.items()) {
            assertEditable(user, item.weekStartDate(), item.weekCloseDate());
            saved.add(upsert(user, new WeekSaveReq(item.weekId(), item.weekStartDate(), item.weekCloseDate(), SUGGESTION,
                    item.content(), item.dueDate(), item.seq(), item.bold(), item.note())));
        }
        return saved;
    }

    /** AS-IS inUpdateData L115 — ▲▼ 뒤 순번 저장 */
    @Transactional
    public int saveSeq(UserPrincipal user, WeekSeqReq req) {
        int count = 0;
        for (WeekSeqReq.Item item : req.items()) {
            assertEditableById(user, item.weekId());
            count += mapper.updateSeq(user.getCompanyId(), user.getUserId(), item.weekId(), item.seq());
        }
        return count;
    }

    /**
     * AS-IS updateFixYn L138 + 화면 검사(Rpt03_Tab_WeekWrite.updateFix L625-658) — 건의사항을 뺀 이번 주 행 전체를 제출/제출취소.
     * 이미 제출됐는데 제출 → "이미 제출되었습니다.", 제출 전인데 취소 → "이미 취소되었습니다."(제출여부가 비어 있으면 검사 안 함). 확인 처리된 보고는 거부
     */
    @Transactional
    public int updateFix(UserPrincipal user, WeekFixReq req) {
        assertNotConfirmed(user, req.startDate());
        List<WeekRes> rows = mapper.selectByStartDate(user.getCompanyId(), user.getUserId(), req.startDate(), req.closeDate(), false);
        for (WeekRes row : rows) {
            if (row.fixYn() == null) {
                continue;
            }
            if (row.fixYn() && req.fixYn()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 제출되었습니다.");
            }
            if (!row.fixYn() && !req.fixYn()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 취소되었습니다.");
            }
        }
        int count = 0;
        for (WeekRes row : rows) {
            count += mapper.updateFix(user.getCompanyId(), user.getUserId(), row.weekId(), String.valueOf(req.fixYn()));
        }
        return count;
    }

    /** AS-IS boldUpdate L187 — 행이 있을 때만 */
    @Transactional
    public int updateBold(UserPrincipal user, Long weekId, boolean bold) {
        assertEditableById(user, weekId);
        return mapper.updateBold(user.getCompanyId(), user.getUserId(), weekId, String.valueOf(bold));
    }

    /** AS-IS delete L209 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            assertEditableById(user, id);
            count += mapper.deleteWeek(user.getCompanyId(), user.getUserId(), id);
        }
        return count;
    }

    /**
     * AS-IS Rpt03_Tab_WeekWrite.downLoadButton L200-289 — ① 지난주 보고(getLastWeek)의 기간 ② sys.Sys99_Print.insertRdWeekWrite(L3847):
     * 내 출력 자료를 지우고 같은 주의 지난주·이번 주 비교 행을 새 그룹 ID로 담는다
     */
    @Transactional
    public WeekPrintRes insertRdWeekWrite(UserPrincipal user, WeekPrintReq req) {
        WeekRes last = mapper.selectLastWeek(user.getCompanyId(), user.getUserId(), req.startDate());
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW);
        for (WeekPrintRow row : mapper.selectPrintRows(user.getCompanyId(), user.getUserId(), req.startDate())) {
            mapper.insertPrint(mapper.selectNextId(), user.getCompanyId(), user.getUserId(), WINDOW, groupId, row);
        }
        return new WeekPrintRes(String.valueOf(groupId), last == null ? null : last.weekStartDate(), last == null ? null : last.weekCloseDate());
    }

    // ===== Rpt05 주간업무구분 관리 =====

    /** AS-IS Rpt05_WeekBizClass.selectByPersonId L21 */
    public List<WeekBizClassRes> getBizClasses(UserPrincipal user) {
        return mapper.selectBizClasses(user.getCompanyId(), user.getUserId(), LocalDate.now());
    }

    /** AS-IS Rpt05_WeekBizClass.upsert L26 */
    @Transactional
    public int saveBizClasses(UserPrincipal user, WeekBizClassSaveReq req) {
        for (WeekBizClassSaveReq.Item item : req.items()) {
            mapper.upsertBizClass(user.getCompanyId(), user.getUserId(), item.weekBizType(), String.valueOf(item.unUseYn()));
        }
        return req.items().size();
    }

    // ===== 내부 =====

    private WeekRes upsert(UserPrincipal user, WeekSaveReq req) {
        Long id = req.weekId();
        WeekSaveReq use = new WeekSaveReq(id, req.weekStartDate(), req.weekCloseDate(), req.bizType(), req.content(), req.dueDate(), req.seq(),
                req.bold() == null ? Boolean.FALSE : req.bold(), req.note());
        if (id == null || id <= 0) {
            id = mapper.selectNextId();
            mapper.insertWeek(user.getCompanyId(), user.getUserId(), id, use);
        } else if (mapper.updateWeek(user.getCompanyId(), user.getUserId(), use) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(user.getCompanyId(), id);
    }

    /** 화면의 fixCheck → confirmCheck를 서버도 지킨다 */
    private void assertEditable(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        if (startDate == null || closeDate == null) {
            return;
        }
        List<WeekRes> rows = mapper.selectByStartDate(user.getCompanyId(), user.getUserId(), startDate, closeDate, false);
        if (!rows.isEmpty() && Boolean.TRUE.equals(rows.get(0).fixYn())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "제출 처리된 보고입니다. 수정이 불가합니다.");
        }
        assertNotConfirmed(user, startDate);
    }

    private void assertNotConfirmed(UserPrincipal user, LocalDate startDate) {
        if (startDate != null && mapper.selectConfirmerId(user.getCompanyId(), user.getUserId(), startDate) != null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "확인 처리된 보고입니다. 수정이 불가합니다.");
        }
    }

    private void assertEditableById(UserPrincipal user, Long weekId) {
        WeekRes row = mapper.selectById(user.getCompanyId(), weekId);
        if (row != null) {
            assertEditable(user, row.weekStartDate(), row.weekCloseDate());
        }
    }
}

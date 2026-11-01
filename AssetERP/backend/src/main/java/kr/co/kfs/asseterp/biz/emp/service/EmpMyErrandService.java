package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ErrandCycleReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyErrandRes;
import kr.co.kfs.asseterp.biz.emp.dto.ErrandSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpMyErrandMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

/** 외출등록 (AS-IS Emp54_Tab_Errand → server/emp/Emp54_Errand) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpMyErrandService {

    private static final int MAX_CYCLE_STEPS = 20000;

    private final EmpMyErrandMapper mapper;

    /** AS-IS emp.Emp54_Errand.selectByDate (본인) */
    public List<MyErrandRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectByDate(user.getCompanyId(), user.getUserId(), startDate, closeDate);
    }

    /**
     * AS-IS emp.Emp54_Errand.update(UpdateDataModel) — errandId 0 이하는 INSERT, 그 밖은 UPDATE.
     * 상신문서(결재 ID)가 있고 반려가 아니면 수정 불가(Emp54_Tab_Errand.update L222-227, 화면 검사를 서버도 한다).
     */
    @Transactional
    public List<MyErrandRes> save(UserPrincipal user, List<ErrandSaveReq> rows) {
        List<MyErrandRes> saved = new ArrayList<>();
        for (ErrandSaveReq row : rows) {
            long id;
            if (row.errandId() == null || row.errandId() <= 0) {
                id = mapper.selectNextId();
                mapper.insertErrand(user.getCompanyId(), user.getUserId(), id, row.errandCode(), row.date(), row.departTime(),
                        row.returnTime(), row.reason(), row.host(), row.venue(), row.note(), row.publicYn());
            } else {
                MyErrandRes old = requireMine(user, row.errandId());
                if (old.apprId() != null && !"반려".equals(old.aprStatusName())) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "상신문서가 존재하는 내역은 수정이 불가능합니다");
                }
                id = row.errandId();
                mapper.updateErrand(user.getCompanyId(), user.getUserId(), row);
            }
            saved.add(mapper.selectMineById(user.getCompanyId(), user.getUserId(), id));
        }
        return saved;
    }

    /** AS-IS Emp54_Tab_Errand.updateApprId → emp.Emp54_Errand.update (결재문서 ID) */
    @Transactional
    public void updateApprId(UserPrincipal user, Long errandId, Long apprId) {
        if (apprId == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        requireMine(user, errandId);
        mapper.updateApprId(user.getCompanyId(), user.getUserId(), errandId, apprId);
    }

    /** AS-IS emp.Emp54_Errand.updatePublicYn → 바뀐 행 */
    @Transactional
    public MyErrandRes updatePublic(UserPrincipal user, Long errandId, Boolean publicYn) {
        requireMine(user, errandId);
        mapper.updatePublicYn(user.getCompanyId(), user.getUserId(), errandId, Boolean.TRUE.equals(publicYn));
        return mapper.selectMineById(user.getCompanyId(), user.getUserId(), errandId);
    }

    /**
     * AS-IS Emp54_Tab_Errand.deleteRow L281-308 — 고른 행이 모두 진행 중 문서(결재 ID가 있고 반려·임시저장이 아님)일 때만 거절한다.
     * 하나라도 지울 수 있는 행이 있으면 고른 행을 전부 지운다(이상한점 #101).
     */
    @Transactional
    public void delete(UserPrincipal user, List<Long> errandIds) {
        if (errandIds == null || errandIds.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        boolean allLocked = true;
        for (Long id : errandIds) {
            MyErrandRes row = requireMine(user, id);
            if (row.apprId() == null || "반려".equals(row.aprStatusName()) || "임시저장".equals(row.aprStatusName())) allLocked = false;
        }
        if (allLocked) throw new BusinessException(ErrorCode.INVALID_INPUT, "상신문서가 존재하는 내역은 삭제가 불가능합니다");
        for (Long id : errandIds) mapper.deleteErrand(user.getCompanyId(), user.getUserId(), id);
    }

    /**
     * AS-IS Emp54_Errand.modelUpdate — 첫 행을 넣고, 반복이면 반복종료일까지 날짜마다 그 행을 복사한다.
     * AS-IS 는 반복 입력을 서버 스레드에서 비동기로 하지만 TOBE 는 같은 트랜잭션에서 끝낸다(날짜 계산은 같은 Calendar 로직).
     */
    @Transactional
    public int createCycle(UserPrincipal user, ErrandCycleReq req) {
        if (req.date() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "외출일자는 필수입력 항목입니다");
        if (req.errandCode() == null || req.errandCode().isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "구분은 필수선택 항목입니다");
        boolean cycle = req.cycleName() != null && !"none".equals(req.cycleName());
        if (cycle) {
            if (req.cycleNum() == null || req.cycleDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "반복조건값이 비어있습니다");
            if (!Set.of("D", "W", "M", "Y").contains(req.cycleName()) || req.cycleNum() < 1) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "반복조건값이 비어있습니다");
            }
            if (("W".equals(req.cycleName()) || "M".equals(req.cycleName())) && (req.cycleOption() == null || req.cycleOption() == 9999)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "반복주기 선택을 해주세요");
            }
        }
        long id = mapper.selectNextId();
        mapper.insertErrand(user.getCompanyId(), user.getUserId(), id, req.errandCode(), req.date(), req.departTime(),
                req.returnTime(), req.reason(), req.host(), req.venue(), null, null);
        int inserted = 1;
        if (!cycle) return inserted;

        int cycleOption = req.cycleOption();
        int step = req.cycleNum().intValue();
        boolean holidayYn = Boolean.TRUE.equals(req.holidayYn());
        Calendar calendar = toCalendar(req.date());
        Calendar end = toCalendar(req.cycleDate());
        end.add(Calendar.DAY_OF_MONTH, 1);

        int count = 0;
        int guard = 0;
        while (calendar.getTime().before(end.getTime())) {
            if (++guard > MAX_CYCLE_STEPS) throw new BusinessException(ErrorCode.INVALID_INPUT, "반복조건값이 비어있습니다");
            LocalDate target = toLocalDate(calendar);
            if (count != 0) {
                if (holidayYn) {
                    if (mapper.countWorkingDay(user.getCompanyId(), target) == 1) {
                        mapper.insertCycle(user.getCompanyId(), id, target);
                        inserted++;
                    }
                } else {
                    mapper.insertCycle(user.getCompanyId(), id, target);
                    inserted++;
                }
            } else {
                count++;
            }
            switch (req.cycleName()) {
                case "D" -> calendar.add(Calendar.DAY_OF_MONTH, step);
                case "W" -> {
                    if (calendar.get(Calendar.DAY_OF_WEEK) == cycleOption) {
                        calendar.add(Calendar.WEEK_OF_YEAR, step);
                    } else {
                        calendar.add(Calendar.DAY_OF_MONTH, 1);
                        count = 0;
                    }
                }
                case "M" -> {
                    if (cycleOption == 1) {
                        calendar.add(Calendar.MONTH, step);   // 원본의 날짜 비교는 항상 같아 바로 월을 더한다
                    } else if (cycleOption == 2) {
                        int baseMonth = calendar.get(Calendar.MONTH);
                        int baseWeek = calendar.get(Calendar.WEEK_OF_MONTH);
                        while (calendar.get(Calendar.MONTH) == baseMonth) {
                            if (calendar.get(Calendar.WEEK_OF_MONTH) == baseWeek) {
                                calendar.add(Calendar.MONTH, step);
                                break;
                            } else {
                                count = 0;
                            }
                            calendar.add(Calendar.DAY_OF_MONTH, 1);
                        }
                    } else {
                        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
                        calendar.add(Calendar.MONTH, step);
                    }
                }
                default -> calendar.add(Calendar.DAY_OF_YEAR, step);   // Y: 원본은 주기 숫자만큼 "일"을 더한다
            }
        }
        return inserted;
    }

    private MyErrandRes requireMine(UserPrincipal user, Long errandId) {
        MyErrandRes row = errandId == null ? null : mapper.selectMineById(user.getCompanyId(), user.getUserId(), errandId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    private static Calendar toCalendar(LocalDate d) {
        Calendar c = Calendar.getInstance();
        c.clear();
        c.set(d.getYear(), d.getMonthValue() - 1, d.getDayOfMonth());
        return c;
    }

    private static LocalDate toLocalDate(Calendar c) {
        return LocalDate.of(c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 1, c.get(Calendar.DAY_OF_MONTH));
    }
}

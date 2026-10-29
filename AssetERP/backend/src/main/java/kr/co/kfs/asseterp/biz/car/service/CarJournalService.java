package kr.co.kfs.asseterp.biz.car.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalBatchReq;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalDateCheckRes;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalFixReq;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalRes;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalSaveReq;
import kr.co.kfs.asseterp.biz.car.dto.CarPublicAdminFixReq;
import kr.co.kfs.asseterp.biz.car.dto.CarPublicAdminJournalRes;
import kr.co.kfs.asseterp.biz.car.dto.CarPublicJournalRes;
import kr.co.kfs.asseterp.biz.car.mapper.CarInfoMapper;
import kr.co.kfs.asseterp.biz.car.mapper.CarJournalMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * AS-IS Car04_Tab_PrivateJournal·Car04_Lookup_PrivateJournal(T11) → server/car/Car04_Journal.java
 * (selectByDate L27 / selectByPrivateJournal L40 / getAfterFixYn L90 / getAfterCloseYn L110 / modelUpdate L148 / checkDate L171 / update L183 / delete L188).
 * 저장·삭제는 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarJournalService {

    private static final DateTimeFormatter YYYY_MM = DateTimeFormatter.ofPattern("yyyy.MM");

    private final CarJournalMapper mapper;
    private final CarInfoMapper infoMapper;

    /** AS-IS selectByPrivateJournal — stdMonth 'YYYY.MM' */
    public List<CarJournalRes> search(UserPrincipal user, Long infoId, String stdMonth) {
        return mapper.selectByPrivateJournal(user.getCompanyId(), infoId, stdMonth);
    }

    /**
     * 편집창 사용일자 검사 — AS-IS Car04_Lookup_PrivateJournal.checkCloseYn → checkFixYn → checkJournal → checkDate → getBeforeMileage
     * (각 단계가 서비스 한 번씩이던 것을 순서·메시지 그대로 한 번에 한다)
     */
    public CarJournalDateCheckRes dateCheck(UserPrincipal user, Long infoId, LocalDate date) {
        Long companyId = user.getCompanyId();
        String stdMonth = date.format(YYYY_MM);
        if (mapper.countAfterClose(companyId, infoId, stdMonth) > 0) return new CarJournalDateCheckRes("해당월 이 후의 운행일지가 마감되어 추가등록하실 수 없습니다", null);
        if (mapper.countAfterFix(companyId, infoId, stdMonth) > 0) return new CarJournalDateCheckRes("해당월 이 후의 운행일지가 확정되어 추가등록하실 수 없습니다", null);
        List<CarJournalRes> month = mapper.selectByPrivateJournal(companyId, infoId, stdMonth);
        if (!month.isEmpty() && Boolean.TRUE.equals(month.get(0).fixYn())) return new CarJournalDateCheckRes("해당월의 운행일지는 확정이 되어 등록하실 수 없습니다", null);
        if (mapper.countByDate(companyId, infoId, date) > 0) return new CarJournalDateCheckRes("해당 사용일자의 운행일지는 이미 등록되어있습니다", null);
        CarJournalRes before = mapper.selectByDate(companyId, infoId, date);
        return new CarJournalDateCheckRes(null, before == null ? 0L : before.afterMileage());
    }

    /** AS-IS modelUpdate (UpdateDataModel) → 저장된 행. 신규는 journalId가 null */
    @Transactional
    public CarJournalRes save(UserPrincipal user, CarJournalSaveReq req) {
        // AS-IS Car04_Lookup_PrivateJournal.update() L444-471의 필수 검사
        if (req.date() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "사용일자는 필수선택 항목입니다");
        if (req.mileage() == null || req.mileage() == 0L) throw new BusinessException(ErrorCode.INVALID_INPUT, "주행거리는 필수입력 항목입니다");
        if (req.bizMileage() != null && req.bizMileage() != 0L) {
            if (isBlank(req.destination())) throw new BusinessException(ErrorCode.INVALID_INPUT, "일반업무용은 행선지가 필수입력 항목입니다");
            if (isBlank(req.reason())) throw new BusinessException(ErrorCode.INVALID_INPUT, "일반업무용은 목적이 필수입력 항목입니다");
        }
        Long companyId = user.getCompanyId();
        if (req.infoId() == null || infoMapper.selectById(companyId, req.infoId()) == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        CarJournalSaveReq row = req.personId() != null ? req : withPerson(req, user.getUserId());
        if (row.journalId() != null && row.journalId() > 0) {
            if (mapper.update(companyId, row) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            return mapper.selectById(companyId, row.journalId());
        }
        long id = mapper.selectNextId();
        mapper.insert(companyId, id, row);
        return mapper.selectById(companyId, id);
    }

    /**
     * AS-IS Tab.confirmAll·cancelAll → Car04_Journal.update — 그 기준년월의 일지 전부를 확정(fixYn=true)·확정취소(false).
     * 마감된 일지가 하나라도 있으면 아무것도 바꾸지 않는다 → 바꾼 건수
     */
    @Transactional
    public int fix(UserPrincipal user, CarJournalFixReq req) {
        boolean fix = Boolean.TRUE.equals(req.fixYn());
        List<CarJournalRes> rows = mapper.selectByPrivateJournal(user.getCompanyId(), req.infoId(), req.stdMonth());
        for (CarJournalRes row : rows) {
            if (Boolean.TRUE.equals(row.closeYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, fix ? "해당월의 운행일지는 마감되었습니다. 담당부서에 문의하세요" : "담당자가 마감처리한 운행일지가 포함되어있습니다. 담당부서에 문의하세요");
            }
        }
        int count = 0;
        for (CarJournalRes row : rows) count += mapper.updateFix(user.getCompanyId(), row, fix);
        return count;
    }

    /**
     * AS-IS Car04_Lookup_PrivateJournal·Car04_Tab_PrivateJournalAdmin.batchCheck → Car04_Lookup_Batch.batch → Car04_Journal.batch (L120).
     * 그 달이 확정이면 거절하고, 작업일마다 그날 일지가 없을 때만 같은 내용으로 만든다 → 만든 건수
     */
    @Transactional
    public int batch(UserPrincipal user, CarJournalBatchReq req) {
        if (req.mileage() == null || req.mileage() == 0L) throw new BusinessException(ErrorCode.INVALID_INPUT, "주행거리는 필수입력 항목입니다");
        if (req.bizMileage() != null && req.bizMileage() != 0L) {
            if (isBlank(req.destination())) throw new BusinessException(ErrorCode.INVALID_INPUT, "일반업무용은 행선지가 필수입력 항목입니다");
            if (isBlank(req.reason())) throw new BusinessException(ErrorCode.INVALID_INPUT, "일반업무용은 목적이 필수입력 항목입니다");
        }
        Long companyId = user.getCompanyId();
        if (req.infoId() == null || infoMapper.selectById(companyId, req.infoId()) == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        List<CarJournalRes> month = mapper.selectByPrivateJournal(companyId, req.infoId(), req.stdMonth());
        if (!month.isEmpty() && Boolean.TRUE.equals(month.get(0).fixYn())) throw new BusinessException(ErrorCode.INVALID_INPUT, "해당월의 운행일지는 확정이 되어 등록하실 수 없습니다");
        int count = 0;
        for (LocalDate day : mapper.selectWorkDays(req.stdMonth())) {
            if (mapper.countByDate(companyId, req.infoId(), day) == 0) count += mapper.insertBatch(companyId, user.getUserId(), req, day);
        }
        return count;
    }

    /** AS-IS Car04_Tab_PublicJournal.retrieve → selectByPublicJournal (infoId가 null이면 전체) */
    public List<CarPublicJournalRes> searchPublic(UserPrincipal user, Long infoId, String stdMonth) {
        return mapper.selectByPublicJournal(user.getCompanyId(), user.getUserId(), infoId, stdMonth);
    }

    /** AS-IS Tab.updateCheck → checkBookingId — 그 예약의 일지가 이미 있으면 true(없으면 화면이 journalId를 비워 새로 넣는다) */
    public boolean existsBooking(UserPrincipal user, Long bookingId) {
        return mapper.countByBookingId(user.getCompanyId(), bookingId) > 0;
    }

    /**
     * AS-IS Car04_Tab_PublicJournal.confirmAll·cancelAll — 로그인 사원 몫의 그 기준년월 행을 확정(fixYn=true)·확정취소(false).
     * 마감된 행이 하나라도 있으면 아무것도 바꾸지 않고, 일지가 없는 예약은 새로 넣는다(updateCheck → modelUpdate) → 바꾼 건수
     */
    @Transactional
    public int fixPublic(UserPrincipal user, CarJournalFixReq req) {
        return applyPublicFix(user, mapper.selectByPublicJournal(user.getCompanyId(), user.getUserId(), req.infoId(), req.stdMonth()), Boolean.TRUE.equals(req.fixYn()));
    }

    /** AS-IS Car04_Journal.selectByPublicJournalAdmin (T15) — 로그인 회사 전체 사용자. infoId가 null이면 전체 차량, searchText는 요일/사용자/행선지/목적 */
    public List<CarPublicAdminJournalRes> searchPublicAdmin(UserPrincipal user, Long infoId, String stdMonth, String searchText) {
        return mapper.selectByPublicJournalAdmin(user.getCompanyId(), infoId, stdMonth, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS Car04_Tab_PublicJournalAdmin.confirmAll·cancelAll (T15) — 화면에 보이는 조건의 행 전부 → 바꾼 건수 */
    @Transactional
    public int fixPublicAdmin(UserPrincipal user, CarPublicAdminFixReq req) {
        List<CarPublicJournalRes> rows = searchPublicAdmin(user, req.infoId(), req.stdMonth(), req.searchText()).stream()
                .map(r -> new CarPublicJournalRes(r.journalId(), r.companyId(), r.infoId(), r.date(), r.personId(), r.mileage(), null, null,
                        r.commuteMileage(), r.bizMileage(), r.unBizMileage(), r.destination(), r.reason(), r.note(), r.bookingId(),
                        r.fixYn(), r.closeYn(), r.businessMileage(), r.infoNm(), r.attendance()))
                .toList();
        return applyPublicFix(user, rows, Boolean.TRUE.equals(req.fixYn()));
    }

    /** 마감된 행이 하나라도 있으면 아무것도 바꾸지 않고, 일지가 없는 예약은 새로 넣는다(updateCheck → modelUpdate) */
    private int applyPublicFix(UserPrincipal user, List<CarPublicJournalRes> rows, boolean fix) {
        for (CarPublicJournalRes row : rows) {
            if (Boolean.TRUE.equals(row.closeYn())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, fix ? "해당월의 운행일지는 마감되었습니다. 담당부서에 문의하세요" : "담당자가 마감처리한 운행일지가 포함되어있습니다. 담당부서에 문의하세요");
            }
        }
        int count = 0;
        for (CarPublicJournalRes row : rows) {
            if (mapper.countByBookingId(user.getCompanyId(), row.bookingId()) > 0) count += mapper.updatePublicFix(user.getCompanyId(), row, fix);
            else count += mapper.insertPublicFix(user.getCompanyId(), mapper.selectNextId(), row, fix);
        }
        return count;
    }

    /** AS-IS delete → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static CarJournalSaveReq withPerson(CarJournalSaveReq r, Long personId) {
        return new CarJournalSaveReq(r.journalId(), r.infoId(), r.date(), personId, r.mileage(), r.commuteMileage(), r.bizMileage(),
                r.unBizMileage(), r.destination(), r.reason(), r.note(), r.bookingId());
    }
}

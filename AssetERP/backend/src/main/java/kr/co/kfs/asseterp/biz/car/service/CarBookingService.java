package kr.co.kfs.asseterp.biz.car.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingAdminReq;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingJournalReq;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingRes;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalSaveReq;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingSaveReq;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingTimelineRes;
import kr.co.kfs.asseterp.biz.car.mapper.CarBookingMapper;
import kr.co.kfs.asseterp.biz.car.mapper.CarInfoMapper;
import kr.co.kfs.asseterp.biz.car.mapper.CarJournalMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Car03_Tab_List·Car03_Tab_DayofMonth·Car03_Popup_BookingReg(T13) → server/car/Car03_Booking.java
 * (selectById L24 / selectByList L29 / selectByDate L39 / selectByDateUnion L62 / update L76 / updateList L114 / delete L367 / deleteList L372).
 * 저장·삭제는 로그인 회사 차량의 예약만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarBookingService {

    private final CarBookingMapper mapper;
    private final CarInfoMapper infoMapper;
    private final CarJournalMapper journalMapper;

    /** AS-IS selectByList */
    public List<CarBookingRes> searchList(UserPrincipal user) {
        return mapper.selectByList(user.getCompanyId());
    }

    /** AS-IS selectByDate — type 'my'면 로그인 사원 것만, 그 밖에는 전체 */
    public List<CarBookingRes> searchByDate(UserPrincipal user, LocalDate date, String type) {
        return mapper.selectByDate(user.getCompanyId(), user.getUserId(), type, date);
    }

    /** AS-IS selectByDateUnion */
    public List<CarBookingTimelineRes> searchTimeline(UserPrincipal user, LocalDate date) {
        return mapper.selectByDateUnion(user.getCompanyId(), date);
    }

    /**
     * AS-IS update / updateList — 종료일이 시작일과 같으면 update, 다르면 updateList(날마다 한 행, 첫 행이 parent).
     * 겹침(confirmUpdate)이 "0"이 아니면 그 메시지로 거절하고 지금까지 쓴 행도 되돌린다
     */
    @Transactional
    public CarBookingRes save(UserPrincipal user, CarBookingSaveReq req) {
        if (req.infoId() == null || infoMapper.selectById(user.getCompanyId(), req.infoId()) == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        if (req.personId() == null || req.startDate() == null || req.startHour() == null || req.startMin() == null
                || req.closeHour() == null || req.closeMin() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "필수 항목이 비어 있습니다");
        LocalDate closeDate = req.closeDate() == null ? req.startDate() : req.closeDate();
        if (closeDate.isBefore(req.startDate())) throw new BusinessException(ErrorCode.INVALID_INPUT, "예약종료일자를 다시 선택해주세요");

        Long firstId = req.bookingId() != null ? req.bookingId() : mapper.selectNextId();
        if (req.bookingId() != null && mapper.countById(firstId) > 0 && !ownsBooking(user, firstId)) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        if (req.changeUpdate()) mapper.deleteByParentId(user.getCompanyId(), firstId);

        CarBookingSaveReq row = req.regEmpId() != null ? req : withRegEmp(req, user.getUserId());
        long parentId = req.parentId() == null ? 0L : req.parentId();
        if (closeDate.equals(req.startDate())) {
            // AS-IS update: 한 행
            put(firstId, req.startDate(), closeDate, parentId, row);
            return mapper.selectById(firstId);
        }
        // AS-IS updateList: 시작일~종료일(포함) 날마다. 첫 행은 기간 그대로, 이후 행은 그날 하루(parent = 첫 행)
        Long id = firstId;
        for (LocalDate day = req.startDate(); !day.isAfter(closeDate); day = day.plusDays(1)) {
            boolean first = day.equals(req.startDate());
            put(id, day, first ? closeDate : day, first ? parentId : firstId, row);
            id = mapper.selectNextId();
        }
        return mapper.selectById(firstId);
    }

    /** AS-IS delete(withChildren=false) / deleteList(true: 첫 행의 하위 예약도 지운다) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids, boolean withChildren) {
        if (ids == null || ids.isEmpty()) return 0;
        if (withChildren) mapper.deleteByParentId(user.getCompanyId(), ids.get(0));
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /**
     * AS-IS Car04_Lookup_PublicJournalAdmin.update → Car03_Booking.updateAdmin / updateListAdmin (T15) — 예약과 운행일지를 날마다 함께 만든다.
     * 예약은 regEmpId 없이(AS-IS) 넣고, 일지는 확정·마감 false. 겹침이면 메시지로 거절하고 지금까지 쓴 행도 되돌린다 → 만든 일지 건수
     */
    @Transactional
    public int createAdmin(UserPrincipal user, CarBookingAdminReq req) {
        Long companyId = user.getCompanyId();
        if (req.infoId() == null || infoMapper.selectById(companyId, req.infoId()) == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        if (req.personId() == null || req.startDate() == null || req.startHour() == null || req.startMin() == null
                || req.closeHour() == null || req.closeMin() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "필수 항목이 비어 있습니다");
        LocalDate closeDate = req.closeDate() == null ? req.startDate() : req.closeDate();
        if (closeDate.isBefore(req.startDate())) throw new BusinessException(ErrorCode.INVALID_INPUT, "예약종료일자를 다시 선택해주세요");
        CarBookingSaveReq row = new CarBookingSaveReq(null, req.infoId(), req.personId(), req.startDate(), req.startHour(), req.startMin(), closeDate,
                req.closeHour(), req.closeMin(), req.destination(), req.reason(), req.attendance(), null, 0L, null, false);
        Long firstId = mapper.selectNextId();
        Long id = firstId;
        int count = 0;
        for (LocalDate day = req.startDate(); !day.isAfter(closeDate); day = day.plusDays(1)) {
            boolean first = day.equals(req.startDate());
            put(id, day, first ? closeDate : day, first ? 0L : firstId, row);
            journalMapper.insert(companyId, journalMapper.selectNextId(), new CarJournalSaveReq(null, req.infoId(), day, req.personId(), req.mileage(),
                    req.commuteMileage(), req.bizMileage(), req.unBizMileage(), req.destination(), req.reason(), null, id));
            count++;
            id = mapper.selectNextId();
        }
        return count;
    }

    /**
     * AS-IS Car04_Edit_PublicJournalAdmin.update → Car03_Booking.updateJournalModel (T15) — 겹침 검사 뒤 예약의 시간·사용자·행선지·목적·참석자와 일지를 함께 고친다.
     * 일지가 아직 없는 예약이면 새로 넣는다 → 저장된 예약
     */
    @Transactional
    public CarBookingRes updateJournal(UserPrincipal user, CarBookingJournalReq req) {
        Long companyId = user.getCompanyId();
        CarBookingRes cur = req.bookingId() == null ? null : mapper.selectById(req.bookingId());
        if (cur == null || infoMapper.selectById(companyId, cur.infoId()) == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        String check = mapper.confirmUpdate(req.bookingId(), req.infoId(), req.date(), req.startHour(), req.startMin(), req.closeHour(), req.closeMin());
        if (check != null && !"0".equals(check)) throw new BusinessException(ErrorCode.INVALID_INPUT, check);
        mapper.updateBooking(req.bookingId(), cur.startDate(), cur.closeDate(), cur.parentId() == null ? 0L : cur.parentId(),
                new CarBookingSaveReq(cur.bookingId(), cur.infoId(), req.personId(), cur.startDate(), req.startHour(), req.startMin(), cur.closeDate(),
                        req.closeHour(), req.closeMin(), req.destination(), req.reason(), req.attendance(), cur.note(), cur.parentId(), cur.regEmpId(), false));
        CarJournalSaveReq journal = new CarJournalSaveReq(null, req.infoId(), req.date(), req.personId(), req.mileage(), req.commuteMileage(),
                req.bizMileage(), req.unBizMileage(), req.destination(), req.reason(), req.note(), req.bookingId());
        Long journalId = journalMapper.selectIdByBookingId(companyId, req.bookingId());
        if (journalId != null) {
            journalMapper.update(companyId, new CarJournalSaveReq(journalId, journal.infoId(), journal.date(), journal.personId(), journal.mileage(),
                    journal.commuteMileage(), journal.bizMileage(), journal.unBizMileage(), journal.destination(), journal.reason(), journal.note(), journal.bookingId()));
        } else {
            journalMapper.insert(companyId, journalMapper.selectNextId(), journal);
        }
        return mapper.selectById(req.bookingId());
    }

    /** AS-IS Car04_Tab_PublicJournalAdmin.delete → Car03_Booking.deleteByJournalList + Car04_Journal.delete (T15) — 예약과 그 일지를 함께 지운다 → 지운 예약 수 */
    @Transactional
    public int deleteAdmin(UserPrincipal user, List<Long> bookingIds) {
        if (bookingIds == null || bookingIds.isEmpty()) return 0;
        journalMapper.deleteByBookingIds(user.getCompanyId(), bookingIds);
        return mapper.deleteByIds(user.getCompanyId(), bookingIds);
    }

    /** AS-IS confirmUpdate → UpdateDataModel — 겹치면 메시지로 거절, 없으면 INSERT/UPDATE */
    private void put(Long bookingId, LocalDate startDate, LocalDate closeDate, long parentId, CarBookingSaveReq row) {
        String check = mapper.confirmUpdate(bookingId, row.infoId(), startDate, row.startHour(), row.startMin(), row.closeHour(), row.closeMin());
        if (check != null && !"0".equals(check)) throw new BusinessException(ErrorCode.INVALID_INPUT, check);
        if (mapper.countById(bookingId) > 0) mapper.updateBooking(bookingId, startDate, closeDate, parentId, row);
        else mapper.insertBooking(bookingId, startDate, closeDate, parentId, row);
    }

    private boolean ownsBooking(UserPrincipal user, Long bookingId) {
        CarBookingRes cur = mapper.selectById(bookingId);
        return cur != null && infoMapper.selectById(user.getCompanyId(), cur.infoId()) != null;
    }

    private CarBookingSaveReq withRegEmp(CarBookingSaveReq r, Long regEmpId) {
        return new CarBookingSaveReq(r.bookingId(), r.infoId(), r.personId(), r.startDate(), r.startHour(), r.startMin(), r.closeDate(),
                r.closeHour(), r.closeMin(), r.destination(), r.reason(), r.attendance(), r.note(), r.parentId(), regEmpId, r.changeUpdate());
    }
}

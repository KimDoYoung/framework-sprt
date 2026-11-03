package kr.co.kfs.asseterp.biz.mrb.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mrb.dto.MrbBookingRes;
import kr.co.kfs.asseterp.biz.mrb.dto.MrbBookingSaveReq;
import kr.co.kfs.asseterp.biz.mrb.dto.MrbBookingTimelineRes;
import kr.co.kfs.asseterp.biz.mrb.mapper.MrbBookingMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Mrb01_Tab_List·Mrb01_Tab_DayofMonth·Mrb01_Popup_MeetingRoomReg(EE14) → server/mrb/Mrb01_Booking.java
 * (selectById L23 / selectByList L38 / selectByYearMonth L48 / selectByDate L58 / selectByDateUnion L73 / update L106 / updateList L145 / delete L209 / deleteList L214).
 * 저장·삭제는 로그인 회사의 예약만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MrbBookingService {

    private final MrbBookingMapper mapper;

    /** AS-IS selectByList */
    public List<MrbBookingRes> searchList(UserPrincipal user) {
        return mapper.selectByList(user.getCompanyId());
    }

    /** AS-IS selectByYearMonth — yyyyMM의 예약 있는 날 */
    public List<LocalDate> searchMarkedDates(UserPrincipal user, String yyyyMM) {
        return mapper.selectByYearMonth(user.getCompanyId(), yyyyMM);
    }

    /** AS-IS selectByDate — type 'my'면 로그인 사원 것만, 그 밖에는 전체 */
    public List<MrbBookingRes> searchByDate(UserPrincipal user, LocalDate date, String type) {
        return mapper.selectByDate(user.getCompanyId(), user.getUserId(), type, date);
    }

    /** AS-IS selectByDateUnion */
    public List<MrbBookingTimelineRes> searchTimeline(UserPrincipal user, LocalDate date) {
        return mapper.selectByDateUnion(user.getCompanyId(), date);
    }

    /** AS-IS dbConfig.getSeq — 새 예약 창이 첨부파일을 올리기 전에 받는 번호. f_create_seq()가 시퀀스를 갱신하므로 쓰기 트랜잭션 */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /**
     * AS-IS update / updateList — 종료일이 시작일과 같으면 update, 다르면 updateList(날마다 한 행, 첫 행이 parent).
     * 겹침(confirmUpdate)이 "0"이 아니면 그 메시지로 거절하고 지금까지 쓴 행도 되돌린다
     */
    @Transactional
    public MrbBookingRes save(UserPrincipal user, MrbBookingSaveReq req) {
        Long companyId = user.getCompanyId();
        if (req.bookingId() == null || req.empId() == null || req.roomCd() == null || req.bookingDate() == null
                || req.startHour() == null || req.startMin() == null || req.closeHour() == null || req.closeMin() == null)
            throw new BusinessException(ErrorCode.INVALID_INPUT, "필수 항목이 비어 있습니다");
        LocalDate closeDate = req.bookingCloseDate() == null ? req.bookingDate() : req.bookingCloseDate();
        if (closeDate.isBefore(req.bookingDate())) throw new BusinessException(ErrorCode.INVALID_INPUT, "예약종료일자를 다시 선택해주세요");

        Long firstId = req.bookingId();
        Long owner = mapper.selectCompanyId(firstId);
        if (owner != null && !owner.equals(companyId)) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        if (req.changeUpdate()) mapper.deleteByParentId(companyId, firstId);

        long parentId = req.parentId() == null ? 0L : req.parentId();
        if (closeDate.equals(req.bookingDate())) {
            // AS-IS update: 한 행
            put(companyId, firstId, req.bookingDate(), closeDate, parentId, req);
            return mapper.selectById(firstId);
        }
        // AS-IS updateList: 시작일~종료일(포함) 날마다. 첫 행은 parentId가 0이면 기간 그대로(아니면 그날 하루), 이후 행은 그날 하루(parent = 첫 행)
        Long id = firstId;
        for (LocalDate day = req.bookingDate(); !day.isAfter(closeDate); day = day.plusDays(1)) {
            boolean first = day.equals(req.bookingDate());
            put(companyId, id, day, first ? (parentId == 0L ? closeDate : day) : day, first ? parentId : firstId, req);
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

    /** AS-IS confirmUpdate → UpdateDataModel — 겹치면 메시지로 거절, 없으면 INSERT/UPDATE */
    private void put(Long companyId, Long bookingId, LocalDate bookingDate, LocalDate closeDate, long parentId, MrbBookingSaveReq req) {
        String check = mapper.confirmUpdate(bookingId, companyId, req.roomCd(), bookingDate, req.startHour(), req.startMin(), req.closeHour(), req.closeMin());
        if (check != null && !"0".equals(check)) throw new BusinessException(ErrorCode.INVALID_INPUT, check);
        if (mapper.selectCompanyId(bookingId) != null) mapper.updateBooking(companyId, bookingId, bookingDate, closeDate, parentId, req);
        else mapper.insertBooking(companyId, bookingId, bookingDate, closeDate, parentId, req);
    }
}

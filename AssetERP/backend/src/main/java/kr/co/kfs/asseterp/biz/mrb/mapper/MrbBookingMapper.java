package kr.co.kfs.asseterp.biz.mrb.mapper;

import kr.co.kfs.asseterp.biz.mrb.dto.MrbBookingRes;
import kr.co.kfs.asseterp.biz.mrb.dto.MrbBookingSaveReq;
import kr.co.kfs.asseterp.biz.mrb.dto.MrbBookingTimelineRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface MrbBookingMapper {

    /** AS-IS mrb01_booking.selectByList — 오늘 이후 예약(그룹 예약은 첫 행만) */
    List<MrbBookingRes> selectByList(@Param("companyId") Long companyId);

    /** AS-IS mrb01_booking.selectByYearMonth — 그 달에 예약이 있는 날(달력 표시) */
    List<LocalDate> selectByYearMonth(@Param("companyId") Long companyId, @Param("yyyyMM") String yyyyMM);

    /** AS-IS mrb01_booking.selectByDate — type 'my'면 로그인 사원 예약만 */
    List<MrbBookingRes> selectByDate(@Param("companyId") Long companyId, @Param("empId") Long empId,
                                     @Param("type") String type, @Param("date") LocalDate date);

    /** AS-IS mrb01_booking.selectByDateUnion — 회의실별 그날 예약(없으면 빈 막대) + 사용시간 안내 행 */
    List<MrbBookingTimelineRes> selectByDateUnion(@Param("companyId") Long companyId, @Param("date") LocalDate date);

    /** AS-IS mrb01_booking.selectById — 저장 결과 한 행 */
    MrbBookingRes selectById(@Param("bookingId") Long bookingId);

    /** AS-IS mrb01_booking.confirmUpdate — "0"이면 겹침 없음, 아니면 메시지 */
    String confirmUpdate(@Param("bookingId") Long bookingId, @Param("companyId") Long companyId, @Param("roomCd") String roomCd,
                         @Param("bookingDate") LocalDate bookingDate, @Param("startHour") String startHour, @Param("startMin") String startMin,
                         @Param("closeHour") String closeHour, @Param("closeMin") String closeMin);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** 그 번호의 예약이 있는 회사 ID (없으면 null) */
    Long selectCompanyId(@Param("bookingId") Long bookingId);

    /** 저장(UpdateDataModel 동적 INSERT) — row의 날짜·parentId는 서비스가 정한 값 */
    int insertBooking(@Param("companyId") Long companyId, @Param("bookingId") Long bookingId, @Param("bookingDate") LocalDate bookingDate,
                      @Param("closeDate") LocalDate closeDate, @Param("parentId") Long parentId, @Param("req") MrbBookingSaveReq req);

    int updateBooking(@Param("companyId") Long companyId, @Param("bookingId") Long bookingId, @Param("bookingDate") LocalDate bookingDate,
                      @Param("closeDate") LocalDate closeDate, @Param("parentId") Long parentId, @Param("req") MrbBookingSaveReq req);

    /** AS-IS mrb01_booking.deleteParentId (로그인 회사 예약만) */
    int deleteByParentId(@Param("companyId") Long companyId, @Param("parentId") Long parentId);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}

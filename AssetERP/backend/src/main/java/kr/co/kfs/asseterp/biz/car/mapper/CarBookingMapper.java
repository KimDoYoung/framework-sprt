package kr.co.kfs.asseterp.biz.car.mapper;

import kr.co.kfs.asseterp.biz.car.dto.CarBookingRes;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingSaveReq;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingTimelineRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface CarBookingMapper {

    /** AS-IS car03_booking.selectByList — 오늘 이후 예약(그룹 예약은 첫 행만) */
    List<CarBookingRes> selectByList(@Param("companyId") Long companyId);

    /** AS-IS car03_booking.selectByDate — type 'my'면 로그인 사원 예약만 */
    List<CarBookingRes> selectByDate(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                     @Param("type") String type, @Param("date") LocalDate date);

    /** AS-IS car03_booking.selectByDateUnion — 공용차량별 그날 예약(없으면 빈 막대) + 사용시간 안내 행 */
    List<CarBookingTimelineRes> selectByDateUnion(@Param("companyId") Long companyId, @Param("date") LocalDate date);

    /** AS-IS car03_booking.selectById — 저장 결과 한 행 */
    CarBookingRes selectById(@Param("bookingId") Long bookingId);

    /** AS-IS car03_booking.confirmUpdate — "0"이면 겹침 없음, 아니면 메시지 */
    String confirmUpdate(@Param("bookingId") Long bookingId, @Param("infoId") Long infoId, @Param("startDate") LocalDate startDate,
                         @Param("startHour") String startHour, @Param("startMin") String startMin,
                         @Param("closeHour") String closeHour, @Param("closeMin") String closeMin);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    int countById(@Param("bookingId") Long bookingId);

    /** 저장(UpdateDataModel 동적 INSERT) — row의 날짜·parentId는 서비스가 정한 값 */
    int insertBooking(@Param("bookingId") Long bookingId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                      @Param("parentId") Long parentId, @Param("req") CarBookingSaveReq req);

    int updateBooking(@Param("bookingId") Long bookingId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                      @Param("parentId") Long parentId, @Param("req") CarBookingSaveReq req);

    /** AS-IS car03_booking.deleteParentId (로그인 회사 차량의 예약만) */
    int deleteByParentId(@Param("companyId") Long companyId, @Param("parentId") Long parentId);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}

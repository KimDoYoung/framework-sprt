package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.HolidayRes;
import kr.co.kfs.asseterp.biz.sys.dto.HolidaySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys14_holiday.xml + UpdateDataModel(sys14_holiday) */
@Mapper
public interface SysHolidayMapper {
    /** AS-IS selectByYear (year는 LIKE 패턴 — 화면의 조회연도 그대로) */
    List<HolidayRes> selectByYear(@Param("companyId") Long companyId, @Param("year") String year);

    HolidayRes selectById(@Param("holidayId") Long holidayId);

    Long selectNextId();

    int insertHoliday(@Param("holidayId") Long holidayId, @Param("companyId") Long companyId, @Param("req") HolidaySaveReq req);

    int updateHoliday(@Param("companyId") Long companyId, @Param("req") HolidaySaveReq req);

    int deleteHolidays(@Param("companyId") Long companyId, @Param("holidayIds") List<Long> holidayIds);

    /** AS-IS deleteByDay */
    int deleteByDay(@Param("companyId") Long companyId, @Param("day") String day);

    /** AS-IS insertInitData: admin(회사 0)의 그날 휴일을 회사로 복사 */
    int insertInitData(@Param("companyId") Long companyId, @Param("day") String day);
}

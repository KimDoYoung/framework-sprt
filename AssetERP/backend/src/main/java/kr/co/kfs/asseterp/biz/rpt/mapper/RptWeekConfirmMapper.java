package kr.co.kfs.asseterp.biz.rpt.mapper;

import kr.co.kfs.asseterp.biz.rpt.dto.WeekConfirmRes;
import kr.co.kfs.asseterp.biz.rpt.dto.WeekConfirmerRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS rpt03_week.selectByCompanyId, rpt04_week_confirm.xml selectByConfirmerId·updateNote·confirmUpdate·updateByPersonId (Z12) */
@Mapper
public interface RptWeekConfirmMapper {

    List<WeekConfirmRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                           @Param("orgCodeId") Long orgCodeId, @Param("confirmYn") boolean confirmYn);

    WeekConfirmerRes selectByConfirmerId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                         @Param("startDate") LocalDate startDate, @Param("confirmerId") Long confirmerId);

    int updateNote(@Param("companyId") Long companyId, @Param("personId") Long personId,
                   @Param("startDate") LocalDate startDate, @Param("confirmNote") String confirmNote);

    int confirmUpdate(@Param("companyId") Long companyId, @Param("personId") Long personId,
                      @Param("startDate") LocalDate startDate, @Param("confirmerId") Long confirmerId);

    int updateByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                         @Param("startDate") LocalDate startDate, @Param("confirmNote") String confirmNote);
}

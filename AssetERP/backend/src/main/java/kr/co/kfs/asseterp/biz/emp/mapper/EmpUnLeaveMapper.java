package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpUnLeaveMapper {

    List<UnLeaveRes> selectYearList(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                                    @Param("unLeaveCode") String unLeaveCode);

    List<UnLeaveRes> selectMonthList(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                                     @Param("unLeaveCode") String unLeaveCode);

    int insertYear(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                   @Param("unLeaveCode") String unLeaveCode);

    int insertMonth(@Param("companyId") Long companyId, @Param("stdYear") String stdYear);

    int updateUnLeave(@Param("companyId") Long companyId, @Param("unLeaveId") Long unLeaveId,
                      @Param("totalDays") Double totalDays, @Param("useDays") Double useDays,
                      @Param("remainDays") Double remainDays);

    int deleteUnLeaves(@Param("companyId") Long companyId, @Param("unLeaveIds") List<Long> unLeaveIds);
}

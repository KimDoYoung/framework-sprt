package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.YearLeaveRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpYearLeaveMapper {

    List<YearLeaveRes> selectYearList(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                                      @Param("monthStdDateType") String monthStdDateType, @Param("stdDate") LocalDate stdDate,
                                      @Param("retireType") String retireType);

    long selectNextId();

    int deletePrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName);

    int insertPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId,
                    @Param("stdYear") String stdYear, @Param("monthStdDateType") String monthStdDateType,
                    @Param("stdDate") LocalDate stdDate, @Param("retireType") String retireType);
}

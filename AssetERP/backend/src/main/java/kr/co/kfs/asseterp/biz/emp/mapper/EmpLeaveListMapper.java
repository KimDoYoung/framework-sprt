package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.LeaveListRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** Y02 휴가신청조회 (AS-IS server/emp/mapper/emp20_leave.xml selectByPersonName) */
@Mapper
public interface EmpLeaveListMapper {

    List<LeaveListRes> selectByPersonName(@Param("companyId") Long companyId, @Param("personName") String personName,
                                          @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    long selectNextId();

    int deletePrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName);

    int insertPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId,
                    @Param("personName") String personName, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);
}

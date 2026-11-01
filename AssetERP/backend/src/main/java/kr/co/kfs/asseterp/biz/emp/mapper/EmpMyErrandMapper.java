package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.MyErrandRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpMyErrandMapper {

    List<MyErrandRes> selectByDate(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                 @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    MyErrandRes selectMineById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("errandId") Long errandId);

    long selectNextId();

    int insertErrand(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("errandId") Long errandId,
                     @Param("errandCode") String errandCode, @Param("date") LocalDate date, @Param("departTime") String departTime,
                     @Param("returnTime") String returnTime, @Param("reason") String reason, @Param("host") String host,
                     @Param("venue") String venue, @Param("note") String note, @Param("publicYn") Boolean publicYn);

    int updateErrand(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") kr.co.kfs.asseterp.biz.emp.dto.ErrandSaveReq req);

    int insertCycle(@Param("companyId") Long companyId, @Param("errandId") Long errandId, @Param("date") LocalDate date);

    int countWorkingDay(@Param("companyId") Long companyId, @Param("targetDate") LocalDate targetDate);

    int updateApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("errandId") Long errandId,
                     @Param("apprId") Long apprId);

    int updatePublicYn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("errandId") Long errandId,
                       @Param("publicYn") Boolean publicYn);

    int deleteErrand(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("errandId") Long errandId);
}

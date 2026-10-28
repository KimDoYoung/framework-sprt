package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.BizTripRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpBizTripMapper {

    List<BizTripRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                       @Param("closeDate") LocalDate closeDate, @Param("resultSkipYn") boolean resultSkipYn,
                                       @Param("searchText") String searchText);

    BizTripRes selectById(@Param("companyId") Long companyId, @Param("bizTripId") Long bizTripId);

    int updateSkip(@Param("companyId") Long companyId, @Param("bizTripId") Long bizTripId,
                   @Param("resultSkipYn") Boolean resultSkipYn, @Param("skipReason") String skipReason);
}

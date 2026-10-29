package kr.co.kfs.asseterp.biz.att.mapper;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteStatusRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface AttCommuteStatusMapper {

    /** AS-IS att02_commute.getCommuteStatus */
    List<AttCommuteStatusRes> getCommuteStatus(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                               @Param("baseDate") LocalDate baseDate, @Param("searchText") String searchText);

    /** AS-IS att02_commute.getPersonStatus */
    List<AttCommuteStatusRes> getPersonStatus(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                              @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);
}

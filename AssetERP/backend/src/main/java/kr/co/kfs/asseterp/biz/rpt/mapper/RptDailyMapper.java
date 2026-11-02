package kr.co.kfs.asseterp.biz.rpt.mapper;

import kr.co.kfs.asseterp.biz.rpt.dto.DailyRes;
import kr.co.kfs.asseterp.biz.rpt.dto.DailySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/rpt/mapper/rpt01_daily.xml + UpdateDataModel(rpt01_daily) (Z08 Rpt01_Tab_DailyWrite) */
@Mapper
public interface RptDailyMapper {

    List<DailyRes> selectByText(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") LocalDate startDate,
                                @Param("closeDate") LocalDate closeDate, @Param("searchText") String searchText);

    DailyRes selectById(@Param("companyId") Long companyId, @Param("dailyId") Long dailyId);

    Long selectNextId();

    int insertDaily(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("dailyId") Long dailyId, @Param("req") DailySaveReq req);

    int updateDaily(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") DailySaveReq req);

    int deleteDaily(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("dailyId") Long dailyId);
}

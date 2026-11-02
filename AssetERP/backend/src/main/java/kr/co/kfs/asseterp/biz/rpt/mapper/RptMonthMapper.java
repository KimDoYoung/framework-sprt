package kr.co.kfs.asseterp.biz.rpt.mapper;

import kr.co.kfs.asseterp.biz.rpt.dto.MonthRes;
import kr.co.kfs.asseterp.biz.rpt.dto.MonthSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/rpt/mapper/rpt02_month.xml (Z10 Rpt02_Tab_MonthWrite) */
@Mapper
public interface RptMonthMapper {

    List<MonthRes> selectByText(@Param("companyId") Long companyId, @Param("yyyyMm") String yyyyMm,
                                @Param("orgCodeId") Long orgCodeId, @Param("searchText") String searchText);

    MonthRes selectById(@Param("companyId") Long companyId, @Param("monthId") Long monthId);

    Long selectNextId();

    int insertMonth(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("monthId") Long monthId,
                    @Param("req") MonthSaveReq req);

    int updateMonth(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") MonthSaveReq req);

    int deleteMonth(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("monthId") Long monthId);

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("row") MonthRes row);
}

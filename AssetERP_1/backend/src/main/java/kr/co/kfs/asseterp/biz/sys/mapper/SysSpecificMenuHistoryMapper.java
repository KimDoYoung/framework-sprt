package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuHistoryRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuHistorySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys54_specific_menu_history.xml (selectByCompanyId, selectById, updateByNote) + UpdateDataModel(sys54_specific_menu_history) */
@Mapper
public interface SysSpecificMenuHistoryMapper {
    List<SpecificMenuHistoryRes> selectByCompanyId(@Param("companyId") Long companyId);

    SpecificMenuHistoryRes selectById(@Param("specificMenuHistoryId") Long specificMenuHistoryId);

    Long selectNextId();

    int insertSpecificMenuHistory(@Param("specificMenuHistoryId") Long specificMenuHistoryId, @Param("companyId") Long companyId,
                                  @Param("req") SpecificMenuHistorySaveReq req);

    int updateSpecificMenuHistory(@Param("companyId") Long companyId, @Param("req") SpecificMenuHistorySaveReq req);

    int deleteSpecificMenuHistories(@Param("companyId") Long companyId, @Param("specificMenuHistoryIds") List<Long> specificMenuHistoryIds);

    int updateByNote(@Param("companyId") Long companyId, @Param("specificMenuHistoryId") Long specificMenuHistoryId, @Param("note") String note);
}

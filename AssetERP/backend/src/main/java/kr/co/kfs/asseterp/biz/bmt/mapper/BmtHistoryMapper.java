package kr.co.kfs.asseterp.biz.bmt.mapper;

import kr.co.kfs.asseterp.biz.bmt.dto.BmtHistoryRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtHistorySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BmtHistoryMapper {

    /** AS-IS bmt11_history.selectByInfoId — 시작일자 순 */
    List<BmtHistoryRes> selectByInfoId(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    /** AS-IS bmt11_history.selectById — 저장 뒤 다시 읽기 */
    BmtHistoryRes selectById(@Param("companyId") Long companyId, @Param("historyId") Long historyId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Bmt11_History.update → UpdateDataModel INSERT */
    int insert(@Param("historyId") long historyId, @Param("companyId") Long companyId, @Param("infoId") Long infoId,
               @Param("req") BmtHistorySaveReq req);

    /** AS-IS Bmt11_History.update → UpdateDataModel UPDATE */
    int update(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("historyId") Long historyId,
               @Param("req") BmtHistorySaveReq req);

    /** AS-IS Bmt11_History.delete → UpdateDataModel DELETE */
    int deleteByIds(@Param("companyId") Long companyId, @Param("historyIds") List<Long> historyIds);
}

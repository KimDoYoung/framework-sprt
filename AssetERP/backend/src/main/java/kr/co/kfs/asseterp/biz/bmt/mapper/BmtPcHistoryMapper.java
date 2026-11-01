package kr.co.kfs.asseterp.biz.bmt.mapper;

import kr.co.kfs.asseterp.biz.bmt.dto.BmtPcHistoryRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtPcHistorySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BmtPcHistoryMapper {

    /** AS-IS bmt12_pc_history.selectByInfoId — 시작일자 내림차순 */
    List<BmtPcHistoryRes> selectByInfoId(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    /** AS-IS bmt12_pc_history.selectById — 저장 뒤 다시 읽기 */
    BmtPcHistoryRes selectById(@Param("companyId") Long companyId, @Param("pcHistoryId") Long pcHistoryId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Bmt12_PcHistory.modelUpdate → UpdateDataModel INSERT */
    int insert(@Param("pcHistoryId") long pcHistoryId, @Param("companyId") Long companyId, @Param("req") BmtPcHistorySaveReq req);

    /** AS-IS Bmt12_PcHistory.modelUpdate → UpdateDataModel UPDATE */
    int update(@Param("companyId") Long companyId, @Param("pcHistoryId") Long pcHistoryId, @Param("req") BmtPcHistorySaveReq req);

    /** AS-IS Bmt12_PcHistory.delete → UpdateDataModel DELETE */
    int deleteByIds(@Param("companyId") Long companyId, @Param("pcHistoryIds") List<Long> pcHistoryIds);
}

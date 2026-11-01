package kr.co.kfs.asseterp.biz.bmt.mapper;

import kr.co.kfs.asseterp.biz.bmt.dto.BmtRelateApprRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BmtRelateApprMapper {

    /** AS-IS bmt20_relate_appr.selectByInfoId */
    List<BmtRelateApprRes> selectByInfoId(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Bmt20_RelateAppr.modelUpdate → UpdateDataModel INSERT */
    int insert(@Param("relateApprId") long relateApprId, @Param("companyId") Long companyId,
               @Param("infoId") Long infoId, @Param("apprId") Long apprId);

    /** AS-IS Bmt20_RelateAppr.delete → UpdateDataModel DELETE */
    int deleteByIds(@Param("companyId") Long companyId, @Param("relateApprIds") List<Long> relateApprIds);
}

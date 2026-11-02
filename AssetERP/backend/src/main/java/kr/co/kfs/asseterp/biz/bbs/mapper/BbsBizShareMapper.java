package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.BizShareRes;
import kr.co.kfs.asseterp.biz.bbs.dto.BizShareSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/bbs/mapper/bbs10_biz_share.xml + UpdateDataModel(bbs10_biz_share) (Z07 Bbs10_Tab_BizShare) */
@Mapper
public interface BbsBizShareMapper {

    List<BizShareRes> selectByText(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                   @Param("bizShareType") String bizShareType, @Param("searchText") String searchText);

    BizShareRes selectById(@Param("companyId") Long companyId, @Param("bizShareId") Long bizShareId);

    Long selectNextId();

    int insertShare(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("bizShareId") Long bizShareId, @Param("req") BizShareSaveReq req);

    int updateShare(@Param("companyId") Long companyId, @Param("req") BizShareSaveReq req);

    int deleteShare(@Param("companyId") Long companyId, @Param("bizShareId") Long bizShareId);
}

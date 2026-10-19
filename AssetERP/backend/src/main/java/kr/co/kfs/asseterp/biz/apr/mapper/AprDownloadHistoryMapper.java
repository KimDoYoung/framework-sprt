package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprDownloadHistoryCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDownloadHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr40_download_history.xml (F09 문서 다운로드) */
@Mapper
public interface AprDownloadHistoryMapper {
    /** AS-IS selectByTextPaging L48 */
    List<AprDownloadHistoryRes> selectByTextPaging(@Param("c") AprDownloadHistoryCond cond);

    /** AS-IS selectByTextPagingTotal */
    long selectByTextPagingTotal(@Param("c") AprDownloadHistoryCond cond);

    /** AS-IS insert L73 */
    int insert(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("apprId") Long apprId);
}

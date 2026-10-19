package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr01_appr.xml */
@Mapper
public interface AprApprMapper {
    /** AS-IS selectByDcrWritePaging L2383 */
    List<AprDcrWriteRes> selectByDcrWritePaging(@Param("c") AprDcrWriteCond cond);

    /** AS-IS selectByDcrWriteTotal L2439 */
    long selectByDcrWriteTotal(@Param("c") AprDcrWriteCond cond);
}

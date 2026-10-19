package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateFundRes;
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

    /** AS-IS selectByClassTreeId2 L139 (F02, admin=false) */
    List<AprDocRes> selectByClassTreeId2(@Param("c") AprDocListCond cond);

    /** AS-IS apr03_relate_fund.selectByIcsClassTreeId L106 (F03, admin=false) */
    /** AS-IS apr01_appr.selectByText2 (F05 통합 문서검색) */
    List<AprDocSearchRes> selectByText2(@Param("c") AprDocSearchCond cond);

    List<AprIcsDocRes> selectByIcsClassTreeId(@Param("c") AprIcsDocListCond cond);

    /** AS-IS apr03_relate_fund.selectByApprId (F02) */
    List<AprRelateFundRes> selectRelateFunds(@Param("apprId") Long apprId);

    /** AS-IS apr12_relate_adv.selectByApprId (F02) */
    List<AprRelateAdvRes> selectRelateAdvs(@Param("apprId") Long apprId);
}

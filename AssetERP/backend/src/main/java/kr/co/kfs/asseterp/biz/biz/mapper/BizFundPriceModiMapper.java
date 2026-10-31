package kr.co.kfs.asseterp.biz.biz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.biz.dto.BizFundPriceModiLinkRow;

@Mapper
public interface BizFundPriceModiMapper {

    /** AS-IS biz60_fund_price_modi.selectById — 결재창 A75~A77 본문용. 회사 조건 추가(원본은 ID만) */
    BizFundPriceModiLinkRow selectLinkById(@Param("companyId") Long companyId, @Param("fundPriceModiId") Long fundPriceModiId);
}

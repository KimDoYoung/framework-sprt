package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeCorpRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeParam;
import kr.co.kfs.asseterp.biz.ast.dto.PreHoldFeeRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeePeriodParam;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeePeriodRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AstBookFundFeeMapper {

    /** AS-IS ast30_book_fund_fee.selectByCompanyId */
    List<BookFundFeeCorpRes> selectByCompanyId(@Param("p") BookFundFeeParam param);

    /** AS-IS ast30_book_fund_fee.selectByHoldDatePaging (X26) */
    List<BookFundFeePeriodRes> selectByHoldDatePaging(@Param("p") BookFundFeePeriodParam param);

    /** AS-IS ast30_book_fund_fee.selectByHoldDatePagingTotal (X26) */
    int selectByHoldDatePagingTotal(@Param("p") BookFundFeePeriodParam param);

    /** AS-IS ast30_book_fund_fee.selectByCorpId */
    List<BookFundFeeFundRes> selectByCorpId(@Param("p") BookFundFeeParam param);

    /** ast30_book_fund_fee.selectByPreHoldDate (X28) — 기준일 전날 보수원장. corpId가 없으면 전체 운용사 */
    List<PreHoldFeeRes> selectByPreHoldDate(@Param("p") BookFundFeeParam param);
}

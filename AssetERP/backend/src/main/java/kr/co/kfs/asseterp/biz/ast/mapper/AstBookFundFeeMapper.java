package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeCorpRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AstBookFundFeeMapper {

    /** AS-IS ast30_book_fund_fee.selectByCompanyId */
    List<BookFundFeeCorpRes> selectByCompanyId(@Param("p") BookFundFeeParam param);

    /** AS-IS ast30_book_fund_fee.selectByCorpId */
    List<BookFundFeeFundRes> selectByCorpId(@Param("p") BookFundFeeParam param);
}

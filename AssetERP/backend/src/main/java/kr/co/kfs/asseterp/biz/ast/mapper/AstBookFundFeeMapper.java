package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeCorpRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeParam;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeStateParam;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeStateRes;
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

    /** AS-IS ast30_book_fund_fee.selectFundFeeBook (X31) — 기간의 일자·펀드별 보수원장 */
    List<BookFundFeeStateRes> selectFundFeeBook(@Param("p") BookFundFeeStateParam param);

    /** AS-IS f_create_seq (dbConfig.getSeq) */
    long selectNextId();

    /** AS-IS sys99_print.deleteByPersonId L695 */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdFundMngFeeState L2000 — selectFundFeeBook 결과를 sys99_print에 한 행씩 넣는다 */
    int insertPrintFundMngFeeState(@Param("p") BookFundFeeStateParam param, @Param("personId") Long personId,
                                   @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId);

    /** ast30_book_fund_fee.selectByPreHoldDate (X28) — 기준일 전날 보수원장. corpId가 없으면 전체 운용사 */
    List<PreHoldFeeRes> selectByPreHoldDate(@Param("p") BookFundFeeParam param);
}

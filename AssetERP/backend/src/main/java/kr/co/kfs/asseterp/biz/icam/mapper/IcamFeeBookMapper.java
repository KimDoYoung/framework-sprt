package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookCheckRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookDiffRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcamFeeBookMapper {

    /** AS-IS icam12_fee_book.selectByStdDatePaging */
    List<IcamFeeBookRes> selectByStdDatePaging(@Param("p") IcamFeeBookParam param);

    /** AS-IS icam12_fee_book.selectByStdDatePagingTotal */
    int selectByStdDatePagingTotal(@Param("p") IcamFeeBookParam param);

    /** AS-IS icam13_fee_book_check.selectByStdDate */
    List<IcamFeeBookCheckRes> selectCheckByStdDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS icam12_fee_book.delete (기준일 하루) */
    int deleteFeeBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS icam13_fee_book_check.delete (기준일 하루) */
    int deleteCheck(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS ast30_book_fund_fee.selectFeeBookDiff — ICAM 월말잔액과 AssetERP 보수원장의 차이 */
    List<IcamFeeBookDiffRes> selectFeeBookDiff(@Param("companyId") Long companyId, @Param("closeDate") LocalDate closeDate);

    /** AS-IS icam13_fee_book_check.insert */
    int insertCheck(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("result") String result,
                    @Param("diffAmt") double diffAmt, @Param("worker") Long worker);
}

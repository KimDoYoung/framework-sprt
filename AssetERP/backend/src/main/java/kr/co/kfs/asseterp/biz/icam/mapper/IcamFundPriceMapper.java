package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.FundPriceRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcamFundPriceMapper {
    /** AS-IS icam06_fund_book.selectFundPrice */
    List<FundPriceRes> selectFundPrice(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** f_create_seq() */
    long selectNextId();

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId,
                    @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdFundPrice */
    int insertPrintFundPrice(@Param("companyId") Long companyId,
                             @Param("personId") Long personId,
                             @Param("windowClassName") String windowClassName,
                             @Param("groupId") Long groupId,
                             @Param("stdDate") LocalDate stdDate);
}

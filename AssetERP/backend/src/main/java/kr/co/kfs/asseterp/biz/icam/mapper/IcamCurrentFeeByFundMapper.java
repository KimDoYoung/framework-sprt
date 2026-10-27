package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.CurrentFeeByFundRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcamCurrentFeeByFundMapper {
    /** AS-IS icam10_fee.getCurrentFeeByFund */
    List<CurrentFeeByFundRes> selectCurrentFeeByFund(@Param("companyId") Long companyId,
                                                    @Param("yearText") String yearText,
                                                    @Param("preYearText") String preYearText);

    /** f_create_seq() */
    long selectNextId();

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId,
                    @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdCurrentFeeByFund */
    int insertPrintCurrentFeeByFund(@Param("companyId") Long companyId,
                                   @Param("personId") Long personId,
                                   @Param("windowClassName") String windowClassName,
                                   @Param("groupId") Long groupId,
                                   @Param("yearText") String yearText,
                                   @Param("preYearText") String preYearText);
}

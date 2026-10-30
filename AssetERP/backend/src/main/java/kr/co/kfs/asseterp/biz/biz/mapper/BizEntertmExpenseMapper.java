package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizEntertmCompanyRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizEntertmHistoryRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizEntertmMonthRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface BizEntertmExpenseMapper {

    /** AS-IS biz01_promo.selectByMonthEntertmExpense */
    List<BizEntertmMonthRes> selectMonthly(@Param("companyId") Long companyId, @Param("year") String year,
                                           @Param("closeDate") LocalDate closeDate, @Param("cardRealUserType") String cardRealUserType);

    /** AS-IS biz01_promo.selectByAccountName */
    List<BizEntertmHistoryRes> selectHistory(@Param("companyId") Long companyId, @Param("year") String year,
                                             @Param("closeDate") LocalDate closeDate, @Param("cardRealUserType") String cardRealUserType);

    /** AS-IS biz01_promo.selectByTargetCompanyName */
    List<BizEntertmHistoryRes> selectByTargetCompany(@Param("companyId") Long companyId, @Param("year") String year,
                                                     @Param("closeDate") LocalDate closeDate, @Param("cardRealUserType") String cardRealUserType,
                                                     @Param("targetCompanyName") String targetCompanyName);

    /** AS-IS biz02_person.selectByEntertmExpense */
    List<BizEntertmCompanyRes> selectCompanies(@Param("companyId") Long companyId, @Param("year") String year, @Param("closeDate") LocalDate closeDate);
}

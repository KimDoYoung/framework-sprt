package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportItemSumRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportMonthAmtRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportPersonRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface BizCardReportMapper {

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS crd03_trans.selectByYear — 그 해에 카드를 가진 사용자(공통 = 0) */
    List<BizCardReportPersonRes> selectCardPersons(@Param("companyId") Long companyId, @Param("year") String year);

    /** AS-IS biz01_promo.selectByYear — 실사용자 기준 사용자(공통 = 0) */
    List<BizCardReportPersonRes> selectRealPersons(@Param("companyId") Long companyId, @Param("year") String year, @Param("closeDate") LocalDate closeDate);

    /** AS-IS biz03_account_map.selectByYear — 한 사용자의 그 달 사용항목별 합계 */
    List<BizCardReportItemSumRes> selectItemSumsByPerson(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                         @Param("year") String year, @Param("month") String month,
                                                         @Param("startDate") LocalDate startDate, @Param("cardRealUserType") String cardRealUserType);

    /** AS-IS biz03_account_map.selectByMonth — 그 달 전체의 사용항목별 합계 */
    List<BizCardReportItemSumRes> selectItemSumsByMonth(@Param("companyId") Long companyId, @Param("year") String year, @Param("month") int month,
                                                        @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS biz01_promo.selectMonthAmt2 (관리자 기준) */
    List<BizCardReportMonthAmtRes> selectMonthAmtByManager(@Param("companyId") Long companyId, @Param("year") String year, @Param("closeDate") LocalDate closeDate);

    /** AS-IS biz01_promo.selectMonthAmt (실사용자 기준) */
    List<BizCardReportMonthAmtRes> selectMonthAmtByRealUser(@Param("companyId") Long companyId, @Param("year") String year, @Param("closeDate") LocalDate closeDate);

    /** AS-IS sys99_print.insert — insertCardReport 가 채우는 열: 순번·사원ID·사원명·사용항목명·사용항목합 */
    int insertPrint1(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                     @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                     @Param("seq") long seq, @Param("empId") long empId, @Param("empName") String empName,
                     @Param("itemName") String itemName, @Param("itemSum") long itemSum);

    /** AS-IS sys99_print.insert — insertCardReport2 가 채우는 열: 순번·월·사용항목명·사용항목합·사용항목코드 */
    int insertPrint2(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                     @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                     @Param("seq") long seq, @Param("monthName") String monthName, @Param("itemName") String itemName,
                     @Param("itemSum") long itemSum, @Param("itemCode") String itemCode);

    /** AS-IS sys99_print.insert — insertCardReport3 가 채우는 열: 사용자 · 1~12월 · 합계 */
    int insertPrint3(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                     @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                     @Param("row") BizCardReportMonthAmtRes row);
}

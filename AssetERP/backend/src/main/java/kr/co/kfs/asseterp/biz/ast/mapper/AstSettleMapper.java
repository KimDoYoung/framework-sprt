package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.SettleAccruedRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleDeleteRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleExpenseRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleHistoryRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleTrAmtRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/** 미수/미지급 결제 Pay50_Tab_ExpenseSettle (U11) — AS-IS server/ast/mapper/ast07_settle.xml · ast06_tr.xml(selectByAccrued) 외 (매퍼 XML 머리 주석) */
@Mapper
public interface AstSettleMapper {

    List<SettleAccruedRes> selectAccrueds(@Param("companyId") Long companyId, @Param("userId") Long userId, @Param("orgId") Long orgId,
                                          @Param("assetType") String assetType, @Param("abroType") String abroType, @Param("payCode") String payCode,
                                          @Param("searchText") String searchText, @Param("trCode") String trCode, @Param("corpId") Long corpId);

    List<SettleHistoryRes> selectHistory(@Param("companyId") Long companyId, @Param("userId") Long userId, @Param("orgId") Long orgId,
                                         @Param("assetType") String assetType, @Param("abroType") String abroType, @Param("selectType") String selectType);

    List<SettleHistoryRes> selectHistoryPaging(@Param("companyId") Long companyId, @Param("userId") Long userId, @Param("orgId") Long orgId,
                                               @Param("assetType") String assetType, @Param("abroType") String abroType, @Param("selectType") String selectType,
                                               @Param("payCode") String payCode, @Param("trCode") String trCode, @Param("corpId") String corpId,
                                               @Param("searchText") String searchText, @Param("limit") long limit, @Param("offset") long offset);

    long selectHistoryTotal(@Param("companyId") Long companyId, @Param("userId") Long userId, @Param("orgId") Long orgId,
                            @Param("assetType") String assetType, @Param("abroType") String abroType, @Param("selectType") String selectType,
                            @Param("payCode") String payCode, @Param("trCode") String trCode, @Param("corpId") String corpId,
                            @Param("searchText") String searchText);

    SettleExpenseRes selectExpenseSettleInfo(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId);

    SettleTrAmtRes selectTrAmt(@Param("companyId") Long companyId, @Param("trId") Long trId);

    int countFixedJournal(@Param("settleId") Long settleId);

    BigDecimal sumForAmt(@Param("trId") Long trId);

    long selectAmt(@Param("settleId") Long settleId);

    long selectNextId();

    int insertSettle(@Param("settleId") Long settleId, @Param("trId") Long trId, @Param("expenseId") Long expenseId, @Param("settleDate") LocalDate settleDate,
                     @Param("settleAmt") Long settleAmt, @Param("note") String note, @Param("depositId") Long depositId, @Param("trCode") String trCode,
                     @Param("personId") Long personId, @Param("forSettleAmt") Double forSettleAmt, @Param("fxRate") Double fxRate,
                     @Param("amt") Long amt, @Param("forAmt") Double forAmt);

    int updateAmt(@Param("settleId") Long settleId, @Param("amt") Long amt, @Param("forAmt") Double forAmt);

    int insertSettleMulti(@Param("settleId") Long settleId, @Param("trId") Long trId, @Param("expenseId") Long expenseId, @Param("settleDate") LocalDate settleDate,
                          @Param("settleAmt") Long settleAmt, @Param("forSettleAmt") Double forSettleAmt, @Param("note") String note,
                          @Param("depositId") Long depositId, @Param("trCode") String trCode, @Param("personId") Long personId);

    SettleDeleteRes selectSettleForDelete(@Param("companyId") Long companyId, @Param("settleId") Long settleId);

    int deleteSettle(@Param("settleId") Long settleId);
}

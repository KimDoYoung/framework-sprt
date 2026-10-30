package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceSearchCond;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/ast/mapper/ast06_tr.xml (selectByPayCode · selectById) · ast08_tr_finance.xml — 청약처리 Ast06_Tab_TrIPO (W05) */
@Mapper
public interface AstTrFinanceMapper {

    /** ast06_tr.selectByPayCode */
    List<TrFinanceRes> selectByPayCode(@Param("c") TrFinanceSearchCond cond);

    /** ast06_tr.selectById (금융 상세 포함) — 회사 조건 추가 */
    TrFinanceRes selectById(@Param("companyId") Long companyId, @Param("trId") Long trId);

    long selectNextId();

    /** ast06_tr 새 행 / 고친 행 (이 화면이 바꾸는 열만) */
    int insertTr(@Param("trId") long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("r") TrFinanceSaveReq r);

    int updateTr(@Param("companyId") Long companyId, @Param("r") TrFinanceSaveReq r);

    /** ast08_tr_finance 존재 여부(trFinanceId) / 새 행 / 고침 */
    Long selectFinanceId(@Param("trId") Long trId);

    int insertFinance(@Param("financeId") long financeId, @Param("trId") Long trId, @Param("r") TrFinanceSaveReq r);

    int updateFinance(@Param("financeId") Long financeId, @Param("r") TrFinanceSaveReq r);

    /** ast09_book.createFinanceBook — 'Y'면 정상 */
    String createFinanceBook(@Param("procType") String procType, @Param("trId") Long trId);
}

package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.DepnProcessReq;
import kr.co.kfs.asseterp.biz.ast.dto.DepnRes;
import kr.co.kfs.asseterp.biz.ast.dto.NonDeductTaxRes;
import kr.co.kfs.asseterp.biz.ast.dto.NonDeductTaxSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** W11 감가상각처리 — AS-IS ast06_tr.selectDepn · updateDepnEval · updateDepnCost, ast16_non_deduct_tax */
@Mapper
public interface AstDepnMapper {

    /** ast06_tr.selectDepn */
    List<DepnRes> selectDepn(@Param("companyId") Long companyId, @Param("depnDate") LocalDate depnDate);

    /** dbConfig.getDateDif — type M(개월)·Y(년) */
    Long selectDateDif(@Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate, @Param("type") String type);

    int existsTr(@Param("trId") Long trId);

    int insertTr(@Param("r") DepnProcessReq.Item r, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("amt") Long amt);

    int updateTr(@Param("r") DepnProcessReq.Item r, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("amt") Long amt);

    /** ast06_tr.updateAmt */
    int updateAmt(@Param("companyId") Long companyId, @Param("trId") Long trId, @Param("amt") Long amt, @Param("personId") Long personId);

    String createDepnBook(@Param("procType") String procType, @Param("trId") Long trId);

    long selectNextId();

    /** ast16_non_deduct_tax.selectByPurTrId */
    List<NonDeductTaxRes> selectNonDeductTaxes(@Param("purTrId") Long purTrId);

    int insertNonDeductTax(@Param("id") long id, @Param("r") NonDeductTaxSaveReq.Row r);

    int updateNonDeductTax(@Param("r") NonDeductTaxSaveReq.Row r);

    int deleteNonDeductTaxes(@Param("ids") List<Long> ids);
}

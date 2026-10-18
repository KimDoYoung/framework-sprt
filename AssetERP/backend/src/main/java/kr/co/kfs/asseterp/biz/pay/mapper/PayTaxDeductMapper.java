package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductLimitRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductLimitSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** 근로소득 세액공제(pay27)와 그 한도(pay28)를 한 탭이 같이 쓰므로 한 매퍼에 둔다 */
@Mapper
public interface PayTaxDeductMapper {

    /** pay27_tax_deduct_table.selectByAll — 적용일별 첫 행(최신순) */
    List<PayStartDateRes> selectDates();

    /** pay27_tax_deduct_table.selectByDate */
    List<PayTaxDeductRes> selectByDate(@Param("startDate") LocalDate startDate);

    /** pay27_tax_deduct_table.selectByStartDate — 적용일 이전 가장 최근 적용일의 행 */
    List<PayTaxDeductRes> selectByStartDate(@Param("startDate") LocalDate startDate);

    PayTaxDeductRes selectById(@Param("id") Long id);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    int insert(@Param("id") Long id, @Param("row") PayTaxDeductSaveReq row);

    int update(@Param("req") PayTaxDeductSaveReq req);

    int deleteByIds(@Param("ids") List<Long> ids);

    /** pay27_tax_deduct_table.deleteByDate */
    int deleteByDate(@Param("startDate") LocalDate startDate);

    /** pay28_tax_deduct_limit.selectByDate */
    List<PayTaxDeductLimitRes> selectLimitByDate(@Param("startDate") LocalDate startDate);

    /** pay28_tax_deduct_limit.selectByStartDate */
    List<PayTaxDeductLimitRes> selectLimitByStartDate(@Param("startDate") LocalDate startDate);

    PayTaxDeductLimitRes selectLimitById(@Param("id") Long id);

    int insertLimit(@Param("id") Long id, @Param("row") PayTaxDeductLimitSaveReq row);

    int updateLimit(@Param("req") PayTaxDeductLimitSaveReq req);

    int deleteLimitByIds(@Param("ids") List<Long> ids);

    /** pay28_tax_deduct_limit.deleteByDate */
    int deleteLimitByDate(@Param("startDate") LocalDate startDate);
}

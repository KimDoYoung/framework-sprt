package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface PayTaxCalcMapper {

    /** pay26_tax_calc_table.selectByAll — 적용일별 첫 행(최신순) */
    List<PayStartDateRes> selectDates();

    /** pay26_tax_calc_table.selectByDate */
    List<PayTaxCalcRes> selectByDate(@Param("startDate") LocalDate startDate);

    /** pay26_tax_calc_table.selectByStartDate — 적용일 이전 가장 최근 적용일의 행 */
    List<PayTaxCalcRes> selectByStartDate(@Param("startDate") LocalDate startDate);

    PayTaxCalcRes selectById(@Param("id") Long id);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    int insert(@Param("id") Long id, @Param("row") PayTaxCalcSaveReq row);

    int update(@Param("req") PayTaxCalcSaveReq req);

    int deleteByIds(@Param("ids") List<Long> ids);

    /** pay26_tax_calc_table.deleteByDate */
    int deleteByDate(@Param("startDate") LocalDate startDate);
}

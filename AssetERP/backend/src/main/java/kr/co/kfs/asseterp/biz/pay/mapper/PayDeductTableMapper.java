package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayDeductTableRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayDeductTableSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface PayDeductTableMapper {

    /** pay24_deduct_table.selectByAll — 적용일별 첫 행(최신순) */
    List<PayStartDateRes> selectDates();

    /** pay24_deduct_table.selectByDataCode */
    List<PayDeductTableRes> selectByDataCode(@Param("startDate") LocalDate startDate, @Param("dataCode") String dataCode);

    /** pay24_deduct_table.selectByStartDate — 적용일 이전 가장 최근 적용일의 행 */
    List<PayDeductTableRes> selectByStartDate(@Param("startDate") LocalDate startDate);

    PayDeductTableRes selectById(@Param("id") Long id);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    int insert(@Param("id") Long id, @Param("row") PayDeductTableRes row);

    int update(@Param("req") PayDeductTableSaveReq req);

    int deleteByIds(@Param("ids") List<Long> ids);

    /** pay24_deduct_table.deleteByDate */
    int deleteByDate(@Param("startDate") LocalDate startDate);

    /** pay24_deduct_table.updateLimitAmt */
    int updateLimitAmt(@Param("startDate") LocalDate startDate, @Param("dataCode") String dataCode, @Param("limitAmt") Long limitAmt);
}

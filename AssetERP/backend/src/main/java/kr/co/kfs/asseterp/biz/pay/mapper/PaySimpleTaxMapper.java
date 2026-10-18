package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxOtherRes;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxOtherSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface PaySimpleTaxMapper {

    /** pay23_simple_tax_table_other.selectByAll — 적용일별 첫 행(최신순) */
    List<PayStartDateRes> selectDates();

    /** pay22_simple_tax_table.selectByDate */
    List<PaySimpleTaxRes> selectByDate(@Param("startDate") LocalDate startDate, @Param("searchLong") Long searchLong);

    /** pay22_simple_tax_table.deleteByDate */
    int deleteTableByDate(@Param("startDate") LocalDate startDate);

    /** pay22_simple_tax_table.excelInsert */
    int excelInsert(@Param("row") PaySimpleTaxRes row);

    /** pay23_simple_tax_table_other.selectByDate */
    List<PaySimpleTaxOtherRes> selectOtherByDate(@Param("startDate") LocalDate startDate);

    /** pay23_simple_tax_table_other.selectByStartDate — 적용일 이전 가장 최근 적용일의 행 */
    List<PaySimpleTaxOtherRes> selectOtherByStartDate(@Param("startDate") LocalDate startDate);

    PaySimpleTaxOtherRes selectOtherById(@Param("id") Long id);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    int insertOther(@Param("id") Long id, @Param("req") PaySimpleTaxOtherSaveReq req);

    int updateOther(@Param("req") PaySimpleTaxOtherSaveReq req);

    int deleteOtherByIds(@Param("ids") List<Long> ids);

    /** pay23_simple_tax_table_other.deleteByDate */
    int deleteOtherByDate(@Param("startDate") LocalDate startDate);
}

package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDetailParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDetailRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcamFeeMapper {

    /** AS-IS icam10_fee.selectByFeeTypePaging */
    List<IcamFeeRes> selectByFeeTypePaging(@Param("p") IcamFeeParam param);

    /** AS-IS icam10_fee.selectByFeeTypePagingTotal */
    int selectByFeeTypePagingTotal(@Param("p") IcamFeeParam param);

    /** AS-IS icam10_fee.selectByFundCode (X25, Ast30_Lookup_FeeDetail) */
    List<IcamFeeDetailRes> selectByFundCode(@Param("p") IcamFeeDetailParam param);

    /** AS-IS icam10_fee.updateFee (+ 회사 조건 — TOBE 보강) */
    int updateFee(@Param("feeId") Long feeId, @Param("fee") BigDecimal fee, @Param("companyId") Long companyId);

    /** AS-IS icam10_fee.createFundFeeBook = f_create_fundFeeBook — 결과 'Y' 또는 오류 메시지 */
    String createFundFeeBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("fundCode") String fundCode);

    /** AS-IS icam10_fee.createFundFeeBook2 = f_create_fundFeeBook2 */
    String createFundFeeBook2(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("corpId") Long corpId,
                              @Param("fundCode") String fundCode);

    /** AS-IS icam10_fee.createFundFeeRcvTr = f_create_fundFeeRcvTr */
    String createFundFeeRcvTr(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS icam10_fee.createFundFeeRcvTr2 = f_create_fundFeeRcvTr_officeMng */
    String createFundFeeRcvTr2(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("corpId") Long corpId);

    /** AS-IS sys12_calendar.selectPeriod — 회사 달력의 기간 안 일자(오름차순) */
    List<LocalDate> selectCalendarDays(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);
}

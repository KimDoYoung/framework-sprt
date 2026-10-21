package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.CeoAccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoApprRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoReportPersonRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoTrRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** J08 책임자보고 — flt03_account.selectByStdDate · flt10_tr.selectByStdDate/2 · apr01_appr.selectByLinkCode */
@Mapper
public interface FltCeoReportMapper {

    List<CeoAccountRes> selectAccounts(@Param("companyId") Long companyId, @Param("stdDate") String stdDate,
                                       @Param("startDate") String startDate, @Param("transCode") String transCode);

    List<CeoReportPersonRes> selectReportPersons(@Param("companyId") Long companyId, @Param("stdDate") String stdDate,
                                                 @Param("startDate") String startDate, @Param("transCode") String transCode,
                                                 @Param("noAccountSkipYnCheck") boolean noAccountSkipYnCheck);

    List<CeoTrRes> selectTrs(@Param("companyId") Long companyId, @Param("stdDate") String stdDate,
                             @Param("startDate") String startDate, @Param("transCode") String transCode,
                             @Param("noAccountSkipYnCheck") boolean noAccountSkipYnCheck);

    List<CeoApprRes> selectApprsByLinkCode(@Param("companyId") Long companyId, @Param("stdDate") String stdDate,
                                           @Param("linkCode") String linkCode);
}

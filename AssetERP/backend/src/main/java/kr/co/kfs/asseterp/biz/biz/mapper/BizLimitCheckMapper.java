package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizLimitCompanyYearRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitPersonDayRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitPersonYearRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/biz/mapper/biz01_promo.xml selectByPersonDay·selectByPersonYear·selectByCompanyYear (L07 이익제공 한도초과현황) */
@Mapper
public interface BizLimitCheckMapper {
    /** 인별 1회 초과건. provideRcvType은 LIKE 패턴('%' 전체) */
    List<BizLimitPersonDayRes> selectByPersonDay(@Param("companyId") Long companyId, @Param("yearText") String yearText, @Param("provideRcvType") String provideRcvType);

    /** 인별 연간 초과건 */
    List<BizLimitPersonYearRes> selectByPersonYear(@Param("companyId") Long companyId, @Param("yearText") String yearText, @Param("provideRcvType") String provideRcvType);

    /** 회사별 연간 초과건 */
    List<BizLimitCompanyYearRes> selectByCompanyYear(@Param("companyId") Long companyId, @Param("yearText") String yearText, @Param("provideRcvType") String provideRcvType);
}

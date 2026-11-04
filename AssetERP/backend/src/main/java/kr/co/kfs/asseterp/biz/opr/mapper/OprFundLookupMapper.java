package kr.co.kfs.asseterp.biz.opr.mapper;

import kr.co.kfs.asseterp.biz.opr.dto.OprCreateRes;
import kr.co.kfs.asseterp.biz.opr.dto.OprFundRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 펀드찾기 창 (AS-IS server/opr/mapper/opr01_create.xml · opr02_fund.xml) — EE100 Opr02_Lookup_Fund */
@Mapper
public interface OprFundLookupMapper {

    /** AS-IS opr01_create.selectByLookupTitle */
    List<OprCreateRes> selectByLookupTitle(@Param("companyId") Long companyId, @Param("title") String title, @Param("year") String year);

    /** AS-IS opr02_fund.selectByCreateId */
    List<OprFundRes> selectFundsByCreateId(@Param("companyId") Long companyId, @Param("createId") Long createId, @Param("orgId") Long orgId);
}

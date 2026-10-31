package kr.co.kfs.asseterp.biz.apr.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.BenefitPayLinkRow;

@Mapper
public interface AprBenefitLinkSeedMapper {

    List<BenefitPayLinkRow> selectPayRows(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    String selectAccountName(@Param("companyId") Long companyId, @Param("benefitCode") String benefitCode);

    String selectOrgName(@Param("personId") Long personId);
}

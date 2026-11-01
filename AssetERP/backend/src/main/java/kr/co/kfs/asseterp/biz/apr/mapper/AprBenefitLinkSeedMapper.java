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

    /** A21~A23·A37·A49 — 로그인 사원의 소속·직위·직책·휴대폰 (AS-IS createMapping 의 LoginUser 값) */
    kr.co.kfs.asseterp.biz.apr.dto.BenefitSenderRow selectSender(@Param("personId") Long personId);
}

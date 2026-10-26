package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.FundTermsDetailRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fnd/mapper/fnd26_terms_detail.xml */
@Mapper
public interface FndTermsDetailMapper {
    /** AS-IS selectByTermsId (P07 규약 내용 조회창) — 사용 중인 개정만, 개정회차 내림차순. 규약은 로그인 회사 것만(보안 보강) */
    List<FundTermsDetailRes> selectByTermsId(@Param("termsId") Long termsId, @Param("companyId") Long companyId);
}

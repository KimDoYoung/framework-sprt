package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.FundLookupRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundMultiRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSingleRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fnd/mapper/fnd00_fund.xml */
@Mapper
public interface FndFundMapper {
    /** AS-IS selectByLookupFundCode L366 (P01 펀드찾기) */
    List<FundLookupRes> selectByLookupFundCode(@Param("companyId") Long companyId, @Param("closeYn") String closeYn,
                                               @Param("fundName") String fundName);

    /** AS-IS selectBySearchTextAdmin L323 (P06 연관펀드 조회창 openAdmin) */
    List<FundMultiRes> selectBySearchTextAdmin(@Param("companyId") Long companyId, @Param("closeYn") String closeYn,
                                               @Param("planYn") String planYn, @Param("fundType") String fundType,
                                               @Param("searchText") String searchText, @Param("classYn") String classYn);

    /** AS-IS fnd00_fund.selectBySearchText (P12 연관펀드 단일 선택 조회창) — 내 조직 권한 펀드 */
    List<FundSingleRes> selectBySearchText(@Param("companyId") Long companyId, @Param("orgId") Long orgId, @Param("closeYn") String closeYn,
                                           @Param("planYn") String planYn, @Param("fundType") String fundType, @Param("searchText") String searchText,
                                           @Param("classYn") String classYn);
}

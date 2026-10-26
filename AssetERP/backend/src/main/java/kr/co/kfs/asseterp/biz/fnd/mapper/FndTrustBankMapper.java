package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FndTrustBankMapper {

    /** AS-IS fnd09_trust_bank.selectByCompanyId0 (공통회사 0 전용) */
    List<TrustBankRes> selectByCompanyId0(@Param("companyId") Long companyId, @Param("useYn") String useYn, @Param("searchText") String searchText);

    /** AS-IS selectByText (P05 조회창) */
    List<TrustBankRes> selectByText(@Param("companyId") Long companyId, @Param("searchText") String searchText);
}

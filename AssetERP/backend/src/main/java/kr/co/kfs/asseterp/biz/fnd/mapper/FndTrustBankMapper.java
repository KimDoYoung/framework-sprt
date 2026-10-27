package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankCompanyRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankCompanySaveReq;
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

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS fnd09_trust_bank.selectByCompanyId (R12 Fnd09_Tab_TrustBank — 회사별 수탁은행 목록) */
    List<TrustBankCompanyRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("useYn") String useYn, @Param("searchText") String searchText);

    /** AS-IS fnd09_trust_bank.selectById (R12 회사별 전체 열) */
    TrustBankCompanyRes selectCompanyById(@Param("trustBankId") Long trustBankId);

    /** AS-IS fnd09_trust_bank.selectByCd (R12 preUpdate 중복 코드 검사) */
    int countByCd(@Param("companyId") Long companyId, @Param("trustBankCode") String trustBankCode);

    /** AS-IS UpdateDataModel(fnd09_trust_bank) INSERT (R12) */
    int insertCompanyTrustBank(@Param("trustBankId") Long trustBankId, @Param("req") TrustBankCompanySaveReq req, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel(fnd09_trust_bank) UPDATE (R12) */
    int updateCompanyTrustBank(@Param("req") TrustBankCompanySaveReq req, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel(fnd09_trust_bank) DELETE (R12) */
    int deleteCompanyTrustBanks(@Param("companyId") Long companyId, @Param("trustBankIds") List<Long> trustBankIds);
}

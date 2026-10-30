package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizCardCompareRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardManagementRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardManagementUpdateReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BizCardManagementMapper {

    /** AS-IS biz01_promo.selectCardManagementPaging — managerId는 전체면 null, searchText는 raw 글자 */
    List<BizCardManagementRes> selectPaging(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                                            @Param("startYm") String startYm, @Param("closeYm") String closeYm,
                                            @Param("managerId") Long managerId, @Param("providePurCode") String providePurCode,
                                            @Param("searchText") String searchText, @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS biz01_promo.selectCardManagementTotal */
    int selectTotal(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                    @Param("startYm") String startYm, @Param("closeYm") String closeYm,
                    @Param("managerId") Long managerId, @Param("providePurCode") String providePurCode,
                    @Param("searchText") String searchText);

    /** AS-IS biz01_promo.selectCardCloseCount */
    long countCardClosed(@Param("companyId") Long companyId, @Param("dataYm") String dataYm);

    /** AS-IS act04_gen_ledger.selectCloseCount */
    long countLedgerClosed(@Param("companyId") Long companyId, @Param("dataYm") String dataYm);

    /** cardClose의 P 점검 — 그 달 내역 중 계정과목이 없는 것의 개수 */
    long countWithoutAccount(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                             @Param("startYm") String startYm, @Param("closeYm") String closeYm,
                             @Param("managerId") Long managerId, @Param("providePurCode") String providePurCode);

    /** cardClose의 C 점검 — 그 달 내역 중 전표가 있는 것의 개수 */
    long countWithJournal(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                          @Param("startYm") String startYm, @Param("closeYm") String closeYm,
                          @Param("managerId") Long managerId, @Param("providePurCode") String providePurCode);

    /** AS-IS biz01_promo.updateCardClose */
    int updateCardClose(@Param("companyId") Long companyId, @Param("dataYm") String dataYm, @Param("procType") String procType);

    /** AS-IS crd02_data.selectByCompareAmt */
    List<BizCardCompareRes> selectCompare(@Param("companyId") Long companyId, @Param("dataYm") String dataYm);

    /** AS-IS Biz01_Promo.modelUpdate (Biz01_Edit_Account) — 로그인 회사의 행만 */
    int update(@Param("companyId") Long companyId, @Param("promoId") Long promoId, @Param("req") BizCardManagementUpdateReq req);

    /** AS-IS LoginUser.getCompanyModel().getCardRealUserYn() */
    boolean selectCardRealUser(@Param("companyId") Long companyId);

    /** AS-IS emp01_person.selectById 의 휴대폰번호 */
    String selectMobileTelNo(@Param("personId") Long personId);

    long selectNextId();

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdCardManagement — 기간(startYm~closeYm) 조회 결과를 새 그룹 ID로 담음 */
    int insertPrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName,
                    @Param("groupId") long groupId, @Param("dataYm") String dataYm,
                    @Param("startYm") String startYm, @Param("closeYm") String closeYm,
                    @Param("managerId") Long managerId, @Param("providePurCode") String providePurCode, @Param("searchText") String searchText);
}

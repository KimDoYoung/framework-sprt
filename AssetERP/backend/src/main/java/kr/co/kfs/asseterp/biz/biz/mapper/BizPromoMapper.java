package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizAccountOptionRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizBuyPromoRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizBuyPromoSaveReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardContentsRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCodeOptionRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizDocClassRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoCardRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoOtherReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoOtherRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoUpdateReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface BizPromoMapper {

    /** AS-IS biz01_promo.selectByCard */
    List<BizPromoCardRes> selectByCard(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                       @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                       @Param("searchText") String searchText);

    /** AS-IS biz01_promo.closeCheck — 마감된 내역의 개수 */
    int countClosed(@Param("companyId") Long companyId, @Param("promoIds") List<Long> promoIds);

    /** AS-IS Biz01_Promo.modelUpdate → UpdateDataModel(biz01_promo) UPDATE — 화면이 바꾸는 4열만, 로그인 회사의 행만 */
    int update(@Param("companyId") Long companyId, @Param("promoId") Long promoId, @Param("req") BizPromoUpdateReq req);

    /** AS-IS biz01_promo.noteUpdate */
    int updateNote(@Param("companyId") Long companyId, @Param("promoId") Long promoId, @Param("note") String note);

    /** AS-IS biz01_promo.updateAccount01 (과세구분 포함) */
    int updateAccountWithTax(@Param("companyId") Long companyId, @Param("promoId") Long promoId,
                             @Param("providePurCode") String providePurCode, @Param("provideContentCode") String provideContentCode,
                             @Param("accountId") Long accountId, @Param("taxType") String taxType, @Param("note") String note);

    /** AS-IS biz01_promo.updateAccount02 (법인카드 화면) */
    int updateAccount(@Param("companyId") Long companyId, @Param("promoId") Long promoId,
                      @Param("providePurCode") String providePurCode, @Param("provideContentCode") String provideContentCode,
                      @Param("accountId") Long accountId, @Param("note") String note);

    /** AS-IS sys00_common.selectByProvideContentCode */
    List<BizAccountOptionRes> selectProvideAccounts(@Param("companyId") Long companyId, @Param("provideContentCode") String provideContentCode);

    /** AS-IS dcr01_class_tree.selectByLinkCode (문서분류 이름은 f_class_tree_nm_allpath) */
    List<BizDocClassRes> selectDocClassByLinkCode(@Param("companyId") Long companyId, @Param("linkCode") String linkCode);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS sys99_print.insert — Biz01_Tab_Card가 채우는 열(문자 02~07·숫자 01~03·날짜 01)만 */
    int insertPrintCard(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                        @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                        @Param("row") BizPromoCardRes row);

    /** AS-IS biz01_promo.selectByOther (L03) */
    List<BizPromoOtherRes> selectByOther(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                         @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                         @Param("provideRcvType") String provideRcvType);

    /** AS-IS Biz01_Promo.modelUpdate → UpdateDataModel INSERT (정산구분 2·등록자·회사는 서버 값) */
    int insertOther(@Param("promoId") long promoId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("req") BizPromoOtherReq req);

    /** AS-IS Biz01_Promo.modelUpdate → UpdateDataModel UPDATE — 로그인 회사의 행만 */
    int updateOther(@Param("companyId") Long companyId, @Param("promoId") Long promoId, @Param("req") BizPromoOtherReq req);

    /** AS-IS biz02_person.delete — 지울 내역의 인원 */
    int deletePersonsByPromoIds(@Param("companyId") Long companyId, @Param("promoIds") List<Long> promoIds);

    /** AS-IS Biz01_Promo.delete → UpdateDataModel DELETE */
    int deletePromos(@Param("companyId") Long companyId, @Param("promoIds") List<Long> promoIds);

    /** AS-IS biz01_promo.selectByBuyId (L05) */
    List<BizBuyPromoRes> selectByBuyId(@Param("companyId") Long companyId, @Param("buyId") Long buyId);

    /** AS-IS biz01_promo.selectById (L05) — 저장 뒤 다시 읽기 */
    BizBuyPromoRes selectBuyPromoById(@Param("companyId") Long companyId, @Param("promoId") Long promoId);

    /** AS-IS Biz01_Promo.updateAdd → UpdateDataModel(biz01_promo) INSERT (정산구분 2·제공/수령 1·등록자·회사는 서버 값) */
    int insertBuyPromo(@Param("promoId") long promoId, @Param("companyId") Long companyId, @Param("regEmpId") Long regEmpId,
                       @Param("req") BizBuyPromoSaveReq req);

    /** AS-IS Biz01_Promo.updateAdd → UpdateDataModel(biz01_promo) UPDATE — 로그인 회사의 행만 */
    int updateBuyPromo(@Param("companyId") Long companyId, @Param("promoId") Long promoId, @Param("req") BizBuyPromoSaveReq req);

    /** AS-IS sys09_code.selectByKindCode (ProvidePurCode, code LIKE 구분코드%) */
    List<BizCodeOptionRes> selectProvidePurposes(@Param("code") String code);

    /** AS-IS biz01_promo.selectCardContentsPaging (L04) — managerId·providePurCode `%`는 전체, searchText는 `%…%`로 감싼 값 */
    List<BizCardContentsRes> selectCardContentsPaging(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                                                      @Param("managerId") String managerId, @Param("providePurCode") String providePurCode,
                                                      @Param("searchText") String searchText, @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS biz01_promo.selectCardContentsTotal */
    long selectCardContentsTotal(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                                 @Param("managerId") String managerId, @Param("providePurCode") String providePurCode,
                                 @Param("searchText") String searchText);

    /** AS-IS biz01_promo.selectByAmt — managerId가 null이면 관리자 조건 없음 */
    long selectCardContentsAmount(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                                  @Param("managerId") Long managerId, @Param("providePurCode") String providePurCode,
                                  @Param("searchText") String searchText);

    /** AS-IS sys00_common.selectBizCardManager */
    List<BizCodeOptionRes> selectCardManagers(@Param("companyId") Long companyId, @Param("stdYm") String stdYm);

    /** AS-IS Sys99_Print.insertRdCardContents — 담은 행 수 */
    int insertPrintCardContents(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                                @Param("dataYm") String dataYm, @Param("managerId") String managerId,
                                @Param("providePurCode") String providePurCode, @Param("searchText") String searchText);

    /** AS-IS Sys99_Print.insertRdCardContentsDownload — 담은 행 수 */
    int insertPrintCardContentsDownload(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                        @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                                        @Param("dataYm") String dataYm, @Param("managerId") String managerId,
                                        @Param("providePurCode") String providePurCode, @Param("searchText") String searchText);
}

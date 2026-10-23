package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizAccountOptionRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizDocClassRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoCardRes;
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
}

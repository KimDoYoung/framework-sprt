package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizPromoRelateApprRow;
import kr.co.kfs.asseterp.biz.biz.dto.BizRelateApprRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BizRelateApprMapper {

    /** AS-IS biz05_relate_appr.selectByPersonId */
    List<BizRelateApprRes> selectByPersonId(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                                            @Param("linkCode") String linkCode, @Param("personId") Long personId);

    /** AS-IS biz05_relate_appr.selectByDataYm — dataYm은 "%…%"로 감싼 글자 */
    List<BizRelateApprRes> selectByDataYm(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                                          @Param("linkCode") String linkCode);

    /** AS-IS biz05_relate_appr.selectByPromoId */
    List<BizRelateApprRes> selectByPromoId(@Param("companyId") Long companyId, @Param("promoId") Long promoId);

    /** AS-IS biz05_relate_appr.selectFileCount — 'n건' */
    String selectFileCount(@Param("promoId") Long promoId);

    /** AS-IS Biz05_RelateAppr.delete → UpdateDataModel.deleteModel */
    int deleteById(@Param("companyId") Long companyId, @Param("relateApprId") Long relateApprId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS biz05_relate_appr.insertPersonId */
    int insertPersonId(@Param("relateApprId") long relateApprId, @Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                       @Param("linkCode") String linkCode, @Param("apprId") Long apprId, @Param("personId") Long personId);

    /** AS-IS biz05_relate_appr.insert — A35·A36(법인카드 현황·접대비 현황) 월 단위 상신 연결 */
    int insertDataYm(@Param("relateApprId") long relateApprId, @Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                     @Param("linkCode") String linkCode, @Param("apprId") Long apprId);

    /** AS-IS sys01_company.selectById의 위치 이름(첨부 폴더) */
    String selectLocName(@Param("companyId") Long companyId);

    /** AS-IS biz05_relate_appr.selectByPromoIdList — 내역들이 이미 걸린 결재문서 (A13 연관문서 자동등록, V38) */
    List<BizPromoRelateApprRow> selectByPromoIds(@Param("promoIds") List<Long> promoIds);
}

package kr.co.kfs.asseterp.biz.biz.mapper;

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
}

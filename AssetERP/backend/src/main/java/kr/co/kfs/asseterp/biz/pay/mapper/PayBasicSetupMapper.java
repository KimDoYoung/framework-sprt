package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayBasicSetupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayBasicSetupSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PayBasicSetupMapper {

    /** AS-IS pay30_basic_setup.selectByCompanyId */
    PayBasicSetupRes selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS dbConfig.getSeq */
    Long selectNextId();

    /** AS-IS Pay30_BasicSetup.modelUpdate — 행이 없을 때 */
    int insertBasicSetup(@Param("basicSetupId") Long basicSetupId, @Param("companyId") Long companyId,
                         @Param("req") PayBasicSetupSaveReq req);

    /** AS-IS Pay30_BasicSetup.modelUpdate — 행이 있을 때 */
    int updateBasicSetup(@Param("companyId") Long companyId, @Param("req") PayBasicSetupSaveReq req);
}

package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizLimitRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BizLimitMapper {

    /** AS-IS biz90_limit.selectByCompanyId */
    List<BizLimitRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS biz90_limit.selectById — 저장 결과 한 행 */
    BizLimitRes selectById(@Param("companyId") Long companyId, @Param("limitId") Long limitId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Biz90_Limit.update → UpdateDataModel(biz90_limit) INSERT */
    int insert(@Param("companyId") Long companyId, @Param("req") BizLimitSaveReq req);

    /** AS-IS Biz90_Limit.update → UpdateDataModel UPDATE — 로그인 회사의 행만 */
    int update(@Param("companyId") Long companyId, @Param("req") BizLimitSaveReq req);

    /** AS-IS Biz90_Limit.delete → UpdateDataModel.deleteModel — 로그인 회사의 행만 */
    int deleteById(@Param("companyId") Long companyId, @Param("limitId") Long limitId);
}

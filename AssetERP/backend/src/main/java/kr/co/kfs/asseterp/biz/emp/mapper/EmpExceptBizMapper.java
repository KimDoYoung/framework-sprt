package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.ExceptBizRes;
import kr.co.kfs.asseterp.biz.emp.dto.ExceptBizSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpExceptBizMapper {

    /** AS-IS emp33_except_biz.selectByExceptBizCode — 로그인 회사·예외업무 코드의 사원별 예외(재직 기준 오늘) */
    List<ExceptBizRes> selectByExceptBizCode(@Param("companyId") Long companyId, @Param("exceptBizCode") String exceptBizCode);

    /** AS-IS emp33_except_biz.selectById — 저장 결과 한 행 */
    ExceptBizRes selectById(@Param("exceptBizId") Long exceptBizId, @Param("companyId") Long companyId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Emp33_ExceptBiz.update → UpdateDataModel(emp33_except_biz) INSERT */
    int insert(@Param("companyId") Long companyId, @Param("req") ExceptBizSaveReq req);

    /** AS-IS Emp33_ExceptBiz.update → UpdateDataModel UPDATE — 로그인 회사 행만 */
    int update(@Param("companyId") Long companyId, @Param("req") ExceptBizSaveReq req);

    /** AS-IS Emp33_ExceptBiz.delete → UpdateDataModel.deleteModel — 로그인 회사 행만 */
    int deleteById(@Param("companyId") Long companyId, @Param("exceptBizId") Long exceptBizId);
}

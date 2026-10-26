package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.PlanRes;
import kr.co.kfs.asseterp.biz.fnd.dto.PlanSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fnd/mapper/fnd20_plan.xml (+ Fnd20_Plan.deleteAppr가 부르는 apr 삭제 SQL) */
@Mapper
public interface FndPlanMapper {
    /** AS-IS selectByFundId L88 (P03) — 로그인 회사 펀드만 */
    List<PlanRes> selectByFundId(@Param("fundId") Long fundId, @Param("companyId") Long companyId);

    /** 저장·삭제 전 그 행을 다시 읽는다(회사 검사 포함) */
    PlanRes selectById(@Param("planId") Long planId, @Param("companyId") Long companyId);

    /** 펀드가 로그인 회사 것인가 */
    long countFund(@Param("fundId") Long fundId, @Param("companyId") Long companyId);

    long selectNextId();

    int insertPlan(@Param("planId") Long planId, @Param("managerId") Long managerId, @Param("req") PlanSaveReq req);

    int updatePlan(@Param("req") PlanSaveReq req);

    int deletePlan(@Param("planId") Long planId);

    /** AS-IS Fnd20_Plan.deleteAppr L164-179 (1)~(4) */
    int deleteRelateFund(@Param("apprId") Long apprId);

    int deleteFiles(@Param("apprId") Long apprId);

    int deleteApprSteps(@Param("apprId") Long apprId);

    int deleteAppr(@Param("apprId") Long apprId);
}

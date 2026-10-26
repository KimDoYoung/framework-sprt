package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanAuthCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanAuthRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanListRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fnd/mapper/fnd01_fund_code.xml */
@Mapper
public interface FndFundCodeMapper {
    /** AS-IS selectByFundOrgAuth L392 (F06) */
    List<FundCodeRes> selectByFundOrgAuth(@Param("c") FundCodeCond cond);

    /** AS-IS selectByFundPlan L534 (P01) */
    List<FundPlanRes> selectByFundPlan(@Param("companyId") Long companyId, @Param("closeYn") String closeYn,
                                       @Param("fundName") String fundName, @Param("fundTypeCode") String fundTypeCode);

    /** AS-IS selectById L35 (P01) — 저장 뒤 그 행을 다시 읽는다 */
    FundPlanRes selectPlanById(@Param("fundCodeId") Long fundCodeId, @Param("companyId") Long companyId);

    /** AS-IS selectByOverlap L771 (P01 [중복확인]) — 같은 코드의 개수(AS-IS는 행 목록의 크기) */
    long countByOverlap(@Param("fundCode") String fundCode);

    /** AS-IS selectOneFundCodeCheck L665 (P01 저장 검사) */
    long countFundCodeCheck(@Param("fundCodeId") Long fundCodeId, @Param("fundCode") String fundCode, @Param("planYn") String planYn);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** 삭제 대상 검사: 로그인 회사의 임시펀드만, ICAM관리 여부와 함께 */
    List<FundPlanRes> selectPlanForDelete(@Param("fundCodeIds") List<Long> fundCodeIds, @Param("companyId") Long companyId);

    int insertFundCode(@Param("fundCodeId") Long fundCodeId, @Param("companyId") Long companyId, @Param("r") FundPlanSaveReq req);

    int updateFundCode(@Param("companyId") Long companyId, @Param("r") FundPlanSaveReq req);

    int insertFundInfo(@Param("fundInfoId") Long fundInfoId, @Param("fundCodeId") Long fundCodeId, @Param("r") FundPlanSaveReq req);

    int updateFundInfo(@Param("fundCodeId") Long fundCodeId, @Param("r") FundPlanSaveReq req);

    int deleteFundInfos(@Param("fundInfoIds") List<Long> fundInfoIds, @Param("fundCodeIds") List<Long> fundCodeIds);

    int deleteFundCodes(@Param("fundCodeIds") List<Long> fundCodeIds, @Param("companyId") Long companyId);

    /** AS-IS selectByFundName L38 (P02, 권한부서 없음) */
    List<FundPlanAuthRes> selectByFundName(@Param("c") FundPlanAuthCond cond);

    /** AS-IS selectByFundOrgAuth L392 (P02, 권한부서 있음 — admin 조건 없이) */
    List<FundPlanAuthRes> selectPlanByOrgAuth(@Param("c") FundPlanAuthCond cond);

    /** AS-IS selectByPlan L800 (P03). admin이 'false'면 내 조직이 권한(fnd08_auth_yn)을 가진 펀드만 */
    List<FundPlanListRes> selectByPlan(@Param("companyId") Long companyId, @Param("orgId") Long orgId, @Param("admin") String admin,
                                       @Param("closeYn") String closeYn, @Param("fundName") String fundName,
                                       @Param("fundTypeCode") String fundTypeCode);
}

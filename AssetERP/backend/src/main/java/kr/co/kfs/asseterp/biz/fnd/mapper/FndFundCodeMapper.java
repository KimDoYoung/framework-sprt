package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundHistoryCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundHistoryRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanAuthCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanAuthRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanListRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundRelateCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundRelateRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.FundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSearchCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSearchRes;
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

    /** AS-IS selectByFundName L253 (P05, 일반 펀드) */
    List<FundRes> selectFunds(@Param("c") FundSearchCond cond);

    /** AS-IS selectById L35 (P05) — 저장 뒤 그 행을 다시 읽는다. cond는 회사만 쓴다 */
    FundRes selectFundById(@Param("c") FundSearchCond cond, @Param("fundCodeId") Long fundCodeId);

    int insertFund(@Param("fundCodeId") Long fundCodeId, @Param("companyId") Long companyId, @Param("r") FundSaveReq req);

    int updateFund(@Param("companyId") Long companyId, @Param("r") FundSaveReq req);

    /** AS-IS noteUpdate (P05, ICAM관리 펀드) */
    int updateFundNote(@Param("fundCodeId") Long fundCodeId, @Param("companyId") Long companyId, @Param("note") String note);

    int insertFundDetail(@Param("fundInfoId") Long fundInfoId, @Param("fundCodeId") Long fundCodeId, @Param("r") FundSaveReq req);

    int updateFundDetail(@Param("fundCodeId") Long fundCodeId, @Param("r") FundSaveReq req);

    /** AS-IS selectByFundName L253 (P07 펀드 조회) — P05와 같은 조회 + 최종 규약 */
    List<FundSearchRes> selectFundSearch(@Param("c") FundSearchCond cond);

    /** AS-IS sys99_print.deleteByPersonId (P07 엑셀다운로드 ① 내 출력 자료 지움) */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdFundSearch (P07 엑셀다운로드 ② 같은 조회 결과를 새 그룹 ID로 담음) */
    int insertPrintFundSearch(@Param("companyId") Long companyId, @Param("personId") Long personId,
                              @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId, @Param("c") FundSearchCond cond);

    /** AS-IS selectByHistoryCompanyId L331 (P08 펀드 조회(변경이력)) — 오늘 기준 펀드별 최신 펀드정보 */
    List<FundHistoryRes> selectByHistoryCompanyId(@Param("c") FundHistoryCond cond);

    /** AS-IS selectByCompanyId L334 (P09 펀드별 자산 조회) — 내 조직 권한 펀드 중 기준일 최신 펀드정보 */
    List<FundRelateRes> selectByCompanyId(@Param("c") FundRelateCond cond);
}

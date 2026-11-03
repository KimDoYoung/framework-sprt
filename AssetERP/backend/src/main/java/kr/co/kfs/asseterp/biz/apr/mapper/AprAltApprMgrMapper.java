package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprMgrRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprMgrSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/apr/mapper/apr07_alt_appr.xml (EE02 대결자 지정(관리자)) — 회사 안의 모든 사원 */
@Mapper
public interface AprAltApprMgrMapper {
    /** AS-IS selectByText L204 — searchText는 LIKE 값 */
    List<AprAltApprMgrRes> selectByText(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate, @Param("searchText") String searchText);

    /** AS-IS notAltApprIdList L71 (empId = null) */
    List<AprAltApprMgrRes> selectNotInIds(@Param("companyId") Long companyId, @Param("altApprIds") List<Long> altApprIds);

    /** AS-IS selectById */
    AprAltApprMgrRes selectById(@Param("companyId") Long companyId, @Param("altApprId") Long altApprId);

    long selectNextId();

    /** UpdateDataModel INSERT — 원결재자·대결자가 이 회사 사원일 때만(보안 보강) */
    int insert(@Param("companyId") Long companyId, @Param("req") AprAltApprMgrSaveReq req);

    /** UpdateDataModel UPDATE — 화면이 바꾸는 열 */
    int update(@Param("companyId") Long companyId, @Param("req") AprAltApprMgrSaveReq req);

    /** UpdateDataModel.deleteModel — 이 회사 원결재자 행만 */
    int deleteById(@Param("companyId") Long companyId, @Param("altApprId") Long altApprId);
}

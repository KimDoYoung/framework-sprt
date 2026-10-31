package kr.co.kfs.asseterp.biz.est.mapper;

import kr.co.kfs.asseterp.biz.est.dto.PfContractLinkRow;
import kr.co.kfs.asseterp.biz.est.dto.PfContractRes;
import kr.co.kfs.asseterp.biz.est.dto.PfContractSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/est/mapper/est02_pf_contract.xml + est03_pf_history.checkList */
@Mapper
public interface EstPfContractMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS est02_pf_contract.selectByText — searchText는 "%…%", startDate는 조회기준일 */
    List<PfContractRes> selectByText(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                     @Param("searchText") String searchText);

    /** AS-IS est02_pf_contract.selectById — 로그인 회사 행만 */
    PfContractRes selectById(@Param("pfContractId") Long pfContractId, @Param("companyId") Long companyId);

    /** 결재창 A60·A61 양식 치환용 행(첨부 목록 포함) — 로그인 회사 행만 */
    PfContractLinkRow selectLinkById(@Param("pfContractId") Long pfContractId, @Param("companyId") Long companyId);

    /** AS-IS est02_pf_contract.updateApprId — 용역수행 계획서(A60)의 결재 문서 */
    int updatePlanApprId(@Param("companyId") Long companyId, @Param("pfContractId") Long pfContractId, @Param("apprId") Long apprId);

    /** AS-IS est02_pf_contract.updateResultApprId — 용역 결과보고서(A61)의 결재 문서 */
    int updateResultApprId(@Param("companyId") Long companyId, @Param("pfContractId") Long pfContractId, @Param("apprId") Long apprId);

    /** AS-IS UpdateDataModel 동적 INSERT */
    int insertPfContract(@Param("companyId") Long companyId, @Param("r") PfContractSaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE — 결재 번호(planApprId·resultApprId)는 건드리지 않는다 */
    int updatePfContract(@Param("companyId") Long companyId, @Param("r") PfContractSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deletePfContracts(@Param("companyId") Long companyId, @Param("pfContractIds") List<Long> pfContractIds);

    /** AS-IS est03_pf_history.checkList — 이 용역계약의 수행내역 ID */
    List<Long> selectHistoryIdsByContracts(@Param("pfContractIds") List<Long> pfContractIds);
}

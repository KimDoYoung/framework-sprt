package kr.co.kfs.asseterp.biz.est.mapper;

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

    /** AS-IS UpdateDataModel 동적 INSERT */
    int insertPfContract(@Param("companyId") Long companyId, @Param("r") PfContractSaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE — 결재 번호(planApprId·resultApprId)는 건드리지 않는다 */
    int updatePfContract(@Param("companyId") Long companyId, @Param("r") PfContractSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deletePfContracts(@Param("companyId") Long companyId, @Param("pfContractIds") List<Long> pfContractIds);

    /** AS-IS est03_pf_history.checkList — 이 용역계약의 수행내역 ID */
    List<Long> selectHistoryIdsByContracts(@Param("pfContractIds") List<Long> pfContractIds);
}

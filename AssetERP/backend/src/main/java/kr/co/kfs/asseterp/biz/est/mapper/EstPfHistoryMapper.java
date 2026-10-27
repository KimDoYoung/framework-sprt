package kr.co.kfs.asseterp.biz.est.mapper;

import kr.co.kfs.asseterp.biz.est.dto.PfConfirmerRes;
import kr.co.kfs.asseterp.biz.est.dto.PfFileRes;
import kr.co.kfs.asseterp.biz.est.dto.PfFileSaveReq;
import kr.co.kfs.asseterp.biz.est.dto.PfHistoryRes;
import kr.co.kfs.asseterp.biz.est.dto.PfHistorySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/est/mapper/est03_pf_history.xml + est04_pf_file.xml */
@Mapper
public interface EstPfHistoryMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS est03_pf_history.selectByPfContractId */
    List<PfHistoryRes> selectByPfContractId(@Param("companyId") Long companyId, @Param("pfContractId") Long pfContractId);

    /** AS-IS est03_pf_history.selectById (UpdateDataModel이 저장 뒤 돌려주는 행) — 로그인 회사 행만 */
    PfHistoryRes selectById(@Param("pfHistoryId") Long pfHistoryId, @Param("companyId") Long companyId);

    /** AS-IS est03_pf_history.getConfirmerParent */
    PfConfirmerRes selectConfirmerParent(@Param("personId") Long personId, @Param("date") LocalDate date);

    /** AS-IS est03_pf_history.checkNo — 같은 용역계약에서 같은 수행번호를 쓰는 다른 내역의 ID */
    List<Long> selectSameNoIds(@Param("pfContractId") Long pfContractId, @Param("no") Long no, @Param("pfHistoryId") Long pfHistoryId);

    /** AS-IS UpdateDataModel 동적 INSERT */
    int insertPfHistory(@Param("companyId") Long companyId, @Param("r") PfHistorySaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE */
    int updatePfHistory(@Param("companyId") Long companyId, @Param("r") PfHistorySaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deletePfHistories(@Param("companyId") Long companyId, @Param("pfHistoryIds") List<Long> pfHistoryIds);

    /** AS-IS est04_pf_file.selectByPfHistoryId — 로그인 회사 수행내역의 증빙만 */
    List<PfFileRes> selectFilesByPfHistoryId(@Param("pfHistoryId") Long pfHistoryId, @Param("companyId") Long companyId);

    /** 증빙 한 건이 있는지 (UpdateDataModel의 INSERT/UPDATE 판정) */
    int countPfFile(@Param("pfFileId") Long pfFileId);

    /** AS-IS UpdateDataModel 동적 INSERT (est04_pf_file) */
    int insertPfFile(@Param("pfHistoryId") Long pfHistoryId, @Param("r") PfFileSaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE (est04_pf_file) — 이 수행내역의 증빙만 */
    int updatePfFile(@Param("pfHistoryId") Long pfHistoryId, @Param("r") PfFileSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel (est04_pf_file) — 이 수행내역의 증빙만 */
    int deletePfFiles(@Param("pfHistoryId") Long pfHistoryId, @Param("pfFileIds") List<Long> pfFileIds);

    /** AS-IS est03_pf_history.selectByConfirmer01 (Q11 일자기준) — 내가 승인자인 신청·승인 내역, confirm이 true면 미승인만 */
    List<PfHistoryRes> selectByConfirmer01(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") LocalDate startDate,
                                           @Param("searchText") String searchText, @Param("confirm") boolean confirm);

    /** AS-IS est03_pf_history.selectByConfirmer02 (Q11 체결용역 기준) — 내가 승인자인 그 용역계약의 내역 */
    List<PfHistoryRes> selectByConfirmer02(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("pfContractId") Long pfContractId);

    /** AS-IS est03_pf_history.updateConfirm — 승인(20)은 승인일시를 지금으로, 승인취소(10)는 비운다 */
    int updateConfirm(@Param("companyId") Long companyId, @Param("pfHistoryId") Long pfHistoryId, @Param("statusCode") String statusCode, @Param("confirm") boolean confirm);
}

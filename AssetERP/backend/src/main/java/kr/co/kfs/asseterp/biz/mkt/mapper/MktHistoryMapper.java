package kr.co.kfs.asseterp.biz.mkt.mapper;

import kr.co.kfs.asseterp.biz.mkt.dto.MktHistoryRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktHistorySaveReq;
import kr.co.kfs.asseterp.biz.mkt.dto.MktRelateFundRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** Z05·Z06 업무활동내역 (AS-IS server/mkt/mapper/mkt03_history.xml, mkt04_relate_fund.xml) */
@Mapper
public interface MktHistoryMapper {

    long selectNextId();

    /** AS-IS mkt03_history.selectByTargetCompanyId — isManager=false면 본인이 쓴 것이거나 공유 지정된 것만(Z05), true면 회사 전체(Z06 관리자). allContactYn=false면 활동처 한정 */
    List<MktHistoryRes> selectByTargetCompanyId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("orgId") Long orgId,
                                                @Param("itemType") String itemType, @Param("targetCompanyId") Long targetCompanyId,
                                                @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                                @Param("allContactYn") boolean allContactYn, @Param("searchText") String searchText,
                                                @Param("isManager") boolean isManager);

    /** AS-IS mkt03_history.selectById (회사 조건 추가) */
    MktHistoryRes selectById(@Param("companyId") Long companyId, @Param("historyId") Long historyId);

    /** 작성자 사원 ID (없으면 null) */
    Long selectOwner(@Param("companyId") Long companyId, @Param("historyId") Long historyId);

    /** UpdateDataModel UPDATE — 활동일·활동내용·상세만 */
    int updateOne(@Param("companyId") Long companyId, @Param("r") MktHistorySaveReq req);

    /** UpdateDataModel INSERT — 작성자·등록일은 서버가 정한다 */
    int insertOne(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("r") MktHistorySaveReq req);

    /** 내가 쓴 것만 골라낸 ID */
    List<Long> selectOwnedIds(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("ids") List<Long> ids);

    /** AS-IS Mkt03_History.delete 의 mkt04_relate_fund.deleteByHistoryId */
    int deleteRelateFundsByHistory(@Param("companyId") Long companyId, @Param("historyId") Long historyId);

    /** AS-IS mkt05_share.deleteByParentId */
    int deleteSharesByParent(@Param("companyId") Long companyId, @Param("parentId") Long parentId);

    /** UpdateDataModel.deleteModel */
    int deleteHistory(@Param("companyId") Long companyId, @Param("historyId") Long historyId);

    /** AS-IS mkt04_relate_fund.selectByHistoryId */
    List<MktRelateFundRes> selectRelateFunds(@Param("companyId") Long companyId, @Param("historyId") Long historyId);

    /** UpdateDataModel INSERT (updateByList) */
    int insertRelateFund(@Param("id") Long id, @Param("historyId") Long historyId, @Param("fundId") Long fundId, @Param("companyId") Long companyId);

    /** Mkt04_RelateFund.delete (연결펀드 삭제 아이콘) */
    int deleteRelateFundsByIds(@Param("companyId") Long companyId, @Param("historyId") Long historyId, @Param("ids") List<Long> ids);
}

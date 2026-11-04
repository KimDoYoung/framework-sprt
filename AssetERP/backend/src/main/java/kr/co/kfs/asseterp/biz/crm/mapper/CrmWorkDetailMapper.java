package kr.co.kfs.asseterp.biz.crm.mapper;

import kr.co.kfs.asseterp.biz.crm.dto.CrmRelateFundRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmWorkDetailRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmWorkDetailSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 업무활동내역 (AS-IS server/crm/Crm12_WorkDetail · Crm13_RelateFund · Crm15_Share) — EE85 Crm12_Lookup_WorkDetail */
@Mapper
public interface CrmWorkDetailMapper {

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS crm12_work_detail.selectById — 회사 조건을 더했다 */
    CrmWorkDetailRes selectById(@Param("companyId") Long companyId, @Param("workDetailId") Long workDetailId);

    /** AS-IS crm13_relate_fund.selectByWorkDetailId */
    List<CrmRelateFundRes> selectFundsByWorkDetailId(@Param("workDetailId") Long workDetailId);

    int countById(@Param("companyId") Long companyId, @Param("workDetailId") Long workDetailId);

    /** AS-IS Crm12_WorkDetail.modelUpdate의 INSERT (새 건) — 등록일은 오늘 */
    int insert(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") CrmWorkDetailSaveReq req);

    /** AS-IS Crm12_WorkDetail.modelUpdate의 UPDATE */
    int update(@Param("companyId") Long companyId, @Param("req") CrmWorkDetailSaveReq req);

    /** AS-IS crm15_share.deleteByWorkDetailId (비공개 저장·등록 취소) */
    int deleteSharesByWorkDetailId(@Param("workDetailId") Long workDetailId);

    /** AS-IS crm15_share.insertDefaultShare — 거래처 기본 공유를 이 건으로 복사 */
    int insertDefaultShare(@Param("contactId") Long contactId, @Param("workDetailId") Long workDetailId);

    /** AS-IS crm15_share.selectShareInfo */
    String selectShareInfo(@Param("workDetailId") Long workDetailId);

    /** AS-IS crm13_relate_fund.deleteByWorkDetailId */
    int deleteFundsByWorkDetailId(@Param("workDetailId") Long workDetailId);

    int insertFund(@Param("relateFundId") long relateFundId, @Param("workDetailId") Long workDetailId, @Param("fundId") Long fundId);

    /** AS-IS Crm13_RelateFund.delete (그리드 삭제 아이콘) */
    int deleteFund(@Param("relateFundId") Long relateFundId, @Param("companyId") Long companyId);
}

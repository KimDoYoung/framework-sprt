package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateSelectRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/apr/mapper/apr20_relate_ics.xml · sys10_file.xml · bbs02_notice.xml · bbs03_target.xml (V10 연관법규 편집·결재완료후 첨부) */
@Mapper
public interface AprRelateEditMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS apr20_relate_ics.selectByApprId */
    List<AprRelateIcsRow> selectRelateIcs(@Param("apprId") Long apprId);

    /** AS-IS dcr20_relate_ics.insertIcs (EE68): 문서분류에 딸린 법규(참고) + 고른 법규 */
    List<AprRelateSelectRes> selectRelateIcsByIcs(@Param("dcrClassTreeId") Long dcrClassTreeId, @Param("icsClassTreeId") Long icsClassTreeId);

    /** AS-IS dcr21_relate_icr.insertIcr (EE69): 문서분류에 딸린 내규(참고) + 고른 내규 */
    List<AprRelateSelectRes> selectRelateIcrByIcr(@Param("dcrClassTreeId") Long dcrClassTreeId, @Param("icrClassTreeId") Long icrClassTreeId);

    /** AS-IS apr22_relate_icr.selectByApprId (EE70) */
    List<AprRelateIcsRow> selectRelateIcr(@Param("apprId") Long apprId);

    /** AS-IS UpdateDataModel(apr22_relate_icr) INSERT (EE70) */
    int insertRelateIcr(@Param("id") Long id, @Param("apprId") Long apprId, @Param("classTreeId") Long classTreeId, @Param("standCode") String standCode,
                        @Param("standDate") LocalDate standDate, @Param("closeDate") LocalDate closeDate, @Param("deadlineId") Long deadlineId);

    /** AS-IS UpdateDataModel(apr22_relate_icr) UPDATE — 이 화면이 바꾸는 기준·마감만 (EE70) */
    int updateRelateIcr(@Param("id") Long id, @Param("apprId") Long apprId, @Param("standCode") String standCode,
                        @Param("standDate") LocalDate standDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS UpdateDataModel(apr22_relate_icr) DELETE (EE70) */
    int deleteRelateIcr(@Param("apprId") Long apprId, @Param("ids") List<Long> ids);

    /** 새로 고른 법규·기한의 보기 값 (selectByApprId와 같은 조인, 관련조문은 AS-IS처럼 비워 둔다) */
    AprRelateIcsRow selectRelateIcsInfo(@Param("classTreeId") Long classTreeId, @Param("deadlineId") Long deadlineId, @Param("withLaw") boolean withLaw);

    /** 새 연관내규 줄: 내규·기한의 보기 값 (V13) */
    AprRelateIcsRow selectRelateIcrInfo(@Param("classTreeId") Long classTreeId, @Param("deadlineId") Long deadlineId);

    /** AS-IS apr20_relate_ics.getCloseDate */
    LocalDate selectCloseDate(@Param("deadlineId") Long deadlineId, @Param("standDate") LocalDate standDate, @Param("companyId") Long companyId);

    /** 기한의 주기 이름 (selectByApprId의 cycle_nm과 같은 식) */
    String selectCycleName(@Param("deadlineId") Long deadlineId);

    /** 내규 기한의 주기 이름 (apr22_relate_icr.selectByApprId의 cycle_nm과 같은 식, V13) */
    String selectCycleNameIcr(@Param("deadlineId") Long deadlineId);

    /** AS-IS UpdateDataModel(apr20_relate_ics) INSERT */
    int insertRelateIcs(@Param("id") Long id, @Param("apprId") Long apprId, @Param("classTreeId") Long classTreeId, @Param("standCode") String standCode,
                        @Param("standDate") LocalDate standDate, @Param("closeDate") LocalDate closeDate, @Param("deadlineId") Long deadlineId);

    /** AS-IS UpdateDataModel(apr20_relate_ics) UPDATE — 이 화면이 바꾸는 기준·마감만 */
    int updateRelateIcs(@Param("id") Long id, @Param("apprId") Long apprId, @Param("standCode") String standCode,
                        @Param("standDate") LocalDate standDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS UpdateDataModel(apr20_relate_ics) DELETE */
    int deleteRelateIcs(@Param("apprId") Long apprId, @Param("ids") List<Long> ids);

    /** AS-IS bbs02_notice.insert — 상신자에게 가는 변동 알림 */
    int insertNotice(@Param("noticeId") Long noticeId, @Param("companyId") Long companyId, @Param("title") String title, @Param("notice") String notice);

    /** AS-IS bbs03_target.insert */
    int insertNoticeTarget(@Param("targetId") Long targetId, @Param("noticeId") Long noticeId, @Param("personId") Long personId);

    /** AS-IS sys10_file.selectByFileYn */
    List<AprAfterFileRes> selectAfterFiles(@Param("apprId") Long apprId);

    /** AS-IS Sys10_File.update(UpdateDataModel) — 인감날인본만 */
    int updateFileStamp(@Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("stampYn") String stampYn);

    /** AS-IS apr03_relate_fund.selectByAfterYn (V16) */
    List<AprAfterFundRes> selectAfterFunds(@Param("apprId") Long apprId);

    /** AS-IS apr03_relate_fund.deleteByAfterYn — 결재완료 이후 등록한 줄만 */
    int deleteAfterFunds(@Param("apprId") Long apprId);

    /** 이 문서에 남아 있는 연관펀드 줄인가 (AS-IS UpdateDataModel이 있으면 UPDATE, 없으면 INSERT) */
    int countRelateFund(@Param("apprId") Long apprId, @Param("relateFundId") Long relateFundId);

    /** AS-IS UpdateDataModel(apr03_relate_fund) UPDATE */
    int updateRelateFund(@Param("apprId") Long apprId, @Param("relateFundId") Long relateFundId, @Param("fundId") Long fundId, @Param("printYn") String printYn, @Param("afterYn") String afterYn);
}

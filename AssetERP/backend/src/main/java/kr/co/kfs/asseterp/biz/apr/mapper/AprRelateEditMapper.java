package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsRow;
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

    /** 새로 고른 법규·기한의 보기 값 (selectByApprId와 같은 조인, 관련조문은 AS-IS처럼 비워 둔다) */
    AprRelateIcsRow selectRelateIcsInfo(@Param("classTreeId") Long classTreeId, @Param("deadlineId") Long deadlineId);

    /** AS-IS apr20_relate_ics.getCloseDate */
    LocalDate selectCloseDate(@Param("deadlineId") Long deadlineId, @Param("standDate") LocalDate standDate, @Param("companyId") Long companyId);

    /** 기한의 주기 이름 (selectByApprId의 cycle_nm과 같은 식) */
    String selectCycleName(@Param("deadlineId") Long deadlineId);

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
}

package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.ActRelateApprRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act80_relate_appr.xml — 연관문서 Act80_Lookup_RelateAppr (W05 2단계 ⓑ) */
@Mapper
public interface ActRelateApprMapper {

    List<ActRelateApprRes> selectByTrId(@Param("companyId") Long companyId, @Param("trId") Long trId);

    List<ActRelateApprRes> selectByJournalId(@Param("companyId") Long companyId, @Param("journalId") Long journalId);

    long selectNextId();

    Long selectTrId(@Param("journalId") Long journalId);

    Long selectJournalId(@Param("trId") Long trId);

    /** act02_journal.selectOneJournalIdByTrId */
    Long selectOneJournalIdByTrId(@Param("trId") Long trId);

    int countAppr(@Param("companyId") Long companyId, @Param("apprId") Long apprId);

    int insertRelateAppr(@Param("relateApprId") long relateApprId, @Param("apprId") Long apprId, @Param("journalId") Long journalId, @Param("trId") Long trId);

    int deleteRelateAppr(@Param("companyId") Long companyId, @Param("relateApprId") Long relateApprId);
}

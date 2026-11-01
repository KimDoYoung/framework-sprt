package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.JournalRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/act/mapper/act02_journal.xml(selectByDate · selectById · createJournalNo · insert · delete) · act80_relate_appr.xml(deleteByJournalId) — X01 */
@Mapper
public interface ActJournalListMapper {

    List<JournalRes> selectByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                  @Param("closeDate") LocalDate closeDate, @Param("abroType") String abroType,
                                  @Param("searchText") String searchText);

    JournalRes selectById(@Param("companyId") Long companyId, @Param("journalId") Long journalId);

    Long createJournalNo(@Param("companyId") Long companyId, @Param("date") LocalDate date);

    int insertJournal(@Param("journalId") Long journalId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                      @Param("date") LocalDate date, @Param("note") String note, @Param("corpId") Long corpId,
                      @Param("curCode") String curCode, @Param("journalNo") Long journalNo);

    int deleteRelateApprByJournalId(@Param("journalId") Long journalId);

    int deleteJournal(@Param("journalId") Long journalId);
}

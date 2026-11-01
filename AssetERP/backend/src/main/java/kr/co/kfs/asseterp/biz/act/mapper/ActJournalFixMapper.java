package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.JournalFixRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/act/mapper/act02_journal.xml (selectByDateAll L147 · selectById L46 · updateFixYn L565) — 전표승인처리 (X02) */
@Mapper
public interface ActJournalFixMapper {

    List<JournalFixRes> selectByDateAll(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                        @Param("closeDate") LocalDate closeDate, @Param("searchText") String searchText,
                                        @Param("corpIdStr") String corpIdStr, @Param("trCode") String trCode,
                                        @Param("unFixYn") String unFixYn, @Param("trOccType") String trOccType);

    JournalFixRes selectById(@Param("companyId") Long companyId, @Param("journalId") Long journalId);

    int updateFixYn(@Param("journalId") Long journalId, @Param("procType") String procType, @Param("fixPersonName") String fixPersonName);
}

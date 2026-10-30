package kr.co.kfs.asseterp.biz.act.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

/** AS-IS server/act/mapper/act02_journal.xml(createJournal) · act04_gen_ledger.xml(checkCloseCount·selectCloseDateCount) — U04 */
@Mapper
public interface ActJournalMapper {

    /** act02_journal.createJournal — 'Y'면 정상, 아니면 오류 메시지 */
    String createJournal(@Param("procType") String procType, @Param("companyId") Long companyId, @Param("personId") Long personId,
                         @Param("trCode") String trCode, @Param("trId") Long trId, @Param("exceptYn") boolean exceptYn);

    /** act04_gen_ledger.checkCloseCount — 처리일 이후 마감 건수 */
    long countCloseAfter(@Param("companyId") Long companyId, @Param("closeDate") LocalDate closeDate);

    /** act04_gen_ledger.selectCloseDateCount — 처리일 마감 건수 */
    long countCloseOn(@Param("companyId") Long companyId, @Param("closeDate") LocalDate closeDate);
}

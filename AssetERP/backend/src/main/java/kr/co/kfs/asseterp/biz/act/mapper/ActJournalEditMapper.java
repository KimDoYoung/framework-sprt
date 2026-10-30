package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.JournalHeaderRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalTmpRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act02_journal.xml(update) · act06_journal_tmp.xml · act03_journal_dtl.xml — 전표변경 Act02_Lookup_ModiJournal (W05 2단계) */
@Mapper
public interface ActJournalEditMapper {

    /** act02_journal 머리 한 건 — 내 회사 것만 */
    JournalHeaderRes selectHeader(@Param("companyId") Long companyId, @Param("journalId") Long journalId);

    /** act06_journal_tmp.selectByJournalId */
    List<JournalTmpRes> selectTmpByJournalId(@Param("journalId") Long journalId);

    long selectNextId();

    /** act02_journal.update (비고·거래처. 통화는 그대로) */
    int updateJournal(@Param("journalId") Long journalId, @Param("corpId") Long corpId, @Param("note") String note);

    /** act06_journal_tmp.deleteByJournalId · act03_journal_dtl.deleteByJournalId */
    int deleteTmpByJournalId(@Param("journalId") Long journalId);

    int deleteDtlByJournalId(@Param("journalId") Long journalId);

    /** act06_journal_tmp.insert */
    int insertTmp(@Param("tmpId") long tmpId, @Param("journalId") Long journalId, @Param("seq") long seq, @Param("r") JournalSaveReq.Line r);

    /** act03_journal_dtl.insertByJournalId — 차변 줄과 대변 줄을 순서대로 짝지은 한 건 (한쪽만 있으면 다른 쪽은 null) */
    int insertDtl(@Param("journalId") Long journalId, @Param("seq") long seq,
                  @Param("dr") JournalSaveReq.Line dr, @Param("cr") JournalSaveReq.Line cr);
}

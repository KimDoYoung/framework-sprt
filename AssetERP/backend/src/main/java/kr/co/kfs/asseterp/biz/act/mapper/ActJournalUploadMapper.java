package kr.co.kfs.asseterp.biz.act.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

/** AS-IS server/act/mapper/act08_journal_upload.xml (deleteByCompanyId · excelInsert · journalWork) — 전표입력 [엑셀업로드] (X01) */
@Mapper
public interface ActJournalUploadMapper {

    int deleteByCompanyId(@Param("companyId") Long companyId);

    long selectNextId();

    int excelInsert(@Param("id") long id, @Param("companyId") Long companyId, @Param("date") LocalDate date, @Param("journalNo") String journalNo,
                    @Param("accountCode") String accountCode, @Param("accountName") String accountName, @Param("drAmt") Long drAmt,
                    @Param("crAmt") Long crAmt, @Param("accountNote") String accountNote, @Param("note") String note,
                    @Param("updName") String updName, @Param("corpCode") String corpCode, @Param("depositCode") String depositCode);

    /** f_create_journal_upload — 'Y'면 성공, 아니면 메시지 */
    String journalWork(@Param("companyId") Long companyId, @Param("personId") Long personId);
}

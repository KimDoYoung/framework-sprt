package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.BookDepnRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleByTrRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCfTodayRow;
import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceSearchCond;
import kr.co.kfs.asseterp.biz.ast.dto.TrIntrinsicRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrIntrinsicSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/ast/mapper/ast06_tr.xml (selectByPayCode L197 · selectById · selectDepnCount L683 · selectTodayCf L869 · insert)
 * · ast07_settle.xml (selectByTrId L44) · ast13_book_depn.xml (selectByDepnDate L61) — 고유자산 거래처리 Ast06_Tab_TrIntrinsic (X03)
 */
@Mapper
public interface AstTrIntrinsicMapper {

    /** ast06_tr.selectByPayCode */
    List<TrIntrinsicRes> selectByPayCode(@Param("c") TrFinanceSearchCond cond, @Param("bookIoCheck") boolean bookIoCheck);

    /** ast06_tr.selectById — 회사 조건 추가 */
    TrIntrinsicRes selectById(@Param("companyId") Long companyId, @Param("trId") Long trId);

    long selectNextId();

    /** ast06_tr 새 행 / 고침 (편집창이 바꾸는 열) */
    int insertTr(@Param("trId") long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("r") TrIntrinsicSaveReq r);

    int updateTr(@Param("companyId") Long companyId, @Param("r") TrIntrinsicSaveReq r);

    /** act02_journal.selectByTrId → 분개가 있으면 승인 여부(fixYn) / 일자·거래처·적요를 맞춘다(updateTrInfo) */
    Long selectJournalId(@Param("trId") Long trId);

    boolean selectJournalFixYn(@Param("trId") Long trId);

    int updateJournalTrInfo(@Param("journalId") Long journalId, @Param("date") LocalDate date, @Param("corpId") Long corpId, @Param("note") String note);

    /** ast09_book.createDepnBook — 'Y'면 정상 */
    String createDepnBook(@Param("procType") String procType, @Param("trId") Long trId);

    /** ast06_tr.selectDepnCount — 거래일 이후 상각(5012) 건수 */
    long countDepn(@Param("companyId") Long companyId, @Param("date") LocalDate date, @Param("purTrId") Long purTrId);

    /** ast07_settle.selectByTrId */
    List<SettleByTrRes> selectSettlesByTrId(@Param("trId") Long trId);

    /** ast06_tr.selectTodayCf */
    List<TrCfTodayRow> selectTodayCf(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("orgId") Long orgId,
                                     @Param("stdDate") LocalDate stdDate, @Param("assetType") String assetType,
                                     @Param("windowClassName") String windowClassName);

    /** ast06_tr.insert (C/F 가져오기) */
    int insertCfTr(@Param("trId") long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                   @Param("r") TrCfTodayRow r);

    /** ast13_book_depn.selectByDepnDate — searchText는 "%검색어%" */
    List<BookDepnRes> selectBookDepns(@Param("companyId") Long companyId, @Param("depnDate") LocalDate depnDate,
                                      @Param("searchText") String searchText);
}

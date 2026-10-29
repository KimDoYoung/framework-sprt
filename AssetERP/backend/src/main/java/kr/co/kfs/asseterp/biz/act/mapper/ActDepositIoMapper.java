package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

/** AS-IS sys99_print.xml(deleteByPersonId·insert·updateDepositOutData) — 일일자금관리 RD 출력 자료(U01) */
@Mapper
public interface ActDepositIoMapper {
    /** dbConfig.getSeq */
    long selectNextId();

    /** deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** insert — 입금 또는 출금 한 줄(둘 중 안 쓰는 쪽은 null) */
    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                    @Param("seq") int seq, @Param("seq2") int seq2, @Param("book") BookRes book,
                    @Param("inRow") JournalDtlRes in, @Param("outRow") JournalDtlRes out);

    /** updateDepositOutData */
    int updateOutData(@Param("groupId") long groupId, @Param("seq") int seq, @Param("seq2") int seq2, @Param("outRow") JournalDtlRes out);
}

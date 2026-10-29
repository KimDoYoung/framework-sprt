package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.BookRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookSumRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast09_book.xml — 예금원장(U01) */
@Mapper
public interface AstBookMapper {
    /** selectByHoldDate (astType 1 = 예금) */
    List<BookRes> selectByHoldDate(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                   @Param("astType") String astType, @Param("searchText") String searchText);

    /** selectDepositCurGroupSum */
    List<BookSumRes> selectDepositCurGroupSum(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate);

    /** createDepositBook — 'Y'면 정상, 아니면 오류 메시지 */
    String createDepositBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);
}

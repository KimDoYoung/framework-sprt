package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.BookFundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookItemRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookRelateAstRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookRelateFndRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/fnd/mapper/fnd10_book.xml */
@Mapper
public interface FndBookMapper {
    /** AS-IS selectByRelateAst (P09 펀드별 자산 조회) */
    List<BookRelateAstRes> selectByRelateAst(@Param("companyId") Long companyId, @Param("fundCodeId") Long fundCodeId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS selectByRelateFnd (P10 자산별 펀드 조회) — 내 조직 권한 펀드 중 그 종목을 가진 펀드 */
    List<BookRelateFndRes> selectByRelateFnd(@Param("companyId") Long companyId, @Param("orgId") Long orgId,
                                             @Param("astClassTreeId") Long astClassTreeId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS selectItemList (EE47 종목별 보유펀드 — 종목 목록). searchText는 '%…%'로 감싸 넘긴다 */
    List<BookItemRes> selectItemList(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate,
                                     @Param("searchText") String searchText);

    /** AS-IS selectFundListByItemCode (EE47 — 고른 종목의 보유펀드) */
    List<BookFundRes> selectFundListByItemCode(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate,
                                               @Param("itemCode") String itemCode);
}

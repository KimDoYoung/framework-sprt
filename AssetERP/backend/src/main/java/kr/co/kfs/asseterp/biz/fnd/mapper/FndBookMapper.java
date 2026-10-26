package kr.co.kfs.asseterp.biz.fnd.mapper;

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
}

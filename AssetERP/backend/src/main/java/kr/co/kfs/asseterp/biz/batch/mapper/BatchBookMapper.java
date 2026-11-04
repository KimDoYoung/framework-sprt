package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchAdvBook;
import kr.co.kfs.asseterp.biz.batch.dto.BatchFndBook;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

/** 운용(fnd10)·자문/일임(adv10) 운용자산 원장 반영용 SQL (ICAM 읽기는 IcamReader) */
@Mapper
public interface BatchBookMapper {

    /** AS-IS fnd10_book.delete — 그 날 그 회사의 ICAM 관리펀드 원장 */
    int deleteFndBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS fnd01_fund_code.selectByFundCode → 펀드ID, 없으면 null */
    Long selectFundCodeId(@Param("companyId") Long companyId, @Param("fundCode") String fundCode);

    /** AS-IS ast01_class_tree.selectByDetailCode → 자산분류ID(ICAM 운용 종목), 없으면 null */
    Long selectItemClassTreeId(@Param("companyId") Long companyId, @Param("itemCode") String itemCode);

    /** AS-IS fnd10_book.insert */
    int insertFndBook(@Param("p") BatchFndBook book);

    /** AS-IS adv10_book.delete */
    int deleteAdvBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS adv10_book.insert */
    int insertAdvBook(@Param("p") BatchAdvBook book);
}

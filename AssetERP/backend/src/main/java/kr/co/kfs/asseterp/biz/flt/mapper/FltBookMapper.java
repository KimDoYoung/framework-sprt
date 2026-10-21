package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.BookRes;
import kr.co.kfs.asseterp.biz.flt.dto.LockupStdRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt11_book.xml, flt01_company_std.xml */
@Mapper
public interface FltBookMapper {

    /** AS-IS flt11_book.selectByText2 (expectYn=true: 사전신고 반영 보유내역) */
    List<BookRes> selectBooksExpect(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                    @Param("accountId") Long accountId, @Param("stdDate") String stdDate,
                                    @Param("searchText") String searchText);

    /** AS-IS flt11_book.selectByText (expectYn=false: 기준일 보유잔고) */
    List<BookRes> selectBooks(@Param("companyId") Long companyId, @Param("personId") Long personId,
                              @Param("accountId") Long accountId, @Param("stdDate") String stdDate,
                              @Param("searchText") String searchText);

    /** AS-IS flt01_company_std.selectByDate 에서 의무보유기간 열 */
    LockupStdRes selectLockupStd(@Param("companyId") Long companyId, @Param("stdDate") String stdDate);
}

package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.BookRealRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookRealSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface AstBookRealMapper {

    /** AS-IS ast12_book_real.selectByHoldDate — 예금 계좌 전부 + 그 일자의 실제잔고(없으면 0) + 직전 입력일의 최근잔고 */
    List<BookRealRes> selectByHoldDate(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                       @Param("searchText") String searchText);

    /** 저장 전 존재 확인(UpdateDataModel이 ID로 INSERT/UPDATE를 가르는 것과 같다) */
    int countById(@Param("companyId") Long companyId, @Param("bookRealId") Long bookRealId);

    /** AS-IS Ast12_BookReal.update → UpdateDataModel INSERT */
    int insert(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate, @Param("realQty") Double realQty,
               @Param("req") BookRealSaveReq req);

    /** AS-IS Ast12_BookReal.update → UpdateDataModel UPDATE — 로그인 회사의 행만 */
    int update(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate, @Param("realQty") Double realQty,
               @Param("req") BookRealSaveReq req);
}

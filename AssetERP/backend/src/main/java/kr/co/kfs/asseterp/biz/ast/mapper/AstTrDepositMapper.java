package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.TargetBookRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSearchCond;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast06_tr.xml selectDepositTr · selectById — 계좌이체 Ast06_Tab_TrDeposit (X06) */
@Mapper
public interface AstTrDepositMapper {

    /** ast06_tr.selectDepositTr */
    List<TrDepositRes> selectDepositTr(@Param("c") TrDepositSearchCond cond);

    /** ast06_tr.selectById(계좌이체 열) — 회사 조건 추가 */
    TrDepositRes selectById(@Param("companyId") Long companyId, @Param("trId") Long trId);

    long selectNextId();

    /** 출금 계좌의 통화(비면 KRW) — AS-IS 편집창 E1이 Ast01_ClassTree.selectById로 정한 curCode */
    String selectCurCode(@Param("classTreeId") Long classTreeId);

    int insertTr(@Param("trId") long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("curCode") String curCode, @Param("bookAmt") long bookAmt, @Param("r") TrDepositSaveReq r);

    /** 외화 계좌이체(X10) Ast06_Tr.update — 통화·적용환율·외화금액은 화면 값 그대로, 장부금액은 건드리지 않는다(NEW는 null) */
    int insertForTr(@Param("trId") long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("r") TrDepositSaveReq r);

    int updateForTr(@Param("companyId") Long companyId, @Param("r") TrDepositSaveReq r);

    /** ast01_class_tree.selectById의 curCode 그대로(비어 있어도 KRW로 바꾸지 않는다) */
    String selectRawCurCode(@Param("classTreeId") Long classTreeId);

    /** ast09_book.selectTargetBook — 출금 계좌의 거래일 기준 보유잔고 */
    TargetBookRes selectTargetBook(@Param("companyId") Long companyId, @Param("holdDate") LocalDate holdDate,
                                   @Param("astClassTreeId") Long astClassTreeId);

    /** ast06_tr.updateByBookAmt */
    int updateBookAmt(@Param("trId") Long trId, @Param("bookAmt") Long bookAmt);

    int updateTr(@Param("companyId") Long companyId, @Param("curCode") String curCode, @Param("bookAmt") long bookAmt,
                 @Param("r") TrDepositSaveReq r);
}

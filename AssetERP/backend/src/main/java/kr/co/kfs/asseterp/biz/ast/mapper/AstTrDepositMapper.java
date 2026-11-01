package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.TrDepositRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSearchCond;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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

    int updateTr(@Param("companyId") Long companyId, @Param("curCode") String curCode, @Param("bookAmt") long bookAmt,
                 @Param("r") TrDepositSaveReq r);
}

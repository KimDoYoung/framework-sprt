package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.TrBizCardPromo;
import kr.co.kfs.asseterp.biz.ast.dto.TrBizCardRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

/** AS-IS server/ast/mapper/ast06_tr.xml selectByCardApprovalNo + UpdateDataModel(ast06_tr) — 비품대장 등록 Ast06_Lookup_TrBizCard (EE41) */
@Mapper
public interface AstTrBizCardMapper {

    /** 카드 사용내역(promoId)의 승인번호·승인일·승인금액·세금 */
    TrBizCardPromo selectPromo(@Param("companyId") Long companyId, @Param("promoId") Long promoId);

    /** AS-IS ast06_tr.selectByCardApprovalNo */
    TrBizCardRes selectByCardApprovalNo(@Param("companyId") Long companyId, @Param("cardApprovalNo") String cardApprovalNo);

    long selectNextId();

    /** UpdateDataModel INSERT — 새 거래(AS-IS insertRow L214-241의 값) */
    int insertTr(@Param("trId") Long trId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                 @Param("date") LocalDate date, @Param("amt") Long amt, @Param("tax") Long tax, @Param("contAmt") Long contAmt,
                 @Param("cardApprovalNo") String cardApprovalNo, @Param("trCd") String trCd, @Param("corpId") Long corpId,
                 @Param("astClassTreeId") Long astClassTreeId, @Param("note") String note);

    /** UpdateDataModel UPDATE — 화면이 바꾸는 열(거래유형·거래처·종목·적요)만 */
    int updateTr(@Param("companyId") Long companyId, @Param("trId") Long trId, @Param("trCd") String trCd, @Param("corpId") Long corpId,
                 @Param("astClassTreeId") Long astClassTreeId, @Param("note") String note);
}

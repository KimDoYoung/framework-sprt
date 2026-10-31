package kr.co.kfs.asseterp.biz.apr.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AstTrLinkRow;
import kr.co.kfs.asseterp.biz.apr.dto.DepositIoPrintRow;
import kr.co.kfs.asseterp.biz.apr.dto.Tr4InsureLinkRow;

/** 자산·자금 링크코드(A17 일일자금 · A68 4대보험 납부)의 본문 값 조회 (V33) */
@Mapper
public interface AprAstLinkSeedMapper {

    /** AS-IS sys99_print.selectByDepositIoList — 회사 조건 추가 */
    List<DepositIoPrintRow> selectDepositIoPrint(@Param("companyId") Long companyId, @Param("groupId") Long groupId);

    /** AS-IS ast06_tr.selectTaxTr 한 행(세금/4대보험 등록 그리드가 넘기던 모델) — 번호로 다시 읽는다 */
    AstTrLinkRow selectTrLink(@Param("companyId") Long companyId, @Param("trId") Long trId);

    /** AS-IS ast21_tr_4insure.selectExpenseAppr */
    List<Tr4InsureLinkRow> selectInsureExpense(@Param("companyId") Long companyId, @Param("trDate") LocalDate trDate);

    /** AS-IS LoginUser.getUserModel().getOrgInfoModel().getKorName() — 로그인 사원의 현재 조직 이름 */
    String selectUserOrgName(@Param("personId") Long personId);
}

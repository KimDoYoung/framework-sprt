package kr.co.kfs.asseterp.biz.apr.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.BookDepnGroupRow;
import kr.co.kfs.asseterp.biz.apr.dto.ErpFeeChargeLinkRow;
import kr.co.kfs.asseterp.biz.apr.dto.ErpFeeLinkRow;
import kr.co.kfs.asseterp.biz.apr.dto.PayExpenseLinkRow;

/** 링크코드 A63·A64(지출)·A65(비품대장)·A69(Asset-ERP 사용료)의 본문 값 조회 (V27) */
@Mapper
public interface AprExpenseLinkSeedMapper {

    /** 지출요청 행 (A63 selectExpenseAppr·A64 selectExpensePay의 그리드 행을 ID로 다시 읽음). byDueDate=true면 이름 기준일이 지급요청일(A64), 아니면 요청등록일(A63). 순서는 ids 순서와 무관 */
    List<PayExpenseLinkRow> selectExpenseRows(@Param("companyId") Long companyId, @Param("ids") List<Long> ids, @Param("byDueDate") boolean byDueDate);

    /** com01_relate_appr.selectByExpenseIdList — 지출요청에 연결된 증빙 상신문서 (A63 문서 자동등록) */
    List<AprLinkRelateApprRes> selectRelateApprsByExpenseIds(@Param("ids") List<Long> ids);

    /** pay50_expense.selectByExpenseApprIdList — 지출결의서 상신문서 (A64 문서 자동등록) */
    List<AprLinkRelateApprRes> selectExpenseApprsByExpenseIds(@Param("ids") List<Long> ids);

    /** ast13_book_depn.selectOfficeAssetsGroup (A65) */
    List<BookDepnGroupRow> selectOfficeAssetsGroup(@Param("companyId") Long companyId, @Param("depnDate") LocalDate depnDate);

    /** biz55_erp_fee_charge.selectByStdDate의 한 행 (A69) — 날짜는 그 행의 청구일자 */
    ErpFeeChargeLinkRow selectErpFeeCharge(@Param("erpFeeChargeId") Long erpFeeChargeId);

    /** biz52_erp_fee.selectByStartDate (A69) */
    ErpFeeLinkRow selectErpFeeByStartDate(@Param("companyId") Long companyId, @Param("erpContCorpId") Long erpContCorpId, @Param("stdDate") LocalDate stdDate);
}

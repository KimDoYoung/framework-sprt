package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayMonthAnnualRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthGroupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/mapper/pay10_month.xml + pay05_relate_appr.checkAppr + act02_journal.countByPayMonthCode + 급여 삭제 부수 SQL — 급여관리(S16) */
@Mapper
public interface PayMonthMapper {
    /** AS-IS pay10_month.selectByCompanyId */
    List<PayMonthRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("payCode") String payCode,
                                        @Param("payDate") LocalDate payDate);

    /** AS-IS pay10_month.selectByYear */
    List<PayMonthGroupRes> selectByYear(@Param("companyId") Long companyId, @Param("year") String year,
                                        @Param("payCode") String payCode, @Param("code") String code);

    /** 삭제·근로시간 저장 전에 행을 다시 읽는다(회사 범위) */
    List<PayMonthRes> selectByIds(@Param("companyId") Long companyId, @Param("monthIds") List<Long> monthIds);

    /** AS-IS pay05_relate_appr.checkAppr 의 행 수 (결재 진행 10·20·30) */
    int countRelateAppr(@Param("companyId") Long companyId, @Param("payCode") String payCode,
                        @Param("payDate") LocalDate payDate, @Param("monthId") Long monthId);

    /** AS-IS act02_journal.countByPayMonthCode */
    long countJournal(@Param("companyId") Long companyId, @Param("payCode") String payCode,
                      @Param("payDate") LocalDate payDate, @Param("monthId") Long monthId);

    int deleteItems(@Param("monthId") Long monthId);

    int deleteRetireInsure(@Param("monthId") Long monthId);

    int deleteRetireTax(@Param("monthId") Long monthId);

    int deleteRetireTaxItem(@Param("monthId") Long monthId);

    /** AS-IS pay32_insure_pay.deleteByDate */
    int deleteInsurePay(@Param("personId") Long personId, @Param("date") LocalDate date);

    /** AS-IS pay11_month_item.getInsureAdjustModi → 'Y' 또는 실패 문구 */
    String getInsureAdjustModi(@Param("personId") Long personId, @Param("insureCode") String insureCode,
                               @Param("payDate") LocalDate payDate);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteMonths(@Param("companyId") Long companyId, @Param("monthIds") List<Long> monthIds);

    /** UpdateDataModel.updateModel — 근로시간 팝업이 바꾸는 열 */
    int updateWorkTime(@Param("companyId") Long companyId, @Param("monthId") Long monthId, @Param("totalWorkTime") Long totalWorkTime,
                       @Param("req") kr.co.kfs.asseterp.biz.pay.dto.PayMonthWorkTimeReq req);

    // ---- 급여 생성 (Pay10_Month.insert) ----

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** 로그인 회사 소속 사원인지 (TOBE 추가 검사) */
    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS sys12_calendar.workDayPerson — 회사 ID 1 고정(원본 그대로), retireDate가 있으면 그 날까지 */
    long workDayPerson(@Param("payDateInt") String payDateInt, @Param("hireDate") LocalDate hireDate,
                       @Param("retireDate") LocalDate retireDate);

    /** AS-IS pay10_month.selectByPayDatePersonId 의 행 수 */
    int countByPayDatePerson(@Param("companyId") Long companyId, @Param("personId") Long personId,
                             @Param("payDate") LocalDate payDate, @Param("payCode") String payCode);

    /** AS-IS pay01_annual.selectByApprStatus (결재완료 30, 적용시작일이 지급일 이전 중 최근) */
    PayMonthAnnualRes selectApprovedAnnual(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                           @Param("payDate") LocalDate payDate);

    /** AS-IS pay10_month.insert — 연장·야간·휴일 근로시간은 넣지 않는다(원본 그대로 NULL) */
    int insertMonth(@Param("monthId") Long monthId, @Param("companyId") Long companyId, @Param("payCode") String payCode,
                    @Param("payDate") LocalDate payDate, @Param("personId") Long personId, @Param("workDay") double workDay,
                    @Param("totalWorkTime") double totalWorkTime, @Param("stdMonth") String stdMonth);

    /** AS-IS pay11_month_item.insert */
    int insertItem(@Param("monthItemId") Long monthItemId, @Param("monthId") Long monthId, @Param("itemType") String itemType,
                   @Param("itemCode") String itemCode, @Param("itemAmt") Long itemAmt);

    /** AS-IS pay11_month_item.insertLatestInfo — 열 이름 없는 INSERT … SELECT(pay11 열 순서 의존) */
    int insertLatestInfo(@Param("monthId") Long monthId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                         @Param("payCode") String payCode, @Param("payDateInt") String payDateInt);

    Long getInsureNps(@Param("personId") Long personId, @Param("payDate") LocalDate payDate);

    Long getInsureHi(@Param("personId") Long personId, @Param("payDate") LocalDate payDate);

    Long getInsureLtc(@Param("personId") Long personId, @Param("payDate") LocalDate payDate);

    Long getInsureEi(@Param("personId") Long personId, @Param("payDate") LocalDate payDate);

    Long getIncomeTax(@Param("monthId") Long monthId);

    Long getLocalTax(@Param("payDate") LocalDate payDate, @Param("monthId") Long monthId);

    /** AS-IS pay11_month_item.getAdjustPay — 4대보험 연말정산 납부(insureCode 2 건강·3 장기요양·4 고용) */
    Long getAdjustPay(@Param("personId") Long personId, @Param("insureCode") String insureCode, @Param("payDate") LocalDate payDate);
}

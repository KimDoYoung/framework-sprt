package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayInsureApplyRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsureApplySaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePreYearRowReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/mapper/pay31_insure_apply.xml (+ pay32_insure_pay.createInsureAdjust·deleteByPersonId, pay21_rate.selectByDate, emp35_deduct.selectByCompanyId, emp01_person 조회) — 4대보험신고(EDI) */
@Mapper
public interface PayInsureApplyMapper {
    /** AS-IS selectByCompanyId — insureApplyGubun "multi"는 보수변동(2)·착오정정(3). year가 있으면 신고일의 연도로, 없으면 startDate~closeDate로 */
    List<PayInsureApplyRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                              @Param("insureCode") String insureCode, @Param("insureApplyGubun") String insureApplyGubun,
                                              @Param("year") String year, @Param("startDate") LocalDate startDate,
                                              @Param("closeDate") LocalDate closeDate);

    /** AS-IS selectById (UpdateDataModel 뒤) + 회사 조건 */
    PayInsureApplyRes selectById(@Param("companyId") Long companyId, @Param("insureApplyId") Long insureApplyId);

    /** AS-IS getSeq와 같은 식 */
    Long selectNextId();

    /** UpdateDataModel insert (탭 4 [등록]) */
    int insert(@Param("insureApplyId") Long insureApplyId, @Param("companyId") Long companyId, @Param("req") PayInsureApplySaveReq req);

    /** UpdateDataModel update */
    int update(@Param("companyId") Long companyId, @Param("req") PayInsureApplySaveReq req);

    /** UpdateDataModel delete */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS insert1 — 보험 하나(insureCode)를 신고 행으로 */
    int insert1(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("insureCode") String insureCode,
                @Param("insureApplyCode") String insureApplyCode, @Param("applyDate") LocalDate applyDate,
                @Param("initDate") LocalDate initDate, @Param("applyMonth") String applyMonth,
                @Param("applyMonthPay") Long applyMonthPay, @Param("npsInitPayYn") String npsInitPayYn);

    /** AS-IS delete3 */
    int delete3(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("applyDate") LocalDate applyDate);

    /** AS-IS insert3-2 (건강보험) */
    int insert3x2(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("applyDate") LocalDate applyDate,
                  @Param("applyMonth") String applyMonth, @Param("hireDate") LocalDate hireDate,
                  @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate, @Param("termInfo") String termInfo);

    /** AS-IS insert3-4 (고용보험) */
    int insert3x4(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("applyDate") LocalDate applyDate,
                  @Param("applyMonth") String applyMonth, @Param("hireDate") LocalDate hireDate,
                  @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate, @Param("termInfo") String termInfo,
                  @Param("preYearPay1Date") LocalDate preYearPay1Date, @Param("preYearPay2Date") LocalDate preYearPay2Date);

    /** AS-IS pay31_insure_apply.updateModel (회사 조건 추가) */
    int updatePreYear(@Param("companyId") Long companyId, @Param("req") PayInsurePreYearRowReq req);

    /** AS-IS pay32_insure_pay.createInsureAdjust — DB 함수, "Y"면 성공 */
    String createInsureAdjust(@Param("personId") Long personId, @Param("year") String year, @Param("insureCode") String insureCode);

    /** AS-IS pay32_insure_pay.deleteByPersonId (회차 0인 정산만) */
    int deleteInsurePayByPersonId(@Param("companyId") Long companyId, @Param("insureCode") String insureCode,
                                  @Param("personId") Long personId, @Param("year") String year);

    /** AS-IS pay21_rate.selectByDate — 적용시작일 목록(정렬 없음, 원본 그대로) */
    List<LocalDate> selectRateStartDates(@Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                         @Param("rateCode") String rateCode);

    /** AS-IS emp35_deduct.selectByCompanyId — 기준일 이전 가장 최근 공제정보의 대표자여부 'true'/'false'. 없으면 null */
    String selectReprYn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("startDate") LocalDate startDate);

    /** AS-IS emp01_person.selectById의 입사일 (회사 조건 추가) */
    LocalDate selectHireDate(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** 로그인 회사 소속 사원 수(0/1) */
    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS emp01_person.selectByCtzNo (EDI 업로드) */
    List<Long> selectPersonIdsByCtzNo(@Param("companyId") Long companyId, @Param("personName") String personName,
                                      @Param("personCtzNo") String personCtzNo);

    /** AS-IS emp01_person.selectByEmpNo (납부방법 업로드) */
    List<Long> selectPersonIdsByEmpNo(@Param("companyId") Long companyId, @Param("empNo") String empNo);

    /** AS-IS pay31_insure_apply.excelInsert (납부방법 업로드) */
    int excelInsert(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("insureCode") String insureCode,
                    @Param("payCode") String payCode, @Param("payDiv") Long payDiv, @Param("applyDate") LocalDate applyDate);
}

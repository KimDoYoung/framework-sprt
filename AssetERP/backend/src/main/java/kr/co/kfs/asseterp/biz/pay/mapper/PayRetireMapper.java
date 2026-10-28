package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayRetireInsureRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireLeaveRowRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireLeaveSummary;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireMonthRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxOfficeRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxRes;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.List;

/** 퇴직정산(Pay10_Tab_Retire, S22) — AS-IS pay10_month·pay12~pay16 매퍼. 계산은 DB 함수(f_calc_*_retire)가 한다 */
@Mapper
public interface PayRetireMapper {

    /** pay10_month.selectByPersonId(payCode 03) + getRetireInfo의 퇴직일 */
    List<PayRetireMonthRes> selectMonthByPerson(Long companyId, Long personId);

    /** pay10_month.selectByRetirePayCode — RD 폼 행 수 계산용(지급 1·공제 2 항목 수) */
    long countRetireItems(Long personId, String itemType);

    // ── 생성·삭제 (Pay12_RetireInsure.getInsureRetire) ──
    String callLeavePayRetire(Long personId, String gubun);

    String callInsureRetire(Long personId, String checkYn, String gubun);

    String callIncomeTaxRetire(Long personId, String checkYn, int menuNum);

    String callIncomeTaxRetireC(Long personId, int menuNum);

    int deleteRelateApprRetire(Long companyId, LocalDate startDate, String payCode, Long retireId);

    // ── 4대보험 ──
    List<PayRetireInsureRes> selectInsures(Long personId, String insureCode);

    List<PayRetireInsureRes> selectInsuresByYear(Long monthId, String insureCode, String year);

    int upsertInsure(PayRetireInsureRes row);

    int deleteInsure(Long monthId, Long retireInsureId);

    int updateMonthItemAmt(Long monthId, String itemCode, Long itemAmt);

    /** 이 퇴직정산 급여(monthId)가 회사 소속인지(personId를 주면 그 사원 것인지도) — TOBE 추가 */
    int countMonth(Long companyId, Long monthId, Long personId);

    /** 사원이 회사 소속인지 — TOBE 추가 */
    int countPerson(Long companyId, Long personId);

    /** AS-IS sys99_print.deleteByPersonId — 내 출력 자료 정리 */
    int deletePrint(Long companyId, Long printPersonId, String windowClassName);

    /** AS-IS Sys99_Print.insertRdRetireInsure — 사원의 퇴직정산 4대보험을 출력 자료로(INSERT … SELECT) */
    int insertPrintInsure(Long companyId, Long printPersonId, String windowClassName, Long groupId, Long personId);

    Long selectNextId();

    // ── 소득세 ──
    PayRetireTaxRes selectTax(Long monthId);

    List<PayRetireTaxOfficeRes> selectOfficePayTax(Long monthId);

    List<PayRetireTaxItemRes> selectTaxItems(Long monthId, String itemType);

    int upsertTaxItem(PayRetireTaxItemRes row);

    int deleteTaxItem(Long monthId, Long retireTaxItemId);

    int updateTaxAmt(Long monthId, int menuNum, Long itemAmt, Long pyItemAmt);

    int updateOfficePayTax(Long monthId, Long preOfficePayTax, Long pyPreOfficePayTax, Long curOfficePayTax, Long pyCurOfficePayTax);

    /** 소득세 탭 [보기] 창의 기준일 — 퇴직정산 급여의 지급일자(AS-IS selectByMonthId의 서브쿼리) */
    LocalDate selectMonthDate(Long companyId, Long monthId);

    // ── 연차수당 ──
    PayRetireLeaveSummary selectRetireLeave(Long monthId, Long personId, LocalDate retireDate, String year);

    List<PayRetireLeaveRowRes> selectLeaveRows(Long monthId, String calcStdType);

    String calcRemLeaveDays(Long personId, LocalDate retireDate);

    PayRetireLeaveSummary selectRemLeaveDays(Long personId);
}

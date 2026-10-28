package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayApprCheckRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthAnnualRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthGroupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthWorkTimeReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayMonthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

/**
 * AS-IS server/pay/Pay10_Month.java (selectByCompanyId·selectByYear·checkAppr L211·insert L243·modelUpdate L615·deleteAll L628) — 급여관리 Pay10_Tab_Month (S16)
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayMonthService {

    private static final String MSG_IN_APPR = "결재진행중인 급여구분입니다";
    private static final String MSG_JOURNAL = "발생된 전표가 존재합니다. '발생업무 회계처리' 화면에서 전표삭제 후 진행하세요";

    private final PayMonthMapper mapper;

    /** pay10_month.selectByCompanyId */
    public List<PayMonthRes> search(UserPrincipal user, String payCode, LocalDate payDate) {
        return mapper.selectByCompanyId(user.getCompanyId(), payCode, payDate);
    }

    /** pay10_month.selectByYear — payCode "%"는 전체 */
    public List<PayMonthGroupRes> searchGroups(UserPrincipal user, String year, String payCode, String code) {
        return mapper.selectByYear(user.getCompanyId(), year, payCode, code);
    }

    /** AS-IS checkAppr: 결재 진행 중이면 막고, 분개(전표)가 있으면 막는다 */
    public PayApprCheckRes checkAppr(UserPrincipal user, String payCode, LocalDate payDate, Long monthId) {
        Long companyId = user.getCompanyId();
        if (mapper.countRelateAppr(companyId, payCode, payDate, monthId) > 0) {
            return new PayApprCheckRes(false, MSG_IN_APPR);
        }
        if (mapper.countJournal(companyId, payCode, payDate, monthId) > 0) {
            return new PayApprCheckRes(false, MSG_JOURNAL);
        }
        return new PayApprCheckRes(true, null);
    }

    /**
     * AS-IS insert L243: 사원마다 ① workDayPerson(퇴직 trans 900이면 퇴직일까지) ② 같은 지급일·구분의 급여가 이미 있으면 만들지 않는다
     * ③ annualYn이면 pay10_month + 결재완료 연봉으로 지급·공제 항목, 아니면 pay10_month + 전월 급여 복사(01만).
     * 급여(01)면 사원마다 마지막에 4대보험 연말정산 납부(221·231·241)를 시도한다 — 이미 있는 급여여도 시도(원본 그대로, 그때 monthId는 비어 있다).
     * 한 호출 = 한 트랜잭션. 하나라도 실패하면 전부 되돌리고 원본과 같은 문구로 실패한다. 항목 insert 순서(210~240 → 250 → 260)를 바꾸지 않는다(소득세가 앞 항목을 읽는다)
     */
    @Transactional
    public void create(UserPrincipal user, PayMonthCreateReq req) {
        Long companyId = user.getCompanyId();
        String payCode = req.payCode();
        LocalDate payDate = req.payDate();
        if (payCode == null || payCode.isBlank() || payDate == null || req.targets() == null || req.targets().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        // Pay10_Lookup_Insert: 퇴직정산(03)이 아니면 결재진행·전표 검사를 먼저 한다
        if (!"03".equals(payCode)) {
            requireOk(checkAppr(user, payCode, payDate, null));
        }
        String payDateInt = Integer.toString(Integer.parseInt(payDate.format(DateTimeFormatter.ofPattern("yyyyMM"))));
        try {
            for (PayMonthCreateReq.Target t : req.targets()) {
                if (mapper.countPerson(companyId, t.personId()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                LocalDate retireDate = "900".equals(t.transCode()) ? t.transDate() : null;
                long workDay = mapper.workDayPerson(payDateInt, t.hireDate(), retireDate);
                double workDayD = workDay;
                double totalWorkTime = workDay * 8d;
                Long monthId = null;   // 이미 있는 급여는 비어 있다(원본의 insertModel.monthId)

                if (mapper.countByPayDatePerson(companyId, t.personId(), payDate, payCode) == 0) {
                    monthId = mapper.selectNextId();
                    mapper.insertMonth(monthId, companyId, payCode, payDate, t.personId(), workDayD, totalWorkTime, req.stdMonth());
                    if (req.annualYn()) {
                        PayMonthAnnualRes annual = mapper.selectApprovedAnnual(companyId, t.personId(), payDate);
                        if (annual != null) {
                            createAnnualItems(payCode, payDate, t.personId(), monthId, annual);
                        }
                    } else if ("01".equals(payCode)) {
                        mapper.insertLatestInfo(monthId, companyId, t.personId(), payCode, payDateInt);
                    }
                }
                if ("01".equals(payCode)) {
                    // 급여일 때만 4대보험 연말정산 납부내역 생성 (원본 2024-7-26 CYY) — 금액이 0이 아니면 insert
                    insertAdjustItem(monthId, "221", "2", t.personId(), payDate);
                    insertAdjustItem(monthId, "231", "3", t.personId(), payDate);
                    insertAdjustItem(monthId, "241", "4", t.personId(), payDate);
                }
            }
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("급여 생성 실패 payCode={} payDate={}", payCode, payDate, e);
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "데이터를 불러올수 없습니다. 관리자에게 문의해주세요");
        }
    }

    /** 연봉정보 → 항목. 01:급여 110·111·112·113·190 + 공제 210~260, 02:상여금 130, 03:퇴직정산 일할 110~113, 04:특별수당 191 */
    private void createAnnualItems(String payCode, LocalDate payDate, Long personId, Long monthId, PayMonthAnnualRes a) {
        switch (payCode) {
            case "01" -> {
                if (a.basicPay() + a.overPay() + a.etc01Pay() + a.etc02Pay() > 0) {
                    item(monthId, "1", "110", a.basicPay() + a.overPay());
                }
                if (a.mealPay() > 0) {
                    item(monthId, "1", "111", a.mealPay());
                }
                if (a.carMt() > 0) {
                    item(monthId, "1", "112", a.carMt());
                }
                if (a.childcareAllowance() > 0) {
                    item(monthId, "1", "113", a.childcareAllowance());
                }
                if (a.etc01Pay() + a.etc02Pay() > 0) {
                    item(monthId, "1", "190", a.etc01Pay() + a.etc02Pay());
                }
                item(monthId, "2", "210", mapper.getInsureNps(personId, payDate));
                item(monthId, "2", "220", mapper.getInsureHi(personId, payDate));
                item(monthId, "2", "230", mapper.getInsureLtc(personId, payDate));
                item(monthId, "2", "240", mapper.getInsureEi(personId, payDate));
                item(monthId, "2", "250", mapper.getIncomeTax(monthId));
                item(monthId, "2", "260", mapper.getLocalTax(payDate, monthId));
            }
            case "02" -> {
                if (a.basicPay() + a.overPay() > 0) {
                    item(monthId, "1", "130", 0L);
                }
            }
            case "03" -> {
                double calc = (double) payDate.getDayOfMonth() / (double) payDate.lengthOfMonth();
                if (a.basicPay() + a.overPay() + a.etc01Pay() + a.etc02Pay() > 0) {
                    long amt = a.basicPay() + a.overPay() + a.etc01Pay() + a.etc02Pay();
                    item(monthId, "1", "110", (long) (amt * calc));
                }
                if (a.mealPay() > 0) {
                    item(monthId, "1", "111", (long) (a.mealPay() * calc));
                }
                if (a.carMt() > 0) {
                    item(monthId, "1", "112", (long) (a.carMt() * calc));
                }
                if (a.childcareAllowance() > 0) {
                    item(monthId, "1", "113", (long) (a.childcareAllowance() * calc));
                }
            }
            case "04" -> {
                if (a.basicPay() + a.overPay() > 0) {
                    item(monthId, "1", "191", 0L);
                }
            }
            default -> {
            }
        }
    }

    private void item(Long monthId, String itemType, String itemCode, Long amt) {
        mapper.insertItem(mapper.selectNextId(), monthId, itemType, itemCode, amt);
    }

    private void insertAdjustItem(Long monthId, String itemCode, String insureCode, Long personId, LocalDate payDate) {
        Long amt = mapper.getAdjustPay(personId, insureCode, payDate);
        if (amt != null && amt != 0) {
            item(monthId, "2", itemCode, amt);
        }
    }

    /**
     * AS-IS deleteAll L628: 행마다 하위 테이블 삭제 → 급여(01)·퇴직정산(03)이면 4대보험 납부 삭제 → 2·3·4 연말정산 검증('Y'가 아니면 그 문구로 실패)
     * → 마지막에 pay10_month 삭제. 행은 서버가 다시 읽는다(화면 값을 믿지 않음). 실패하면 예외로 전부 되돌린다
     */
    @Transactional
    public int delete(UserPrincipal user, List<Long> monthIds) {
        if (monthIds == null || monthIds.isEmpty()) {
            return 0;
        }
        Long companyId = user.getCompanyId();
        List<PayMonthRes> rows = mapper.selectByIds(companyId, monthIds);
        for (PayMonthRes row : rows) {
            requireOk(checkAppr(user, row.payCd(), row.date(), row.monthId()));
        }
        for (PayMonthRes row : rows) {
            mapper.deleteItems(row.monthId());
            mapper.deleteRetireInsure(row.monthId());
            mapper.deleteRetireTax(row.monthId());
            mapper.deleteRetireTaxItem(row.monthId());
            if ("01".equals(row.payCd()) || "03".equals(row.payCd())) {
                mapper.deleteInsurePay(row.personId(), row.date());
            }
            for (String insureCode : List.of("2", "3", "4")) {
                String msg = mapper.getInsureAdjustModi(row.personId(), insureCode, row.date());
                if (!"Y".equals(msg)) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
                }
            }
        }
        return mapper.deleteMonths(companyId, rows.stream().map(PayMonthRes::monthId).filter(Objects::nonNull).toList());
    }

    /** AS-IS Pay10_Lookup_Work [저장]: checkAppr 뒤 totalWorkTime = 근로일수×8 + 연장 + 야간 + 휴일 로 modelUpdate */
    @Transactional
    public int updateWorkTime(UserPrincipal user, Long monthId, PayMonthWorkTimeReq req) {
        List<PayMonthRes> rows = mapper.selectByIds(user.getCompanyId(), List.of(monthId));
        if (rows.isEmpty()) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        PayMonthRes row = rows.get(0);
        requireOk(checkAppr(user, row.payCd(), row.date(), row.monthId()));
        long total = nz(req.workDay()) * 8 + nz(req.extendWorkTime()) + nz(req.nightWorkTime()) + nz(req.holidayWorkTime());
        return mapper.updateWorkTime(user.getCompanyId(), monthId, total, req);
    }

    private static long nz(Long v) {
        return v == null ? 0 : v;
    }

    private static void requireOk(PayApprCheckRes res) {
        if (!res.ok()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, res.message());
        }
    }
}

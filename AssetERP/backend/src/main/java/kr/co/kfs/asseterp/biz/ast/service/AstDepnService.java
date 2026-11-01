package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.mapper.ActJournalMapper;
import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.DepnProcessReq;
import kr.co.kfs.asseterp.biz.ast.dto.DepnRes;
import kr.co.kfs.asseterp.biz.ast.dto.NonDeductTaxRes;
import kr.co.kfs.asseterp.biz.ast.dto.NonDeductTaxSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstDepnMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/ast/Ast06_Tr.java (selectDepn L168 · updateDepnEval L659 · updateDepnCost L863) · Ast16_NonDeductTax — 감가상각처리 Ast06_Tab_EvalDepn (W11).
 * 취소는 거래 삭제(Ast06_Tr.delete)와 같아 {@link AstTrService#delete}를 쓴다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstDepnService {

    /** 감가상각 거래코드 */
    private static final String TR_CODE = "5012";

    private final AstDepnMapper mapper;
    private final ActJournalMapper journalMapper;
    private final ActJournalService journalService;

    /**
     * ast06_tr.selectDepn — 아직 처리하지 않은 줄의 거래ID를 SQL 안의 f_create_seq()가 만든다. 이 함수는 시퀀스(nextval)를 쓰므로
     * 읽기 전용 트랜잭션에서는 NULL을 돌려준다(W09 평가처리와 같은 이유) → 조회지만 쓰기 가능 트랜잭션
     */
    @Transactional(readOnly = false)
    public List<DepnRes> search(UserPrincipal user, LocalDate depnDate) {
        return mapper.selectDepn(user.getCompanyId(), depnDate);
    }

    /** act.Act04_GenLedger.checkClose — 마감된 날짜면 예외(메시지는 서버 검사 그대로) */
    public void checkClose(UserPrincipal user, LocalDate stdDate) {
        journalService.checkClose(user.getCompanyId(), stdDate);
    }

    /**
     * updateDepnEval — 상각비를 계산해 거래(ast06_tr)를 만들고 비품원장·분개를 만든다. 한 줄이라도 실패하면 전부 되돌린다.
     * 회계마감 검사(클라이언트가 먼저 부르던 checkClose)는 첫 선택 행의 일자로 여기서 한다
     */
    @Transactional
    public void process(UserPrincipal user, List<DepnProcessReq.Item> items) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        journalService.checkClose(companyId, items.get(0).date());

        for (DepnProcessReq.Item r : items) {
            if (r.depnType() == null) {
                throw invalid("자산명[" + r.classTreeName() + "]의 감가상각 계산방식 정보가 존재하지 않습니다. 고유자산 기본등록 화면에서 선택해주세요.");
            }
            if (r.depnYear() == null) {
                throw invalid("자산명[" + r.classTreeName() + "]의 감가상각 기간정보가 존재하지 않습니다. 고유자산 기본등록 화면에서 입력해주세요.");
            }
            if (r.depnRate() == null && "2".equals(r.depnType())) {   // 2:정률법
                throw invalid("자산명[" + r.classTreeName() + "]의 감가상각 상각율 정보가 존재하지 않습니다. 고유자산 기본등록 화면에서 입력해주세요.");
            }
            long amt = calcDepnCost(r);
            if (mapper.existsTr(r.trId()) > 0) {
                mapper.updateTr(r, companyId, personId, amt);
            } else {
                mapper.insertTr(r, companyId, personId, amt);
            }
        }

        // 비품원장 반영 → 분개생성 (줄마다)
        for (DepnProcessReq.Item r : items) {
            String msg = mapper.createDepnBook("P", r.trId());
            if (!"Y".equals(msg)) throw invalid(msg);
            String jnlMsg = journalMapper.createJournal("P", companyId, personId, TR_CODE, r.trId(), true);
            if (!"Y".equals(jnlMsg)) throw invalid(jnlMsg);
        }
    }

    /** 감가상각비 계산 — AS-IS updateDepnEval L695-815의 식 그대로(정액법 1·정률법 2) */
    private long calcDepnCost(DepnProcessReq.Item r) {
        long bookAmt = nz(r.bookAmt());
        long tax = nz(r.nonDeductTax());
        long acm = nz(r.acmDepnCost());
        long depnYear = r.depnYear();
        long depnCost = 0;

        // 계산구간 개월수(직전 계상월의 익월 ~ 상각월), 취득일~처리일 개월수, 취득년수
        long monthDiff = nz(mapper.selectDateDif(r.calcStartDate(), r.date(), "M")) + 1;
        long purMonthDiff = nz(mapper.selectDateDif(r.purDate(), r.date(), "M")) + 1;
        long yearDiff = nz(mapper.selectDateDif(r.purDate(), r.date(), "Y")) + 1;
        long totalDepnMonth = depnYear * 12;

        if ("1".equals(r.depnType())) {
            // ((취득금액 + 불공제세액) / 감가상각기간) * 상각비계산개월수 / 12
            depnCost = (bookAmt + tax) / depnYear * monthDiff / 12;
            // 잔여상각액이 1000원 이하로 계산되면 잔여상각액이 1000원이 되도록 다시 계산
            if ((bookAmt + tax - (acm + depnCost)) <= 1000) {
                depnCost = bookAmt + tax - acm;
                if (depnCost > 1000) depnCost = depnCost - 1000;
            } else if (totalDepnMonth <= purMonthDiff) {
                // 마지막 상각구간인데 1000원 넘게 남았으면 1000원만 빼고 모두 상각
                depnCost = bookAmt + tax - acm - 1000;
            }
        } else if ("2".equals(r.depnType())) {
            if (depnYear <= yearDiff) {
                // 상각 마지막 연차는 1,000원만 남기고 모두 상각
                depnCost = bookAmt + tax - acm;
                if (depnCost > 1000) depnCost = depnCost - 1000;
            } else {
                // 전기말잔존가액(= 취득금액 + 불공제세액 - 누계액 + 당기분) * 상각률 / 100 * 상각비계산개월수 / 12 (2025.09.24 CYY 방식)
                BigDecimal base = BigDecimal.valueOf(bookAmt + tax - acm + nz(r.depnCost()));
                depnCost = base.multiply(BigDecimal.valueOf(r.depnRate()))
                        .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                        .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(monthDiff))
                        .setScale(0, RoundingMode.HALF_UP)
                        .longValue();
                if ((bookAmt + tax - (acm + depnCost)) <= 1000) {
                    depnCost = bookAmt - acm;   // AS-IS 그대로 불공제세액을 빼지 않는다
                    if (depnCost > 1000) depnCost = depnCost - 1000;
                }
            }
        }
        return depnCost;
    }

    /**
     * updateDepnCost — 처리한 감가상각비를 고친다: 거래금액 → 비품원장 취소(C)·재생성(P) → 분개 재생성.
     * (AS-IS는 클라이언트가 열기 전에 checkClose만 한다 — 서버는 그대로)
     */
    @Transactional
    public void updateDepnCost(UserPrincipal user, Long trId, Long depnCost) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        if (mapper.updateAmt(companyId, trId, depnCost, personId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        String msg = mapper.createDepnBook("C", trId);
        if (!"Y".equals(msg)) throw invalid(msg);
        msg = mapper.createDepnBook("P", trId);
        if (!"Y".equals(msg)) throw invalid(msg);
        String jnlMsg = journalMapper.createJournal("P", companyId, personId, TR_CODE, trId, true);
        if (!"Y".equals(jnlMsg)) throw invalid(jnlMsg);
    }

    /** ast16_non_deduct_tax.selectByPurTrId */
    public List<NonDeductTaxRes> searchNonDeductTaxes(Long purTrId) {
        return mapper.selectNonDeductTaxes(purTrId);
    }

    /** Ast16_NonDeductTax.update — 새 행(ID 비었거나 0 이하)은 새 ID로 넣고 요청과 같은 순서로 ID를 돌려준다 */
    @Transactional
    public List<Long> saveNonDeductTaxes(List<NonDeductTaxSaveReq.Row> rows) {
        return rows.stream().map(r -> {
            if (r.nonDeductTaxId() == null || r.nonDeductTaxId() <= 0) {
                long id = mapper.selectNextId();
                mapper.insertNonDeductTax(id, r);
                return id;
            }
            mapper.updateNonDeductTax(r);
            return r.nonDeductTaxId();
        }).toList();
    }

    /** Ast16_NonDeductTax.delete */
    @Transactional
    public int deleteNonDeductTaxes(List<Long> ids) {
        return ids.isEmpty() ? 0 : mapper.deleteNonDeductTaxes(ids);
    }

    private static long nz(Long v) {
        return v == null ? 0L : v;
    }

    private static BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}

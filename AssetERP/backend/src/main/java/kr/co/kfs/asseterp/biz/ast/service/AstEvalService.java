package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.mapper.ActJournalMapper;
import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.EvalItemReq;
import kr.co.kfs.asseterp.biz.ast.dto.EvalRdReq;
import kr.co.kfs.asseterp.biz.ast.dto.EvalRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstEvalMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

/**
 * AS-IS server/ast/Ast06_Tr.java (selectEvalList L121 · updateEval L920) · Sys99_Print.insertRdEvalFinance L1807 — 금융상품 평가처리 Ast06_Tab_EvalFinance (W09).
 * 처리(P)는 평가 거래(ast06_tr·ast08_tr_finance)를 만들고 보유원장·평가분개·익일 반제분개를 만든다. 취소(C)는 되돌리고 거래를 지운다. 한 트랜잭션
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstEvalService {

    /** AS-IS Sys99_Print 호출 때 화면 클래스명으로 "Ast13_Tab_DepnBook"을 넘긴다(원본 그대로, 이상한점 #125) */
    private static final String RD_WINDOW_CLASS_NAME = "Ast13_Tab_DepnBook";

    private final AstEvalMapper mapper;
    private final ActJournalMapper journalMapper;
    private final ActJournalService journalService;

    /**
     * ast06_tr.selectEvalList — 자산구분 1(고유자산) 고정, 국내외 조건 없음. evalType 1(시가평가)·2(이자평가).
     * 아직 평가하지 않은 줄의 거래ID를 SQL 안의 f_create_seq()가 만든다 — 이 함수는 시퀀스(nextval)를 쓰므로 읽기 전용 트랜잭션에서는
     * 예외를 삼키고 NULL을 돌려준다. 그래서 조회지만 쓰기 가능 트랜잭션으로 둔다
     */
    @Transactional(readOnly = false)
    public List<EvalRes> search(UserPrincipal user, LocalDate closeDate, Long corpId, Long accountId, Long classTreeId,
                                String searchText, String evalType) {
        return mapper.selectEvalList(user.getCompanyId(), closeDate, zeroToNull(classTreeId), zeroToNull(accountId),
                zeroToNull(corpId), "1", "%" + nz(searchText) + "%", blankToNull(evalType), null);
    }

    /** 회사의 자산평가 주기 — 'W'면 평가일자(주별), 아니면 평가년월(월별) 칸을 보여 준다(AS-IS LoginUser.getCompanyModel().getAstEvalCycleCode()) */
    public String evalCycle(UserPrincipal user) {
        return mapper.selectEvalCycle(user.getCompanyId());
    }

    /** sys.Sys12_Calendar.selectBizDate2(companyId 0, stdDate, "-0", chkYn true) — 시세입력 창의 기준일, yyyy-MM-dd */
    public String priceDate(LocalDate stdDate) {
        return mapper.selectBizDate2(stdDate);
    }

    /** updateEval(procType P) — 처리한 줄을 다시 읽어 돌려준다(AS-IS는 ast06_tr.selectById로 읽어 그리드 행을 바꾼다) */
    @Transactional
    public List<EvalRes> process(UserPrincipal user, List<EvalItemReq> items) {
        Long companyId = user.getCompanyId();
        journalService.checkClose(companyId, items.get(0).date());   // 클라이언트 checkClose(첫 선택 행 일자)

        // 거래내역 생성
        for (EvalItemReq r : items) {
            long amt = r.amt() == null ? 0L : r.amt();
            double forAmt;
            double fxRate;
            boolean interest = "2".equals(r.evalType());
            if (interest || "KRW".equals(r.curCode())) {
                forAmt = (double) amt;
                fxRate = 1d;
            } else {
                if (r.forAmt() == null || r.forAmt() == 0d) throw invalid("외화금액이 없습니다.");
                forAmt = r.forAmt();
                fxRate = amt / forAmt;
            }
            if (mapper.existsTr(r.trId()) > 0) {
                mapper.updateTr(r, companyId, user.getUserId(), amt, forAmt, fxRate);
            } else {
                mapper.insertTr(r, companyId, user.getUserId(), amt, forAmt, fxRate);
            }

            double price;
            long pl;
            double forPl;
            if (interest) {
                price = 1.0;
                pl = amt;
                forPl = forAmt;
            } else {
                // price = (평가금액 / 보유수량) * 거래단위 (보유수량 0이면 AS-IS도 Infinity)
                price = ((double) amt / nz(r.qty())) * (double) (r.trUnit() == null ? 1L : r.trUnit());
                pl = amt - (r.bookAmt() == null ? 0L : r.bookAmt());
                forPl = forAmt - nz(r.forBookAmt());
            }
            if (r.trFinanceId() == null) {
                mapper.insertFinance(mapper.selectNextId(), r, price, amt, pl, forAmt, forPl);
            } else {
                mapper.updateFinance(r.trFinanceId(), r, price, amt, pl, forAmt, forPl);
            }
        }

        // 금융자산 보유원장 반영, 분개생성 (익일 반제분개도 같이)
        for (EvalItemReq r : items) {
            clearJournals(companyId, r);
            try {
                String msg = mapper.createFinanceBook("P", r.trId());
                if (!"Y".equals(msg)) throw invalid(msg);

                String jnlMsg = journalMapper.createJournal("P", companyId, user.getUserId(), r.trCode(), r.trId(), true);
                // AS-IS는 이 실패 때 앞의 원장 결과(resultMsg = "Y")를 메시지로 돌려준다(이상한점 #126) — TOBE는 분개 결과 메시지를 쓴다
                if (!"Y".equals(jnlMsg)) throw invalid(jnlMsg);

                String backMsg = mapper.createBackJournal(r.trId());
                if (!"Y".equals(backMsg)) throw invalid(backMsg);

                // 말일이면 마감원장 생성
                if (r.date().equals(mapper.selectLastDay(r.date()))) {
                    mapper.insertBookClose(companyId, r.astClassTreeId(), r.accountId(), r.date());
                }
            } catch (BusinessException e) {
                throw e;
            } catch (RuntimeException e) {
                log.warn("평가처리 중 DB 오류", e);
                throw invalid("update fail : \n" + e.getMessage()).causedBy(e);
            }
        }

        // 처리한 줄을 다시 읽는다
        Set<Long> ids = items.stream().map(EvalItemReq::trId).collect(Collectors.toSet());
        Set<LocalDate> dates = new TreeSet<>(items.stream().map(EvalItemReq::date).toList());
        List<EvalRes> result = new ArrayList<>();
        for (LocalDate d : dates) {
            for (EvalRes e : mapper.selectEvalList(companyId, d, null, null, null, "1", "%", null, null)) {
                if (ids.contains(e.trId())) result.add(e);
            }
        }
        return result;
    }

    /** updateEval(procType C) — 원장을 되돌리고 평가 거래를 지운다 */
    @Transactional
    public void cancel(UserPrincipal user, List<EvalItemReq> items) {
        Long companyId = user.getCompanyId();
        journalService.checkClose(companyId, items.get(0).date());
        for (EvalItemReq r : items) {
            clearJournals(companyId, r);
            try {
                String msg = mapper.createFinanceBook("C", r.trId());
                if (!"Y".equals(msg)) throw invalid(msg);
            } catch (BusinessException e) {
                throw e;
            } catch (RuntimeException e) {
                log.warn("평가취소 중 DB 오류", e);
                throw invalid("update fail : \n" + e.getMessage()).causedBy(e);
            }
        }
        for (EvalItemReq r : items) {
            mapper.deleteFinanceByTrId(r.trId());
            mapper.deleteTr(r.trId());
        }
    }

    /**
     * sys.Sys99_Print.insertRdEvalFinance — 현재 조건의 목록을 sys99_print에 넣고 출력그룹ID를 돌려준다
     * (RD 뷰어 mrd Ast06_Rd_EvalFinance가 rdGroupId로 읽는다)
     */
    @Transactional
    public Long insertRd(UserPrincipal user, EvalRdReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, RD_WINDOW_CLASS_NAME);
        List<EvalRes> list = mapper.selectEvalList(companyId, req.closeDate(), zeroToNull(req.classTreeId()), zeroToNull(req.accountId()),
                zeroToNull(req.corpId()), "1", "%" + nz(req.searchText()) + "%", blankToNull(req.evalType()), null);
        for (EvalRes r : list) {
            mapper.insertPrint(mapper.selectNextId(), companyId, personId, RD_WINDOW_CLASS_NAME, groupId, r, r.pl() == null ? 0L : r.pl());
        }
        return groupId;
    }

    /** 기존 평가분개 → 익일 반제분개 → 익일 반제거래 → 마감원장 순으로 정리(P·C 공통, AS-IS updateEval L977-1030) */
    private void clearJournals(Long companyId, EvalItemReq r) {
        if (mapper.countFixedJournalByTrId(r.trId()) > 0) throw invalid("기존 평가분개 정리실패. 승인완료 전표입니다.");
        if (mapper.countFixedJournalByOrgTrId(r.trId()) > 0) throw invalid("익일 반제분개 및 반제거래 정리실패. 승인완료 전표입니다.");

        mapper.deleteJournalDtlByTrId(r.trId());
        mapper.deleteJournalTmpByTrId(r.trId());
        mapper.deleteJournalByTrId(r.trId());

        mapper.deleteBackJournalDtl(companyId, r.astClassTreeId(), r.accountId(), r.date());
        mapper.deleteBackJournal(companyId, r.astClassTreeId(), r.accountId(), r.date());

        Long backTrId = mapper.selectBackTrId(companyId, r.astClassTreeId(), r.accountId(), r.date());
        if (backTrId != null) {
            // AS-IS는 ast08_tr_finance.deleteByTrId에 금융상세ID를 넘겨 실제로는 아무것도 지우지 않는다(이상한점 #127) — 같게 둔다
            mapper.deleteTr(backTrId);
        }
        mapper.deleteBookClose(companyId, r.astClassTreeId(), r.accountId(), r.date());
    }

    private static Long zeroToNull(Long v) {
        return v == null || v == 0L ? null : v;
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s;
    }

    private static String nz(String s) {
        return s == null ? "" : s;
    }

    private static double nz(Double d) {
        return d == null ? 0d : d;
    }

    private static BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}

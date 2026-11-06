package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.FxEvalItemReq;
import kr.co.kfs.asseterp.biz.ast.dto.FxEvalRdReq;
import kr.co.kfs.asseterp.biz.ast.dto.FxEvalRes;
import kr.co.kfs.asseterp.biz.ast.dto.FxEvalSearchCond;
import kr.co.kfs.asseterp.biz.ast.dto.FxRateRes;
import kr.co.kfs.asseterp.biz.ast.dto.FxRateSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstEvalMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstFxEvalMapper;
import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 외화예금 환평가처리 Ast06_Tab_FxEvalDeposit (X12) — AS-IS Ast06_Tr.selectFxEvalList(L152) · updateFxEval(L1142) · Sys99_Print.insertRdFxEvalDeposit(L1911) · Ast24_FxRate.
 * 처리(P)는 환평가 거래(ast06_tr 3700)를 만들고 평가분개·익일 반제분개(3701)·예금원장 환산손익을 만든다. 취소(C)는 되돌리고 거래를 지운다. 한 트랜잭션
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstFxEvalService {

    private static final String RD_WINDOW_CLASS_NAME = "Ast06_Tab_FxEvalDeposit";
    private static final String FX_RATE_TYPE = "01";   // 평가환율

    private final AstFxEvalMapper mapper;
    private final AstEvalMapper evalMapper;
    private final ActJournalService journalService;

    /** ast06_tr.selectFxEvalList (assetType "1" 고정) */
    public List<FxEvalRes> search(UserPrincipal user, LocalDate closeDate, Long corpId, Long accountId) {
        return mapper.selectFxEvalList(new FxEvalSearchCond(user.getCompanyId(), closeDate, zeroToNull(accountId), zeroToNull(corpId), "1"));
    }

    /** 평가처리(P) — 클라이언트의 미래일·평가완료·환율 검사와 회계마감 검사(첫 행 일자)를 서버에서도 한다 */
    @Transactional
    public void process(UserPrincipal user, List<FxEvalItemReq> items) {
        validate(items);
        LocalDate evalDate = items.get(0).date();
        if (evalDate.isAfter(LocalDate.now())) throw invalid("평가일이 미래일입니다.");
        for (FxEvalItemReq r : items) {
            if ("평가".equals(r.evalYnName())) throw invalid("선택한 내역중 평가완료된 내역이 존재합니다.");
            if (r.fxRate() == null || r.fxRate() == 0) throw invalid("평가환율을 입력해주세요.");
        }
        journalService.checkClose(user.getCompanyId(), evalDate);
        updateFxEval(user, items, "P");
    }

    /** 평가취소(C) */
    @Transactional
    public void cancel(UserPrincipal user, List<FxEvalItemReq> items) {
        validate(items);
        for (FxEvalItemReq r : items) {
            if (!"평가".equals(r.evalYnName())) throw invalid("선택한 내역중 미평가 내역이 존재합니다.");
        }
        journalService.checkClose(user.getCompanyId(), items.get(0).date());
        updateFxEval(user, items, "C");
    }

    /** ast.Ast06_Tr.updateFxEval */
    private void updateFxEval(UserPrincipal user, List<FxEvalItemReq> items, String procType) {
        Long companyId = user.getCompanyId();
        // 기준일 이후 환평가 여부 체크
        for (FxEvalItemReq r : items) {
            if (mapper.countFxEvalAfter(companyId, r.astClassTreeId(), r.date()) > 0)
                throw invalid("처리일 이후 환평가내역이 존재합니다. 취소 후 진행하세요");
        }

        // 거래내역(ast06) 생성 — 평가손익 = (long)(외화잔고 × 평가환율) − 원화잔고
        List<Long> amts = new ArrayList<>();
        for (FxEvalItemReq r : items) {
            long evalAmt = (long) (nz(r.forAmt()) * nz(r.fxRate()));
            long amt = evalAmt - (r.depositBookAmt() == null ? 0 : r.depositBookAmt());
            amts.add(amt);
            if ("P".equals(procType)) mapper.insertFxTr(companyId, user.getUserId(), amt, r);
        }

        // 보유원장 반영, 분개생성(익일 반제분개도 같이 생성)
        for (int i = 0; i < items.size(); i++) {
            FxEvalItemReq r = items.get(i);
            Long trId = r.trId();
            if (evalMapper.countFixedJournalByTrId(trId) > 0) throw invalid("기존 평가분개 정리실패. 승인완료 전표입니다.");
            if (evalMapper.countFixedJournalByOrgTrId(trId) > 0) throw invalid("익일 반제분개 및 반제거래 정리실패. 승인완료 전표입니다.");

            // 기존 평가분개 정리
            evalMapper.deleteJournalDtlByTrId(trId);
            evalMapper.deleteJournalTmpByTrId(trId);
            evalMapper.deleteJournalByTrId(trId);

            // 기존 익일 반제분개 및 반제거래 정리
            mapper.deleteDepositBackJournalDtl(companyId, r.astClassTreeId(), r.date());
            mapper.deleteDepositBackJournal(companyId, r.astClassTreeId(), r.date());
            Long backTrId = mapper.selectDepositBackTrId(companyId, r.astClassTreeId(), r.date());
            if (backTrId != null) evalMapper.deleteTr(backTrId);

            if ("P".equals(procType)) {
                journalService.createJournal(user, trId, r.trCode() == null ? "3700" : r.trCode(), "P", true);
                String backMsg;
                try {
                    backMsg = evalMapper.createBackJournal(trId);
                } catch (RuntimeException e) {
                    throw invalid("update fail : \n" + e.getMessage()).causedBy(e);
                }
                if (!"Y".equals(backMsg)) throw invalid(backMsg);
            }

            // 당일원장유무 체크 → 없으면 직전 원장을 복사해 만들고, 있으면 환산손익 UPDATE
            long amt = amts.get(i);
            if (mapper.countBook(companyId, r.astClassTreeId(), r.astClassTreeId(), r.date()) == 0) {
                if (mapper.insertBookFromTarget(companyId, r.astClassTreeId(), r.astClassTreeId(), r.date(), amt) == 0)
                    throw invalid("평가일 기준 보유원장을 찾을 수 없습니다.");
            } else {
                mapper.updateFxPl(companyId, r.date(), r.astClassTreeId(), "P".equals(procType) ? amt : 0);
            }
        }

        // 취소는 거래정보(ast06) delete
        if ("C".equals(procType)) {
            for (FxEvalItemReq r : items) evalMapper.deleteTr(r.trId());
        }
    }

    /** sys.Sys99_Print.insertRdFxEvalDeposit — 현재 조건의 목록을 sys99_print에 넣고 출력그룹ID를 돌려준다(mrd Ast06_Rd_FxEvalDeposit) */
    @Transactional
    public Long insertRd(UserPrincipal user, FxEvalRdReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        evalMapper.deletePrint(companyId, personId, RD_WINDOW_CLASS_NAME);
        List<FxEvalRes> list = mapper.selectFxEvalList(new FxEvalSearchCond(companyId, req.closeDate(), null, zeroToNull(req.corpId()), "1"));
        // AS-IS는 keepAccountId가 아니라 accountId를 SQL에 넘기지 않는다(param "accountId"는 SQL이 쓰지 않음) — 조회와 달리 계좌 조건이 없다
        for (FxEvalRes r : list) {
            mapper.insertPrint(mapper.selectNextId(), companyId, personId, RD_WINDOW_CLASS_NAME, groupId, r);
        }
        return groupId;
    }

    // ---- 환율입력 Ast24_Lookup_FxRate

    /** ast24_fx_rate.selectByStdDate (fxRateType 01) — curCode "%"는 전체 */
    public List<FxRateRes> searchFxRates(UserPrincipal user, LocalDate stdDate, String curCode) {
        return mapper.selectFxRates(user.getCompanyId(), stdDate, FX_RATE_TYPE, curCode == null || curCode.isBlank() ? "%" : curCode);
    }

    /** ast.Ast24_FxRate.update — fxRateId 0 이하는 새 행. 저장한 행을 요청 순서대로 돌려준다 */
    @Transactional
    public List<FxRateRes> saveFxRates(UserPrincipal user, List<FxRateSaveReq.Item> items) {
        List<FxRateRes> out = new ArrayList<>();
        if (items == null) return out;
        for (FxRateSaveReq.Item r : items) {
            Long id = r.fxRateId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertFxRate(id, user.getCompanyId(), FX_RATE_TYPE, r);
            } else if (mapper.updateFxRate(user.getCompanyId(), r) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            out.add(mapper.selectFxRateById(user.getCompanyId(), id));
        }
        return out;
    }

    /** ast.Ast24_FxRate.delete */
    @Transactional
    public int deleteFxRates(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        return mapper.deleteFxRates(user.getCompanyId(), ids);
    }

    private void validate(List<FxEvalItemReq> items) {
        if (items == null || items.isEmpty()) throw invalid("선택된 내역이 없습니다.");
        for (FxEvalItemReq r : items) {
            if (r.trId() == null || r.astClassTreeId() == null || r.date() == null) throw invalid("평가 대상이 올바르지 않습니다.");
        }
    }

    private Long zeroToNull(Long v) {
        return v == null || v == 0 ? null : v;
    }

    private double nz(Double d) {
        return d == null ? 0 : d;
    }

    private BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}

package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseItemReq;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseRdReq;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseSearchCond;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeFundSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstEvalMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstFundFeeCloseMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 펀드보수 결산처리 Ast30_Tab_OfficeMngFeeClose (X13) — AS-IS Ast30_BookFundFee.selectEvalFundFee(L72) · updateEvalFundFee(L88) · reprocFundFee(L301) · selectByCorpId(L48) · update(L387)
 * · Sys99_Print.insertRdOfficeMngFeeClose(L1865) · Act04_GenLedger.checkClose.
 * 결산처리(P)는 펀드보수 미수처리 거래(9910/9920)와 분개·반제분개를 만들고 보수원장을 결산원장으로 옮긴다. 취소(C)는 되돌린다.
 * AS-IS는 행마다 commit하지만 TOBE는 한 트랜잭션이라 중간에 실패하면 앞 행도 함께 되돌아간다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstFundFeeCloseService {

    private static final String RD_WINDOW_CLASS_NAME = "Ast30_Tab_OfficeMngFeeClose";

    private final AstFundFeeCloseMapper mapper;
    private final AstEvalMapper evalMapper;
    private final ActJournalService journalService;

    /** ast30_book_fund_fee.selectEvalFundFee — corpId null은 전체("%") */
    public List<FundFeeCloseRes> search(UserPrincipal user, LocalDate holdDate, Long corpId, String searchText) {
        return mapper.selectEvalFundFee(cond(user.getCompanyId(), holdDate, corpId, searchText));
    }

    /** 결산처리(P) — 미래일 검사와 회계마감 검사(첫 행 일자)를 AS-IS preCheck처럼 먼저 한다 */
    @Transactional
    public void process(UserPrincipal user, List<FundFeeCloseItemReq> items) {
        preCheck(user, items);
        updateEvalFundFee(user, items, "P");
    }

    /** 결산취소(C) */
    @Transactional
    public void cancel(UserPrincipal user, List<FundFeeCloseItemReq> items) {
        preCheck(user, items);
        updateEvalFundFee(user, items, "C");
    }

    /** preCheck() L332-408: 선택 없음 · 결산일 미래일 · 회계마감 */
    private void preCheck(UserPrincipal user, List<FundFeeCloseItemReq> items) {
        if (items == null || items.isEmpty()) throw invalid("처리대상을 선택해주세요.");
        for (FundFeeCloseItemReq r : items) {
            if (r.holdDate() == null || r.astClassTreeId() == null || r.curCode() == null) throw invalid("처리 대상이 올바르지 않습니다.");
        }
        LocalDate checkDate = items.get(0).holdDate();
        if (checkDate.isAfter(LocalDate.now())) throw invalid("결산일이 미래일입니다.");
        journalService.checkClose(user.getCompanyId(), checkDate);
    }

    /** ast.Ast30_BookFundFee.updateEvalFundFee */
    private void updateEvalFundFee(UserPrincipal user, List<FundFeeCloseItemReq> items, String procType) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        LocalDate actCloseDate = mapper.selectAccountCloseDate(companyId, items.get(0).holdDate());

        for (FundFeeCloseItemReq r : items) {
            if ("P".equals(procType)) {
                if ("결산".equals(r.closeYnName())) throw invalid("결산처리가 완료된 내역이 존재합니다. 확인해주세요");
                processItem(user, companyId, personId, actCloseDate, r);
            } else {
                if (r.closeYnName() == null || r.closeYnName().isEmpty()) throw invalid("결산처리 전 내역이 존재합니다. 확인해주세요");
                cancelItem(companyId, r);
            }
            // 결산일 이후 원장정리(결산일+1일 ~ 현재)
            createFundFeeBook2(companyId, r);
        }
    }

    private void processItem(UserPrincipal user, Long companyId, Long personId, LocalDate actCloseDate, FundFeeCloseItemReq r) {
        // 거래생성 — KRW는 환율 1·금액=보수, 외화는 환율 필수·계약금액=(long)(외화보수×환율)
        double fxRate;
        long amt = nz(r.fee());
        long contAmt;
        if ("KRW".equals(r.curCode())) {
            fxRate = 1.0;
            contAmt = amt;
        } else {
            if (r.fxRate() == null || r.fxRate() <= 0) throw invalid("환율을 입력해주세요");
            fxRate = r.fxRate();
            contAmt = (long) (nz(r.forFee()) * fxRate);
        }
        long trId = mapper.selectNextId();
        mapper.insertTr(trId, companyId, personId, r, fxRate, amt, contAmt);

        // 분개생성, 반제거래 및 분개 생성(연결산시에도 반제한다 — 2023.04.24 AS-IS 변경)
        journalService.createJournal(user, trId, r.trCode(), "P", true);
        String backMsg = evalMapper.createBackJournal(trId);
        if (!"Y".equals(backMsg)) throw invalid(backMsg);

        // 복구용 보수원장 → (결산일이면) 확정미수보수 → 보수 결산원장
        mapper.insertBookFundFeeRecovery(companyId, r.holdDate(), r.curCode(), r.astClassTreeId(), r.corpId());
        if (r.holdDate().equals(actCloseDate)) mapper.updateFixFee(companyId, r.holdDate(), r.curCode(), r.astClassTreeId(), r.corpId());
        mapper.insertBookFundFeeClose(companyId, trId, r.holdDate(), r.curCode(), r.astClassTreeId(), r.corpId());
    }

    private void cancelItem(Long companyId, FundFeeCloseItemReq r) {
        Long trId = r.trId();
        if (trId == null) throw invalid("결산처리 전 내역이 존재합니다. 확인해주세요");

        // 보수원장 복구 → 보수결산원장·복구원장 삭제
        mapper.deleteBookFundFeeByTrId(trId);
        mapper.insertBookFundFeeByTrId(trId);
        mapper.deleteBookFundFeeRecoveryByTrId(trId);
        mapper.deleteBookFundFeeCloseByTrId(trId);

        // 분개 삭제 — 승인완료 전표 체크
        if (evalMapper.countFixedJournalByTrId(trId) > 0) throw invalid("승인완료 전표가 존재합니다");
        if (evalMapper.countFixedJournalByOrgTrId(trId) > 0) throw invalid("승인완료 전표가 존재합니다(반제분개도 취소하셨나요?)");

        // 미수반제 분개&거래 삭제
        mapper.deleteBackJournalTmpByOrgTrId(trId);
        mapper.deleteBackJournalDtlByOrgTrId(trId);
        mapper.deleteBackJournalByOrgTrId(trId);
        mapper.deleteTrByOrgTrId(trId);

        // 미수 분개&거래 삭제
        evalMapper.deleteJournalTmpByTrId(trId);
        evalMapper.deleteJournalDtlByTrId(trId);
        evalMapper.deleteJournalByTrId(trId);
        evalMapper.deleteTr(trId);
    }

    private void createFundFeeBook2(Long companyId, FundFeeCloseItemReq r) {
        String msg = mapper.createFundFeeBook2(companyId, r.holdDate().plusDays(1), r.corpId());
        if (!"Y".equals(msg)) throw invalid(msg);
    }

    /** ast.Ast30_BookFundFee.reprocFundFee — 연결산일의 다음날부터 보수원장을 다시 만든다 */
    @Transactional
    public void reprocFundFee(UserPrincipal user, LocalDate closeDate) {
        if (closeDate == null) throw invalid("결산일자를 확인하세요.");
        Long companyId = user.getCompanyId();
        // 작업종료일 = 오늘 − 1일. 결산일이 오늘 이후면 대상이 아니다(AS-IS: closeDate >= 작업종료일 시각이면 실패 = 어제까지만 가능)
        if (!closeDate.isBefore(LocalDate.now())) throw invalid("재작업 대상일(결산일+1일 이후)이 아닙니다.");

        LocalDate yearCloseDate = mapper.selectYearCloseDate(companyId, String.valueOf(closeDate.getYear()));
        if (!closeDate.equals(yearCloseDate)) throw invalid("연결산일에만 재작업이 가능합니다.");

        String msg = mapper.createFundFeeBook(companyId, closeDate.plusDays(1));
        if (!"Y".equals(msg)) throw invalid(msg);
    }

    /** sys.Sys99_Print.insertRdOfficeMngFeeClose — 현재 조건의 목록을 sys99_print에 넣고 출력그룹ID를 돌려준다(mrd Ast30_Rd_OfficeMngFeeClose) */
    @Transactional
    public Long insertRd(UserPrincipal user, FundFeeCloseRdReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        evalMapper.deletePrint(companyId, personId, RD_WINDOW_CLASS_NAME);
        for (FundFeeCloseRes r : mapper.selectEvalFundFee(cond(companyId, req.holdDate(), req.corpId(), req.searchText()))) {
            mapper.insertPrint(mapper.selectNextId(), companyId, personId, RD_WINDOW_CLASS_NAME, groupId, r);
        }
        return groupId;
    }

    // ---- 환율 및 펀드보수 변경 Ast30_Lookup_FeeClose

    /** ast30_book_fund_fee.selectByCorpId — 검색어는 서버가 "%…%"로 감싼다 */
    public List<FundFeeFundRes> searchFunds(UserPrincipal user, LocalDate holdDate, Long corpId, String curCode, String searchText) {
        return mapper.selectByCorpId(user.getCompanyId(), holdDate, corpId, curCode, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** ast.Ast30_BookFundFee.update — KRW는 외화 누적보수를 누적보수와 같게 한다. 이미 결산한 펀드는 AS-IS 화면 검사(결산여부)를 서버에서도 막는다 */
    @Transactional
    public int saveFunds(UserPrincipal user, FundFeeFundSaveReq req) {
        if (req.items() == null || req.items().isEmpty()) throw invalid("변경된 내역이 없습니다.");
        Long companyId = user.getCompanyId();
        int count = 0;
        for (FundFeeFundSaveReq.Item it : req.items()) {
            if (it.bookFundFeeId() == null) throw invalid("저장 대상이 올바르지 않습니다.");
            if (mapper.countClosedBook(companyId, it.bookFundFeeId()) > 0) throw invalid("결산처리가 완료되었습니다. 취소 후 저장하세요");
            FundFeeFundSaveReq.Item row = "KRW".equals(req.curCode())
                    ? new FundFeeFundSaveReq.Item(it.bookFundFeeId(), it.fee(), it.fee() == null ? null : (double) it.fee(), it.fxRate())
                    : it;
            if (mapper.updateFundFee(companyId, row) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            count++;
        }
        return count;
    }

    private FundFeeCloseSearchCond cond(Long companyId, LocalDate holdDate, Long corpId, String searchText) {
        return new FundFeeCloseSearchCond(companyId, holdDate, corpId == null || corpId == 0 ? "%" : String.valueOf(corpId), searchText);
    }

    private long nz(Long v) {
        return v == null ? 0 : v;
    }

    private double nz(Double v) {
        return v == null ? 0 : v;
    }

    private BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}

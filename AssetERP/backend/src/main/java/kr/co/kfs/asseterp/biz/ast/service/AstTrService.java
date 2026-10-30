package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.AstClassCodeRes;
import kr.co.kfs.asseterp.biz.ast.dto.Tr4InsureLedgerRes;
import kr.co.kfs.asseterp.biz.ast.dto.Tr4InsureSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrTaxLedgerRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrTaxSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/ast/Ast06_Tr.java (selectTaxTr L115 · selectById L32 · updateTax L439 · update4Insure L465 · updateApprId L1304 · delete L1313)
 * · Ast20_TrTax.selectGenLedgerTax L21 · Ast21_Tr4Insure.selectGenLedgerInsure L33 — 세금/4대보험 등록 U04
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstTrService {

    private final AstTrMapper mapper;
    private final ActJournalService journalService;

    /** ast06_tr.selectTaxTr — trCode 없으면 '%' */
    public List<TrRes> searchTaxTrs(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String trCode) {
        return mapper.selectTaxTr(user.getCompanyId(), startDate, closeDate, trCode == null || trCode.isEmpty() ? "%" : trCode);
    }

    /** ast06_tr.selectById */
    public TrRes getTr(UserPrincipal user, Long trId) {
        TrRes tr = mapper.selectById(user.getCompanyId(), trId);
        if (tr == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return tr;
    }

    public TrTaxLedgerRes getGenLedgerTax(UserPrincipal user, LocalDate date, String trCode) {
        return mapper.selectGenLedgerTax(user.getCompanyId(), date, trCode);
    }

    public Tr4InsureLedgerRes getGenLedgerInsure(UserPrincipal user, LocalDate date) {
        return mapper.selectGenLedgerInsure(user.getCompanyId(), date);
    }

    /** Ast06_Tr.updateTax — ast06_tr 반영 뒤 ast20_tr_tax 반영(상세 행이 없으면 새 ID). 저장한 거래ID를 돌려준다 */
    @Transactional
    public Long saveTax(UserPrincipal user, TrTaxSaveReq r) {
        Long trId = saveTr(user, r.trId(), r.date(), r.trCode(), r.amt(), null, r.settleMngYn(), r.note(), r.depositId(), null);
        Long taxId = mapper.selectTaxId(trId);
        if (taxId == null) {
            mapper.insertTax(mapper.selectNextId(), trId, r);
        } else {
            mapper.updateTax(taxId, r);
        }
        return trId;
    }

    /** Ast06_Tr.update4Insure — 금액은 네 보험 납부금액의 합(contAmt도 같은 값) */
    @Transactional
    public Long save4Insure(UserPrincipal user, Tr4InsureSaveReq r) {
        Long settleAmt = r.settleAmt() == null ? 0L : r.settleAmt();
        Long trId = saveTr(user, r.trId(), r.date(), r.trCode(), settleAmt, settleAmt, r.settleMngYn(), r.note(), r.depositId(), r.astClassTreeId());
        Long insureId = mapper.select4InsureId(trId);
        if (insureId == null) {
            mapper.insert4Insure(mapper.selectNextId(), trId, r);
        } else {
            mapper.update4Insure(insureId, r);
        }
        return trId;
    }

    private Long saveTr(UserPrincipal user, Long trId, LocalDate date, String trCode, Long amt, Long contAmt,
                        boolean settleMngYn, String note, Long depositId, Long astClassTreeId) {
        if (!settleMngYn && depositId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.");
        }
        if (trId == null) {
            long newId = mapper.selectNextId();
            mapper.insertTr(newId, user.getCompanyId(), user.getUserId(), date, trCode, amt, contAmt, settleMngYn, note, depositId, astClassTreeId);
            return newId;
        }
        if (mapper.updateTr(user.getCompanyId(), trId, amt, contAmt, settleMngYn, note, depositId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return trId;
    }

    /** ast06_tr.updateApprId */
    @Transactional
    public void updateApprId(UserPrincipal user, Long trId, Long apprId) {
        if (mapper.updateApprId(user.getCompanyId(), trId, apprId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
    }

    /**
     * Ast06_Tr.delete — 먼저 거래일마다 회계마감 검사(Act04_GenLedger.checkClose), 거래마다: 비품원장 되돌리기(자산분류가 50·55·952002일 때, 거래를 지우기 전에)
     * → 세금·4대보험 상세 → 확정 전표가 있으면 "승인완료 전표입니다." → 분개 임시·상세·분개 → 연결문서 → 결제내역, 마지막에 거래. 한 건이라도 실패하면 전부 되돌린다.
     * 금융자산 원장(ast09_book.createFinanceBook)은 AS-IS도 selectTaxTr가 금융 상세를 안 읽어 항상 건너뛰므로 만들지 않았다
     */
    @Transactional
    public void delete(UserPrincipal user, List<Long> trIds) {
        Long companyId = user.getCompanyId();
        for (Long trId : trIds) {
            TrRes tr = mapper.selectById(companyId, trId);
            if (tr == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            journalService.checkClose(companyId, tr.date());
        }
        for (Long trId : trIds) {
            Long astClassTreeId = mapper.selectAstClassTreeId(companyId, trId);
            if (astClassTreeId != null) {
                AstClassCodeRes codes = mapper.selectClassCodes(astClassTreeId);
                if (codes != null && ("50".equals(codes.itemLClassCode()) || "55".equals(codes.itemLClassCode())
                        || "952002".equals(codes.itemSClassCode()))) {
                    String msg = mapper.createDepnBook("C", trId);
                    if (!"Y".equals(msg)) throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
                }
            }
            mapper.deleteTaxByTrId(trId);
            mapper.delete4InsureByTrId(trId);
            if (mapper.countFixedJournalByTrId(trId) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "승인완료 전표입니다.");
            }
            mapper.deleteJournalTmpByTrId(trId);
            mapper.deleteJournalDtlByTrId(trId);
            mapper.deleteJournalByTrId(trId);
            mapper.deleteRelateApprByTrId(trId);
            mapper.deleteSettleByTrId(trId);
            mapper.deleteTr(companyId, trId);
        }
    }
}

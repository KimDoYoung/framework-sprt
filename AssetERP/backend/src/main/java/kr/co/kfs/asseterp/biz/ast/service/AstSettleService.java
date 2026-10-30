package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.mapper.ActJournalMapper;
import kr.co.kfs.asseterp.biz.ast.dto.SettleAccruedRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleDeleteRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleExpenseRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleHistoryRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleMultiReq;
import kr.co.kfs.asseterp.biz.ast.dto.SettleMultiRowReq;
import kr.co.kfs.asseterp.biz.ast.dto.SettleSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.SettleTrAmtRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstSettleMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * AS-IS server/ast/Ast07_Settle.java (selectByHistoryPaging L44 · update L169 · updateMulti L277 · delete L350) · Ast06_Tr.java (selectByAccrued L174) — U11.
 * 결제 한 건을 만들거나 지우면 분개도 DB 함수(f_create_journal, procType P 생성 / C 삭제)로 같이 만들고 지운다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstSettleService {

    private final AstSettleMapper mapper;
    private final ActJournalMapper journalMapper;
    private final EmpTransInfoService transInfoService;

    private static BusinessException fail(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }

    /** LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
    private Long orgId(UserPrincipal user) {
        return user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
    }

    private static String orAll(String v) {
        return v == null || v.isEmpty() ? "%" : v;
    }

    /** ast.Ast06_Tr.selectByAccrued — Pay50_Tab_ExpenseSettle: 고유자산(1)·국내(1)·지급(02), corpId 0/없음은 전체, 검색어가 없으면 "%" */
    public List<SettleAccruedRes> searchAccrueds(UserPrincipal user, Long corpId, String searchText, String trCode) {
        Long corp = corpId == null || corpId == 0L ? null : corpId;
        return mapper.selectAccrueds(user.getCompanyId(), user.getUserId(), orgId(user), "1", "1", "02", orAll(searchText), orAll(trCode), corp);
    }

    /**
     * ast.Ast07_Settle.selectByHistoryPaging — selectType 1 최근입력순(최대 20건) / 2 조회조건 적용(쪽 나누기) / 3 최근입력순 중 사업비지출(9100) 거래만
     */
    public PageRes<SettleHistoryRes> searchHistory(UserPrincipal user, String assetType, String selectType, String payCode, String trCode,
                                                   String corpId, String searchText, long limit, long offset) {
        Long companyId = user.getCompanyId();
        Long orgId = orgId(user);
        String asset = orAll(assetType);
        if ("2".equals(selectType)) {
            String pay = orAll(payCode), tr = orAll(trCode), corp = orAll(corpId), text = searchText == null ? "" : searchText;
            List<SettleHistoryRes> rows = mapper.selectHistoryPaging(companyId, user.getUserId(), orgId, asset, "1", selectType, pay, tr, corp, text, limit, offset);
            return new PageRes<>(mapper.selectHistoryTotal(companyId, user.getUserId(), orgId, asset, "1", selectType, pay, tr, corp, text), rows);
        }
        List<SettleHistoryRes> rows = mapper.selectHistory(companyId, user.getUserId(), orgId, asset, "1", selectType);
        return new PageRes<>(rows.size(), rows);
    }

    /** pay.Pay50_Expense.selectById 중 결제등록 창이 쓰는 값 (Ast07_Lookup_Settle.openNew9100) */
    public SettleExpenseRes getExpenseInfo(UserPrincipal user, Long expenseId) {
        SettleExpenseRes info = mapper.selectExpenseSettleInfo(user.getCompanyId(), expenseId);
        if (info == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "지출결의서를 찾을 수 없습니다.");
        return info;
    }

    /** ast.Ast07_Settle.update (새 결제) — 결제 insert → 미수/미지급 금액 정리 → 분개 생성. 한 곳이라도 실패하면 모두 되돌린다. 돌려주는 값은 새 결제 ID */
    @Transactional
    public Long createSettle(UserPrincipal user, SettleSaveReq r) {
        Long companyId = user.getCompanyId();
        boolean byExpense = r.expenseId() != null;

        // 원거래내역(지출결의서 또는 거래)
        long orgAmt;
        double orgForAmt;
        Long orgId;
        if (byExpense) {
            SettleExpenseRes e = mapper.selectExpenseSettleInfo(companyId, r.expenseId());
            if (e == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "지출결의서를 찾을 수 없습니다.");
            orgAmt = e.settleAmt();
            orgForAmt = e.settleAmt().doubleValue();
            orgId = e.expenseId();
        } else {
            SettleTrAmtRes t = r.trId() == null ? null : mapper.selectTrAmt(companyId, r.trId());
            if (t == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "거래내역을 찾을 수 없습니다.");
            orgAmt = t.amt();
            orgForAmt = t.forAmt();
            orgId = r.trId();
        }

        // 결제내역 insert (UpdateDataModel)
        long settleId = mapper.selectNextId();
        double forAmt = r.amt().doubleValue();
        mapper.insertSettle(settleId, byExpense ? 0L : r.trId(), r.expenseId(), r.settleDate(), r.settleAmt(), r.note(), r.depositId(), r.trCode(),
                user.getUserId(), r.settleAmt().doubleValue(), 1.0, r.amt(), forAmt);

        // 전표승인여부 체크
        if (mapper.countFixedJournal(settleId) > 0) throw fail("승인완료 전표입니다.");

        // 미수금액 SET
        BigDecimal forAmtSum = mapper.sumForAmt(orgId);
        int cmp = BigDecimal.valueOf(orgForAmt).compareTo(forAmtSum);
        long rcvPayAmt;
        if (cmp == 0) {          // 전액수령
            rcvPayAmt = orgAmt - mapper.selectAmt(settleId);
        } else if (cmp < 0) {    // 미수/미지급금보다 더 많은 금액을 입력함
            throw fail("미수/미지급금액을 확인하여 주십시오. 실제발생분보다 많습니다.");
        } else {                 // 일부수령
            rcvPayAmt = BigDecimal.valueOf(orgAmt).divide(BigDecimal.valueOf(orgForAmt), 10, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(forAmt)).setScale(0, RoundingMode.DOWN).longValue();
        }
        mapper.updateAmt(settleId, rcvPayAmt, forAmt);

        // 분개생성
        createJournal("P", companyId, user.getUserId(), settleId, r.trCode());
        return settleId;
    }

    /** ast.Ast07_Settle.updateMulti (일괄 결제등록) — 행마다 결제 insert + 분개 생성 */
    @Transactional
    public void createSettles(UserPrincipal user, SettleMultiReq req) {
        Long companyId = user.getCompanyId();
        String trCode = null;   // AS-IS는 반복문 밖 변수라 수령/지급 구분이 없는 행은 앞 행의 값을 쓴다
        for (SettleMultiRowReq row : req.rows()) {
            double forSettleAmt = row.accruedAmt() == null ? 0 : row.accruedAmt();
            long settleAmt = (long) forSettleAmt;
            boolean expense = "9100".equals(row.trCode());   // 9100: 사업비발생 — 지출결의서 결제

            if ("01".equals(row.rcvPayCode())) trCode = "9002";        // 9002: 미수금 결제
            else if ("02".equals(row.rcvPayCode())) trCode = "9003";   // 9003: 미지급금 결제
            if ("9913".equals(row.trCode()) || "9923".equals(row.trCode())) trCode = "9002";   // 펀드운용·사무관리보수 유보처리(자동)

            long settleId = mapper.selectNextId();
            mapper.insertSettleMulti(settleId, expense ? 0L : row.trId(), expense ? row.trId() : null, req.settleDate(), settleAmt, forSettleAmt,
                    row.note(), req.depositId(), trCode, user.getUserId());
            createJournal("P", companyId, user.getUserId(), settleId, trCode);
        }
    }

    /** ast.Ast07_Settle.delete (취소) — 분개 삭제(procType C) 뒤 결제내역 삭제. 로그인 회사의 결제만 */
    @Transactional
    public void deleteSettles(UserPrincipal user, List<Long> settleIds) {
        Long companyId = user.getCompanyId();
        for (Long settleId : settleIds) {
            SettleDeleteRes s = mapper.selectSettleForDelete(companyId, settleId);
            if (s == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "취소할 결제내역을 찾을 수 없습니다.");
            if (mapper.countFixedJournal(settleId) > 0) throw fail("승인완료 전표가 존재합니다.");
            try {
                createJournal("C", companyId, s.personId(), settleId, s.trCode());
            } catch (BusinessException e) {
                throw e;
            } catch (RuntimeException e) {
                throw fail("update fail : \n" + e.getMessage());
            }
        }
        for (Long settleId : settleIds) mapper.deleteSettle(settleId);
    }

    /** act02_journal.createJournal — 'Y'가 아니면 돌려준 메시지로 실패, DB 예외는 `update fail : ` 머리말 */
    private void createJournal(String procType, Long companyId, Long personId, Long settleId, String trCode) {
        String msg;
        try {
            msg = journalMapper.createJournal(procType, companyId, personId, trCode, settleId, true);
        } catch (RuntimeException e) {
            throw fail("update fail : \n" + e.getMessage());
        }
        if (!"Y".equals(msg)) throw fail(msg);
    }
}

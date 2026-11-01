package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.FinanceOprPrintRow;
import kr.co.kfs.asseterp.biz.ast.dto.FinanceOprRes;
import kr.co.kfs.asseterp.biz.ast.dto.FinanceOprTrRes;
import kr.co.kfs.asseterp.biz.ast.dto.InvestAssetLimitRes;
import kr.co.kfs.asseterp.biz.ast.dto.OwnerCapitalMaxRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstFinanceOprMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** 금융상품 운용내역 W15 (Ast09_Tab_FinanceBookOpr · Ast06_TabPage_FinanceBookOpr) — Ast09_Book.selectInvestAssetLimit·selectFinanceByHoldDate, Sys99_Print.insertRdFinanceBookOpr1·2 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstFinanceOprService {

    private static final String WINDOW_LIMIT = "Ast09_Tab_FinanceBookOpr_1";
    private static final String WINDOW_BOOK = "Ast09_Tab_FinanceBookOpr_2";

    private final AstFinanceOprMapper mapper;
    private final AstBookMapper bookMapper;

    /** ast40_owner_capital.selectByMaxDate — 없으면 null */
    public OwnerCapitalMaxRes ownerCapitalMax(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectOwnerCapitalMax(user.getCompanyId(), stdDate);
    }

    public List<InvestAssetLimitRes> investLimits(UserPrincipal user, LocalDate holdDate) {
        return mapper.selectInvestAssetLimit(user.getCompanyId(), holdDate);
    }

    /** periodType "0" = 미보유 제외, "1"~"4" = 미보유 포함 + 기간(1개월·3개월·1년·기간지정) */
    public List<FinanceOprRes> search(UserPrincipal user, LocalDate holdDate, String searchText, String investAssetType, boolean holdYn,
                                      String periodType, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectFinanceByHoldDate(user.getCompanyId(), holdDate, like(searchText), investAssetType == null ? "%" : investAssetType + "%",
                holdYn, periodType, startDate, closeDate);
    }

    public List<FinanceOprTrRes> trs(UserPrincipal user, LocalDate stdDate, Long astClassTreeId, Long keepAccountId, String trType) {
        return mapper.selectTrsByAstClassTreeId(user.getCompanyId(), stdDate, astClassTreeId, keepAccountId, trType);
    }

    /** Sys99_Print.insertRdFinanceBookOpr1 L2687 — 내 지난 자료를 지우고 투자한도 현황을 쌓아 출력그룹ID를 돌려준다 */
    @Transactional
    public Long insertRdLimit(UserPrincipal user, LocalDate holdDate) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = bookMapper.selectNextId();
        bookMapper.deletePrint(companyId, personId, WINDOW_LIMIT);
        for (InvestAssetLimitRes b : mapper.selectInvestAssetLimit(companyId, holdDate)) {
            mapper.insertPrintLimit(bookMapper.selectNextId(), companyId, personId, WINDOW_LIMIT, groupId, b);
        }
        return groupId;
    }

    /**
     * Sys99_Print.insertRdFinanceBookOpr2 L2729 — 보유 종목마다 [보유내역 + 매수내역 + 매도내역]을 한 줄(매수·매도가 더 많으면 줄을 늘려)로 쌓는다.
     * AS-IS는 줄을 넣은 뒤 매수는 첫 줄만 update, 매도는 k번째 줄을 다시 읽어 update한다 → 여기서는 종목별 줄을 메모리에서 합쳐 순서대로 넣는다(결과 같음)
     */
    @Transactional
    public Long insertRdBook(UserPrincipal user, LocalDate holdDate, String searchText, String investAssetType, boolean holdYn,
                             String periodType, LocalDate startDate, LocalDate closeDate) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = bookMapper.selectNextId();
        bookMapper.deletePrint(companyId, personId, WINDOW_BOOK);

        for (FinanceOprRes b : search(user, holdDate, searchText, investAssetType, holdYn, periodType, startDate, closeDate)) {
            FinanceOprPrintRow base = new FinanceOprPrintRow();
            base.string01 = b.keepAccountName();
            base.string02 = b.astClassName();
            base.string03 = b.astClassTreeName();
            base.string04 = b.stopLossNotice();
            base.string05 = b.holdPeriod();
            base.date01 = b.firstPurDate();
            base.date02 = b.sellPossibleDate();
            base.double01 = b.holdQty();
            base.double02 = nz(b.evalPrice());
            base.double03 = b.tyPlRate();
            base.double04 = b.purPlRate();
            base.long01 = b.purAmt();
            base.long02 = b.bookAmt();
            base.double05 = nz(b.purPrice());
            base.long03 = b.evalAmt();
            base.long04 = b.purEvalPl();
            base.long05 = b.evalPl();
            base.long48 = b.astClassTreeId();
            base.long49 = b.keepAccountId();

            List<FinanceOprPrintRow> rows = new ArrayList<>();
            rows.add(base.copyHoldings());   // 1번 줄 = 보유내역

            List<FinanceOprTrRes> buys = mapper.selectTrsByAstClassTreeId(companyId, holdDate, b.astClassTreeId(), b.keepAccountId(), "1");
            for (int i = 0; i < buys.size(); i++) {
                FinanceOprPrintRow r = i == 0 ? rows.get(0) : base.copyHoldings();
                if (i > 0) rows.add(r);
                FinanceOprTrRes t = buys.get(i);
                r.date05 = t.date();
                r.double10 = t.qty();
                r.double11 = nz(t.price());
                r.long10 = nz(t.trAmt());
                r.long11 = nz(t.amt());
            }

            List<FinanceOprTrRes> sells = mapper.selectTrsByAstClassTreeId(companyId, holdDate, b.astClassTreeId(), b.keepAccountId(), "2");
            for (int k = 1; k <= sells.size(); k++) {
                FinanceOprPrintRow r;
                if (buys.size() < k && k > 1) {   // 매수 줄이 모자라면 매수 칸을 0으로 비운 새 줄
                    r = base.copyHoldings();
                    r.double10 = 0.0;
                    r.double11 = 0.0;
                    r.long10 = 0L;
                    r.long11 = 0L;
                    rows.add(r);
                } else {
                    r = rows.get(k - 1);
                }
                FinanceOprTrRes t = sells.get(k - 1);
                r.date06 = t.date();
                r.double15 = t.qty();
                r.double16 = nz(t.price());
                r.double17 = t.purPlRate();
                r.long15 = nz(t.purBookAmt());
                r.long16 = nz(t.trAmt());
                r.long17 = nz(t.feeSum());
                r.long18 = nz(t.amt());
                r.long19 = nz(t.pl());
            }

            long cnt = 0;
            for (FinanceOprPrintRow r : rows) {
                r.long50 = ++cnt;
                mapper.insertPrintOpr(bookMapper.selectNextId(), companyId, personId, WINDOW_BOOK, groupId, r);
            }
        }
        return groupId;
    }

    /** 기간 조건: 미보유 포함이 아니면 "0", 포함이면 고른 기간(1~4), 아무것도 안 골랐으면 안내 문구 */
    public static String periodType(boolean holdYn, String radio) {
        if (!holdYn) return "0";
        if (radio == null || !List.of("1", "2", "3", "4").contains(radio)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "미보유 포함 기간조건을 선택하세요");
        }
        return radio;
    }

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }

    private static Double nz(Double v) {
        return v == null ? 0.0 : v;
    }

    private static Long nz(Long v) {
        return v == null ? 0L : v;
    }
}

package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.BookDepnRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleByTrRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCfInsertReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrCfTodayRow;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepnCheckReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceSearchCond;
import kr.co.kfs.asseterp.biz.ast.dto.TrIntrinsicRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrIntrinsicSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrIntrinsicMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/ast/Ast06_Tr.java (selectByPayCode L43 · selectById L32 · update L333 · updateDepn L574 · checkDepn L300 · insertByCf L245)
 * · Ast07_Settle.selectByTrId L32 · Ast13_BookDepn.selectByDepnDate L20 — 고유자산 거래처리 X03.
 * 삭제는 U04의 {@link AstTrService#delete}, 분개 생성·회계마감 검사는 U04 {@link ActJournalService}를 같이 쓴다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstTrIntrinsicService {

    private final AstTrIntrinsicMapper mapper;
    private final ActJournalService journalService;
    private final EmpTransInfoService transInfoService;

    /**
     * ast06_tr.selectByPayCode. 거래유형·거래처·종목 0은 조건 없음, 결제구분(payCode)이 비면 %, 검색어 비면 %.
     * 자산구분 1(고유자산)·국내외 1(국내)은 AS-IS 화면이 고정으로 보낸다. 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0
     */
    public List<TrIntrinsicRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String windowClassName,
                                       String payCode, Long corpId, Long classTreeId, Long trCodeId, String searchText, boolean bookIoCheck) {
        return mapper.selectByPayCode(new TrFinanceSearchCond(user.getCompanyId(), user.getUserId(), orgId(user), startDate, closeDate,
                blank(payCode) ? "%" : payCode, "1", "1", null, zeroToNull(corpId), zeroToNull(classTreeId), zeroToNull(trCodeId),
                windowClassName, blank(searchText) ? "%" : searchText), bookIoCheck);
    }

    /** ast06_tr.selectById */
    public TrIntrinsicRes get(UserPrincipal user, Long trId) {
        TrIntrinsicRes row = mapper.selectById(user.getCompanyId(), trId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /**
     * Ast06_Tr.update / updateDepn — 필수 검사(AS-IS Ast06_Lookup_TrIntrinsic.preUpdate L528-577) → 회계마감 검사 → 감가상각 검사(자산만) → 저장.
     * 분개가 있으면 일자·거래처·적요를 맞추되 승인된 전표면 "전표가 승인완료 상태입니다. 승인 취소 후 저장하세요".
     * 종목 대분류가 50·55이거나 소분류가 952002면 비품원장(ast09_book.createDepnBook 'P')을 만든다. 저장한 거래ID를 돌려준다
     */
    @Transactional
    public Long save(UserPrincipal user, TrIntrinsicSaveReq in) {
        if (in.date() == null) throw invalid("일자는 필수입력 항목입니다");
        if (blank(in.trCode())) throw invalid("거래유형은 필수선택 항목입니다");
        if (in.depositId() == null && !in.settleMngYn()) throw invalid("미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.");
        // AS-IS 순서: 감가상각 검사(자산만) → 회계마감 검사
        if (isDepnTarget(in.itemLClassCode())) checkDepn(user, new TrDepnCheckReq(in.date(), in.purTrId(), in.itemLClassCode()));
        journalService.checkClose(user.getCompanyId(), in.date());

        boolean isNew = in.trId() == null;
        Long trId = isNew ? mapper.selectNextId() : in.trId();
        TrIntrinsicSaveReq r = in.selfPur()
                ? new TrIntrinsicSaveReq(trId, in.date(), in.trCode(), in.corpId(), in.astClassTreeId(), in.contAmt(), in.tax(), in.amt(), in.settleMngYn(),
                        in.depositId(), in.note(), in.curCode(), trId, in.contAmt(), in.itemLClassCode(), in.itemSClassCode(), true)
                : new TrIntrinsicSaveReq(trId, in.date(), in.trCode(), in.corpId(), in.astClassTreeId(), in.contAmt(), in.tax(), in.amt(), in.settleMngYn(),
                        in.depositId(), in.note(), in.curCode(), in.purTrId(), in.bookAmt(), in.itemLClassCode(), in.itemSClassCode(), false);
        if (isNew) {
            mapper.insertTr(trId, user.getCompanyId(), user.getUserId(), r);
        } else {
            Long journalId = mapper.selectJournalId(trId);
            if (journalId != null) {
                if (mapper.selectJournalFixYn(trId)) throw invalid("전표가 승인완료 상태입니다. 승인 취소 후 저장하세요");
                mapper.updateJournalTrInfo(journalId, r.date(), r.corpId(), r.note());
            }
            if (mapper.updateTr(user.getCompanyId(), r) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (isDepnTarget(r.itemLClassCode()) || "952002".equals(r.itemSClassCode())) {
            String msg = mapper.createDepnBook("P", trId);
            if (!"Y".equals(msg)) throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
        }
        return trId;
    }

    /** ast.Ast06_Tr.checkDepn — 상각 대상(대분류 50·55)이 아니면 통과, 거래일 이후 상각이 있으면 AS-IS 메시지로 실패 */
    public void checkDepn(UserPrincipal user, TrDepnCheckReq r) {
        if (!isDepnTarget(r.itemLClassCode())) return;
        if (mapper.countDepn(user.getCompanyId(), r.date(), r.purTrId()) != 0) {
            throw invalid("거래일 이후 감가상각 처리내역이 존재합니다. 상각 취소 후 거래하세요.");
        }
    }

    /** ast.Ast07_Settle.selectByTrId */
    public List<SettleByTrRes> settles(Long trId) {
        return mapper.selectSettlesByTrId(trId);
    }

    /**
     * ast.Ast06_Tr.insertByCf — 기준일의 C/F를 거래로 넣고 거래마다 분개를 만든다(procType P, exceptYn true). 회계마감 검사는 화면이 먼저 한다.
     * 가져온 건수를 돌려준다. 한 건이라도 실패하면 전부 되돌린다
     */
    @Transactional
    public int insertByCf(UserPrincipal user, TrCfInsertReq r) {
        List<TrCfTodayRow> rows = mapper.selectTodayCf(user.getCompanyId(), user.getUserId(), orgId(user), r.stdDate(), "1", r.windowClassName());
        for (TrCfTodayRow row : rows) {
            long trId = mapper.selectNextId();
            mapper.insertCfTr(trId, user.getCompanyId(), user.getUserId(), row);
            journalService.createJournal(user, trId, row.trCode(), "P", true);
        }
        return rows.size();
    }

    /** ast.Ast13_BookDepn.selectByDepnDate — 검색어 "%…%" */
    public List<BookDepnRes> bookDepns(UserPrincipal user, LocalDate depnDate, String searchText) {
        return mapper.selectBookDepns(user.getCompanyId(), depnDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    private Long orgId(UserPrincipal user) {
        return user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
    }

    private static boolean isDepnTarget(String itemLClassCode) {
        return "50".equals(itemLClassCode) || "55".equals(itemLClassCode);
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }

    private static Long zeroToNull(Long v) {
        return v == null || v == 0 ? null : v;
    }

    private static BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}

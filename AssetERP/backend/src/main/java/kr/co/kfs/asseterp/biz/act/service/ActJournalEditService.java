package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.JournalEditRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalHeaderRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalNewReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalSaveReq;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalEditMapper;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalListMapper;
import kr.co.kfs.asseterp.biz.ast.service.AstBookService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/act/Act02_Journal.java (updateAll L462-569) · Act06_JournalTmp.selectByJournalId · Act03_JournalDtl.selectByJournalId —
 * 전표변경 Act02_Lookup_ModiJournal (W05 2단계). 창은 이미 있는 전표만 연다(AS-IS updateAll의 "전표가 없으면 insert" 가지는 이 창에서 닿지 않아 만들지 않았다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActJournalEditService {

    private final ActJournalEditMapper mapper;
    private final ActJournalListMapper listMapper;
    private final ActJournalService journalService;
    private final AstBookService bookService;

    /** 열 때: 전표 머리 + 임시분개 줄 (act03 상세 첫 행이 없는 전표도 열린다) */
    public JournalEditRes get(UserPrincipal user, Long journalId) {
        JournalHeaderRes h = header(user, journalId);
        return new JournalEditRes(h.journalId(), h.date(), h.journalNo(), h.corpId(), h.corpName(), h.trName(), h.note(), h.fixYn(), h.curCode(),
                mapper.selectTmpByJournalId(journalId));
    }

    /**
     * Act02_Journal.updateAll — 승인완료 전표는 막고, 창의 검사(차/대 구분·계정코드·금액, 차/대 원화 금액)를 다시 한 뒤 마감 검사 →
     * 비고·거래처 → 임시분개·분개장을 지우고 줄 순서(10, 20, …)로 임시분개를 다시 쓰고, 분개장은 차변 n번째·대변 n번째를 한 줄로 짝지어 다시 쓴다
     * → 관리계좌가 한 줄이라도 있으면 그 날짜의 예금원장정리
     */
    @Transactional
    public void save(UserPrincipal user, Long journalId, JournalSaveReq req) {
        JournalHeaderRes h = header(user, journalId);
        if (h.fixYn()) throw invalid("승인완료 전표입니다.");
        checkLines(req.lines());
        journalService.checkClose(user.getCompanyId(), h.date());

        mapper.updateJournal(journalId, req.corpId(), req.note(), req.curCode());
        writeLines(user, journalId, h.date(), req.lines());
    }

    /**
     * Act02_Lookup_CreateJournal NEW → Act02_Journal.updateAll의 "전표가 없으면 insert" 가지 — 전표번호(f_create_journal_no)를 만들어 전표를 넣고(통화 KRW, 결산·확정 false)
     * 나머지는 변경과 같이 임시분개·분개장을 쓴다. 새 전표 ID를 돌려준다
     */
    @Transactional
    public Long create(UserPrincipal user, JournalNewReq req) {
        checkLines(req.lines());
        journalService.checkClose(user.getCompanyId(), req.date());
        Long journalId = mapper.selectNextId();
        Long journalNo = listMapper.createJournalNo(user.getCompanyId(), req.date());
        listMapper.insertJournal(journalId, user.getCompanyId(), user.getUserId(), req.date(), req.note(), req.corpId(), req.curCode() == null || req.curCode().isEmpty() ? "KRW" : req.curCode(), journalNo);
        writeLines(user, journalId, req.date(), req.lines());
        return journalId;
    }

    /** 창의 검사(차/대 구분·계정코드·금액, 차/대 원화 금액)를 서버에서 다시 한다 */
    private static void checkLines(List<JournalSaveReq.Line> lines) {
        long dr = 0, cr = 0;
        double forDr = 0, forCr = 0;
        for (JournalSaveReq.Line l : lines) {
            if (l.drcrType() == null || l.drcrType().isEmpty()) throw invalid("차/대 구분은 필수선택 항목입니다.");
            if (l.realAccountCode() == null || l.realAccountCode().isEmpty()) throw invalid("계정코드는 필수선택 항목입니다");
            if (l.amt() == null || l.amt() == 0) throw invalid("금액은 필수입력 항목입니다");
            double f = l.forAmt() == null ? 0 : l.forAmt();
            if ("D".equals(l.drcrType())) { dr += l.amt(); forDr += f; }
            else if ("C".equals(l.drcrType())) { cr += l.amt(); forCr += f; }
        }
        // 외화 금액 검사가 먼저 (Act02_Lookup_CreateForJournal.preUpdate L538-546). 내국 화면은 외화금액이 0이라 그대로 통과한다
        if (Math.abs(forCr - forDr) > 1e-9) throw invalid("차/대 외화 금액이 다릅니다.");
        if (cr - dr != 0) throw invalid("차/대 원화 금액이 다릅니다.");
    }

    /** 임시분개·분개장을 지우고 줄 순서(10, 20, …)로 임시분개를 다시 쓰고, 분개장은 차변 n번째·대변 n번째를 한 줄로 짝지어 쓴 뒤 관리계좌가 있으면 예금원장정리 */
    private void writeLines(UserPrincipal user, Long journalId, java.time.LocalDate date, List<JournalSaveReq.Line> lines) {
        mapper.deleteTmpByJournalId(journalId);
        mapper.deleteDtlByJournalId(journalId);
        long seq = 0;
        boolean deposit = false;
        List<JournalSaveReq.Line> drs = new ArrayList<>();
        List<JournalSaveReq.Line> crs = new ArrayList<>();
        for (JournalSaveReq.Line l : lines) {
            seq += 10;
            mapper.insertTmp(mapper.selectNextId(), journalId, seq, l);
            if ("D".equals(l.drcrType())) drs.add(l);
            else crs.add(l);
            if (l.depositId() != null) deposit = true;
        }
        for (int i = 0; i < Math.max(drs.size(), crs.size()); i++) {
            mapper.insertDtl(journalId, i + 1, i < drs.size() ? drs.get(i) : null, i < crs.size() ? crs.get(i) : null);
        }
        if (deposit) bookService.createDepositBook(user, date);
    }

    private JournalHeaderRes header(UserPrincipal user, Long journalId) {
        JournalHeaderRes h = mapper.selectHeader(user.getCompanyId(), journalId);
        if (h == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return h;
    }

    private static BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}

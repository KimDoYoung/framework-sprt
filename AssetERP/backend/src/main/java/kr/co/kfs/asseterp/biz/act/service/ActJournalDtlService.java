package kr.co.kfs.asseterp.biz.act.service;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubCond;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubRdReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalAccountRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalRealAccountRes;
import java.io.IOException;
import java.io.UncheckedIOException;
import kr.co.kfs.asseterp.biz.act.dto.JournalDtlCond;
import kr.co.kfs.asseterp.biz.act.dto.JournalDtlListRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRdReq;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;

import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalLineRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalPayMonthRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalDtlMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/act/Act03_JournalDtl.java (selectPayMonth L45) — 급여 전표확인 (S18) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActJournalDtlService {

    private final ActJournalDtlMapper mapper;

    /** act03_journal_dtl.selectPayMonth */
    public List<JournalPayMonthRes> searchPayMonth(UserPrincipal user, LocalDate payDate, String payType) {
        return mapper.selectPayMonth(user.getCompanyId(), payDate, payType);
    }

    /** act03_journal_dtl.selectByAstId (Act02_Tab_DepositIoList, U01) — AS-IS는 companyId를 선택한 원장 행에서 가져오지만 로그인 회사와 같다 */
    public List<JournalDtlRes> searchByAstId(UserPrincipal user, LocalDate date, Long astId, String drCrType) {
        return mapper.selectByAstId(user.getCompanyId(), date, astId, drCrType);
    }

    /** act03_journal_dtl.selectByJournalId (Ast06_Grid_Journal, U04) — 분개가 없으면(journalId null) 빈 목록 */
    public List<JournalLineRes> searchByJournalId(UserPrincipal user, Long journalId) {
        return mapper.selectByJournalId(user.getCompanyId(), journalId);
    }

    /** act03_journal_dtl.selectByCompanyId (Act02_Tab_Journal, X15) — corpId null은 전체("%"), 검색어는 "%…%", trCode null은 전체 */
    public List<JournalDtlListRes> searchList(UserPrincipal user, LocalDate startDate, LocalDate closeDate, Long corpId,
                                              String searchText, String trCode, String abroType) {
        return mapper.selectByCompanyId(cond(user.getCompanyId(), startDate, closeDate, corpId, searchText, trCode, abroType, null));
    }

    /**
     * sys.Sys99_Print.insertRdJournal L859-946 — 출력용 분개장을 sys99_print에 만들고 출력그룹ID를 돌려준다(mrd Act02_Rd_Journal).
     * journalIds가 있으면 그 전표만(1: 출력용 선택전표 그룹을 만들어 selectByCompanyId의 checkedGroupId로 거른다).
     */
    @Transactional
    public Long insertRd(UserPrincipal user, JournalDtlRdReq req) {
        if (req.startDate() == null || req.closeDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "조회기간을 확인하세요.");
        if (req.windowClassName() == null || req.windowClassName().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "화면 클래스명이 없습니다.");
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        String windowClassName = req.windowClassName();
        String checkedClassName = "출력용 선택전표";

        // 1. 데이터 정리
        mapper.deletePrint(companyId, personId, checkedClassName);
        mapper.deletePrint(companyId, personId, windowClassName);

        // 2. 선택된 전표리스트 생성 (연속으로 같은 전표는 한 번만)
        Long checkedGroupId = null;
        List<Long> ids = req.journalIds() == null ? List.of() : req.journalIds();
        if (!ids.isEmpty()) {
            checkedGroupId = mapper.selectNextId();
            Long prev = null;
            for (Long id : ids) {
                if (prev == null || !prev.equals(id)) {
                    prev = id;
                    mapper.insertPrintChecked(mapper.selectNextId(), companyId, personId, checkedClassName, checkedGroupId, id);
                }
            }
        }

        // 3. 출력용 분개장 생성 (그룹ID 재생성)
        long groupId = mapper.selectNextId();
        for (JournalDtlListRes r : mapper.selectByCompanyId(
                cond(companyId, req.startDate(), req.closeDate(), req.corpId(), req.searchText(), req.trCode(), req.abroType(), checkedGroupId))) {
            mapper.insertPrintJournal(mapper.selectNextId(), companyId, personId, windowClassName, groupId, r);
        }
        return groupId;
    }

    private JournalDtlCond cond(Long companyId, LocalDate startDate, LocalDate closeDate, Long corpId, String searchText,
                                String trCode, String abroType, Long checkedGroupId) {
        String search = searchText == null || searchText.isEmpty() ? "%" : "%" + searchText + "%";
        return new JournalDtlCond(companyId, startDate, closeDate, corpId == null ? "%" : String.valueOf(corpId), search,
                trCode == null || trCode.isEmpty() ? "%" : trCode, abroType == null || abroType.isEmpty() ? "0" : abroType, checkedGroupId);
    }

    // ---- 계정별원장 Act02_Tab_JournalSub (X17)

    /** act03_journal_dtl.selectByAccountCode — corpId·depositId null은 전체("%"), 검색어는 "%…%" */
    public List<JournalSubRes> searchByAccountCode(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String accountCode,
                                                   String trCode, Long corpId, Long depositId, String searchText) {
        if (accountCode == null || accountCode.isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "계정코드를 선택해주세요");
        return mapper.selectByAccountCode(subCond(user.getCompanyId(), startDate, closeDate, accountCode, trCode, corpId, depositId, searchText));
    }

    /** act02_journal.getAccountCode — 기간에 분개가 있는 계정 목록(엑셀다운로드 전 "조회된 데이터가 없습니다" 판정) */
    public List<JournalAccountRes> searchAccountCodes(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectAccountCodes(subCond(user.getCompanyId(), startDate, closeDate, null, null, null, null, null));
    }

    /** act13_real_account_map.selectByAstClassTreeId — 없으면 null */
    public JournalRealAccountRes getRealAccount(UserPrincipal user, Long classTreeId) {
        return mapper.selectRealAccountByClassTree(user.getCompanyId(), classTreeId);
    }

    /**
     * sys.Sys99_Print.insertRdJournalSub L1218-1270 — 현재 조건의 계정별원장을 sys99_print에 만들고 출력그룹ID를 돌려준다(mrd Act02_Rd_JournalSub).
     * AS-IS는 그룹ID를 먼저 만들고 같은 화면 클래스의 이전 출력을 지운다.
     */
    @Transactional
    public Long insertRdSub(UserPrincipal user, JournalSubRdReq req) {
        if (req.accountCode() == null || req.accountCode().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "계정코드를 선택해주세요");
        if (req.windowClassName() == null || req.windowClassName().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "화면 클래스명이 없습니다.");
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, req.windowClassName());
        for (JournalSubRes r : mapper.selectByAccountCode(subCond(companyId, req.startDate(), req.closeDate(), req.accountCode(),
                req.trCode(), req.corpId(), req.depositId(), req.searchText()))) {
            mapper.insertPrintJournalSub(mapper.selectNextId(), companyId, personId, req.windowClassName(), groupId, r);
        }
        return groupId;
    }

    /**
     * ExcelDownload act02List — accountCode가 비거나 "none"이면 기간에 분개가 있는 모든 계정(getAccountCode), 있으면 그 계정과 하위의 전표생성 계정(getOneAccountCode).
     * 계정마다 시트, 조건은 거래처·거래유형·관리계좌·검색어 전체("%").
     */
    public byte[] downloadAccountExcel(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String accountCode) {
        Long companyId = user.getCompanyId();
        boolean all = accountCode == null || accountCode.isBlank() || "none".equals(accountCode);
        JournalSubCond base = subCond(companyId, startDate, closeDate, all ? null : accountCode, null, null, null, null);
        List<JournalAccountRes> accounts = all ? mapper.selectAccountCodes(base) : mapper.selectOneAccountCodes(base);
        try {
            return ActJournalSubExcelWriter.write(startDate, closeDate, accounts, acc ->
                    mapper.selectByAccountCode(subCond(companyId, startDate, closeDate, acc.trCode(), null, null, null, null)));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private JournalSubCond subCond(Long companyId, LocalDate startDate, LocalDate closeDate, String accountCode, String trCode,
                                   Long corpId, Long depositId, String searchText) {
        return new JournalSubCond(companyId, startDate, closeDate, accountCode,
                trCode == null || trCode.isEmpty() ? "%" : trCode,
                corpId == null ? "%" : String.valueOf(corpId),
                depositId == null ? "%" : String.valueOf(depositId),
                "%" + (searchText == null ? "" : searchText) + "%");
    }
}

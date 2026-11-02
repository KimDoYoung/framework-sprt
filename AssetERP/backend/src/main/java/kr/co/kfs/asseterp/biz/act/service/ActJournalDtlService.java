package kr.co.kfs.asseterp.biz.act.service;
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
}

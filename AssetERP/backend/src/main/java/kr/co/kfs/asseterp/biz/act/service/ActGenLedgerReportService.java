package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.CloseParam;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerFssRdReq;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerFssRes;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerReportCond;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerReportRdReq;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerReportRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActGenLedgerMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 재무제표 Act04_Tab_ReportPL(X20, 손익계산서)·Act04_Tab_ReportBS(X21, 재무상태표) —
 * AS-IS Act04_GenLedger.selectBSPL(L75) · Sys00_Common.selectAccountCloseDate/selectPreQuarterCloseDate · Sys99_Print.insertRdReportPL(L1674).
 * 조회도 결산원장(act05)이 없는 날짜는 가결산원장(act07)을 지우고 다시 만드므로 쓰기 트랜잭션이다(AS-IS 서비스 브로커도 commit).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActGenLedgerReportService {

    private final ActGenLedgerMapper mapper;

    /** Sys00_Common.selectAccountCloseDate(type -1: 전기말) · selectPreQuarterCloseDate(type 2: 반기, 1: 분기). 전년동기(4)는 화면이 계산한다 */
    public LocalDate searchCompareDate(UserPrincipal user, LocalDate stdDate, String compareCode) {
        if (stdDate == null) throw invalid("기준일자를 선택해주세요");
        return switch (compareCode == null ? "1" : compareCode) {
            case "1" -> mapper.selectAccountCloseDate(user.getCompanyId(), stdDate, -1);
            case "2" -> mapper.selectQuarterDate(stdDate, "2");
            case "3" -> mapper.selectQuarterDate(stdDate, "1");
            default -> throw invalid("비교기준을 확인하세요.");
        };
    }

    /** act.Act04_GenLedger.selectBSPL — reportType 1 재무상태표 / 2 손익계산서 */
    @Transactional
    public List<GenLedgerReportRes> searchBSPL(UserPrincipal user, LocalDate stdDate, LocalDate compareDate,
                                               boolean exceptZeroYn, String reportType) {
        return selectBSPL(user.getCompanyId(), stdDate, compareDate, exceptZeroYn, reportType);
    }

    /** sys.Sys99_Print.insertRdReportPL — 현재 조건의 재무제표를 sys99_print에 만들고 출력그룹ID를 돌려준다(mrd Act04_Rd_ReportPL/BS) */
    @Transactional
    public Long insertRdReport(UserPrincipal user, GenLedgerReportRdReq req) {
        if (req.windowClassName() == null || req.windowClassName().isBlank()) throw invalid("화면 클래스명이 없습니다.");
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, req.windowClassName());
        List<GenLedgerReportRes> list = selectBSPL(companyId, req.stdDate(), req.compareDate(),
                Boolean.TRUE.equals(req.exceptZeroYn()), req.reportType());
        for (GenLedgerReportRes r : list) {
            mapper.insertPrintReport(mapper.selectNextId(), companyId, personId, req.windowClassName(), groupId, r);
        }
        return groupId;
    }

    /** sys.Sys99_Print.insertRdReportFSS L1766 (→ Act04_GenLedger.selectFssBSPL L106) — 금감원 재무제표를 sys99_print에 만들고 출력그룹ID를 돌려준다(mrd Act04_Rd_ReportFSS) */
    @Transactional
    public Long insertRdReportFss(UserPrincipal user, GenLedgerFssRdReq req) {
        if (req.windowClassName() == null || req.windowClassName().isBlank()) throw invalid("화면 클래스명이 없습니다.");
        if (req.stdDate() == null) throw invalid("기준년월을 확인하세요.");
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, req.windowClassName());
        Long checkCnt = createGenLedgerCloseTmp(companyId, req.stdDate());   // 가결산원장 생성
        for (GenLedgerFssRes r : mapper.selectFssBSPL(companyId, req.stdDate(), checkCnt, req.code())) {
            mapper.insertPrintFss(mapper.selectNextId(), companyId, personId, req.windowClassName(), groupId, r);
        }
        return groupId;
    }

    private List<GenLedgerReportRes> selectBSPL(Long companyId, LocalDate stdDate, LocalDate compareDate,
                                                boolean exceptZeroYn, String reportType) {
        if (stdDate == null) throw invalid("기준일자를 선택해주세요");
        if (compareDate == null) throw invalid("비교일자를 선택해주세요");
        if (!"1".equals(reportType) && !"2".equals(reportType)) throw invalid("재무제표 종류를 확인하세요.");
        Long checkStd = createGenLedgerCloseTmp(companyId, stdDate);          // 기준일 가결산원장 생성
        Long checkCompare = createGenLedgerCloseTmp(companyId, compareDate);  // 비교일 가결산원장 생성
        return mapper.selectBSPL(new GenLedgerReportCond(companyId, stdDate, compareDate, checkStd, checkCompare, exceptZeroYn, reportType));
    }

    /** Act04_GenLedger.createGenLedgerCloseTmp L129-139 — 결산원장(act05) 미존재시 가결산원장(act07) 생성 후 조회 */
    private Long createGenLedgerCloseTmp(Long companyId, LocalDate closeDate) {
        long cnt = mapper.selectCloseDateCount(CloseParam.of(companyId, closeDate));
        if (cnt == 0) {
            mapper.deleteGenLedgerCloseTmp(companyId, closeDate);        // 가결산원장 정리
            mapper.insertGenLedgerCloseTmp(companyId, closeDate);        // 가결산원장 생성
            mapper.insertGenLedgerCloseTmpEicp(companyId, closeDate);    // 미처분이익잉여금 반영
        }
        return cnt;
    }

    private static BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}

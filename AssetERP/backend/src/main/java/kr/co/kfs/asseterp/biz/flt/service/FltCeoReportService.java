package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.CeoAccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoApprRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoReportPersonRes;
import kr.co.kfs.asseterp.biz.flt.dto.CeoTrRes;
import kr.co.kfs.asseterp.biz.flt.mapper.FltCeoReportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/**
 * AS-IS server/flt/Flt03_Account.selectByStdDate, Flt10_Tr.selectByStdDate·selectByStdDate2, Apr01_Appr.selectByLinkCode,
 * Sys99_Print.insertRdCeoReport(L4551) — J08 책임자보고.
 * stdDate = 기준월 말일, startDate = 기준월 1일(AS-IS getStdDateEnd / getStdDate)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltCeoReportService {

    /** AS-IS apprChk()의 linkCode — A72 : 임직원매매 책임자보고 */
    static final String LINK_CODE = "A72";

    private final FltCeoReportMapper mapper;

    /** AS-IS Flt03_TabPage_Account.retrieve — 임직원계좌신고내역 */
    public List<CeoAccountRes> searchAccounts(UserPrincipal user, String stdDate, String startDate, String transCode) {
        return mapper.selectAccounts(user.getCompanyId(), stdDate, startDate, transCode);
    }

    /** AS-IS Flt10_TabPage_ReportPerson.retrieve — 매월신고대상임직원(noAccountSkipYnCheck 없음) */
    public List<CeoReportPersonRes> searchReportPersons(UserPrincipal user, String stdDate, String startDate, String transCode) {
        return mapper.selectReportPersons(user.getCompanyId(), stdDate, startDate, transCode, false);
    }

    /** AS-IS Flt10_TabPage_TrList.retrieve — 임직원매매명세(noAccountSkipYnCheck = true: 신고 계좌 없는 사원 제외) */
    public List<CeoTrRes> searchTrs(UserPrincipal user, String stdDate, String startDate, String transCode) {
        return mapper.selectTrs(user.getCompanyId(), stdDate, startDate, transCode, true);
    }

    /** AS-IS apprChk() — 기준월(startDate)에 상신된 책임자보고 문서 */
    public List<CeoApprRes> searchApprs(UserPrincipal user, String startDate) {
        return mapper.selectApprsByLinkCode(user.getCompanyId(), startDate, LINK_CODE);
    }

    /**
     * 엑셀다운로드 — AS-IS는 Sys99_Print.insertRdCeoReport(세 구간을 sys99_print에 쌓음) + RD 리포트 Flt10_Rd_CeoReport.
     * RD 서버가 없으므로 세 구간(임직원 계좌 신고 내역 · 매월 신고 대상 임직원 · 임직원 매매명세)을 시트 3개로 쓴다.
     */
    public byte[] download(UserPrincipal user, String stdDate, String startDate, String transCode) {
        List<List<Object>> accountRows = searchAccounts(user, stdDate, startDate, transCode).stream()
                .map(r -> row(r.apprEffectDate(), r.checkCycleName(), r.personName(), r.orgName(), r.corpName(), r.accountNoDec(),
                        r.accountName(), r.familyRelateName()))
                .toList();
        List<List<Object>> personRows = searchReportPersons(user, stdDate, startDate, transCode).stream()
                .map(r -> row(r.personName(), r.orgName(), r.apprEffectDate()))
                .toList();
        List<List<Object>> trRows = searchTrs(user, stdDate, startDate, transCode).stream()
                .map(r -> row(r.personName(), r.orgName(), r.checkCycleName(), r.trYn(), r.depositAmt(), r.totalInvestAmt(),
                        r.corpName(), r.accountNo(), r.accountName(), r.trItemName(), r.trTypeName(), r.regDate(),
                        r.expectTrQty(), r.trDate(), r.trQty(), r.unitPrice(), r.trAmt()))
                .toList();
        return FltExcelWriter.write(List.of(
                new FltExcelWriter.SheetData("임직원 계좌 신고 내역",
                        List.of("신고일자", "보고주기", "이름", "소속", "증권사", "계좌번호", "계좌명", "관계"), accountRows),
                new FltExcelWriter.SheetData("매월 신고 대상 임직원", List.of("이름", "소속", "신고일자"), personRows),
                new FltExcelWriter.SheetData("임직원 매매명세",
                        List.of("이름", "소속", "보고주기", "매매여부", "당해연도 순입금액", "총 누적 투자금액", "증권사", "계좌번호", "계좌명",
                                "매매종목", "거래구분", "사전신고일", "신고수량", "매매일자", "매매수량", "단가", "매매금액"), trRows)));
    }

    private static List<Object> row(Object... values) {
        return Arrays.asList(values);
    }
}

package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AccountStatusRes;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpApprDocRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpApprRes;
import kr.co.kfs.asseterp.biz.flt.dto.InvestLimitRes;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeCodeRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrAccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrCheckRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrItemRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrListRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.TrStatusReq;
import kr.co.kfs.asseterp.biz.flt.dto.TrUnfillReq;
import kr.co.kfs.asseterp.biz.flt.dto.ViolateRes;
import kr.co.kfs.asseterp.biz.flt.mapper.FltAccountMapper;
import kr.co.kfs.asseterp.biz.flt.mapper.FltTrMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * AS-IS server/flt/Flt10_Tr.java (selectByAccountId L103 / selectInvestLimit L66 / selectItemName L45 / update L696 / delete L737 /
 * updateStatusCode L512 / updateUnFill L587), Flt01_CompanyStd.getExpectTrDate L41, Flt08_BuyLockup.checkLockup L31,
 * Flt02_Emp.selectByDate, Flt03_Account.selectByDate, Sys00_Common.selectByFltItemType — 로그인 사용자(회사·사원) 본인의 사전신고만 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltTrService {

    private final FltTrMapper mapper;
    private final FltAccountMapper accountMapper;

    /** AS-IS selectByAccountId — 검색어는 `%검색어%`(클라이언트가 붙이던 것) */
    public List<TrRes> search(UserPrincipal user, String trType, Long accountId, String regDate,
                              String startDate, String closeDate, String searchText) {
        return mapper.selectTrs(user.getCompanyId(), user.getUserId(), trType, accountId, regDate, startDate, closeDate, like(searchText));
    }

    /** AS-IS Flt02_Emp.selectByDate(기준일) + Flt04_Oath.selectByDate(오늘) + 회사 소급 설정 + 서버 오늘 */
    public TrCheckRes check(UserPrincipal user, String stdDate) {
        String today = mapper.selectToday();
        TrCheckRes emp = mapper.selectEmpByDate(user.getCompanyId(), user.getUserId(), stdDate == null ? today : stdDate);
        AccountStatusRes oath = accountMapper.selectOath(user.getCompanyId(), user.getUserId());
        Boolean onlyCurr = Boolean.TRUE.equals(mapper.selectFltOnlyCurr(user.getCompanyId()));
        String oathCode = oath == null ? null : oath.oathStatusCode();
        if (emp == null) {
            return new TrCheckRes(false, null, null, null, null, oathCode, today, onlyCurr);
        }
        return new TrCheckRes(true, emp.checkCycle(), emp.yearInvestLimit(), emp.investAmtCalcTargetCode(),
                emp.investAmtOverCheckYn(), oathCode, today, onlyCurr);
    }

    /** AS-IS selectInvestLimit */
    public List<InvestLimitRes> investLimit(UserPrincipal user, String stdDate) {
        return mapper.selectInvestLimit(user.getCompanyId(), user.getUserId(), stdDate);
    }

    /** AS-IS selectItemName(종목 찾기 창) */
    public List<TrItemRes> itemNames(UserPrincipal user, String stdDate, String searchText) {
        return mapper.selectItemNames(user.getCompanyId(), user.getUserId(), stdDate, like(searchText));
    }

    /** AS-IS Flt01_CompanyStd.getExpectTrDate — 기준관리가 없으면 null */
    public String expectTrDate(UserPrincipal user, String stdDate) {
        return mapper.selectExpectTrDate(user.getCompanyId(), stdDate);
    }

    /** AS-IS Flt08_BuyLockup.checkLockup — 코드 3자리: 1 매수제한(주의) / 2 운용펀드 보유 / 3 고유자산 보유 */
    public BuyLockupRes buyLockup(UserPrincipal user, String itemCode, String stdDate) {
        String code = mapper.selectBuyLockupCode(user.getCompanyId(), itemCode, stdDate);
        if (code == null || code.length() < 3) {
            code = "000";
        }
        boolean fundHoldStk = Boolean.TRUE.equals(mapper.selectFundHoldStk(user.getCompanyId(), stdDate));
        StringBuilder name = new StringBuilder();
        if (code.charAt(0) == '1') {
            name.append("매수제한(주의) 종목");
            if (code.charAt(1) == '1' || code.charAt(2) == '1') {
                name.append(", ");
            }
        }
        if (code.charAt(1) == '1') {
            if (fundHoldStk) {
                return new BuyLockupRes("REJECT", "펀드(일임) 보유주식으로 매수가 제한됩니다");
            }
            name.append("운용중인 펀드의 보유종목");
            if (code.charAt(2) == '1') {
                name.append(", ");
            }
        }
        if (code.charAt(2) == '1') {
            if (fundHoldStk) {
                return new BuyLockupRes("REJECT", "고유자산 보유주식으로 매수가 제한됩니다");
            }
            name.append("고유자산 보유종목");
        }
        return name.length() == 0 ? new BuyLockupRes("OK", null) : new BuyLockupRes("CONFIRM", "해당 종목은 " + name + "입니다");
    }

    /** AS-IS update(UpdateDataModel): trId 0 이하 INSERT 아니면 UPDATE → selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<TrRes> update(UserPrincipal user, List<TrSaveReq> rows) {
        List<TrRes> saved = new ArrayList<>();
        for (TrSaveReq src : rows) {
            TrSaveReq req = new TrSaveReq(src.trId(), src.trType(), src.accountId(), src.regDate(), src.expectTrDate(), src.itemType(),
                    src.itemName() == null ? null : src.itemName().trim(), src.itemCode(), src.expectTrQty(), src.expectTrAmt(), src.trReason());
            boolean isNew = req.trId() == null || req.trId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.trId();
            if (isNew) {
                mapper.insertTr(id, user.getCompanyId(), user.getUserId(), req);
            } else if (mapper.updateTr(user.getCompanyId(), user.getUserId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectTrById(id));
        }
        return saved;
    }

    /** AS-IS delete(deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteTrs(user.getCompanyId(), user.getUserId(), ids);
    }

    /** AS-IS updateStatusCode — 이 화면은 승인신청("10")과 신청취소(null)만 쓴다(승인·반려는 준감인 화면) */
    @Transactional
    public int updateStatus(UserPrincipal user, TrStatusReq req) {
        if (req.statusCode() != null && !"10".equals(req.statusCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        int count = 0;
        for (Long trId : req.trIds()) {
            count += mapper.updateStatusCode(user.getCompanyId(), user.getUserId(), trId, req.statusCode());
        }
        return count;
    }

    /** AS-IS updateUnFill — 행마다 실거래 등록 여부를 다시 검사하고 미체결 여부를 바꾼다 */
    @Transactional
    public int updateUnfill(UserPrincipal user, TrUnfillReq req) {
        String unfillYn = Boolean.TRUE.equals(req.unfill()) ? "true" : "false";
        int count = 0;
        for (Long trId : req.trIds()) {
            if (mapper.selectTrDate(trId) != null) {
                TrRes tr = mapper.selectTrById(trId);
                throw new BusinessException(ErrorCode.INVALID_INPUT, "'" + (tr == null ? "" : tr.itemName()) + "' 종목은 실거래 등록이 진행된 신고내역입니다");
            }
            count += mapper.updateUnfillYn(user.getCompanyId(), user.getUserId(), trId, unfillYn);
        }
        return count;
    }

    /** AS-IS Flt03_Account.selectByDate */
    public List<TrAccountRes> accounts(UserPrincipal user, String setupDate) {
        return mapper.selectAccountsByDate(user.getCompanyId(), user.getUserId(), setupDate);
    }

    /** AS-IS Sys00_Common.selectByFltItemType(종목유형 콤보) */
    public List<ItemTypeCodeRes> itemTypeCodes(UserPrincipal user, String startDate) {
        return mapper.selectItemTypeCodes(user.getCompanyId(), startDate);
    }

    /** AS-IS Flt10_Tr.selectByTrList (I08) — trType·ioType은 생략하면 전체(`%`), 검색어는 `%검색어%`(클라이언트가 붙이던 것) */
    public List<TrListRes> searchList(UserPrincipal user, String startDate, String closeDate, boolean preTrYn,
                                      String trType, String ioType, String searchText) {
        return mapper.selectTrList(user.getCompanyId(), user.getUserId(), startDate, closeDate, String.valueOf(preTrYn),
                "true", blankToAll(trType), blankToAll(ioType), like(searchText));
    }

    /** AS-IS Flt10_Tab_TrListAdmin.retrieve (J03 준감인) — personId 생략 = 회사 전체 사원, unApprYn "false" */
    public List<TrListRes> searchListAdmin(UserPrincipal user, Long personId, String startDate, String closeDate, boolean preTrYn,
                                           String trType, String ioType, String searchText) {
        return mapper.selectTrList(user.getCompanyId(), personId, startDate, closeDate, String.valueOf(preTrYn),
                "false", blankToAll(trType), blankToAll(ioType), like(searchText));
    }

    /**
     * 엑셀다운로드 (J03) — AS-IS는 Sys99_Print.insertRdTrListAdmin + RD 리포트. 일반(Flt10_Rd_TrListAdmin)은 preTrYn=true 고정,
     * 금감원양식(Flt10_Rd_TrListAdminReport, report=true)은 preTrYn=false라 사전신고 열 4개를 쓰지 않는다. RD 양식 대신 그리드 열 순서의 단순 xlsx.
     */
    public byte[] downloadListAdmin(UserPrincipal user, Long personId, String startDate, String closeDate, boolean report,
                                    String trType, String ioType, String searchText) {
        boolean preTrYn = !report;
        List<TrListRes> list = searchListAdmin(user, personId, startDate, closeDate, preTrYn, trType, ioType, searchText);
        List<String> headers = new ArrayList<>(List.of("사원명", "입/출", "매매구분"));
        if (preTrYn) {
            headers.addAll(List.of("사전신고일", "사전신고종목명", "사전신고수량", "사전신고금액"));
        }
        headers.add("사전승인");
        headers.addAll(List.of("매매일자", "종목유형", "종목명", "매매수량", "매매총액", "손익율(%)", "비고"));
        List<List<Object>> rows = new ArrayList<>();
        for (TrListRes r : list) {
            List<Object> v = new ArrayList<>(Arrays.asList(r.personOrgName(), r.inOutName(), r.trTypeName()));
            if (preTrYn) {
                v.addAll(Arrays.asList(r.regDate(), r.itemName(), r.expectTrQty(), r.expectTrAmt()));
            }
            v.addAll(Arrays.asList(r.statusName(), r.trDate(), r.trItemTypeName(), r.trItemName(), r.trQty(), r.trAmt(), r.trPlRate(), r.trNote()));
            rows.add(v);
        }
        return FltExcelWriter.write("임직원 매매내역", headers, rows);
    }

    /**
     * 엑셀다운로드 — AS-IS는 Sys99_Print.insertRdTrList + RD 리포트(Flt10_Rd_TrList)에 맡겼다. 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다.
     * "사전신고 포함"을 끄면 그리드가 가리는 열 4개(사전신고일·사전신고종목명·사전신고수량·사전신고금액, setPreTrColumn L247-259)는 쓰지 않는다.
     */
    public byte[] downloadList(UserPrincipal user, String startDate, String closeDate, boolean preTrYn,
                               String trType, String ioType, String searchText) {
        List<TrListRes> list = searchList(user, startDate, closeDate, preTrYn, trType, ioType, searchText);
        List<String> headers = new ArrayList<>(List.of("계좌", "입/출", "매매구분"));
        if (preTrYn) {
            headers.addAll(List.of("사전신고일", "사전신고종목명", "사전신고수량", "사전신고금액"));
        }
        headers.add("사전승인");
        headers.addAll(List.of("매매일자", "종목유형", "종목명", "매매수량", "매매총액", "손익율(%)", "비고"));
        List<List<Object>> rows = new ArrayList<>();
        for (TrListRes r : list) {
            List<Object> v = new ArrayList<>(Arrays.asList(r.accountNo(), r.inOutName(), r.trTypeName()));
            if (preTrYn) {
                v.addAll(Arrays.asList(r.regDate(), r.itemName(), r.expectTrQty(), r.expectTrAmt()));
            }
            v.addAll(Arrays.asList(r.statusName(), r.trDate(), r.trItemTypeName(), r.trItemName(), r.trQty(), r.trAmt(), r.trPlRate(), r.trNote()));
            rows.add(v);
        }
        return FltExcelWriter.write("임직원 매매내역", headers, rows);
    }

    /** AS-IS Flt10_Tr.selectViolate (I10 위반내역조회) — personId를 생략하면 회사 전체 사원 */
    public List<ViolateRes> searchViolate(UserPrincipal user, String stdDate, Long personId) {
        return mapper.selectViolate(user.getCompanyId(), personId, stdDate);
    }

    /** 엑셀다운로드 — AS-IS는 Sys99_Print.insertRdViolate + RD 리포트(Flt10_Rd_Violate). 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다 */
    public byte[] downloadViolate(UserPrincipal user, String stdDate, Long personId) {
        List<String> headers = List.of("본부(부서)", "사원명", "위반내역", "기준정보", "위반정보", "위반거래일", "위반종목명", "사전승인의견", "매매사유");
        List<List<Object>> rows = new ArrayList<>();
        for (ViolateRes r : searchViolate(user, stdDate, personId)) {
            rows.add(Arrays.asList(r.orgName(), r.personName(), r.checkName(), r.checkStd(), r.checkViolate(),
                    r.trDate(), r.trItemName(), r.rejectReason(), r.trNote()));
        }
        return FltExcelWriter.write("임직원매매 위반내역", headers, rows);
    }

    /** AS-IS Flt10_Tr.selectEmpAppr (J06 정기보고현황) — 기준일 시점 재직 사원의 서약서·점검주기·상신상태. 검색어는 `%검색어%`(클라이언트가 붙이던 것) */
    public List<EmpApprRes> searchEmpApprs(UserPrincipal user, String stdDate, boolean unApprYn, String searchText) {
        return mapper.selectEmpAppr(user.getCompanyId(), stdDate, unApprYn, like(searchText));
    }

    /** AS-IS Flt10_Tr.selectByApprId (J06 Flt10_Grid_EmpAppr) — 사원의 기간 내 정기보고 상신문서 */
    public List<EmpApprDocRes> searchEmpApprDocs(UserPrincipal user, Long personId, String startDate, String closeDate) {
        return mapper.selectEmpApprDocs(user.getCompanyId(), personId, startDate, closeDate);
    }

    /** AS-IS Flt10_Tr.deleteAppr (L647) — 폐기 보관(apr99) → 상신문서 삭제 → 매매내역 연결 끊기. 원본과 같이 본인 문서 제한은 없고 회사만 본다 */
    @Transactional
    public void deleteAppr(UserPrincipal user, Long apprId) {
        mapper.insertApprDelAdmin(user.getCompanyId(), user.getUserId(), apprId);
        mapper.deleteApprAdmin(user.getCompanyId(), apprId);
        mapper.clearApprIdAdmin(user.getCompanyId(), apprId);
    }

    private static String blankToAll(String code) {
        return code == null || code.isBlank() ? "%" : code;
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }
}

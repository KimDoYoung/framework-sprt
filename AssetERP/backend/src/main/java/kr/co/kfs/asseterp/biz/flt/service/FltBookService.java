package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookListRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookRes;
import kr.co.kfs.asseterp.biz.flt.dto.LockupStdRes;
import kr.co.kfs.asseterp.biz.flt.mapper.FltBookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** AS-IS server/flt/Flt11_Book.java (selectByText L25, selectByText2 L30), Flt01_CompanyStd.selectByDate L36 — 로그인 사용자(회사·사원) 본인의 보유내역만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltBookService {

    private final FltBookMapper mapper;

    /** AS-IS selectByText2 — 검색어는 `%검색어%`(클라이언트가 붙이던 것) */
    public List<BookRes> searchExpect(UserPrincipal user, Long accountId, String stdDate, String searchText) {
        return mapper.selectBooksExpect(user.getCompanyId(), user.getUserId(), accountId, stdDate,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS selectByText — 검색어는 `%검색어%`(클라이언트가 붙이던 것) */
    public List<BookRes> search(UserPrincipal user, Long accountId, String stdDate, String searchText) {
        return mapper.selectBooks(user.getCompanyId(), user.getUserId(), accountId, stdDate,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS Flt11_Book.selectByBookList (I09 보유내역조회) — 기준일의 보유내역, 검색어는 `%검색어%`(클라이언트가 붙이던 것) */
    public List<BookListRes> searchList(UserPrincipal user, String baseDate, String searchText) {
        return mapper.selectBookList(user.getCompanyId(), user.getUserId(), baseDate,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** 엑셀다운로드 — AS-IS는 Sys99_Print.insertRdBookList + RD 리포트(Flt11_Rd_BookList)에 맡겼다. 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다. */
    public byte[] downloadList(UserPrincipal user, String baseDate, String searchText) {
        List<List<Object>> rows = new ArrayList<>();
        for (BookListRes r : searchList(user, baseDate, searchText)) {
            rows.add(Arrays.asList(r.accountNo(), r.itemTypeName(), r.itemName(), r.bookQty(), r.bookAmt(), r.bookDays(),
                    r.buyDate(), r.yearInvestLimit(), r.totalInvestAmt(), r.turnoverRate()));
        }
        return FltExcelWriter.write("임직원매매 보유내역",
                List.of("계좌", "종목유형", "종목명", "보유수량", "보유금액", "보유기간", "최근매매일", "연간투자금액", "총누적투자금액", "월간매매회전율(%)"),
                rows);
    }

    /** AS-IS Flt11_Book.selectByBookList (J04 준감인 보유내역조회) — personId가 null이면 회사 전체 사원 */
    public List<BookListRes> searchListAdmin(UserPrincipal user, Long personId, String baseDate, String searchText) {
        return mapper.selectBookList(user.getCompanyId(), personId, baseDate,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** 엑셀다운로드 (준감인) — AS-IS는 Sys99_Print.insertRdBookListAdmin + RD 리포트. 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다. */
    public byte[] downloadListAdmin(UserPrincipal user, Long personId, String baseDate, String searchText) {
        List<List<Object>> rows = new ArrayList<>();
        for (BookListRes r : searchListAdmin(user, personId, baseDate, searchText)) {
            rows.add(Arrays.asList(r.personOrgName(), r.checkCycleName(), r.buyDate(), r.accountNo(), r.itemTypeName(), r.itemName(),
                    r.bookQty(), r.bookAmt(), r.bookDays(), r.yearInvestLimit(), r.totalInvestAmt(), r.turnoverRate()));
        }
        return FltExcelWriter.write("임직원매매 보유내역",
                List.of("사원명", "점검주기", "최근매매일", "계좌", "종목유형", "종목명", "보유수량", "보유금액", "보유기간", "연간투자금액", "총누적투자금액", "월간매매회전율(%)"),
                rows);
    }

    /** AS-IS Flt01_CompanyStd.selectByDate — 의무보유기간 기준, 기준관리가 없으면 null */
    public LockupStdRes lockupStd(UserPrincipal user, String stdDate) {
        return mapper.selectLockupStd(user.getCompanyId(), stdDate);
    }
}

package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookRes;
import kr.co.kfs.asseterp.biz.flt.dto.LockupStdRes;
import kr.co.kfs.asseterp.biz.flt.mapper.FltBookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/flt/Flt11_Book.java (selectByText2 L30), Flt01_CompanyStd.selectByDate L36 — 로그인 사용자(회사·사원) 본인의 보유내역만 */
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

    /** AS-IS Flt01_CompanyStd.selectByDate — 의무보유기간 기준, 기준관리가 없으면 null */
    public LockupStdRes lockupStd(UserPrincipal user, String stdDate) {
        return mapper.selectLockupStd(user.getCompanyId(), stdDate);
    }
}

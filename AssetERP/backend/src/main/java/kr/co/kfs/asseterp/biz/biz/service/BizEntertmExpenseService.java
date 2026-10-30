package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizEntertmCompanyRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizEntertmHistoryRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizEntertmMonthRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizEntertmExpenseMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Biz01_Tab_EntertmExpenseReport 탭 3개 → server/biz/Biz01_Promo.java(selectByMonthEntertmExpense·selectByAccountName·selectByTargetCompanyName)
 * + server/biz/Biz02_Person.java(selectByEntertmExpense). 조회 전용.
 * 마감일(closeDate)은 클라이언트 getCloseDate()와 같게 고른 달의 말일이다(월 "전체"는 12월).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizEntertmExpenseService {

    private static final String MANAGER = "관리자";
    private static final String REAL_USER = "실사용자";

    private final BizEntertmExpenseMapper mapper;
    private final BizCardManagementService cardManagementService;

    public List<BizEntertmMonthRes> searchMonthly(UserPrincipal user, String year, String month, String cardRealUserType) {
        return mapper.selectMonthly(user.getCompanyId(), checkYear(year), closeDate(year, month), realUserType(user, cardRealUserType));
    }

    public List<BizEntertmHistoryRes> searchHistory(UserPrincipal user, String year, String month, String cardRealUserType) {
        return mapper.selectHistory(user.getCompanyId(), checkYear(year), closeDate(year, month), realUserType(user, cardRealUserType));
    }

    public List<BizEntertmCompanyRes> searchCompanies(UserPrincipal user, String year, String month) {
        return mapper.selectCompanies(user.getCompanyId(), checkYear(year), closeDate(year, month));
    }

    public List<BizEntertmHistoryRes> searchByTargetCompany(UserPrincipal user, String year, String month, String cardRealUserType, String targetCompanyName) {
        if (targetCompanyName == null || targetCompanyName.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return mapper.selectByTargetCompany(user.getCompanyId(), checkYear(year), closeDate(year, month), realUserType(user, cardRealUserType), targetCompanyName);
    }

    /** 클라이언트 retrieveTabpage L270-286: 실사용자 관리를 쓰는 회사만 콤보 값, 아니면 "관리자" */
    private String realUserType(UserPrincipal user, String cardRealUserType) {
        return cardManagementService.isCardRealUser(user) && REAL_USER.equals(cardRealUserType) ? REAL_USER : MANAGER;
    }

    private static String checkYear(String year) {
        if (year == null || !year.matches("\\d{4}")) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return year;
    }

    /** getCloseDate() L437-445 + getMonth() L447-479: 고른 달의 말일, "전체"는 12월 */
    private static LocalDate closeDate(String year, String month) {
        checkYear(year);
        int m;
        try {
            m = "전체".equals(month) ? 12 : Integer.parseInt(month);
        } catch (NumberFormatException | NullPointerException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        if (m < 1 || m > 12) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return LocalDate.of(Integer.parseInt(year), m, 1).plusMonths(1).minusDays(1);
    }
}

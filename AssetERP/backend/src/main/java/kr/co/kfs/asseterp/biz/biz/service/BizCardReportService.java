package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportItemSumRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportMonthAmtRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportPersonRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardReportPrintRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizCardReportMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Biz01_Tab_CardReport [조회] → sys.Sys99_Print.insertCardReport(L415)·insertCardReport2(L510)·insertCardReport3(L561).
 * 세 보고서의 출력 자료(sys99_print)를 차례로 만든다. 원본은 세 서비스를 클라이언트가 이어 부르지만 하나의 API로 묶는다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizCardReportService {

    /** 보고서마다 windowClassName이 다르다 (AS-IS retrieve() L194-270) */
    private static final String WINDOW1 = "Biz01_Tab_CardReport";
    private static final String WINDOW2 = "Biz01_Tab_CardReport2";
    private static final String WINDOW3 = "Biz01_Tab_CardReport3";
    private static final String MANAGER = "관리자";

    private final BizCardReportMapper mapper;
    private final BizCardManagementService cardManagementService;

    @Transactional
    public BizCardReportPrintRes print(UserPrincipal user, BizCardReportPrintReq req) {
        int month = parseMonth(req.month());
        String year = req.year();
        if (year == null || !year.matches("\\d{4}")) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        // 클라이언트 L196-201: 실사용자 관리를 쓰는 회사만 콤보 값, 아니면 "관리자"
        String type = cardManagementService.isCardRealUser(user) && "실사용자".equals(req.cardRealUserType()) ? "실사용자" : MANAGER;
        LocalDate startDate = LocalDate.of(Integer.parseInt(year), month, 1);
        LocalDate closeDate = startDate.plusMonths(1).minusDays(1);
        String mm = String.format("%02d", month);

        String g1 = String.valueOf(print1(user, year, mm, startDate, closeDate, type));
        String g2 = String.valueOf(print2(user, year, startDate, closeDate));
        String g3 = String.valueOf(print3(user, year, closeDate, type));
        return new BizCardReportPrintRes(g1, g2, g3);
    }

    /** insertCardReport L415-508 — 사용자별 사용항목 합계 */
    private long print1(UserPrincipal user, String year, String month, LocalDate startDate, LocalDate closeDate, String type) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        long seq = 0;
        mapper.deletePrint(companyId, personId, WINDOW1);
        boolean manager = MANAGER.equals(type);
        List<BizCardReportPersonRes> persons = manager ? mapper.selectCardPersons(companyId, year) : mapper.selectRealPersons(companyId, year, closeDate);
        for (BizCardReportPersonRes person : persons) {
            seq++;
            List<BizCardReportItemSumRes> items = mapper.selectItemSumsByPerson(companyId, person.personId(), year, month, startDate, type);
            for (BizCardReportItemSumRes item : items) {
                // 관리자 기준은 사원ID = 카드 사용자(공통 0), 실사용자 기준은 원본이 모델의 personId(select에 없음 → null → 0)를 쓴다
                long empId = manager && person.personId() != null ? person.personId() : 0L;
                mapper.insertPrint1(mapper.selectNextId(), companyId, personId, WINDOW1, groupId, seq, empId, person.personName(),
                        item.useItemName(), nz(item.useItemSum()));
            }
        }
        return groupId;
    }

    /** insertCardReport2 L510-559 — 월별(1~12월) 사용항목 합계 */
    private long print2(UserPrincipal user, String year, LocalDate startDate, LocalDate closeDate) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        long seq = 0;
        mapper.deletePrint(companyId, personId, WINDOW2);
        for (int i = 1; i <= 12; i++) {
            seq++;
            for (BizCardReportItemSumRes item : mapper.selectItemSumsByMonth(companyId, year, i, startDate, closeDate)) {
                mapper.insertPrint2(mapper.selectNextId(), companyId, personId, WINDOW2, groupId, seq, i + "월",
                        item.useItemName(), nz(item.useItemSum()), item.useItemCode());
            }
        }
        return groupId;
    }

    /** insertCardReport3 L561-648 — 사용자별 월별 사용금액 */
    private long print3(UserPrincipal user, String year, LocalDate closeDate, String type) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, WINDOW3);
        List<BizCardReportMonthAmtRes> rows = MANAGER.equals(type)
                ? mapper.selectMonthAmtByManager(companyId, year, closeDate)
                : mapper.selectMonthAmtByRealUser(companyId, year, closeDate);
        for (BizCardReportMonthAmtRes row : rows) {
            mapper.insertPrint3(mapper.selectNextId(), companyId, personId, WINDOW3, groupId, row);
        }
        return groupId;
    }

    private static int parseMonth(String month) {
        try {
            int m = Integer.parseInt(month);
            if (m >= 1 && m <= 12) {
                return m;
            }
        } catch (NumberFormatException ignored) {
            // 아래에서 거절
        }
        throw new BusinessException(ErrorCode.INVALID_INPUT);
    }

    private static long nz(Long value) {
        return value == null ? 0L : value;
    }
}

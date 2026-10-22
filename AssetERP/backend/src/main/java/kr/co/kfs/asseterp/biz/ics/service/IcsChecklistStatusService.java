package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusCount;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusDetailRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusOrder;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsChecklistStatusMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * AS-IS Ics15_Tab_ChecklistStatus → server/sys/Sys99_Print.insertIcsCheckListStatus L238 + ics.Ics11_ChecklistCompany.selectByChecklistIdStatus L26
 * — K07 내부통제내역 현황(준감인). AS-IS는 기준일마다 읽은 건수를 sys99_print에 쌓고 다시 합쳐 읽지만, 여기서는 쌓지 않고 메모리에서 합친다(DB를 바꾸지 않는다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsChecklistStatusService {

    private final IcsChecklistStatusMapper mapper;

    /**
     * AS-IS insertIcsCheckListStatus: 그 해의 월(분기) 말일마다 체크리스트별 미체크·미확인 건수를 읽어 월별 칸("체크 / 확인" O·X)으로 합친다.
     * 기준월(지난 달·지난 분기) 이후의 칸은 "-". 기준월은 오늘 기준이다
     */
    public List<IcsChecklistStatusRes> summary(UserPrincipal user, String year, String cycleType, Long checklistLClassId, Long checklistMClassId, String searchText) {
        Long companyId = user.getCompanyId();
        String like = like(searchText);
        boolean monthly = "M".equals(cycleType);
        List<LocalDate> days = monthly ? mapper.selectMonthLastDays(companyId, year) : mapper.selectQuarterLastDays(companyId, year);
        LocalDate stdDate = monthly ? mapper.selectPreMonthLastDay(LocalDate.now()) : mapper.selectPreQuarterCloseDate(LocalDate.now(), "1");

        Map<String, Row> rows = new LinkedHashMap<>();
        for (LocalDate day : days) {
            for (IcsChecklistStatusCount c : mapper.selectCounts(companyId, cycleType, day, checklistLClassId, checklistMClassId, like)) {
                Row row = rows.computeIfAbsent(c.checklistId() + "|" + c.checkLClassName() + "|" + c.checkMClassName(), k -> new Row(c));
                row.unCheck[day.getMonthValue() - 1] += c.unCheckCnt();
                row.unConfirm[day.getMonthValue() - 1] += c.unConfirmCnt();
            }
        }
        if (rows.isEmpty()) return List.of();

        long stdMonth = stdDate.getYear() * 100L + stdDate.getMonthValue();
        long yyyy = Long.parseLong(year);
        List<Long> ids = rows.values().stream().map(r -> r.count.checklistId()).distinct().toList();
        List<IcsChecklistStatusRes> result = new ArrayList<>();
        for (IcsChecklistStatusOrder order : mapper.selectOrder(companyId, stdDate, ids)) {
            for (Row row : rows.values()) {
                if (!row.count.checklistId().equals(order.checklistId())) continue;
                List<String> months = new ArrayList<>();
                for (int m = 1; m <= 12; m++) {
                    months.add(stdMonth < yyyy * 100 + m ? "-"
                            : (row.unCheck[m - 1] == 0 ? "O" : "X") + " / " + (row.unConfirm[m - 1] == 0 ? "O" : "X"));
                }
                result.add(new IcsChecklistStatusRes(order.checklistId(), row.count.checkLClassName(), row.count.checkMClassName(), order.content(), months));
            }
        }
        return result;
    }

    /** AS-IS selectByChecklistIdStatus: 한 체크리스트의 담당자별 내역 (stdDate = 기준 분기(월)의 말일) */
    public List<IcsChecklistStatusDetailRes> byChecklist(UserPrincipal user, LocalDate stdDate, String cycleType, Long checklistId, boolean unCheckYn, boolean unConfirmYn) {
        return mapper.selectByChecklistId(user.getCompanyId(), stdDate, cycleType, checklistId, unCheckYn, unConfirmYn);
    }

    /** AS-IS selectChecklistStatusPaging (K08): 목록 + 전체 건수. 검색어가 비면 AS-IS처럼 조건을 걸지 않는다(null) */
    public PageRes<IcsChecklistStatusDetailRes> search(UserPrincipal user, LocalDate stdDate, String cycleType, Long checklistLClassId, Long checklistMClassId,
                                                       String searchText, boolean unCheckYn, boolean unConfirmYn, int offset, int limit) {
        String like = searchText == null || searchText.isEmpty() ? null : like(searchText);
        return new PageRes<>(mapper.selectTotal(user.getCompanyId(), stdDate, cycleType, checklistLClassId, checklistMClassId, like, unCheckYn, unConfirmYn),
                mapper.selectPaging(user.getCompanyId(), stdDate, cycleType, checklistLClassId, checklistMClassId, like, unCheckYn, unConfirmYn, offset, limit));
    }

    /**
     * 출력/다운로드 — AS-IS는 Sys99_Print.insertRdChecklistDetail(sys99_print에 쌓음) + RD 리포트 Ics15_Rd_ChecklistDetail.
     * RD 서버가 없으므로 RD에 싣던 값(대분류·중분류·체크결과·담당부서·담당자·확인자·확인여부)을 한 시트에 쓴다. 전체 건수만큼 한 번에 읽고 검색어는 항상 '%…%'다(AS-IS와 같다)
     */
    public byte[] download(UserPrincipal user, LocalDate stdDate, String cycleType, Long checklistLClassId, Long checklistMClassId,
                           String searchText, boolean unCheckYn, boolean unConfirmYn) {
        String like = like(searchText);
        long total = mapper.selectTotal(user.getCompanyId(), stdDate, cycleType, checklistLClassId, checklistMClassId, like, unCheckYn, unConfirmYn);
        List<List<Object>> rows = total == 0 ? List.of() : mapper.selectPaging(user.getCompanyId(), stdDate, cycleType,
                        checklistLClassId, checklistMClassId, like, unCheckYn, unConfirmYn, 0, total).stream()
                .map(r -> Arrays.<Object>asList(r.checkLClassName(), r.checkMClassName(), r.reason(), r.orgName(), r.personName(), r.confirmerName(),
                        Boolean.TRUE.equals(r.confirmYn()) ? "확인" : ""))
                .toList();
        return IcsExcelWriter.write("내부통제내역 상세", List.of("대분류", "중분류", "체크결과", "담당부서", "담당자", "확인자", "확인여부"), rows);
    }

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }

    private static final class Row {
        final IcsChecklistStatusCount count;
        final long[] unCheck = new long[12];
        final long[] unConfirm = new long[12];

        Row(IcsChecklistStatusCount count) {
            this.count = count;
        }
    }
}

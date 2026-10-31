package kr.co.kfs.asseterp.biz.emp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.service.link.UnLeaveNoticeHtml;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveApprReq;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveEtcRange;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveNoticeRow;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpUnLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * V39 미사용 연차·월차 [상신] — 선택한 사원마다 결재문서(상태 30 결재완료)를 서버가 직접 만든다.
 * AS-IS emp.Emp21_UnLeave.insertAppr(L159-385, 연차 탭)·insertAppr2(L387-601, 월차 탭). 사용 시기 지정일 배정 알고리즘과 문구는 원본 그대로다
 * (이상한 곳은 docs/원본-이상한점.md #95~#97).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpUnLeaveApprService {

    private final EmpUnLeaveMapper mapper;

    /** AS-IS emp.Emp21_UnLeave.insertAppr (연차 탭: 구분 01 사용촉진 통지서 / 02 사용일시 지정 통보서) → 만든 결재문서 수 */
    @Transactional
    public int createYear(UserPrincipal user, UnLeaveApprReq req) {
        checkReq(req);
        Long companyId = user.getCompanyId();
        Long regEmpId = user.getUserId();
        List<UnLeaveNoticeRow> rows = pick(mapper.selectNoticeYear(companyId, req.stdYear(), "%", req.ids()), req.ids());

        LocalDate today = LocalDate.now();
        // 첫 행의 구분으로 기간을 정한다: 01은 오늘+10일이 속한 해의 결산월 6개월 전부터, 02는 2개월 전부터
        String firstCode = rows.get(0).unLeaveCode();
        LocalDate base = today;
        int monthDel = 0;
        if ("01".equals(firstCode)) {
            base = today.plusDays(10);
            monthDel = 6;
        } else if ("02".equals(firstCode)) {
            monthDel = 2;
        }
        String leaveMonth = mapper.selectLeaveMonthCode(companyId);
        if (leaveMonth == null || !leaveMonth.matches("\\d{1,2}")) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "회사의 휴가 결산월이 지정되어 있지 않습니다.");
        }
        LocalDate startDate = LocalDate.of(base.getYear(), Integer.parseInt(leaveMonth), 1).minusMonths(monthDel);
        // AS-IS 그대로: 마지막 날은 시작월(startDate)의 말일 숫자를 쓴다 (이상한점 #95)
        LocalDate closeDate = startDate.plusMonths(monthDel).withDayOfMonth(startDate.lengthOfMonth());
        List<LocalDate> workDays = mapper.selectWorkDays(companyId, startDate, closeDate);

        int workDayIndex = 0;
        for (UnLeaveNoticeRow row : rows) {
            String title;
            String content;
            if ("01".equals(row.unLeaveCode())) {
                title = "미사용 연차유급휴가일수 통지서_" + row.personName() + "_" + row.unLeaveName();
                content = UnLeaveNoticeHtml.html1_01(row, base, today);
            } else {
                List<LocalDate> standardDates = new ArrayList<>();
                for (int i = 0; i < Math.ceil(row.remainDays()); i++) {
                    if (workDayIndex >= workDays.size()) {
                        workDayIndex = 0;
                    }
                    if (workDays.isEmpty()) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, "영업일 달력이 없어 사용 시기를 지정할 수 없습니다.");
                    }
                    standardDates.add(workDays.get(workDayIndex++));
                }
                List<UnLeaveEtcRange> etc = mapper.selectEtcLeaveRanges(companyId, row.personId(), startDate, closeDate);
                // AS-IS 그대로: 연차 탭은 특별휴가의 종료일에도 시작일을 쓴다 (이상한점 #96)
                List<LocalDate> assigned = assign(standardDates, workDays, etc, row.remainDays(), true, today.plusDays(1));
                List<List<String>> parts = monthParts(assigned, row.remainDays());
                title = "미사용 연차 유급휴가 사용일시 지정 통보서_" + row.personName() + "_" + row.unLeaveName();
                content = UnLeaveNoticeHtml.html1_02(row, base, today, parts.get(0), parts.get(1), parts.get(2));
            }
            insertDoc(companyId, regEmpId, req.classTreeId(), row, today, title, content);
        }
        return rows.size();
    }

    /** AS-IS emp.Emp21_UnLeave.insertAppr2 (월차 탭: 구분 03·05 통지서 / 04·06 사용일시 지정 통보서) → 만든 결재문서 수 */
    @Transactional
    public int createMonth(UserPrincipal user, UnLeaveApprReq req) {
        checkReq(req);
        Long companyId = user.getCompanyId();
        Long regEmpId = user.getUserId();
        List<UnLeaveNoticeRow> rows = pick(mapper.selectNoticeMonth(companyId, req.stdYear(), "%", req.ids()), req.ids());

        LocalDate today = LocalDate.now();
        for (UnLeaveNoticeRow row : rows) {
            LocalDate base = today;
            if ("03".equals(row.unLeaveCode())) {
                base = today.plusDays(10);
            } else if ("05".equals(row.unLeaveCode())) {
                base = today.plusDays(5);
            }
            // 사원마다 기간이 다르다: 생성일 ~ 휴가 사용대상 종료일
            LocalDate startDate = row.startDate();
            LocalDate closeDate = row.leaveTargetCloseDate();
            List<LocalDate> workDays = mapper.selectWorkDays(companyId, startDate, closeDate);

            String title;
            String content;
            if ("03".equals(row.unLeaveCode()) || "05".equals(row.unLeaveCode())) {
                title = "미사용 월차유급휴가일수 통지서_" + row.personName() + "_" + row.unLeaveName();
                content = UnLeaveNoticeHtml.html2_01(row, base, today);
            } else {
                List<LocalDate> standardDates = new ArrayList<>();
                for (int i = 0; i < row.remainDays(); i++) {
                    if (i < workDays.size()) {
                        standardDates.add(workDays.get(i));
                    } else {
                        break;
                    }
                }
                List<UnLeaveEtcRange> etc = mapper.selectEtcLeaveRanges(companyId, row.personId(), startDate, closeDate);
                List<LocalDate> assigned = assign(standardDates, workDays, etc, row.remainDays(), false, today.plusDays(1));
                List<List<String>> parts = monthParts(assigned, row.remainDays());
                title = "미사용 월차 유급휴가 사용일시 지정 통보서_" + row.personName() + "_" + row.unLeaveName();
                content = UnLeaveNoticeHtml.html2_02(row, base, today, parts.get(0), parts.get(1), parts.get(2));
            }
            insertDoc(companyId, regEmpId, req.classTreeId(), row, today, title, content);
        }
        return rows.size();
    }

    // ───── 공통 ─────

    private static void checkReq(UnLeaveApprReq req) {
        if (req == null || req.stdYear() == null || !req.stdYear().matches("\\d{4}") || req.classTreeId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "문서분류를 먼저 선택해주세요");
        }
        if (req.ids() == null || req.ids().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사원을 선택해주세요");
        }
    }

    /** 요청한 행 순서대로 돌려준다(AS-IS는 그리드에서 선택한 순서). 없는 행이 있으면 오류 */
    private static List<UnLeaveNoticeRow> pick(List<UnLeaveNoticeRow> found, List<Long> ids) {
        Map<Long, UnLeaveNoticeRow> byId = new LinkedHashMap<>();
        for (UnLeaveNoticeRow r : found) {
            byId.put(r.unLeaveId(), r);
        }
        List<UnLeaveNoticeRow> ordered = new ArrayList<>();
        for (Long id : ids) {
            UnLeaveNoticeRow r = byId.get(id);
            if (r == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "미사용휴가 정보를 찾을 수 없습니다.");
            }
            ordered.add(r);
        }
        return ordered;
    }

    /**
     * 사용 시기 지정일 배정: 기준 영업일 중 내일 이후이고 특별휴가와 겹치지 않는 날을 담고, 모자라면 뒤의 영업일로 채운다.
     * (특별휴가가 둘 이상이면 같은 날이 겹쳐 담긴다 — AS-IS 그대로, 이상한점 #97)
     */
    private static List<LocalDate> assign(List<LocalDate> standardDates, List<LocalDate> workDays, List<UnLeaveEtcRange> etc,
                                          double remainDays, boolean closeIsStart, LocalDate tomorrow) {
        List<LocalDate> assigned = new ArrayList<>();
        if (!etc.isEmpty()) {
            for (UnLeaveEtcRange e : etc) {
                LocalDate s = e.startDate();
                LocalDate c = closeIsStart ? e.startDate() : e.closeDate();
                for (LocalDate d : standardDates) {
                    if (!d.isBefore(s) && !d.isAfter(c)) {
                        continue;
                    }
                    if (d.isBefore(tomorrow)) {
                        continue;
                    }
                    assigned.add(d);
                }
            }
        } else {
            for (LocalDate d : standardDates) {
                if (d.isBefore(tomorrow)) {
                    continue;
                }
                assigned.add(d);
            }
        }
        int currentIndex = standardDates.size();
        while (assigned.size() < remainDays && currentIndex < workDays.size()) {
            LocalDate next = workDays.get(currentIndex);
            if (!next.isBefore(tomorrow)) {
                assigned.add(next);
            }
            currentIndex++;
        }
        return assigned;
    }

    /** 월별 표: [월 목록, 일 목록("05,06"), 사용일수 목록]. 잔여일수에 소수가 있으면 첫 달 일수에서 뺀다 */
    private static List<List<String>> monthParts(List<LocalDate> assigned, double number) {
        Map<String, Set<String>> monthDays = new LinkedHashMap<>();
        Map<String, Integer> dayCount = new LinkedHashMap<>();
        for (LocalDate d : assigned) {
            String month = String.format("%02d", d.getMonthValue());
            String day = String.format("%02d", d.getDayOfMonth());
            monthDays.computeIfAbsent(month, k -> new LinkedHashSet<>()).add(day);
            dayCount.put(month, dayCount.getOrDefault(month, 0) + 1);
        }
        List<String> months = new ArrayList<>();
        List<String> days = new ArrayList<>();
        List<String> counts = new ArrayList<>();
        boolean decimal = (number - Math.floor(number)) != 0;
        List<String> sortedMonths = new ArrayList<>(monthDays.keySet());
        sortedMonths.sort(Comparator.comparingInt(Integer::parseInt));
        for (String month : sortedMonths) {
            months.add(month);
            days.add(String.join(",", monthDays.get(month)));
            if (decimal) {
                counts.add((dayCount.get(month) - (1 - (number - Math.floor(number)))) + "");
                decimal = false;
            } else {
                counts.add(dayCount.get(month) + "");
            }
        }
        return List.of(months, days, counts);
    }

    /** 결재문서 한 건 + 결재선(상신 승인, 대상자가 상신자와 다르면 참조) + 미사용휴가 행에 문서 ID 연결 */
    private void insertDoc(Long companyId, Long regEmpId, Long classTreeId, UnLeaveNoticeRow row, LocalDate today,
                           String title, String content) {
        Long apprId = mapper.selectNextId();
        LocalDateTime midnight = today.atStartOfDay();
        mapper.insertNoticeAppr(apprId, companyId, regEmpId, classTreeId, midnight, midnight, "30", "20", title, content);

        // 00 상신 · 10 순서 · 20 승인(오늘)
        mapper.insertNoticeStep(mapper.selectNextId(), apprId, "00", "10", "20", LocalDateTime.now(), regEmpId, regEmpId);
        if (!row.personId().equals(regEmpId)) {
            // 30 참조 · 20 순서 · 상태·결재일·실결재자 없음
            mapper.insertNoticeStep(mapper.selectNextId(), apprId, "30", "20", null, null, row.personId(), null);
        }
        mapper.updateNoticeApprId(companyId, row.unLeaveId(), apprId);
    }
}

package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.YearLeaveRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpYearLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/** 연월차휴가 현황 (AS-IS Emp20_Tab_YearList) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpYearLeaveService {

    private static final String WINDOW_CLASS_NAME = "Emp20_Tab_YearList";
    /** 월차 계산기준일 구분: 1 현재 / 2 기준연도말 / 3 특정일 */
    private static final Set<String> STD_DATE_TYPES = Set.of("1", "2", "3");
    /** 재직구분: 100 재직 / 900 퇴직 / 000 전체 */
    private static final Set<String> RETIRE_TYPES = Set.of("100", "900", "000");

    private final EmpYearLeaveMapper mapper;

    /** AS-IS emp.Emp01_Person.selectByYearList(companyId, stdYear, monthStdDateType, stdDate, retireType) */
    public List<YearLeaveRes> searchYearList(UserPrincipal user, String stdYear, String monthStdDateType, LocalDate stdDate, String retireType) {
        check(stdYear, monthStdDateType, retireType);
        return mapper.selectYearList(user.getCompanyId(), stdYear, monthStdDateType, stdDate(stdDate), retireType);
    }

    /** AS-IS Sys99_Print.insertRdYearList L2248: ① 내 출력 자료 정리 ② 목록을 sys99_print 에 삽입 ③ 새 groupId 반환 */
    @Transactional
    public String insertRdPrint(UserPrincipal user, String stdYear, String monthStdDateType, LocalDate stdDate, String retireType) {
        check(stdYear, monthStdDateType, retireType);
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId,
                stdYear, monthStdDateType, stdDate(stdDate), retireType);
        return String.valueOf(groupId);
    }

    private static LocalDate stdDate(LocalDate stdDate) {
        return stdDate != null ? stdDate : LocalDate.now();
    }

    private static void check(String stdYear, String monthStdDateType, String retireType) {
        if (stdYear == null || !stdYear.matches("\\d{4}")
                || !STD_DATE_TYPES.contains(monthStdDateType) || !RETIRE_TYPES.contains(retireType)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
    }
}

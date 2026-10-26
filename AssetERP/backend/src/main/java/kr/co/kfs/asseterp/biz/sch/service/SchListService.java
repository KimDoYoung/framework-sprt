package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04CheckStatusRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04CheckStatusSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04DailyCheckRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04DailyCheckStatusReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListResultReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04TodoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04TodoSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04TodoSearchCond;
import kr.co.kfs.asseterp.biz.sch.mapper.SchListMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

/** AS-IS server/sch/Sch04_List.java (selectByIcs L171 / updateConfirm L396 / upsert L436) + sys.Sys99_Print.insertRdIcsList (H06 Sch04_Tab_IcsList) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchListService {

    private final SchListMapper mapper;
    private final EmpTransInfoService transInfoService;

    private static final String[] ICS_HEADERS = {"마감일", "담당부서", "처리자", "처리구분", "처리일", "처리결과", "확인여부", "법규명", "관련조문", "원인문서", "발생일", "발생구분", "주기구분", "일임(자문)"};

    /**
     * AS-IS Sch04_List.selectByIcs L171: 조회 기간을 영업일로 한 칸씩 넓힌 값(startDateCalc '-1', closeDateCalc '+1')을 만들어 SQL에 넘긴다.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0. scheduleCode·cycleCode는 전체가 '%', 검색어는 서비스가 %…%로 만든다(빈 글자면 %%)
     */
    public List<Sch04ListRes> searchIcs(UserPrincipal user, LocalDate startDate, LocalDate closeDate, boolean doneExceptYn, String scheduleCode,
                                        String cycleCode, String searchText, boolean advisYn) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return select(user, orgId, false, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, searchText, advisYn);
    }

    /**
     * AS-IS Sch04_Tab_IcsListManager.retrieve (managerYn=true): 같은 selectByIcs를 관리자 모드로 부른다.
     * orgId는 화면의 담당부서 조회창에서 고른 조직 — 없으면(null, "전체") 조직·권한 조건 없이 회사 전체 건을 읽는다
     */
    public List<Sch04ListRes> searchIcsManager(UserPrincipal user, Long orgId, LocalDate startDate, LocalDate closeDate, boolean doneExceptYn,
                                               String scheduleCode, String cycleCode, String searchText, boolean advisYn) {
        return select(user, orgId, true, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, searchText, advisYn);
    }

    private List<Sch04ListRes> select(UserPrincipal user, Long orgId, boolean managerYn, LocalDate startDate, LocalDate closeDate, boolean doneExceptYn,
                                      String scheduleCode, String cycleCode, String searchText, boolean advisYn) {
        LocalDate startDateCalc = mapper.selectBizDate(user.getCompanyId(), startDate, "-1");
        LocalDate closeDateCalc = mapper.selectBizDate(user.getCompanyId(), closeDate, "+1");
        return mapper.selectByIcs(new Sch04ListSearchCond(user.getCompanyId(), user.getUserId(), orgId, startDate, closeDate, startDateCalc, closeDateCalc,
                doneExceptYn, blankToAny(scheduleCode), blankToAny(cycleCode), managerYn, "%" + (searchText == null ? "" : searchText) + "%", advisYn));
    }

    /**
     * AS-IS Sch04_List.upsert L436: 그리드에서 고친 행마다 sch04_list에 있으면(selectById) updatePersonId, 없으면(UNION이 만든 미처리 건) 새 ID로 insert.
     * 처리자(personId)는 로그인 사용자. 회사는 로그인 회사(AS-IS는 모델 값)
     */
    @Transactional
    public void upsert(UserPrincipal user, List<Sch04ListSaveReq> rows) {
        for (Sch04ListSaveReq r : rows) {
            if (mapper.selectById(user.getCompanyId(), r.listId()) == null) {
                mapper.insert(mapper.selectNextId(), user.getCompanyId(), user.getUserId(), r);
            } else {
                mapper.updatePersonId(user.getCompanyId(), r.listId(), user.getUserId(), r.manageDate(), r.statusCode());
            }
        }
    }

    /**
     * AS-IS Sch04_Tab_ToDoList.retrieve L364-401 → Sch04_List.selectByManagerId L34: 기준일 하루(endDate가 없으면 startDate), 공유구분은 항상 나의 스케줄('1'),
     * 처리여부(전체 '%')·분류(없으면 전체)·완료건 제외·취소건 제외·조회 기준(처리일/마감일). 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0.
     * 검색어는 화면이 항상 '%'를 보낸다
     */
    public List<Sch04TodoRes> searchTodo(UserPrincipal user, boolean manageCheck, LocalDate startDate, boolean exceptYn, boolean cancelYn,
                                         String statusCode, Long classId) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByManagerId(new Sch04TodoSearchCond(user.getCompanyId(), user.getUserId(), orgId, String.valueOf(manageCheck), startDate, startDate,
                "1", String.valueOf(exceptYn), String.valueOf(cancelYn), blankToAny(statusCode), classId, "%"));
    }

    /**
     * AS-IS Sch04_List.insertCheck L207-252: 고친 행마다 sch04_list에 있으면(selectById) 처리여부·처리일·담당자·비고만 confirmUpdate(처리일은 미처리·취소면 마감일),
     * 없으면(UNION이 만든 미처리 건) 새 ID로 insert. 회사는 로그인 회사(AS-IS는 모델 값)
     */
    @Transactional
    public void saveTodo(UserPrincipal user, List<Sch04TodoSaveReq> rows) {
        for (Sch04TodoSaveReq r : rows) {
            if (mapper.selectById(user.getCompanyId(), r.listId()) == null) {
                Sch04ListSaveReq ins = new Sch04ListSaveReq(null, r.closeDate(), r.manageDate(), r.infoId(), r.title(), r.scheduleCode(), r.cycleCode(),
                        r.managerId(), r.statusCode(), r.note(), r.deadlineId(), null, r.mngOrgId());
                mapper.insert(mapper.selectNextId(), user.getCompanyId(), r.personId(), ins);
            } else {
                mapper.confirmUpdate(user.getCompanyId(), r.listId(), r.statusCode(), r.manageDate(), r.personId(), r.note());
            }
        }
    }

    /**
     * AS-IS Sch04_Tab_DailyCheckList.retrieve L335-373 → Sch04_List.selectByManagerId L34: 기준일 하루(endDate가 없으면 startDate), 나의 스케줄('1'), 처리일 기준(manageCheck 'true'),
     * 완료건 제외 안 함·취소건 제외·처리여부 전체. 분류(classId)와 검색어(구분/제목/담당부서·처리자에 들어 있는 글자)만 화면이 정한다.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0. 검색어는 서비스가 %…%로 만든다
     */
    public List<Sch04DailyCheckRes> searchDailyCheck(UserPrincipal user, LocalDate startDate, Long classId, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByDailyCheck(new Sch04TodoSearchCond(user.getCompanyId(), user.getUserId(), orgId, "true", startDate, startDate,
                "1", "false", "true", "%", classId, searchText == null || searchText.isEmpty() ? "%" : "%" + searchText + "%"));
    }

    /**
     * AS-IS Sch04_List.statusUpdateCheck L254-316: 같은 일정·담당자·마감일 행이 있으면(selectByCheck) 처리여부·처리일·처리자만 바꾸고(updateStatusCode),
     * 없으면(UNION이 만든 미처리 건) 새 ID로 insert. 어느 쪽이든 행의 listId를 돌려준다. 처리자는 로그인 사용자, 회사는 로그인 회사(AS-IS는 모델 값)
     */
    @Transactional
    public Long updateStatus(UserPrincipal user, Sch04DailyCheckStatusReq r) {
        Long found = mapper.selectByCheck(user.getCompanyId(), r.infoId(), r.managerId(), r.closeDate());
        if (found != null) {
            mapper.updateStatusCode(user.getCompanyId(), found, r.statusCode(), r.manageDate(), user.getUserId());
            return found;
        }
        long listId = mapper.selectNextId();
        Sch04ListSaveReq ins = new Sch04ListSaveReq(null, r.closeDate(), r.manageDate(), r.infoId(), r.title(), r.scheduleCode(), r.cycleCode(),
                r.managerId(), r.statusCode(), r.note(), r.deadlineId(), null, r.mngOrgId());
        mapper.insert(listId, user.getCompanyId(), user.getUserId(), ins);
        return listId;
    }

    /**
     * AS-IS Sch04_Tab_DailyCheckListStatus.retrieve L181-205 → Sch04_List.selectCheckListStatus L101: 로그인 사용자가 처리한(처리자) 데일리 체크 건을 처리일 기간으로 읽는다.
     * 처리여부(전체 '%')·분류(없으면 전체)·검색어(체크항목/체크내용에 들어 있는 글자, 서비스가 %…%로 만든다)
     */
    public List<Sch04CheckStatusRes> searchCheckStatus(UserPrincipal user, LocalDate startDate, LocalDate endDate, String statusCode, Long classId, String searchText) {
        return mapper.selectCheckListStatus(new Sch04CheckStatusSearchCond(user.getCompanyId(), user.getUserId(), startDate, endDate, blankToAny(statusCode), classId,
                "%" + (searchText == null ? "" : searchText) + "%"));
    }

    /**
     * AS-IS Sch04_List.updateConfirm L396: type U 처리결과(note) 저장 / P 확인(확인자=로그인 사용자, 오늘) / C 확인취소. 바뀐 한 행(selectById)을 돌려준다
     */
    @Transactional
    public Sch04ListRes updateResult(UserPrincipal user, Long listId, Sch04ListResultReq req) {
        Long companyId = user.getCompanyId();
        if ("U".equals(req.type())) {
            mapper.updateNote(companyId, listId, req.note());
        } else if ("P".equals(req.type())) {
            mapper.updateConfirm(companyId, listId, "true", LocalDate.now(), user.getUserId());
        } else if ("C".equals(req.type())) {
            mapper.updateConfirm(companyId, listId, "false", null, null);
        } else {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "type은 U, P, C 중 하나여야 합니다.");
        }
        Sch04ListRes row = mapper.selectById(companyId, listId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "처리 대상을 찾을 수 없습니다.");
        }
        return row;
    }

    /** AS-IS rdButton(sys.Sys99_Print.insertRdIcsList + RD 리포트 Sch04_Rd_IcsList) — 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다 */
    public byte[] downloadIcs(UserPrincipal user, LocalDate startDate, LocalDate closeDate, boolean doneExceptYn, String scheduleCode,
                              String cycleCode, String searchText, boolean advisYn) {
        return toExcel(searchIcs(user, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, searchText, advisYn));
    }

    /** AS-IS Sch04_Tab_IcsListManager.rdButton (managerYn=true) — 관리자 조회 결과 xlsx */
    public byte[] downloadIcsManager(UserPrincipal user, Long orgId, LocalDate startDate, LocalDate closeDate, boolean doneExceptYn, String scheduleCode,
                                     String cycleCode, String searchText, boolean advisYn) {
        return toExcel(searchIcsManager(user, orgId, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, searchText, advisYn));
    }

    private byte[] toExcel(List<Sch04ListRes> rows) {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("법규보고 점검");
            Row header = sheet.createRow(0);
            for (int i = 0; i < ICS_HEADERS.length; i++) {
                header.createCell(i).setCellValue(ICS_HEADERS[i]);
            }
            int r = 1;
            for (Sch04ListRes a : rows) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(str(a.closeDate()));
                row.createCell(1).setCellValue(nvl(a.mngOrgName()));
                row.createCell(2).setCellValue(nvl(a.personName()));
                row.createCell(3).setCellValue(nvl(a.statusName()));
                row.createCell(4).setCellValue(str(a.manageDate()));
                row.createCell(5).setCellValue(nvl(a.note()));
                row.createCell(6).setCellValue(Boolean.TRUE.equals(a.confirmYn()) ? "O" : "");
                row.createCell(7).setCellValue(nvl(a.title()));
                row.createCell(8).setCellValue(nvl(a.relatedLaw()));
                row.createCell(9).setCellValue(nvl(a.apprTitle()));
                row.createCell(10).setCellValue(str(a.issDate()));
                row.createCell(11).setCellValue(nvl(a.scheduleName()));
                row.createCell(12).setCellValue(nvl(a.cycleName()));
                row.createCell(13).setCellValue(Boolean.TRUE.equals(a.advisYn()) ? "O" : "");
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }

    private static String blankToAny(String s) {
        return s == null || s.isBlank() ? "%" : s;
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static String str(LocalDate d) {
        return d == null ? "" : d.toString();
    }
}

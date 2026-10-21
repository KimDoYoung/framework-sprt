package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.EmpLimitRes;
import kr.co.kfs.asseterp.biz.flt.dto.RealTrRes;
import kr.co.kfs.asseterp.biz.flt.dto.RealTrSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.flt.dto.ReportCheckRes;
import kr.co.kfs.asseterp.biz.flt.dto.ReportEmpRes;
import kr.co.kfs.asseterp.biz.flt.mapper.FltTrMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 정기보고 (AS-IS Flt10_Tab_RealTransaction → server/flt/Flt10_Tr.java selectByPeriod L149 / update L696 / delete L737 / deleteUpdate L665 /
 * deleteApprList L628 / getBizDate L450 / insertFloorTrBook L459 / checkPreAppr L202 / checkNextAppr L267, Flt02_Emp.selectInvestLimit L49,
 * Flt14_RelateAppr.selectByStdDate L25, Sys12_Calendar.selectByDay, ExcelUpload.fltUpload L2471) — 로그인 사용자(회사·사원) 본인의 매매내역만 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltRealTrService {

    private static final String TEMPLATE = "excelTemplete/Template_임직원자기매매.xlsx";

    private final FltTrMapper mapper;

    /** AS-IS selectByPeriod — 검색어는 `%검색어%`(클라이언트가 붙이던 것), 구분은 전체(`%`) */
    public List<RealTrRes> search(UserPrincipal user, Long accountId, String startDate, String closeDate,
                                  String searchText, boolean myAccountYn, boolean preTrYn) {
        return mapper.selectRealTrs(user.getCompanyId(), user.getUserId(), accountId, "%", startDate, closeDate,
                like(searchText), myAccountYn, preTrYn ? "true" : "false");
    }

    /**
     * AS-IS update(UpdateDataModel): 최초원장 기준일 이전 거래는 막고(전부 검사한 뒤 저장), 공백을 지우고, 예치금(99)은 매매총액 = 매매수량.
     * trId 0 이하 INSERT 아니면 UPDATE → selectById로 다시 읽어 요청 순서대로
     */
    @Transactional
    public List<RealTrRes> update(UserPrincipal user, List<RealTrSaveReq> rows) {
        String initDate = mapper.selectInitDate(user.getCompanyId(), user.getUserId());
        List<RealTrSaveReq> list = new ArrayList<>();
        for (RealTrSaveReq src : rows) {
            if (initDate != null && src.trDate() != null && initDate.compareTo(src.trDate()) >= 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "최초원장 기준일 이전의 거래내역은 등록할 수 없습니다");
            }
            Long trAmt = "99".equals(src.trItemType()) ? (long) (src.trQty() == null ? 0 : src.trQty()) : src.trAmt();
            list.add(new RealTrSaveReq(src.trId(), src.trType(), src.accountId(), src.trDate(), src.trItemType(),
                    src.trItemName() == null ? null : src.trItemName().trim(), src.trItemCode(), src.trQty(), trAmt, src.trNote()));
        }
        String today = mapper.selectToday();
        List<RealTrRes> saved = new ArrayList<>();
        for (RealTrSaveReq req : list) {
            boolean isNew = req.trId() == null || req.trId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.trId();
            if (isNew) {
                mapper.insertRealTr(id, user.getCompanyId(), user.getUserId(), req);
            } else if (mapper.updateRealTr(user.getCompanyId(), user.getUserId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectRealTrById(user.getCompanyId(), today, id));
        }
        return saved;
    }

    /** AS-IS delete(GridDeleteData) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteTrs(user.getCompanyId(), user.getUserId(), ids);
    }

    /** AS-IS deleteUpdate — 사전신고가 있는 행은 실거래 열만 비우고, 없는 행은 지운다 → 처리한 건수 */
    @Transactional
    public int clear(UserPrincipal user, List<Long> ids) {
        if (ids == null) {
            return 0;
        }
        int count = 0;
        for (Long id : ids) {
            if (mapper.clearRealTr(user.getCompanyId(), user.getUserId(), id) == 0) {
                count += mapper.deleteTrs(user.getCompanyId(), user.getUserId(), List.of(id));
            } else {
                count++;
            }
        }
        return count;
    }

    /** AS-IS deleteApprList — 상신문서를 폐기한다(매매내역 연결을 끊고, 폐기 보관 뒤 지운다) */
    @Transactional
    public int discardApprs(UserPrincipal user, List<Long> apprIds) {
        if (apprIds == null) {
            return 0;
        }
        for (Long apprId : apprIds) {
            mapper.clearApprId(user.getCompanyId(), user.getUserId(), apprId);
            mapper.insertApprDel(user.getCompanyId(), user.getUserId(), apprId);
            mapper.deleteAppr(user.getCompanyId(), user.getUserId(), apprId);
        }
        return apprIds.size();
    }

    /** AS-IS getBizDate — 기준일(말일)의 영업일 */
    public String bizDate(UserPrincipal user, String baseDate) {
        return mapper.selectBizDate(user.getCompanyId(), baseDate);
    }

    /** AS-IS Flt02_Emp.selectInvestLimit — 설정이 없으면 null */
    public EmpLimitRes empLimit(UserPrincipal user, String stdDate) {
        return mapper.selectEmpLimit(user.getCompanyId(), user.getUserId(), stdDate);
    }

    /** AS-IS Flt14_RelateAppr.selectByStdDate */
    public List<RelateApprRes> relateApprs(UserPrincipal user, String stdDate) {
        return mapper.selectRelateApprs(user.getUserId(), stdDate);
    }

    /** AS-IS Sys12_Calendar.selectByDay → 영업일 여부, 일자 정보가 없으면 null */
    public Boolean workingDay(String stdDate) {
        String yn = mapper.selectWorkingYn(stdDate);
        return yn == null ? null : "true".equals(yn);
    }

    /** AS-IS insertFloorTrBook(원장생성) — 함수가 'Y'가 아닌 글자를 주면 그 글자가 오류 메시지 */
    @Transactional
    public void insertFloorTrBook(UserPrincipal user, String startDate) {
        String msg = mapper.insertFloorTrBook(user.getCompanyId(), user.getUserId(), startDate);
        if (!"Y".equals(msg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, msg == null ? "원장생성에 실패했습니다" : msg);
        }
    }

    /** AS-IS checkPreAppr(전 보고 상신 여부) → checkNextAppr(다음 보고가 이미 상신됐는지). 실패하면 message */
    public ReportCheckRes checkReport(UserPrincipal user, String stdDate) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        ReportEmpRes emp = mapper.selectReportEmp(companyId, personId, stdDate);
        if (emp == null || emp.checkCycle() == null) {
            return fail("보고주기 정보가 존재하지 않습니다. 보고주기 및 적용시작일자를 확인해주세요");
        }
        String cycle = emp.checkCycle();
        if (!"1".equals(cycle) && !"2".equals(cycle)) {
            return fail("정의되지 않은 보고주기코드(" + cycle + ")입니다. 전산팀에 문의하세요");
        }

        // checkPreAppr — 전보고일이 보고시작일 또는 입사일 이전이면 전보고여부를 보지 않는다
        String preStdDate = mapper.selectPreReportDate(companyId, cycle, stdDate);
        boolean skipPre = preStdDate.compareTo(emp.rptStartDate()) < 0 || preStdDate.compareTo(emp.hireDate()) < 0;
        if (!skipPre) {
            boolean noAccount = Boolean.TRUE.equals(emp.noAccountSkipYn()) && mapper.countAccount(companyId, personId, preStdDate) == 0;
            if (!noAccount && mapper.countReport(companyId, personId, preStdDate) == 0) {
                return fail("1".equals(cycle) ? "전분기 정기보고서를 제출한 후 처리해 주세요." : "전월 정기보고서를 제출한 후 처리해 주세요.");
            }
        }

        // checkNextAppr
        boolean noAccount = Boolean.TRUE.equals(emp.noAccountSkipYn()) && mapper.countAccount(companyId, personId, stdDate) == 0;
        if (!noAccount && mapper.countNextReport(companyId, personId, stdDate) > 0) {
            return fail("1".equals(cycle) ? "다음 분기 정기보고서를 정리한 후 처리해주시길 바랍니다." : "다음 월 정기보고서를 정리한 후 처리해주시길 바랍니다.");
        }
        return new ReportCheckRes(true, null);
    }

    /** 엑셀 템플릿 (AS-IS downloadForm → ./excelTemplete/Template_임직원자기매매.xlsx) */
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * AS-IS ExcelUpload.fltUpload L2471-2619 — 첫 시트 2번째 행부터 계좌번호·실거래일·매매구분·종목유형·종목명·종목코드·매매수량·매매금액.
     * 계좌번호가 비어 있는 행이 21번 이어지면 거기서 끝내고, 계좌를 못 찾으면 전체 롤백 → 등록한 건수
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        String today = mapper.selectToday();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int rowCount = 0;
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (rowCount > 20) {
                    break;
                }
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (isCellEmpty(row.getCell(0))) {
                    continue;
                }
                String accountNo = cellString(row.getCell(0));
                if (accountNo != null && isExponentialFormat(accountNo)) {
                    accountNo = new BigDecimal(accountNo).toPlainString();
                }
                LocalDate trDate = cellDate(row.getCell(1));
                String trType = stripZero(cellString(row.getCell(2)));
                String trItemType = stripZero(cellString(row.getCell(3)));
                String trItemName = trim(cellString(row.getCell(4)));
                String itemCode = trim(cellString(row.getCell(5)));
                Double trQty = cellDouble(row.getCell(6));
                Long trAmt = cellLong(row.getCell(7));

                if (accountNo == null || accountNo.isEmpty() || " ".equals(accountNo)) {
                    rowCount++;
                    continue;
                }
                List<Long> accountIds = mapper.selectAccountIdsByNo(companyId, personId, accountNo);
                if (accountIds.size() != 1) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT,
                            "(에러) 존재하지 않는 계좌(" + accountNo + ")가 포함 되어있습니다. 계좌신고를 해주시거나 엑셀 계좌부분을 확인바랍니다.");
                }
                rowCount = 0;
                Boolean stkPriceYn = mapper.selectStkPriceYn(companyId, trItemType,
                        trDate == null ? today : trDate.toString());
                if (stkPriceYn == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 종목유형코드(" + trItemType + ")를 찾을 수 없습니다.");
                }
                if (stkPriceYn) {
                    if (itemCode == null || itemCode.isEmpty()) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 종목코드는 필수입력입니다.");
                    }
                    if (itemCode.length() != 12) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) [" + trItemName + "] 종목의 종목코드가 12자리가 아닙니다.");
                    }
                    List<String> names = mapper.selectItemNamesByCode(itemCode);
                    if (names.isEmpty()) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 존재하지 않는 종목코드(" + itemCode + ")입니다. 수정 후 업로드하세요");
                    }
                    for (String name : names) {
                        if (!name.equals(trItemName)) {
                            trItemName = name;
                        }
                    }
                }
                mapper.insertExcelTr(companyId, personId, accountIds.get(0), trDate, trType, trItemType, trItemName, itemCode, trQty, trAmt);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    private static ReportCheckRes fail(String message) {
        return new ReportCheckRes(false, message);
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }

    private static String trim(String s) {
        return s == null ? null : s.trim();
    }

    /** "10.0" 같은 숫자 글자는 소수점 앞만 */
    private static String stripZero(String s) {
        return s != null && s.matches("-?\\d+\\.0+") ? s.substring(0, s.indexOf('.')) : s;
    }

    private static boolean isExponentialFormat(String s) {
        return s.contains("E") || s.contains("e");
    }

    /** ExcelUpload.isCellEmpty */
    private static boolean isCellEmpty(Cell cell) {
        if (cell == null) {
            return true;
        }
        switch (cell.getCellType()) {
            case BLANK:
                return true;
            case STRING:
                return cell.getStringCellValue() == null || cell.getStringCellValue().trim().isEmpty();
            case NUMERIC:
            case BOOLEAN:
                return false;
            case FORMULA:
                try {
                    switch (cell.getCachedFormulaResultType()) {
                        case BLANK:
                            return true;
                        case STRING:
                            return cell.getStringCellValue() == null || cell.getStringCellValue().trim().isEmpty();
                        default:
                            return false;
                    }
                } catch (Exception e) {
                    return true;
                }
            default:
                return true;
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
    }

    /** ExcelUpload.getLongCellData — 숫자·수식 숫자는 정수로, 글자는 쉼표를 빼고 숫자면 변환 / 그 밖은 null */
    private static Long cellLong(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.FORMULA) {
            return cell.getCachedFormulaResultType() == CellType.NUMERIC ? (long) cell.getNumericCellValue() : null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            String s = cell.getStringCellValue().replace(",", "");
            return s.matches("-?\\d+") ? Long.valueOf(s) : null;
        }
        return null;
    }

    /** ExcelUpload.getDoubleCellData */
    private static Double cellDouble(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING && cell.getStringCellValue().length() > 0) {
            return Double.parseDouble(cell.getStringCellValue());
        }
        return null;
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
        if (cell == null) {
            return null;
        }
        Date date;
        if (cell.getCellType() == CellType.STRING) {
            try {
                date = new SimpleDateFormat("yyyyMMdd").parse(cell.getStringCellValue().replaceAll("[.-]", "").trim());
            } catch (ParseException e) {
                return null;
            }
        } else {
            date = cell.getDateCellValue();
        }
        return date == null ? null : date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }
}

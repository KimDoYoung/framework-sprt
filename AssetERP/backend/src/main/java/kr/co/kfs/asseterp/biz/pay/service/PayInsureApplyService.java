package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoSearchParam;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpTransInfoMapper;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsureApplyCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsureApplyRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsureApplySaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePreYearCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePreYearDeleteReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePreYearRowReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePreYearSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayInsureApplyMapper;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

/**
 * AS-IS server/pay/Pay31_InsureApply.java (selectByCompanyId L49 / insert1 L81 / insert3 L122 / updateList L326 / deleteList L349 / update L368 / delete L373)
 * + server/utils/file/ExcelUpload.ediUpload L1825 (탭 2 [엑셀업로드]) · payInsureApply4Upload L2945 (탭 4 [엑셀업로드])
 * + ./excelTemplete/Template_4대보험 납부방법 변경.xlsx (탭 4 [템플릿])
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayInsureApplyService {

    private static final String TEMPLATE = "excelTemplete/Template_4대보험 납부방법 변경.xlsx";
    private static final DateTimeFormatter KOR_DAY = DateTimeFormatter.ofPattern("MM월 dd일");
    private static final DateTimeFormatter YEAR_MONTH = DateTimeFormatter.ofPattern("yyyy.MM");

    private final PayInsureApplyMapper mapper;
    private final EmpTransInfoMapper transInfoMapper;

    /**
     * AS-IS selectByCompanyId L49: insureApplyGubun "1" 자격취득 / "multi" 보수변동·착오정정 / "4" 전년도분 보수총액 / "5" 납부방법 변경.
     * year가 있으면 신고일의 연도로, 없으면 startDate~closeDate로 거른다. insureCode는 LIKE라 "%"면 전체
     */
    public List<PayInsureApplyRes> search(UserPrincipal user, Long personId, String insureCode, String insureApplyGubun,
                                          String year, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectByCompanyId(user.getCompanyId(), personId, insureCode, insureApplyGubun, year, startDate, closeDate);
    }

    /**
     * 탭 1·2·4 [저장] — AS-IS pay.Pay31_InsureApply.update(UpdateDataModel). 화면이 보낸 변경 행을 요청 순서대로 저장하고 다시 읽어 돌려준다.
     * 사원이 로그인 회사 소속인지는 TOBE가 더 본다
     */
    @Transactional
    public List<PayInsureApplyRes> save(UserPrincipal user, List<PayInsureApplySaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (PayInsureApplySaveReq req : rows) {
            if (req.personId() == null || mapper.countPerson(companyId, req.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (req.insureCode() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "보험구분은 필수선택 항목입니다");
            }
            if (req.applyDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "신고일 필수작성 항목입니다");
            }
        }
        return rows.stream().map(req -> {
            if (req.insureApplyId() != null && req.insureApplyId() > 0 && mapper.selectById(companyId, req.insureApplyId()) != null) {
                mapper.update(companyId, req);
                return mapper.selectById(companyId, req.insureApplyId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, companyId, req);
            return mapper.selectById(companyId, newId);
        }).toList();
    }

    /** 탭 1·2·4 [삭제] — AS-IS pay.Pay31_InsureApply.delete → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /**
     * 자격취득 등록·보수변동/착오정정 등록 창의 [생성] — AS-IS insert1 L81: 체크한 보험마다 신고 행 하나
     * (국민연금 1은 입사월 납부여부를 그대로, 건강 2·고용 4는 "false"). 만든 행 수를 돌려준다
     */
    @Transactional
    public int create(UserPrincipal user, PayInsureApplyCreateReq req) {
        Long companyId = user.getCompanyId();
        if (req.personId() == null || mapper.countPerson(companyId, req.personId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (req.applyDate() == null || req.insureApplyCode() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "신고일과 신고구분은 필수입니다.");
        }
        int count = 0;
        if (req.ch01()) {
            count += insert1(companyId, req, "1", String.valueOf(Boolean.TRUE.equals(req.npsInitPayYn())));
        }
        if (req.ch02()) {
            count += insert1(companyId, req, "2", "false");
        }
        if (req.ch03()) {
            count += insert1(companyId, req, "4", "false");
        }
        return count;
    }

    private int insert1(Long companyId, PayInsureApplyCreateReq req, String insureCode, String npsInitPayYn) {
        return mapper.insert1(companyId, req.personId(), insureCode, req.insureApplyCode(), req.applyDate(), req.initDate(),
                req.applyMonth(), req.applyMonthPay(), npsInitPayYn);
    }

    /**
     * 전년도분 보수총액 등록 창의 [생성] — AS-IS insert3 L122. 신고일 = (기준년도+1)-04-01.
     * 전년도 고용보험료율 변동(pay21_rate 율구분 23)으로 구간을 나눠 termInfo·구간 시작일을 정하고, 사원마다
     * 같은 신고일 행을 지운 뒤 건강(2)·고용(4) 행을 만들고 정산금액(DB 함수)을 만든다. 전체생성은 재직(100) 전원
     * (기준연도 말보다 늦게 입사한 사원은 건너뜀, 대표자(emp35 대표자여부)는 고용보험 정산 안 함).
     * 정산 함수가 "Y"가 아니면 그 문구로 실패 — AS-IS는 앞선 사원의 행이 남지만 TOBE는 전체를 되돌린다
     */
    @Transactional
    public void createPreYear(UserPrincipal user, PayInsurePreYearCreateReq req) {
        Long companyId = user.getCompanyId();
        int year = parseYear(req.year());
        LocalDate applyDate = LocalDate.of(year + 1, 4, 1);
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate closeDate = LocalDate.of(year, 12, 31);
        String applyMonth = applyDate.format(YEAR_MONTH);

        // 전년도 보험료율 변동사항 체크
        List<LocalDate> rates = mapper.selectRateStartDates(startDate, closeDate, "23");
        StringBuilder termInfo = new StringBuilder();
        LocalDate preYearPay1Date = null;
        LocalDate preYearPay2Date = null;
        if (!rates.isEmpty()) {
            boolean firstIsJan1 = KOR_DAY.format(rates.get(0)).equals("01월 01일");
            for (int i = 0; i < rates.size(); i++) {
                boolean last = rates.size() == i + 1;
                if (firstIsJan1) {
                    if (i == 1) {
                        preYearPay1Date = rates.get(i);
                        termInfo.append("구간1 : ").append(KOR_DAY.format(rates.get(i - 1))).append(" ~ ").append(KOR_DAY.format(rates.get(i).minusDays(1)));
                        if (last) {
                            termInfo.append(" / 구간2 : ").append(KOR_DAY.format(rates.get(i))).append(" ~ 12월 31일");
                        }
                    } else if (i == 2) {
                        preYearPay2Date = rates.get(i);
                        termInfo.append(" / 구간2 : ").append(KOR_DAY.format(rates.get(i - 1))).append(" ~ ").append(KOR_DAY.format(rates.get(i).minusDays(1)));
                        if (last) {
                            termInfo.append(" / 구간3 : ").append(KOR_DAY.format(rates.get(i))).append(" ~ 12월 31일");
                        }
                    }
                } else if (i == 0) {
                    preYearPay1Date = rates.get(i);
                    termInfo.append("구간1 : 01월 01일 ~ ").append(KOR_DAY.format(rates.get(i).minusDays(1)));
                    if (last) {
                        termInfo.append(" / 구간2 : ").append(KOR_DAY.format(rates.get(i))).append(" ~ 12월 31일");
                    }
                } else if (i == 1) {
                    preYearPay2Date = rates.get(i);
                    termInfo.append(" / 구간2 : ").append(KOR_DAY.format(rates.get(i - 1))).append(" ~ ").append(KOR_DAY.format(rates.get(i).minusDays(1)));
                    if (last) {
                        termInfo.append(" / 구간3 : ").append(KOR_DAY.format(rates.get(i))).append(" ~ 12월 31일");
                    }
                }
            }
        } else {
            preYearPay1Date = closeDate;
            termInfo.append("구간1 : 01월 01일 ~ 12월 31일");
        }

        if (req.allYn()) {
            List<TransInfoRes> persons = transInfoMapper.searchTransInfos(
                    new TransInfoSearchParam(companyId, applyDate.toString(), "%", "100", true, null, null));
            for (TransInfoRes person : persons) {
                // 입사일이 기준년 이후이면 Skip
                if (person.hireDate() != null && person.hireDate().isAfter(closeDate)) {
                    continue;
                }
                createOne(companyId, person.personId(), person.hireDate(), applyDate, applyMonth, startDate, closeDate,
                        termInfo.toString(), preYearPay1Date, preYearPay2Date, req.year(), isRepr(companyId, person.personId(), applyDate));
            }
        } else {
            if (req.personId() == null || mapper.countPerson(companyId, req.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            // 개인으로 등록할 때는 입사일을 가져와 넣고, 대표자 여부는 보지 않는다
            createOne(companyId, req.personId(), mapper.selectHireDate(companyId, req.personId()), applyDate, applyMonth, startDate,
                    closeDate, termInfo.toString(), preYearPay1Date, preYearPay2Date, req.year(), false);
        }
    }

    private void createOne(Long companyId, Long personId, LocalDate hireDate, LocalDate applyDate, String applyMonth, LocalDate startDate,
                           LocalDate closeDate, String termInfo, LocalDate preYearPay1Date, LocalDate preYearPay2Date, String year, boolean repr) {
        mapper.delete3(companyId, personId, applyDate);
        mapper.insert3x2(companyId, personId, applyDate, applyMonth, hireDate, startDate, closeDate, termInfo);
        mapper.insert3x4(companyId, personId, applyDate, applyMonth, hireDate, startDate, closeDate, termInfo, preYearPay1Date, preYearPay2Date);
        adjust(personId, year, "2");   // 건강보험 정산금액 생성
        if (!repr) {
            adjust(personId, year, "4");   // 고용보험 정산금액 생성 (대표자는 미납 대상이라 안 만든다)
        }
    }

    private boolean isRepr(Long companyId, Long personId, LocalDate applyDate) {
        return "true".equals(mapper.selectReprYn(companyId, personId, applyDate));
    }

    private void adjust(Long personId, String year, String insureCode) {
        String msg = mapper.createInsureAdjust(personId, year, insureCode);
        if (!"Y".equals(msg)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, msg == null ? "정산금액을 만들 수 없습니다." : msg);
        }
    }

    /** 탭 3 [저장] — AS-IS updateList L326: 행마다 보수총액 4칸을 저장하고 그 사원·보험의 정산금액을 다시 만든다 */
    @Transactional
    public void savePreYear(UserPrincipal user, PayInsurePreYearSaveReq req) {
        Long companyId = user.getCompanyId();
        for (PayInsurePreYearRowReq row : req.rows()) {
            PayInsureApplyRes old = row.insureApplyId() == null ? null : mapper.selectById(companyId, row.insureApplyId());
            if (old == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            mapper.updatePreYear(companyId, row);
            adjust(old.personId(), req.year(), old.insureCode());
        }
    }

    /** 탭 3 [삭제] — AS-IS deleteList L349: 그 사원·보험의 정산(회차 0)을 먼저 지우고 신고 행을 지운다 → 지운 건수 */
    @Transactional
    public int deletePreYear(UserPrincipal user, PayInsurePreYearDeleteReq req) {
        Long companyId = user.getCompanyId();
        if (req.ids() == null || req.ids().isEmpty()) {
            return 0;
        }
        for (Long id : req.ids()) {
            PayInsureApplyRes old = mapper.selectById(companyId, id);
            if (old != null) {
                mapper.deleteInsurePayByPersonId(companyId, old.insureCode(), old.personId(), req.year());
            }
        }
        return mapper.deleteByIds(companyId, req.ids());
    }

    /** 탭 4 [템플릿] */
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 탭 2 [엑셀업로드] — AS-IS ediUpload L1825(EDI 신고서). 첫 시트 2번째 행부터: 국민연금(1)·건강(2)·고용(4) 신청 Y/N, 성명(5)·주민번호(6),
     * 연금 보수월액(9), 건강 변경월(11)·보수월액(12), 고용 보수월액(13)·신고구분(14)·변경월(15). 성명+주민번호 앞 6자리로 사원을 찾아
     * 한 명일 때만 신고일 = 오늘로 보수변동(2, 고용은 착오정정이면 3) 행을 넣는다. 한 행이라도 오류면 전체 롤백. 넣은 건수를 돌려준다
     */
    @Transactional
    public int uploadEdi(UserPrincipal user, MultipartFile file) {
        Long companyId = user.getCompanyId();
        LocalDate toDay = LocalDate.now();
        return readSheet(file, (row, rowIndex) -> {
            String insureCode1Chk = cellString(row.getCell(1));
            String insureCode2Chk = cellString(row.getCell(2));
            String insureCode4Chk = cellString(row.getCell(3));
            String personName = cellString(row.getCell(5));
            String personCtzNo = cellString(row.getCell(6));
            Long insureCode1MonthPay = cellLong(row.getCell(9));
            String insureCode2Month = cellString(row.getCell(11));
            Long insureCode2MonthPay = cellLong(row.getCell(12));
            String insureCode4Month = cellString(row.getCell(15));
            Long insureCode4MonthPay = cellLong(row.getCell(13));
            String insureApplyCode = cellString(row.getCell(14));

            String applyMonth2 = yearMonth(insureCode2Month);
            String applyMonth4 = yearMonth(insureCode4Month);

            if (personName == null || personCtzNo == null) {
                return 0;
            }
            List<Long> persons = mapper.selectPersonIdsByCtzNo(companyId, personName, personCtzNo);
            if (persons.size() != 1) {
                return 0;
            }
            Long personId = persons.get(0);
            int count = 0;
            if ("Y".equals(insureCode1Chk)) {
                count += mapper.insert1(companyId, personId, "1", "2", toDay, null, applyMonth2 == null ? applyMonth4 : applyMonth2,
                        insureCode1MonthPay, "false");
            }
            if ("Y".equals(insureCode2Chk)) {
                count += mapper.insert1(companyId, personId, "2", "2", toDay, null, applyMonth2, insureCode2MonthPay, "false");
            }
            if ("Y".equals(insureCode4Chk)) {
                count += mapper.insert1(companyId, personId, "4", "3".equals(insureApplyCode) ? "3" : "2", toDay, null, applyMonth4,
                        insureCode4MonthPay, "false");
            }
            return count;
        });
    }

    /**
     * 탭 4 [엑셀업로드] — AS-IS payInsureApply4Upload L2945. 첫 시트 2번째 행부터: 사원번호(0)·구분(2)·납부방법(3)·분할납부 지정회차(4)·신고일자(5).
     * 신고구분은 5(납부방법 변경). 한 행이라도 오류면 전체 롤백. 넣은 건수를 돌려준다
     */
    @Transactional
    public int uploadPayMethod(UserPrincipal user, MultipartFile file) {
        Long companyId = user.getCompanyId();
        return readSheet(file, (row, rowIndex) -> {
            String personNo = cellString(row.getCell(0));
            String insureCode = cellString(row.getCell(2));
            String payCode = cellString(row.getCell(3));
            Long payDiv = cellLong(row.getCell(4));
            LocalDate applyDate = cellDate(row.getCell(5));
            List<Long> persons = personNo == null ? List.of() : mapper.selectPersonIdsByEmpNo(companyId, personNo.trim());
            if (persons.isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, (rowIndex + 1) + "행의 사번 [" + personNo + "]을 찾을 수 없습니다.");
            }
            if (applyDate == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, (rowIndex + 1) + "행의 신고일자를 읽을 수 없습니다.");
            }
            return mapper.excelInsert(companyId, persons.get(0), insureCode, payCode, payDiv, applyDate);
        });
    }

    private interface RowHandler {
        int handle(Row row, int rowIndex);
    }

    /** 첫 시트 2번째 행부터 한 행씩 처리하고 합친 건수를 돌려준다. 오류는 전체 롤백(원본은 commit 전에 중단) */
    private int readSheet(MultipartFile file, RowHandler handler) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                count += handler.handle(row, i);
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    /** 6자리 이상이면 앞 4자리 + "." + 5~6번째 (yyyyMM → yyyy.MM), 아니면 null */
    private static String yearMonth(String value) {
        return value != null && value.length() > 5 ? value.substring(0, 4) + "." + value.substring(4, 6) : null;
    }

    private static int parseYear(String year) {
        try {
            return Integer.parseInt(year == null ? "" : year.trim());
        } catch (NumberFormatException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년도를 입력해주세요");
        }
    }

    /** ExcelUpload.getStringCellData — 셀이 없으면 null, 숫자는 정수면 정수 글자, 아니면 소수 글자 */
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

    /** ExcelUpload.getLongCellData — 수식은 마지막 계산값(숫자만), 숫자 셀은 소수점 버림, 글자는 쉼표를 빼고 숫자면 그 값 */
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
            String str = cell.getStringCellValue().replace(",", "");
            return str.matches("-?\\d+") ? Long.parseLong(str) : null;
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

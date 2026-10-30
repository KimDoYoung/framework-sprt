package kr.co.kfs.asseterp.biz.crd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataSaveReq;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeRes;
import kr.co.kfs.asseterp.biz.crd.mapper.CrdDataMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * AS-IS server/utils/file/ExcelUpload.crdExcelUpload L692-1145 (uploadType=crdExcelUpload) + 셀 읽기 도우미 L1148-1396 — 법인카드 내역 엑셀업로드.
 * 열 위치는 업로드 구분코드 맵핑(crd11_excel_code, 회사 맵핑이 없으면 회사 0의 기본 맵핑)의 위치(seq, 0부터)로 읽는다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrdDataUploadService {

    private final CrdDataMapper mapper;

    /** 한 행 안 읽은 값 */
    private static final class Line {
        String cardNo, approvalTime, paymentMethod, approvalNo, stateName, merchantNo, franchiseName, merchantStatus,
                bizLicenseNo, merchantAddr, sectorName, representativeName, merchantPhone;
        LocalDate approvalDt;
        Long approvalAmount, surtax, monthlyPayments, cancelAmount;
    }

    /** 업로드 구분코드(CreditCardExcelCode) → 열 위치 */
    private Map<String, Integer> columns(Long companyId, String cardCode) {
        Map<String, Integer> m = new HashMap<>();
        for (CrdExcelCodeRes c : mapper.selectExcelCodes(companyId, cardCode)) {
            m.put(c.bankExcelCode(), c.seq().intValue());
        }
        return m;
    }

    /** 등록한 내역 수를 돌려준다. 읽을 수 없는 행은 건너뛰고, 형식이 안 맞는 행이 연달아 20개면 거기서 멈춘다(AS-IS 그대로) */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file, String cardCode, String dataYm) {
        Long companyId = user.getCompanyId();
        if (companyId == null || companyId == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "해당 카드전표를 등록할 수 없습니다.");
        }
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Map<String, Integer> col = columns(companyId, cardCode);
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int bad = 0;
            int count = 0;
            for (int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (bad == 20) {
                    break;
                }
                if (row == null) {
                    continue;
                }
                Line l = new Line();
                l.cardNo = str(row, col.get("010"));
                if (col.get("020") != null) {
                    Cell cell = row.getCell(col.get("020"));
                    LocalDate d = crdCellDate(cell);
                    if (d == null) {
                        String s = str(cell);
                        if (s == null) {
                            continue;
                        }
                        try {
                            d = dateWithYear(s, dataYm);
                        } catch (IllegalArgumentException e) {
                            continue;
                        }
                    }
                    l.approvalDt = d;
                }
                if (col.get("030") != null) {
                    l.approvalTime = time(row.getCell(col.get("030")));
                }
                if (col.get("040") != null) {
                    l.approvalAmount = amount(row.getCell(col.get("040")));
                }
                if (col.get("050") != null) {
                    Cell cell = row.getCell(col.get("050"));
                    l.surtax = cell == null ? Long.valueOf(0) : amount(cell);
                }
                l.paymentMethod = str(row, col.get("060"));
                if (col.get("070") != null) {
                    Long v = longCell(row.getCell(col.get("070")));
                    l.monthlyPayments = v == null ? 0L : v;
                }
                l.approvalNo = str(row, col.get("080"));
                if (col.get("090") != null) {
                    String s = str(row, col.get("090"));
                    l.stateName = s == null || s.equals("정상") || s.equals("일시불") || s.equals("N") ? "정상" : s.equals("거절") ? "거절" : "승인취소";
                }
                l.merchantNo = str(row, col.get("100"));
                l.franchiseName = str(row, col.get("110"));
                l.merchantStatus = str(row, col.get("120"));
                if (col.get("130") != null) {
                    l.bizLicenseNo = bizLicenseNo(row.getCell(col.get("130")));
                }
                l.merchantAddr = str(row, col.get("140"));
                l.sectorName = str(row, col.get("150"));
                l.representativeName = str(row, col.get("160"));
                l.merchantPhone = str(row, col.get("170"));
                // 취소금액(180) → 0이면 매출취소금액(190). 양수는 음수로 바꾼다
                if (col.get("180") != null) {
                    l.cancelAmount = negative(amount(row.getCell(col.get("180"))));
                    if (l.cancelAmount != null && l.cancelAmount == 0 && col.get("190") != null) {
                        l.cancelAmount = negative(amount(row.getCell(col.get("190"))));
                    }
                } else if (col.get("190") != null) {
                    l.cancelAmount = negative(amount(row.getCell(col.get("190"))));
                }

                // 빈 행(카드번호·승인금액·부가세 없음)·거절은 건너뛰고, 연달아 20개면 멈춘다. 승인상태 열이 맵핑에 없으면 AS-IS도 오류가 난다
                if (l.stateName == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "업로드 구분코드(승인상태)가 설정되지 않았습니다.");
                }
                if (!(l.cardNo != null && !l.cardNo.isEmpty() && l.approvalAmount != null && l.surtax != null && !l.stateName.equals("거절"))) {
                    bad++;
                    continue;
                }
                bad = 0;
                if (l.approvalNo == null || l.approvalNo.isEmpty()) {
                    l.approvalNo = mapper.selectApprovalNo(companyId, dataYm);
                }
                boolean hasAmount = l.approvalAmount != 0;
                boolean hasCancel = l.cancelAmount != null && l.cancelAmount != 0;
                if (hasAmount && hasCancel) {
                    // 한 행에 승인금액과 취소금액이 같이 있으면 승인취소 내역과 정상 내역을 둘 다 만든다(같은 승인번호)
                    insert(companyId, cardCode, dataYm, l, l.cancelAmount, -l.surtax, "승인취소");
                    insert(companyId, cardCode, dataYm, l, l.approvalAmount, l.surtax, "정상");
                    count += 2;
                } else if (hasAmount || hasCancel) {
                    insert(companyId, cardCode, dataYm, l, hasAmount ? l.approvalAmount : l.cancelAmount, l.surtax, l.stateName);
                    count++;
                }
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    private void insert(Long companyId, String cardCode, String dataYm, Line l, Long amount, Long surtax, String state) {
        CrdDataSaveReq req = new CrdDataSaveReq(null, dataYm, cardCode, l.approvalDt, l.approvalTime, null, null, l.cardNo, null,
                l.franchiseName, l.sectorName, l.paymentMethod, l.monthlyPayments, amount, surtax, null, null, l.approvalNo, state, null,
                l.merchantStatus, l.merchantNo, l.bizLicenseNo, l.representativeName, l.merchantAddr, l.merchantPhone);
        mapper.insert(mapper.selectNextId(), companyId, req);
    }

    // ===== 셀 읽기 (ExcelUpload 도우미) =====

    private static Long negative(Long v) {
        return v != null && v > 0 ? -v : v;
    }

    private static String str(Row row, Integer index) {
        return index == null ? null : str(row.getCell(index));
    }

    /** getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자. 그 밖은 글자 값(trim) */
    private static String str(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
    }

    /** getBLNCellData — 숫자는 실수 글자 그대로, 글자는 '-'를 뺀다 */
    private static String bizLicenseNo(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return Double.toString(cell.getNumericCellValue()).trim();
        }
        return cell.getStringCellValue().trim().replaceAll("-", "");
    }

    private static boolean isNumber(String s) {
        return s != null && s.matches("[-+]?\\d*\\.?\\d+");
    }

    /** getLongCellData — 수식(숫자)·숫자는 정수, 글자는 ','를 빼고 숫자면 정수, 그 밖은 null */
    private static Long longCell(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.FORMULA) {
            if (cell.getCachedFormulaResultType() == CellType.NUMERIC) {
                return (long) cell.getNumericCellValue();
            }
            if (cell.getCachedFormulaResultType() == CellType.STRING) {
                return null;
            }
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            String s = cell.getStringCellValue();
            if (s.length() > 0) {
                String t = s.replaceAll("\\,", "");
                return isNumber(t) ? Long.parseLong(t) : null;
            }
        }
        return null;
    }

    /** getAmountCellData — 없으면 0, 숫자는 정수, 글자는 ',원'을 빼고 숫자면 정수(아니면·빈 글자면 null) */
    private static Long amount(Cell cell) {
        if (cell == null) {
            return 0L;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            if (cell.getStringCellValue().length() > 0) {
                String s = cell.getStringCellValue().replaceAll("[,원]", "").trim();
                return isNumber(s) ? Long.parseLong(s) : null;
            }
        }
        return null;
    }

    /** getCrdCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 정확히 읽히면 날짜, 숫자는 셀 서식에 yy·MM·dd가 있을 때만 날짜 */
    private static LocalDate crdCellDate(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.STRING) {
            String s = cell.getStringCellValue().replaceAll("[.-]", "").trim();
            SimpleDateFormat f = new SimpleDateFormat("yyyyMMdd");
            try {
                Date d = f.parse(s);
                return f.format(d).equals(s) ? toLocal(d) : null;
            } catch (ParseException e) {
                return null;
            }
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            String fmt = cell.getCellStyle().getDataFormatString();
            return fmt.contains("yy") || fmt.contains("MM") || fmt.contains("dd") ? toLocal(cell.getDateCellValue()) : null;
        }
        return null;
    }

    private static LocalDate toLocal(Date d) {
        return d.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    /** parseDate("MM.dd HH:mm" → "yyyy.MM.dd HH:mm") — 연도가 없으면(1970) 사용년월의 연도 */
    private static LocalDate dateWithYear(String s, String dataYm) {
        Date parsed = null;
        for (String format : new String[]{"MM.dd HH:mm", "yyyy.MM.dd HH:mm"}) {
            try {
                SimpleDateFormat f = new SimpleDateFormat(format);
                f.setLenient(false);
                parsed = f.parse(s);
                break;
            } catch (ParseException e) {
                // 다음 형식
            }
        }
        if (parsed == null) {
            throw new IllegalArgumentException("유효하지 않은 날짜 형식: " + s);
        }
        Calendar c = Calendar.getInstance();
        c.setTime(parsed);
        if (c.get(Calendar.YEAR) == 1970) {
            c.set(Calendar.YEAR, Integer.parseInt(dataYm.substring(0, 4)));
        }
        return toLocal(c.getTime());
    }

    /** 승인시간 — 없으면 "00:00:00", "MM.dd HH:mm"·"HHmmss"·"HH:mm:ss"는 "HH:mm:ss"로, 그 밖은 null */
    private static String time(Cell cell) {
        if (cell == null) {
            return "00:00:00";
        }
        String input = str(cell);
        if (input == null || input.trim().isEmpty()) {
            return "00:00:00";
        }
        input = input.trim();
        try {
            Date d;
            if (input.matches("\\d{2}\\.\\d{2} \\d{2}:\\d{2}")) {
                d = new SimpleDateFormat("MM.dd HH:mm").parse(input);
            } else if (input.matches("\\d{6}")) {
                d = new SimpleDateFormat("HHmmss").parse(input);
            } else if (input.matches("\\d{2}:\\d{2}:\\d{2}")) {
                d = new SimpleDateFormat("HH:mm:ss").parse(input);
            } else {
                return null;
            }
            return new SimpleDateFormat("HH:mm:ss").format(d);
        } catch (ParseException e) {
            return null;
        }
    }
}

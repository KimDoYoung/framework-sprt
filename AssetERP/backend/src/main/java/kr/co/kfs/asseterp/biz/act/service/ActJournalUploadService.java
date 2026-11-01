package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.mapper.ActJournalUploadMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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
import java.util.Date;

/**
 * AS-IS server/act/Act08_JournalUpload.java (deleteByCompanyId L25 · journalWork L32) · server/utils/file/ExcelUpload.journalUpload L3419-3517
 * · ./excelTemplete/Template_분개장 업로드.xlsx — 전표입력 [템플릿]·[엑셀업로드] (X01)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActJournalUploadService {

    private static final String TEMPLATE = "excelTemplete/Template_분개장 업로드.xlsx";

    private final ActJournalUploadMapper mapper;

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * excelUpload() L421-449 → 먼저 내 회사의 업로드 자료를 지우고(deleteByCompanyId) 파일을 올린다. 업로드 자료를 읽어 넣는 일(ExcelUpload.journalUpload)은
     * 첫 시트 2번째 행부터: 일자(0)·전표번호(1)·계정코드(2)·계정명(3)·차변(4)·대변(5)·계정별 적요(6)·적요(7)·거래처코드(8)·관리계좌코드(9).
     * 앞 세 칸이 모두 빈 행은 건너뛰고(빈 행/빈 칸이 11번 넘으면 중단), 일자·전표번호·계정코드가 비면 "(에러) n번째 데이터를 읽을 수 없습니다." — 한 행이라도 오류면 전체 롤백
     */
    @Transactional
    public void upload(UserPrincipal user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        mapper.deleteByCompanyId(companyId);
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int spaceSeq = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    spaceSeq++;
                    continue;
                }
                if (spaceSeq > 10) break;
                if (isEmpty(row.getCell(0)) && isEmpty(row.getCell(1)) && isEmpty(row.getCell(2))) {
                    spaceSeq++;
                    continue;
                }
                LocalDate date = cellDate(row.getCell(0));
                String journalNo = cellString(row.getCell(1));
                String accountCode = cellString(row.getCell(2));
                String accountName = cellString(row.getCell(3));
                Long drAmt = cellLong(row.getCell(4));
                Long crAmt = cellLong(row.getCell(5));
                String accountNote = cellString(row.getCell(6));
                String note = cellString(row.getCell(7));
                String corpCode = isEmpty(row.getCell(8)) ? null : cellString(row.getCell(8));
                String depositCode = isEmpty(row.getCell(9)) ? null : cellString(row.getCell(9));

                String head = "(에러) " + (i + 1) + "번째 데이터를 읽을 수 없습니다. ";
                if (date == null) throw new BusinessException(ErrorCode.INVALID_INPUT, head + "[전표일자] 데이터를 읽을 수 없습니다.");
                else if (journalNo.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, head + "[전표번호] 데이터를 읽을 수 없습니다.");
                else if (accountCode.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, head + "[계정과목코드] 데이터를 읽을 수 없습니다.");
                else if (drAmt == null) drAmt = 0L;      // AS-IS는 else-if 사슬이라 차변이 비었을 때만 0으로 바꾸고 대변은 그대로 둔다
                else if (crAmt == null) crAmt = 0L;

                mapper.excelInsert(mapper.selectNextId(), companyId, date, journalNo, accountCode, accountName, drAmt, crAmt,
                        accountNote, note, user.getName(), corpCode, depositCode);
            }
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    /** journalWork() L451-469 → act08_journal_upload.journalWork — 'Y'가 아니면 돌려준 메시지로 실패 */
    @Transactional
    public void journalWork(UserPrincipal user) {
        String msg = mapper.journalWork(user.getCompanyId(), user.getUserId());
        if (!"Y".equals(msg)) throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }

    /** ExcelUpload.isCellEmpty — 빈 칸·공백 글자 */
    private static boolean isEmpty(Cell cell) {
        if (cell == null) return true;
        switch (cell.getCellType()) {
            case BLANK:
                return true;
            case STRING:
                return cell.getStringCellValue() == null || cell.getStringCellValue().trim().isEmpty();
            case FORMULA:
                return cell.getCachedFormulaResultType() == CellType.STRING
                        ? cell.getStringCellValue().trim().isEmpty() : cell.getCachedFormulaResultType() == CellType.BLANK;
            default:
                return false;
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 빈 글자 */
    private static String cellString(Cell cell) {
        if (cell == null) return "";
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        if (cell.getCellType() == CellType.BLANK) return "";
        return cell.getStringCellValue().trim();
    }

    /** ExcelUpload.getLongCellData — 숫자(수식 결과 포함)는 정수로 자르고, 글자는 쉼표를 뺀 숫자만, 그 밖은 null */
    private static Long cellLong(Cell cell) {
        if (cell == null) return null;
        CellType type = cell.getCellType() == CellType.FORMULA ? cell.getCachedFormulaResultType() : cell.getCellType();
        if (type == CellType.NUMERIC) return (long) cell.getNumericCellValue();
        if (type == CellType.STRING && cell.getCellType() != CellType.FORMULA) {
            String str = cell.getStringCellValue().replace(",", "");
            return str.matches("-?\\d+") ? Long.parseLong(str) : null;
        }
        return null;
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
        if (cell == null) return null;
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

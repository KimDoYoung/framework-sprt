package kr.co.kfs.asseterp.common.excel;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.multipart.MultipartFile;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;

/**
 * 엑셀 업로드 공통 셀 읽기 (AS-IS ExcelUpload 의 getXxxCellData).
 * <p>
 * 화면마다 복사돼 있던 같은 본문만 모았다(2026-11-06 정적분석 C). 빈 칸(cell == null)이면 모두 null 을 돌려준다.
 * 빈 칸에서 NPE 가 나는 옛 복사본(빈 칸을 "파일을 읽을 수 없음"으로 처리하는 화면)은 동작이 달라 옮기지 않았다.
 */
public final class ExcelCells {

    private ExcelCells() {
    }

    /** 업로드 양식 파일(classpath) 내려받기 — 못 읽으면 INTERNAL_ERROR "엑셀 템플릿을 읽을 수 없습니다." */
    public static byte[] template(String classpath) {
        try (InputStream in = new ClassPathResource(classpath).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.", e);
        }
    }

    /** forEachRow 가 한 행마다 부르는 처리. index 는 0부터 센 행 번호(첫 데이터 행 = 1) */
    @FunctionalInterface
    public interface RowHandler {
        void accept(Workbook wb, Row row, int index) throws Exception;
    }

    /**
     * 업로드 엑셀의 첫 시트를 2번째 행(index 1)부터 한 행씩 처리하고 처리한 행 수를 돌려준다(2026-11-06 정적분석 C).
     * 파일이 없거나 비면 "등록할 파일이 전달되지 않았습니다.", 행을 못 읽으면 "{i}행의 자료을 읽을 수 없습니다. ",
     * 처리 중 BusinessException 은 그대로, 그 밖의 예외는 INVALID_INPUT 으로 바꿔 던진다(옛 화면별 복사본과 같은 문구).
     * 첫 칸이 비었을 때의 문구는 화면마다 달라 처리(handler)가 직접 검사한다.
     */
    public static int forEachRow(MultipartFile file, RowHandler handler) {
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
                handler.accept(wb, row, i);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    public static String string(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    public static LocalDate date(Cell cell) {
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

    /** ExcelUpload.getLongCellData — 수식은 마지막 계산값(숫자만), 숫자 셀은 소수점 버림, 글자는 쉼표를 빼고 정수면 그 값 / 그 밖은 null */
    public static Long longValue(Cell cell) {
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

    /** ExcelUpload.getDoubleCellData — 숫자 셀은 그 값, 비지 않은 글자는 Double.parseDouble(못 읽으면 NumberFormatException) */
    public static Double doubleValue(Cell cell) {
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
}

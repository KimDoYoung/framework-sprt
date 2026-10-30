package kr.co.kfs.asseterp.biz.crd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.mapper.CrdCardMapper;
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

/** AS-IS server/utils/file/ExcelUpload.cardUpload L3620-3713 (U13 [엑셀업로드]) + ./excelTemplete/Template_카드업로드.xlsx ([템플릿]) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrdCardUploadService {

    private static final String TEMPLATE = "excelTemplete/Template_카드업로드.xlsx";

    private final CrdCardMapper mapper;

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 카드: 시작일자(0, 필수)·카드명(1)·카드번호(2, 필수)·식별구분(3, 없으면 카드번호)·카드회사 코드(4)·비고(5).
     * 사용여부 true·카드구분 1(신용카드)로 넣는다. 한 행이라도 오류면 전체 롤백. 등록한 건수를 돌려준다
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 시작일자는 필수입력입니다.");
                }
                LocalDate startDate = cellDate(row.getCell(0));
                String cardName = row.getCell(1) == null ? "" : cellString(row.getCell(1));
                if (row.getCell(2) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 카드번호는 필수입력입니다.");
                }
                String cardNoSlip = cellString(row.getCell(2));
                String cardNo = row.getCell(3) == null ? cellString(row.getCell(2)) : cellString(row.getCell(3));
                String bankCode = row.getCell(4) == null ? "" : cellString(row.getCell(4));
                String note = row.getCell(5) == null ? "" : cellString(row.getCell(5));
                mapper.excelInsertCard(mapper.selectNextId(), companyId, bankCode, cardName, cardNoSlip, cardNo, startDate, note);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 */
    private static String cellString(Cell cell) {
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
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

package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundExcelRow;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndFundUploadMapper;
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

/** AS-IS server/utils/file/ExcelUpload.fundUpload L1402-1573 (P05 [엑셀업로드]) + ./excelTemplete/Template_펀드정보.xlsx ([템플릿]) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndFundUploadService {

    private static final String TEMPLATE = "excelTemplete/Template_펀드정보.xlsx";

    private final FndFundUploadMapper mapper;

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 펀드: 펀드코드(0)·협회펀드코드(1)·예탁원펀드코드(2)·예탁원종목코드(3)·펀드명(4)·펀드약명(5)·설정일(9)·해지일(13)·
     * 해지구분 Y/N(14)·운용부서(15)·주운용역(16)·부운용역(17)·사무수탁사 협회코드(18)·수탁사 코드(19)·신탁구분(20)·펀드유형(21)·공모/사모(22).
     * 같은 회사에 같은 코드가 있으면 펀드는 그대로 두고 오늘 작업일의 펀드정보만 다시 넣는다. 한 행이라도 오류면 전체 롤백.
     * 원본이 읽지만 SQL이 넣지 않는 칸(기준통화·설정액·순자산·결산일·보수율·클래스구분 등)은 읽지 않는다. 등록·갱신한 건수를 돌려준다.
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        LocalDate toDay = LocalDate.now();
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
                String fundCode = cellString(row.getCell(0));
                String closeCell = cellString(row.getCell(14));
                String closeYn = "Y".equalsIgnoreCase(closeCell) ? "true" : "false";

                String officeWorkCode = cellString(row.getCell(18));
                if (officeWorkCode != null) {
                    String found = mapper.selectOfficeWorkCodeByKofia(companyId, officeWorkCode);
                    if (found == null) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, (i + 1) + "행의 사무수탁사 협회코드(" + officeWorkCode + ")를 찾을 수 없습니다.");
                    }
                    officeWorkCode = found;
                }
                String consignmentCode = mapper.selectCorpCode("1", cellString(row.getCell(19)), "1", officeWorkCode);

                Long fundCodeId = mapper.selectFundCodeId(companyId, fundCode);
                LocalDate startDate = cellDate(row.getCell(9));
                LocalDate endDate = cellDate(row.getCell(13));
                if (fundCodeId == null) {
                    fundCodeId = mapper.selectNextId();
                    mapper.excelInsertFund(new FundExcelRow(fundCodeId, null, companyId, fundCode, startDate, endDate, closeYn,
                            null, null, null, null, null, null, null, null, null, null, null, null, null, null));
                }
                FundExcelRow info = new FundExcelRow(fundCodeId, mapper.selectNextId(), companyId, fundCode, startDate, endDate, closeYn,
                        toDay, cellString(row.getCell(5)), cellString(row.getCell(4)), cellString(row.getCell(1)),
                        cellString(row.getCell(21)), cellString(row.getCell(20)), cellString(row.getCell(22)), consignmentCode,
                        officeWorkCode, cellString(row.getCell(15)), cellString(row.getCell(16)), cellString(row.getCell(17)),
                        cellString(row.getCell(2)), cellString(row.getCell(3)));
                mapper.excelDeleteInfo(fundCodeId, toDay);
                mapper.excelInsertInfo(info);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
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

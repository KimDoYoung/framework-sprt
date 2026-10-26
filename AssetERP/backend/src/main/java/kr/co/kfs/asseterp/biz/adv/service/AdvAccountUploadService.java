package kr.co.kfs.asseterp.biz.adv.service;

import kr.co.kfs.asseterp.biz.adv.dto.AccountExcelRow;
import kr.co.kfs.asseterp.biz.adv.mapper.AdvAccountMapper;
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
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

/** AS-IS server/utils/file/ExcelUpload.adv02Upload L1575-1665 (Q01 [엑셀업로드]) + ./excelTemplete/Template_일임계좌정보.xlsx ([템플릿]) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdvAccountUploadService {

    private static final String TEMPLATE = "excelTemplete/Template_일임계좌정보.xlsx";

    private final AdvAccountMapper mapper;

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 계좌: 관리코드(0)·계좌명(1)·계좌번호(2)·증권사명(3)·최초설정일(4)·해지일(5).
     * 증권사명은 사용 중인 증권회사(거래처구분 3)의 이름과 같아야 하고(코드는 그 거래처 것), 같은 관리코드가 이미 있으면 막는다(원본은 갱신 코드를 주석 처리).
     * 한 행이라도 오류면 전체 롤백. 등록한 건수를 돌려준다.
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
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                String manageCode = cellString(row.getCell(0));
                String trCorpName = cellString(row.getCell(3));
                List<String> corpCodes = mapper.selectTrCorpCodesByName(companyId, trCorpName);
                if (corpCodes.isEmpty()) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "등록되지않은 증권사명(" + trCorpName + ")이 포함되어있습니다");
                }
                if (mapper.countByManageCode(companyId, manageCode) > 0) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "중복되는 관리코드(" + manageCode + ")가 포함되어있습니다");
                }
                mapper.excelInsert(new AccountExcelRow(mapper.selectNextId(), companyId, manageCode, cellString(row.getCell(1)),
                        corpCodes.get(0), trCorpName, cellString(row.getCell(2)), cellDate(row.getCell(4)), cellDate(row.getCell(5)),
                        LocalDateTime.now(), user.getName()));
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

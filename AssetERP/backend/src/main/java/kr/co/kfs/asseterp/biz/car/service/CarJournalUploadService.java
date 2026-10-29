package kr.co.kfs.asseterp.biz.car.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalSaveReq;
import kr.co.kfs.asseterp.biz.car.mapper.CarInfoMapper;
import kr.co.kfs.asseterp.biz.car.mapper.CarJournalMapper;
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

/** AS-IS server/utils/file/ExcelUpload.carUpload L3519-3618 (T12 [엑셀업로드]) + ./excelTemplete/Template_차량운행등록.xlsx ([템플릿]) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarJournalUploadService {

    private static final String TEMPLATE = "excelTemplete/Template_차량운행등록.xlsx";

    private final CarJournalMapper mapper;
    private final CarInfoMapper infoMapper;

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 하루: 사용일자(0)·출퇴근용(1)·일반업무용(2)·비업무용(3)·행선지(4)·목적(5).
     * 주행거리는 세 거리의 합. 한 행이라도 오류면 전체 롤백. 등록한 건수를 돌려준다.
     * 원본 그대로: 일반업무용 거리 열에 비업무용 값을 넣는다(`setBizMileage(unBizMileage)`) — 작업기록 제안
     */
    @Transactional
    public int upload(UserPrincipal user, Long personId, Long infoId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        if (infoId == null || infoMapper.selectById(companyId, infoId) == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 사용일자는 필수입력입니다.");
                }
                LocalDate date = cellDate(row.getCell(0));
                long commute = row.getCell(1) == null ? 0L : cellLong(row.getCell(1));
                long biz = row.getCell(2) == null ? 0L : cellLong(row.getCell(2));
                long unBiz = row.getCell(3) == null ? 0L : cellLong(row.getCell(3));
                String destination = row.getCell(4) == null ? "" : cellString(row.getCell(4));
                String reason = row.getCell(5) == null ? "" : cellString(row.getCell(5));
                CarJournalSaveReq req = new CarJournalSaveReq(null, infoId, date, personId, commute + biz + unBiz, commute, unBiz, unBiz,
                        destination, reason, null, null);
                mapper.insert(companyId, mapper.selectNextId(), req);
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

    /** ExcelUpload.getLongCellData — 숫자는 정수로 자르고, 글자는 쉼표를 빼고 숫자일 때만. 읽을 수 없으면 오류(원본은 null 계산 NPE) */
    private static long cellLong(Cell cell) {
        if (cell.getCellType() == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            String str = cell.getStringCellValue().replace(",", "");
            if (str.matches("-?\\d+")) return Long.parseLong(str);
        }
        throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀 파일을 읽을 수 없습니다.");
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고, 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
        Date date;
        if (cell.getCellType() == CellType.STRING) {
            try {
                date = new SimpleDateFormat("yyyyMMdd").parse(cell.getStringCellValue().replaceAll("[.-]", "").trim());
            } catch (ParseException e) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 사용일자를 읽을 수 없습니다.");
            }
        } else {
            date = cell.getDateCellValue();
        }
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }
}

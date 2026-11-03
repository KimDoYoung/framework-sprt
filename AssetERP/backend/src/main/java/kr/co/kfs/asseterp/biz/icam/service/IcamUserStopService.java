package kr.co.kfs.asseterp.biz.icam.service;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

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

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopExcelRow;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopSaveReq;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamUserMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/** 미사용ID 권한정지 신청 (AS-IS Icam55_Tab_UserStopAuthAppr → server/icam/Icam55_IcamUser + ExcelUpload.icamUserStopUpload, EE31) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamUserStopService {

    private static final String TEMPLATE = "excelTemplete/Template_권한정지 신청서.xlsx";
    private static final String REG_TYPE_STOP = "2";

    private final IcamUserMapper mapper;

    /** AS-IS icam.Icam55_IcamUser.selectBySearchText (regType 2) — 기준일자 하루(분기 마지막 날) */
    public List<IcamStopRes> search(String searchText, LocalDate stdDate) {
        String like = (searchText == null || searchText.isBlank()) ? "%" : "%" + searchText + "%";
        return mapper.selectStops(like, stdDate, stdDate, REG_TYPE_STOP);
    }

    /**
     * AS-IS icam.Icam55_IcamUser.update(UpdateDataModel) — icamUserId 0 이하는 INSERT, 아니면 UPDATE. 검사는 Icam55_Tab_UserStopAuthAppr.update L325-361.
     * (원본의 "결재 중인 문서의 정보는 수정 불가능합니다"는 문자열 `==` 비교라 실제로는 걸리지 않아 옮기지 않았다 — 이상한점 #196)
     */
    @Transactional
    public void save(UserPrincipal user, List<IcamStopSaveReq> rows) {
        if (rows == null) {
            return;
        }
        for (IcamStopSaveReq row : rows) {
            if (isBlank(row.companyName())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "회사명은 필수입력 항목입니다.");
            }
            if (isBlank(row.userId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용자ID는 필수입력 항목입니다.");
            }
            if (isBlank(row.userName())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용자명은 필수입력 항목입니다.");
            }
        }
        for (IcamStopSaveReq row : rows) {
            if (row.icamUserId() == null || row.icamUserId() <= 0) {
                mapper.insertStop(mapper.selectNextId(), user.getUserId(), row);
            } else {
                mapper.updateStop(row);
            }
        }
    }

    /** AS-IS icam.Icam55_IcamUser.updateApprIds — 받은 행 모두에 같은 상신ID */
    @Transactional
    public void updateApprIds(List<Long> ids, Long apprId) {
        if (apprId == null || ids == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        for (Long id : ids) {
            mapper.updateApprId(apprId, id);
        }
    }

    /** ./excelTemplete/Template_권한정지 신청서.xlsx */
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * AS-IS ExcelUpload.icamUserStopUpload L1761-1823 — 첫 시트 2번째 행부터 기준일자(0)·회사명(1)·사용자ID(2)·사용자명(3)·이메일(4).
     * 행마다 같은 (기준일자·회사명·사용자명·사용자ID)를 지우고 넣는다. 오류가 나면 전체 롤백. 넣은 행 수를 돌려준다.
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
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
                IcamStopExcelRow r = new IcamStopExcelRow(cellDate(row.getCell(0)), cellString(row.getCell(1)), cellString(row.getCell(2)),
                        cellString(row.getCell(3)), cellString(row.getCell(4)), user.getUserId());
                mapper.excelDelete(r);
                mapper.excelInsert(r);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
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

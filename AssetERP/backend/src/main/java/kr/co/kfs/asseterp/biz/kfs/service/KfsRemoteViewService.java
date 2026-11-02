package kr.co.kfs.asseterp.biz.kfs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.kfs.dto.RemoteViewRes;
import kr.co.kfs.asseterp.biz.kfs.dto.RemoteViewSaveReq;
import kr.co.kfs.asseterp.biz.kfs.mapper.KfsRemoteViewMapper;
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
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

/** 리모트뷰 사용기록 관리 (AS-IS server/kfs/Kfs01_RemoteView + ExcelUpload.remoteViewUpload) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KfsRemoteViewService {

    /** AS-IS 화면이 이 이름의 로그인 사원만 관리자로 본다(Kfs01_Tab_RemoteView.settings L128) */
    public static final String MANAGER_NAME = "정서현";

    private final KfsRemoteViewMapper mapper;

    /**
     * AS-IS retrieve() L221-254: 관리자는 kfs.Kfs01_RemoteView.selectByText("%사원명%", 기간), 그 밖의 사원은 selectByPersonName(자기 이름, 기간 조건 없음).
     * 어느 쪽인지는 AS-IS가 클라이언트에서 로그인 이름으로 고르던 것을 서버가 로그인 이름으로 정한다
     */
    public List<RemoteViewRes> search(UserPrincipal user, String personName, LocalDate startDate, LocalDate closeDate, boolean checkBox) {
        if (MANAGER_NAME.equals(user.getName())) {
            return mapper.selectByText(user.getCompanyId(), "%" + (personName == null ? "" : personName) + "%", startDate, closeDate, checkBox);
        }
        return mapper.selectByPersonName(user.getCompanyId(), user.getName(), checkBox);
    }

    /** AS-IS update(UpdateDataModel): 고친 행(업무내용·관리자확인)을 저장한다 → 저장된 행(요청 순서) */
    @Transactional
    public List<RemoteViewRes> save(UserPrincipal user, List<RemoteViewSaveReq> rows) {
        return rows.stream().map(req -> {
            mapper.updateRemoteView(user.getCompanyId(), req);
            return mapper.selectById(req.remoteViewId(), user.getCompanyId());
        }).toList();
    }

    /** AS-IS delete(deleteModel): 체크한 행을 지운다(로그인 회사 행만) */
    @Transactional
    public void delete(UserPrincipal user, List<Long> remoteViewIds) {
        if (remoteViewIds == null || remoteViewIds.isEmpty()) {
            return;
        }
        mapper.deleteRemoteViews(user.getCompanyId(), remoteViewIds);
    }

    /**
     * ExcelUpload.remoteViewUpload: 첫 시트 2번째 행부터 한 행이 한 사용기록 — 일시(0, "yyyy-MM-dd HH:mm…")·사용자(2)·종료일시(14).
     * 시작시간은 일시(0)의 시각, 종료시간은 종료일시(14)의 시각(각 HH:mm). 시작일시(13)와 종료일시(14)가 같거나 종료일시가 없으면 건너뛴다.
     * 다 넣은 뒤 같은 사용자·일자·시작시간의 중복을 지운다(excelDelete). 한 행이라도 오류면 전체 롤백. 등록 대상 건수를 돌려준다
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
                String dateTime = cellString(row.getCell(0));
                String personName = cellString(row.getCell(2));
                String startTime = cellString(row.getCell(13));
                String closeTime = cellString(row.getCell(14));
                if (closeTime == null || closeTime.equals(startTime)) {
                    continue;
                }
                try {
                    mapper.excelInsert(user.getCompanyId(), personName, LocalDate.parse(dateTime.substring(0, 10)),
                            dateTime.substring(11, 16), closeTime.substring(11, 16));
                } catch (DateTimeParseException | StringIndexOutOfBoundsException e) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, (i + 1) + "행의 일시를 읽을 수 없습니다. (yyyy-MM-dd HH:mm)");
                }
                count++;
            }
            mapper.excelDelete();
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
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
}

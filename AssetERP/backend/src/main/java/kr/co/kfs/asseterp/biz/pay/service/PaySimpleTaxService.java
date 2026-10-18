package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxOtherRes;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxOtherSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PaySimpleTaxMapper;
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
import java.util.List;

/**
 * AS-IS server/pay/Pay22_SimpleTaxTable.java + Pay23_SimpleTaxTableOther.java (+ ExcelUpload.simpleTaxTableUpload).
 * 간이세액표는 회사와 무관한 공통 표라 조회는 로그인한 누구나, 생성·저장·삭제·엑셀업로드는 관리자 회사만 한다(원본 화면도 관리자에게만 버튼을 연다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaySimpleTaxService {

    private final PaySimpleTaxMapper mapper;

    /** AS-IS Pay23_SimpleTaxTableOther.selectByAll: 적용일 목록(최신순) */
    public List<PayStartDateRes> searchDates() {
        return mapper.selectDates();
    }

    /** AS-IS Pay22_SimpleTaxTable.selectByDate: 천만원 이하 표. searchLong이 있으면 그 금액이 속한 구간만 */
    public List<PaySimpleTaxRes> search(LocalDate startDate, Long searchLong) {
        return mapper.selectByDate(startDate, searchLong);
    }

    /** AS-IS Pay23_SimpleTaxTableOther.selectByDate: 천만원 초과 표 */
    public List<PaySimpleTaxOtherRes> searchOther(LocalDate startDate) {
        return mapper.selectOtherByDate(startDate);
    }

    /**
     * AS-IS Pay23_SimpleTaxTableOther.insert: 적용일 이전 가장 최근 적용일의 천만원 초과 표를 새 적용일로 복사한다
     * (없으면 0으로 채운 한 줄). 천만원 이하 표는 복사하지 않는다 — 엑셀업로드로 채운다
     */
    @Transactional
    public void createDate(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "적용일은 필수입력 항목입니다");
        }
        List<PaySimpleTaxOtherRes> latest = mapper.selectOtherByStartDate(startDate);
        if (latest.isEmpty()) {
            mapper.insertOther(mapper.selectNextId(), new PaySimpleTaxOtherSaveReq(null, startDate, 0L, 0L, 0.0, 0.0, 0L, null));
            return;
        }
        for (PaySimpleTaxOtherRes row : latest) {
            mapper.insertOther(mapper.selectNextId(),
                    new PaySimpleTaxOtherSaveReq(null, startDate, row.fromAmt(), row.toAmt(), row.rate1(), row.rate2(), row.addTax(), row.note()));
        }
    }

    /** AS-IS Pay23_SimpleTaxTableOther.deleteByDate: 두 표의 해당 적용일을 모두 지운다 → 지운 건수(초과 표 기준) */
    @Transactional
    public int deleteDate(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        requireDate(startDate);
        int count = mapper.deleteOtherByDate(startDate);
        mapper.deleteTableByDate(startDate);
        return count;
    }

    /** AS-IS Pay22_SimpleTaxTable.deleteByDate: 엑셀업로드 전에 천만원 이하 표를 비운다 → 지운 건수 */
    @Transactional
    public int deleteTable(UserPrincipal user, LocalDate startDate) {
        requireSysAdmin(user);
        requireDate(startDate);
        return mapper.deleteTableByDate(startDate);
    }

    /**
     * AS-IS Pay23_SimpleTaxTableOther.update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서).
     * 원본은 필수값 검사가 없어 NOT NULL 열이 비면 DB 오류가 나므로 서버가 먼저 막는다
     */
    @Transactional
    public List<PaySimpleTaxOtherRes> saveOther(UserPrincipal user, List<PaySimpleTaxOtherSaveReq> rows) {
        requireSysAdmin(user);
        for (PaySimpleTaxOtherSaveReq req : rows) {
            if (req.startDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
            }
            if (req.fromAmt() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "초과 금액은 필수입력 항목입니다.");
            }
            if (req.toAmt() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이하 금액은 필수입력 항목입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.simpleTaxTableOtherId() != null && req.simpleTaxTableOtherId() > 0
                    && mapper.selectOtherById(req.simpleTaxTableOtherId()) != null;
            if (exists) {
                mapper.updateOther(req);
                return mapper.selectOtherById(req.simpleTaxTableOtherId());
            }
            long newId = mapper.selectNextId();
            mapper.insertOther(newId, req);
            return mapper.selectOtherById(newId);
        }).toList();
    }

    /** AS-IS Pay23_SimpleTaxTableOther.delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int deleteOther(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteOtherByIds(ids);
    }

    /**
     * AS-IS ExcelUpload.simpleTaxTableUpload: 첫 시트 첫 행부터(머리글 없음) 월급여액 이상·미만, 공제대상가족수 1~11을 읽어 넣는다.
     * 한 행이라도 오류면 전체 롤백 → 넣은 건수. (원본의 `excelDelete`는 방금 받은 새 ID로 지우므로 항상 0건이라 부르지 않는다)
     */
    @Transactional
    public int uploadExcel(UserPrincipal user, LocalDate startDate, MultipartFile file) {
        requireSysAdmin(user);
        requireDate(startDate);
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                Long fromAmt = cellLong(row.getCell(0));
                Long toAmt = cellLong(row.getCell(1));
                if (fromAmt == null || toAmt == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, (i + 1) + "행의 월급여액(이상·미만)을 읽을 수 없습니다.");
                }
                mapper.excelInsert(new PaySimpleTaxRes(mapper.selectNextId(), startDate, fromAmt, toAmt,
                        cellLong(row.getCell(2)), cellLong(row.getCell(3)), cellLong(row.getCell(4)), cellLong(row.getCell(5)),
                        cellLong(row.getCell(6)), cellLong(row.getCell(7)), cellLong(row.getCell(8)), cellLong(row.getCell(9)),
                        cellLong(row.getCell(10)), cellLong(row.getCell(11)), cellLong(row.getCell(12))));
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    /** ExcelUpload.getLongCellData — 숫자·수식 숫자는 정수로, 글자는 쉼표를 빼고 숫자면 변환 / 그 밖은 null */
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
            String s = cell.getStringCellValue().replace(",", "");
            return s.matches("-?\\d+") ? Long.valueOf(s) : null;
        }
        return null;
    }

    private static void requireDate(LocalDate startDate) {
        if (startDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준 적용일을 선택해주세요");
        }
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}

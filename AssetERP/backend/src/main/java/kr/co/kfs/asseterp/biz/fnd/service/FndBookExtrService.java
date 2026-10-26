package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.BookExtrRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookExtrSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndBookExtrMapper;
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
import java.util.List;

/**
 * AS-IS server/fnd/Fnd11_BookExtr.java (selectByStdDate L22 / selectRecentStdDate L28 / update L39 / delete L44)
 * + server/utils/file/ExcelUpload.bookFndExtrUpload L2763-2850 (P11 [엑셀업로드]) + ./excelTemplete/Template_펀드보유주식등록(타사무).xlsx ([템플릿])
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndBookExtrService {

    private static final String TEMPLATE = "excelTemplete/Template_펀드보유주식등록(타사무).xlsx";
    /** 종목구분(ItemMClassCode001-2010:주식/2050:집합투자증권), 엑셀은 항상 주식 */
    private static final String ITEM_TYPE_STOCK = "2010";

    private final FndBookExtrMapper mapper;

    /** AS-IS selectByStdDate: 검색어는 클라이언트가 "%…%"로 보낸다 */
    public List<BookExtrRes> search(UserPrincipal user, LocalDate stdDate, String searchText) {
        return mapper.selectByStdDate(user.getCompanyId(), stdDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS selectRecentStdDate: 그 날 이전 가장 최근 기준일(yyyy-MM-dd), 없으면 null */
    public String recentStdDate(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectRecentStdDate(user.getCompanyId(), stdDate);
    }

    /** AS-IS UpdateDataModel: ID가 DB에 있으면 UPDATE, 없으면 INSERT(0 이하는 새 id) → 저장된 행(요청 순서) */
    @Transactional
    public List<BookExtrRes> save(UserPrincipal user, List<BookExtrSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(req -> {
            boolean exists = req.bookExtrId() != null && req.bookExtrId() > 0 && mapper.selectById(req.bookExtrId()) != null;
            if (exists) {
                if (mapper.updateBookExtr(companyId, req) == 0) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
                return mapper.selectById(req.bookExtrId());
            }
            long newId = req.bookExtrId() != null && req.bookExtrId() > 0 ? req.bookExtrId() : mapper.selectNextId();
            mapper.insertBookExtr(newId, companyId, req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS deleteModel: 체크한 행을 지운다(로그인 회사 행만) */
    @Transactional
    public void delete(UserPrincipal user, List<Long> bookExtrIds) {
        if (bookExtrIds == null || bookExtrIds.isEmpty()) {
            return;
        }
        mapper.deleteBookExtrs(user.getCompanyId(), bookExtrIds);
    }

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 보유종목: 기준일(0)·펀드코드(1)·펀드명(2)·종목코드(3, 12자리)·종목명(4, 없으면 "").
     * 한 행이라도 오류면 전체 롤백(원본 rollback). 등록한 건수를 돌려준다.
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
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 기준일은 필수입력입니다.");
                }
                LocalDate stdDate = cellDate(row.getCell(0));
                if (row.getCell(1) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 펀드코드는 필수입력입니다.");
                }
                String fundCode = cellString(row.getCell(1));
                if (row.getCell(2) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 펀드명은 필수입력입니다.");
                }
                String fundName = cellString(row.getCell(2));
                if (row.getCell(3) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 종목코드는 필수입력입니다.");
                }
                String itemCode = cellString(row.getCell(3));
                String itemName = row.getCell(4) == null ? "" : cellString(row.getCell(4));
                if (itemCode.length() != 12) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) [" + fundName + "] 펀드의 종목코드가 12자리가 아닙니다.");
                }
                mapper.excelInsert(companyId, stdDate, fundCode, fundName, itemCode, itemName, ITEM_TYPE_STOCK);
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

package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookInitCheckRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookInitRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookInitSaveReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltBookInitMapper;
import kr.co.kfs.asseterp.biz.flt.mapper.FltTrMapper;
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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 최초원장 등록 (Flt13_Lookup_BookInit, EE46) — 로그인 사원 본인 것만 다룬다.
 * AS-IS server/flt/Flt13_BookInit.java (selectByPersonId L31, getInitDate L56, update L67, delete L131) · Flt10_Tr.countByTrDate L433 · ExcelUpload.fltBookInitUpload L2621
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltBookInitService {

    private static final String TEMPLATE = "excelTemplete/Template_초기원장등록.xlsx";

    private final FltBookInitMapper mapper;
    private final FltTrMapper trMapper;

    /** AS-IS Flt13_Lookup_BookInit.retrieve() L425-439: flt.Flt13_BookInit.selectByPersonId(회사, 로그인 사원, `%검색어%`) */
    public List<BookInitRes> search(UserPrincipal user, String searchText) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS Flt13_Lookup_BookInit.setStdDate() L267-283: flt.Flt13_BookInit.getInitDate — 등록된 최초원장이 없으면 null */
    public LocalDate initDate(UserPrincipal user) {
        return mapper.selectInitDate(user.getCompanyId(), user.getUserId());
    }

    /**
     * AS-IS Flt13_Lookup_BookInit.checkPreTr() L621-651 — ① 영업일 여부(sys.Sys12_Calendar.selectByDay) ② 잔고기준일 이전 실거래 내역(flt.Flt10_Tr.countByTrDate)
     * ③ 임직원매매 정기보고 상신문서(flt14_relate_appr.checkAppr). ①의 실패는 잔고기준일을 되돌리지 않는다
     */
    public BookInitCheckRes check(UserPrincipal user, LocalDate stdDate) {
        if (stdDate == null || !"true".equals(mapper.selectWorkingYn(stdDate))) {
            return new BookInitCheckRes(false, "최초원장 잔고기준일은 반드시 영업일이어야 합니다", false);
        }
        if (mapper.countTrByDate(user.getCompanyId(), user.getUserId(), stdDate) != 0) {
            return new BookInitCheckRes(false, "최초원장 기준일 이전에 등록된 실거래 내역이 존재하여, 최초원장 등록(수정)이 불가합니다.", true);
        }
        if (mapper.countRelateAppr(user.getUserId()) != 0) {
            return new BookInitCheckRes(false, "임직원매매 정기보고 상신문서가 존재하여, 최초원장 변경이 불가합니다.", true);
        }
        return new BookInitCheckRes(true, null, false);
    }

    /**
     * AS-IS Flt13_BookInit.update L67-129: 종목명 공백 제거 → flt13 INSERT/UPDATE → 행마다 보유원장(flt11)을 지우고 최초원장으로 다시 만든 뒤
     * 기준일 +1일부터 오늘까지 보유원장을 만든다(f_insert_floorTrBook). 함수가 'Y'가 아닌 글을 돌려주면 그 글로 실패(전체 롤백) → 요청과 같은 순서의 저장된 행
     */
    @Transactional
    public List<BookInitRes> save(UserPrincipal user, List<BookInitSaveReq> list) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        List<BookInitSaveReq> rows = new ArrayList<>();
        List<Long> ids = new ArrayList<>();
        for (BookInitSaveReq r : list) {
            if (r.accountId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "계좌를 선택하세요");
            }
            if (r.itemType() == null || r.itemType().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "종목유형을 선택하세요");
            }
            if (r.itemName() == null || r.itemName().trim().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "종목명을 입력하세요");
            }
            if (r.bookDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "상단의 원장기준일을 지정하세요");
            }
            BookInitSaveReq req = new BookInitSaveReq(r.bookInitId(), r.bookDate(), r.accountId(), r.itemType(), r.itemName().trim(), r.itemCode(), r.bookQty(), r.bookAmt());
            Long id = req.bookInitId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insert(id, companyId, personId, req);
            } else if (mapper.update(companyId, personId, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "최초원장 정보를 찾을 수 없습니다.");
            }
            rows.add(req);
            ids.add(id);
        }
        for (BookInitSaveReq r : rows) {
            Boolean stk = trMapper.selectStkPriceYn(companyId, r.itemType(), r.bookDate().toString());
            mapper.deleteBookByItem(companyId, personId, r.accountId(), r.itemType(), String.valueOf(Boolean.TRUE.equals(stk)), r.itemCode(), r.itemName());
            mapper.insertBookByFlt13(companyId, personId, r.accountId(), r.itemType(), r.itemCode(), r.itemName());
            String msg = mapper.insertFloorTrBook(companyId, personId, r.accountId().toString(), r.itemType(), r.itemName(), r.itemCode(), r.bookDate().plusDays(1));
            if (!"Y".equals(msg)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
            }
        }
        List<BookInitRes> saved = new ArrayList<>();
        for (Long id : ids) {
            saved.add(mapper.selectById(companyId, personId, id));
        }
        return saved;
    }

    /** AS-IS Flt13_BookInit.delete L131-164: 행마다 보유원장(flt11)을 정리하고 최초원장을 지운다 → 지운 건수. 본인 행만 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        for (Long id : ids) {
            BookInitRes r = mapper.selectById(companyId, personId, id);
            if (r == null) {
                continue;
            }
            Boolean stk = trMapper.selectStkPriceYn(companyId, r.itemType(), r.bookDate().toString());
            mapper.deleteBookByItem(companyId, personId, r.accountId(), r.itemType(), String.valueOf(Boolean.TRUE.equals(stk)), r.itemCode(), r.itemName());
        }
        return mapper.deleteByIds(companyId, personId, ids);
    }

    /** AS-IS downloadForm → ./excelTemplete/Template_초기원장등록.xlsx */
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.", e);
        }
    }

    /**
     * AS-IS ExcelUpload.fltBookInitUpload L2621-2760 — 첫 시트 2번째 행부터 계좌번호·종목명·종목유형·종목코드·보유수량·보유금액.
     * 계좌를 하나로 못 찾는 행은 건너뛰고, 잔고기준일은 화면의 값. 중간에 실패하면 전체 롤백 → 안내 문구
     */
    @Transactional
    public String upload(UserPrincipal user, LocalDate stdDate, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        if (stdDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상단의 원장기준일을 지정하세요");
        }
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                String accountNo = cellString(row.getCell(0));
                if (accountNo != null && isExponentialFormat(accountNo)) {
                    accountNo = new BigDecimal(accountNo).toPlainString();
                }
                String itemName = nz(cellString(row.getCell(1))).trim();
                String itemType = stripZero(nz(cellString(row.getCell(2))));
                String itemCode = nz(cellString(row.getCell(3))).trim();
                Double qty = cellDouble(row.getCell(4));
                Long amt = cellLong(row.getCell(5));

                List<Long> accountIds = trMapper.selectAccountIdsByNo(companyId, personId, accountNo);
                if (accountIds.size() != 1) {
                    continue;
                }
                Boolean stk = trMapper.selectStkPriceYn(companyId, itemType, stdDate.toString());
                if (Boolean.TRUE.equals(stk) && itemCode.length() != 12) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "[" + itemName + "] 종목의 종목코드가 12자리가 아닙니다.");
                }
                Long accountId = accountIds.get(0);
                mapper.insertExcel(companyId, personId, accountId, itemName, itemType, stdDate, amt, qty, itemCode);
                mapper.insertBookByFlt13(companyId, personId, accountId, itemType, itemCode, itemName);
                String msg = mapper.insertFloorTrBook(companyId, personId, accountId.toString(), itemType, itemName, itemCode, stdDate.plusDays(1));
                if (!"Y".equals(msg)) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
                }
            }
            return "초기원장등록을 업로드하였습니다.";
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    private static String nz(String s) {
        return s == null ? "" : s;
    }

    /** "10.0" 같은 숫자 글자는 소수점 앞만 */
    private static String stripZero(String s) {
        return s != null && s.matches("-?\\d+\\.0+") ? s.substring(0, s.indexOf('.')) : s;
    }

    private static boolean isExponentialFormat(String s) {
        return s.contains("E") || s.contains("e");
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

    /** ExcelUpload.getLongCellData */
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

    /** ExcelUpload.getDoubleCellData */
    private static Double cellDouble(Cell cell) {
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

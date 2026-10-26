package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.IpoAccountRes;
import kr.co.kfs.asseterp.biz.fnd.dto.IpoAccountSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndAccountMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * AS-IS server/fnd/Fnd32_Account.java (selectByText L26 / updateList L36 / copyUpdate L50 / delete L71)
 * + server/utils/file/ExcelUpload.accountUpload L3084 ([엑셀업로드]) + ./excelTemplete/Template_공모주참여계좌.xlsx ([템플릿])
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndAccountService {

    private static final String TEMPLATE = "excelTemplete/Template_공모주참여계좌.xlsx";

    private final FndAccountMapper mapper;

    /** AS-IS selectByText: 검색어는 클라이언트가 "%…%"로, 계좌상태는 코드 또는 "%"(전체) */
    public List<IpoAccountRes> search(UserPrincipal user, String searchText, String accountStateCode) {
        return mapper.selectByText(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%",
                accountStateCode == null || accountStateCode.isEmpty() ? "%" : accountStateCode);
    }

    /** AS-IS updateList(UpdateDataModel): ID가 DB에 있으면 UPDATE, 없으면 INSERT(0 이하는 새 id) → 저장된 행(요청 순서) */
    @Transactional
    public List<IpoAccountRes> save(UserPrincipal user, List<IpoAccountSaveReq> rows) {
        return rows.stream().map(req -> saveOne(user.getCompanyId(), req)).toList();
    }

    /** AS-IS copyUpdate: [등록(복사)]가 만든 새 행을 곧바로 저장한다 → 저장된 행 */
    @Transactional
    public IpoAccountRes copy(UserPrincipal user, IpoAccountSaveReq req) {
        return saveOne(user.getCompanyId(), req);
    }

    private IpoAccountRes saveOne(Long companyId, IpoAccountSaveReq req) {
        boolean exists = req.accountId() != null && req.accountId() > 0 && mapper.selectById(req.accountId(), companyId) != null;
        if (exists) {
            mapper.updateAccount(companyId, req);
            return mapper.selectById(req.accountId(), companyId);
        }
        long newId = req.accountId() != null && req.accountId() > 0 ? req.accountId() : mapper.selectNextId();
        mapper.insertAccount(newId, companyId, req);
        return mapper.selectById(newId, companyId);
    }

    /** AS-IS deleteModel: 체크한 행을 지운다(로그인 회사 행만) */
    @Transactional
    public void delete(UserPrincipal user, List<Long> accountIds) {
        if (accountIds == null || accountIds.isEmpty()) {
            return;
        }
        mapper.deleteAccounts(user.getCompanyId(), accountIds);
    }

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 계좌: 개설일자(0, yyyy-MM-dd)·증권사명(1)·관리점(2)·운용대상(3)·구분(4)·계좌명(5)·계좌번호(6)·연계은행(7)·은행연계계좌(8)·상태(9)·상장일출고(10)·담당자연락처(11)·비고(12).
     * 이름으로 증권사·연계은행(사용 중 거래처)과 코드(운용대상·구분·상태·상장일출고, 개설일자 기준 유효 코드)를 찾고 없으면 그 문구로 중단한다.
     * 한 행이라도 오류면 전체 롤백(원본은 commit 전에 중단). 등록한 건수를 돌려준다
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
                LocalDate setupDate = cellDate(row.getCell(0), i + 1);
                String corpName = cellString(row.getCell(1));
                String branch = cellString(row.getCell(2));
                String accountName1 = cellString(row.getCell(3));
                String accountName2 = cellString(row.getCell(4));
                String accountName = cellString(row.getCell(5));
                String accountNo = cellString(row.getCell(6));
                String bankCorpName = cellString(row.getCell(7));
                String bankLinkNo = cellString(row.getCell(8));
                String accountStateName = cellString(row.getCell(9));
                String ipoOutName = cellString(row.getCell(10));
                String managerTel = cellString(row.getCell(11));
                String note = cellString(row.getCell(12));

                Long corpId = null;
                if (corpName != null) {
                    corpId = mapper.selectCorpIdByName(companyId, corpName);
                    if (corpId == null) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, "[" + corpName + "] 해당하는 증권사가 존재하지 않습니다.");
                    }
                }
                Long bankCorpId = null;
                if (bankCorpName != null) {
                    bankCorpId = mapper.selectCorpIdByName(companyId, bankCorpName);
                    if (bankCorpId == null) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, "[" + bankCorpName + "] 해당하는 연계은행이 존재하지 않습니다.");
                    }
                }
                String accountCode1 = codeByName(companyId, "Fnd32Code1", accountName1, setupDate, "[%s] 해당하는 운용대상이 존재하지 않습니다.");
                String accountCode2 = codeByName(companyId, "Fnd32Code2", accountName2, setupDate, "[%s]해당하는 구분이 존재하지 않습니다.");
                String accountStateCode = codeByName(companyId, "AccountStateCode", accountStateName, setupDate, "[%s]해당하는 상태가 존재하지 않습니다.");
                String ipoOutCode = codeByName(companyId, "IpoOutCode", ipoOutName, setupDate, "[%s]해당하는 상장일출고가 존재하지 않습니다.");

                mapper.insertAccount(mapper.selectNextId(), companyId, new IpoAccountSaveReq(null, setupDate, corpId, branch, accountCode1,
                        accountCode2, accountName, accountNo, bankCorpId, bankLinkNo, accountStateCode, ipoOutCode, managerTel, note));
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    private String codeByName(Long companyId, String kindCode, String name, LocalDate applyDate, String notFoundFormat) {
        if (name == null) {
            return null;
        }
        String code = mapper.selectCodeByName(companyId, kindCode, name, applyDate);
        if (code == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, String.format(notFoundFormat, name));
        }
        return code;
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

    /** 개설일자: 원본은 글자를 yyyy-MM-dd로만 읽는다(날짜 서식 셀이면 일련번호 글자가 되어 읽기 오류). 날짜 서식 셀도 날짜 값으로 읽는다 */
    private static LocalDate cellDate(Cell cell, int rowNo) {
        try {
            if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            }
            return LocalDate.parse(cellString(cell));
        } catch (DateTimeParseException | IllegalStateException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, rowNo + "행의 개설일자를 읽을 수 없습니다. (yyyy-MM-dd)");
        }
    }
}

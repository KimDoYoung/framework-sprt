package kr.co.kfs.asseterp.biz.mkt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.mapper.MktTargetManageMapper;
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

/** Z05 Mkt01_Lookup_ExcelUpload → server/utils/file/ExcelUpload.java targetCompanyUpload (L3835-4042) + ./excelTemplete/Template_업무활동등록.xlsx */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MktTargetUploadService {

    private static final String TEMPLATE = "excelTemplete/Template_업무활동등록.xlsx";

    private final MktTargetManageMapper mapper;

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 첫 시트 2번째 행부터: 활동처(0)·담당자(1)·부서(2)·직위(3)·전화(4)·이메일(5)·비고(6)·퇴직정보(7). 앞 세 칸이 모두 빈 행이 11번 넘게 이어지면 거기서 끝낸다.
     * 한 행이라도 오류면 전체 롤백(원본 sqlSession.rollback). 즐겨찾기는 로그인 사원이 있을 때(personId != 0)만, 이미 있던 활동처에 공백 없는 이름으로
     * 바로 맞은 행에는 넣지 않는다(원본 그대로).
     */
    @Transactional
    public void upload(UserPrincipal user, String itemTypeCode, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        // AS-IS: 회사관리자("관리자")는 personId 0. 회사관리자의 사원 ID는 음수이므로 0으로 본다
        Long personId = user.getUserId() != null && user.getUserId() > 0 ? user.getUserId() : 0L;
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int spaceSeq = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (spaceSeq > 10) {
                    break;
                }
                if (isEmpty(row.getCell(0)) && isEmpty(row.getCell(1)) && isEmpty(row.getCell(2))) {
                    spaceSeq++;
                    continue;
                }
                spaceSeq = 0;

                Long targetCompanyId = null;
                String targetCompanyName = null;
                if (isEmpty(row.getCell(0))) {
                    targetCompanyName = "기타";
                } else {
                    targetCompanyId = mapper.selectIdByName(companyId, itemTypeCode, str(row.getCell(0)).replace(" ", ""));
                    if (targetCompanyId == null) {
                        targetCompanyName = str(row.getCell(0));
                    }
                }
                String managerName = value(row, 1);
                String orgName = value(row, 2);
                String posName = value(row, 3);
                String tel = value(row, 4);
                String emailAddr = value(row, 5);
                String note = value(row, 6);
                String retireInfo = value(row, 7);

                if (targetCompanyId != null) {
                    mapper.insertManagerExcel(mapper.selectNextId(), targetCompanyId, companyId, managerName, orgName, posName, tel, emailAddr, note, retireInfo);
                    continue;
                }
                Long found = mapper.selectIdByName(companyId, itemTypeCode, targetCompanyName);
                Long useCompanyId = found;
                if (found == null) {
                    useCompanyId = mapper.selectNextId();
                    mapper.insertCompanyExcel(useCompanyId, companyId, itemTypeCode, targetCompanyName);
                }
                long managerId = mapper.selectNextId();
                mapper.insertManagerExcel(managerId, useCompanyId, companyId, managerName, orgName, posName, tel, emailAddr, note, retireInfo);
                if (personId != 0) {
                    mapper.insertFavoriteExcel(mapper.selectNextId(), personId, managerId);
                }
            }
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    private static String value(Row row, int index) {
        return isEmpty(row.getCell(index)) ? null : str(row.getCell(index));
    }

    /** ExcelUpload.isCellEmpty */
    private static boolean isEmpty(Cell cell) {
        if (cell == null) {
            return true;
        }
        return switch (cell.getCellType()) {
            case BLANK -> true;
            case STRING -> cell.getStringCellValue() == null || cell.getStringCellValue().trim().isEmpty();
            default -> false;
        };
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 */
    private static String str(Cell cell) {
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
    }
}

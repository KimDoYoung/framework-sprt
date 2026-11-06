package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.DeductRow;
import kr.co.kfs.asseterp.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.biz.emp.dto.TransRow;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpTransInfoMapper;
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

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * SEU03 AS-IS ExcelUpload.empUpload L2300-2469 (Emp00_Tab_TransInfo [엑셀업로드], 회사관리자만): 첫 시트 2번째 줄부터 한 줄 = 사원 한 명.
 * 열: 0 사번 · 1 이름(공백 제거) · 2 사원구분코드 · 3 입사일 · 4 이메일 · 5 휴대폰 · 6 직책코드 · 7 직위코드 · 8 발령구분코드 · 9 조직코드 · 10 회사번호 · 11 내선번호.
 * 한 줄마다 사람(emp01) → 기타(emp02) → 발령(emp03, 발령일=입사일) → 급여공제(emp35) + 공제항목(emp36).
 * AS-IS는 단계마다 commit해서 중간에 실패하면 앞 줄·앞 단계가 남지만, TOBE는 한 트랜잭션이라 실패하면 모두 되돌린다(원본-이상한점).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpTransInfoUploadService {

    private final EmpTransInfoMapper mapper;

    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        if (user.getUserId() >= 0) {  // 화면: LoginUser.getIsManager()일 때만 [엑셀업로드]가 보인다
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int rowIndex = 1; rowIndex < sheet.getPhysicalNumberOfRows(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    throw invalid(rowIndex + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw invalid("엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                insertOne(companyId, row, rowIndex);
                count++;
            }
            return count;
        } catch (IOException | RuntimeException e) {
            if (e instanceof BusinessException be) {
                throw be;
            }
            throw invalid("엑셀 파일을 읽을 수 없습니다.").causedBy(e);
        }
    }

    private void insertOne(Long companyId, Row row, int rowIndex) {
        String empNo = text(row, 0);
        String korNm = text(row, 1).replaceAll("\\s+", "");
        String kindCd = text(row, 2);
        LocalDate hireDate = date(row.getCell(3));
        String email = text(row, 4);
        String mobile = text(row, 5);
        String titleCd = text(row, 6);
        String posCd = text(row, 7);
        String transCd = text(row, 8);
        String orgCode = text(row, 9);
        String officeTelNo = text(row, 10);
        String officeDetail = text(row, 11);

        String where = rowIndex + "행: ";
        if (hireDate == null) {
            throw invalid(where + "입사일을 읽을 수 없습니다.");
        }
        if (empNo.isEmpty() || mapper.countEmpNo(companyId, empNo) > 0) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, where + "사원번호 '" + empNo + "'은(는) 비었거나 이미 사용 중입니다.");
        }
        String kind = requireCode(companyId, "EmpKindCode", hireDate, kindCd, where, "사원구분");
        String pos = requireCode(companyId, "EmpPosCode", hireDate, posCd, where, "직위");
        String title = requireCode(companyId, "EmpTitleCode", hireDate, titleCd, where, "직책");
        String trans = requireCode(companyId, "EmpTransCode", hireDate, transCd, where, "발령구분");
        Long orgCodeId = mapper.selectOrgCodeIdByOrgCode(companyId, orgCode);
        if (orgCodeId == null) {
            throw invalid(where + "조직코드 '" + orgCode + "'을(를) 찾을 수 없습니다.");
        }

        Long personId = mapper.selectNextId();
        mapper.insertPerson(new PersonRow(personId, companyId, empNo, korNm, hireDate, null, null, null, email, officeTelNo, officeDetail, mobile, null));
        mapper.insertOthers(personId);
        Long transId = mapper.selectNextId();
        mapper.insertTrans(new TransRow(transId, companyId, personId, hireDate, trans, kind, orgCodeId, title, pos, null, null, null, null, null, null, null));
        Long deductId = mapper.selectNextId();
        mapper.insertDeduct(new DeductRow(deductId, companyId, personId, hireDate));
        for (String type : mapper.selectAddDeductTypes(hireDate)) {
            mapper.insertAddDeduct(deductId, type);
        }
    }

    private String requireCode(Long companyId, String kindCode, LocalDate applyDate, String code, String where, String label) {
        String found = mapper.selectCodeByCode2(companyId, kindCode, applyDate, code);
        if (found == null) {
            throw invalid(where + label + " 코드 '" + code + "'을(를) 찾을 수 없습니다.");
        }
        return found;
    }

    /** AS-IS getStringCellData: 숫자는 정수면 long 문자열, 아니면 double 문자열. 빈 칸은 "" */
    private static String text(Row row, int index) {
        Cell cell = row.getCell(index);
        if (cell == null) {
            return "";
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double v = cell.getNumericCellValue();
            return (v == Math.rint(v) ? String.valueOf((long) v) : String.valueOf(v)).trim();
        }
        return cell.getStringCellValue().trim();
    }

    /** AS-IS getCellDate: 문자열은 '.'·'-'를 빼고 yyyyMMdd, 그 밖은 날짜 셀. 읽을 수 없으면 null */
    private static LocalDate date(Cell cell) {
        if (cell == null) {
            return null;
        }
        try {
            if (cell.getCellType() == CellType.STRING) {
                return LocalDate.parse(cell.getStringCellValue().replaceAll("[.-]", "").trim(), DateTimeFormatter.BASIC_ISO_DATE);
            }
            return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        } catch (DateTimeParseException | IllegalStateException e) {
            return null;
        }
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}

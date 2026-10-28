package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayAnnualRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayAnnualSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayAnnualMapper;
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
import java.util.Set;

/**
 * AS-IS server/pay/Pay01_Annual.java (selectByAll L24 / selectByPersonId L39 / update L54 / delete L59)
 * + server/utils/file/ExcelUpload.payUpload L1667 ([엑셀업로드]) + ./excelTemplete/Template_연봉계약정보.xlsx ([템플릿])
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayAnnualService {

    private static final String TEMPLATE = "excelTemplete/Template_연봉계약정보.xlsx";
    /** 상신 상태 10:진행 20:진행 30:완료 — 이 문서가 걸린 행은 저장·삭제 못 한다 */
    private static final Set<String> IN_APPR = Set.of("10", "20", "30");
    private static final String RD_WINDOW_CLASS_NAME = "Pay01_Tab_AnnualList";

    private final PayAnnualMapper mapper;

    /** AS-IS retrieve() L565: 사원을 골랐으면 selectByPersonId, 아니면 selectByAll. radioOption 1 최근등록내역 / 2 년도별 / 3 전체 */
    public List<PayAnnualRes> search(UserPrincipal user, Long personId, int radioOption, String yearStr, boolean retireYn, boolean apprCheckYn) {
        Long companyId = user.getCompanyId();
        return personId == null
                ? mapper.selectByAll(companyId, radioOption, yearStr, retireYn, apprCheckYn)
                : mapper.selectByPersonId(companyId, personId, radioOption, yearStr, retireYn, apprCheckYn, false);
    }

    /**
     * 연봉조회(S15) — AS-IS Pay01_Tab_AnnualPerson.retrieve() L130: selectByPersonId(companyId, personId = 로그인 사용자, apprYn "true").
     * radioOption·retireYn을 안 보내므로 기간·퇴직 조건 없이 본인의 결재완료 연봉 전부. 사원은 서버가 로그인 사용자로 정한다(남의 연봉을 못 본다)
     */
    public List<PayAnnualRes> searchMine(UserPrincipal user) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), 0, null, true, false, true);
    }

    /**
     * 연봉계약현황(S14) [출력/다운로드] — AS-IS Sys99_Print.insertRdAnnualListAll(personId 없음) / insertRdAnnualList L2306·L2386:
     * ① 내 출력 자료 정리 ② 결재완료(apprCheckYn true) 목록을 sys99_print에 삽입 ③ 새 groupId 반환.
     * AS-IS는 사원을 골랐을 때 정리를 "고른 사원 ID"로 지워 로그인 사용자의 지난 자료가 남는다 → 로그인 사용자 기준으로 지운다
     */
    @Transactional
    public String insertRdPrint(UserPrincipal user, Long personId, int radioOption, String yearStr, boolean retireYn) {
        if (radioOption < 1 || radioOption > 3 || (radioOption == 2 && (yearStr == null || !yearStr.matches("\\d{4}")))) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), RD_WINDOW_CLASS_NAME);
        if (personId == null) {
            mapper.insertPrintAll(user.getCompanyId(), user.getUserId(), RD_WINDOW_CLASS_NAME, groupId, radioOption, yearStr, retireYn, true);
        } else {
            mapper.insertPrintPerson(user.getCompanyId(), user.getUserId(), RD_WINDOW_CLASS_NAME, groupId, personId, radioOption, yearStr, retireYn, true, false);
        }
        return String.valueOf(groupId);
    }

    /**
     * AS-IS update() L601 + UpdateDataModel: 있는 행은 고치고 없는 행은 새 ID로 넣는다 → 저장된 행(요청 순서).
     * 상신 중·완료 행은 못 고친다(화면 검사를 서버에서도), 사원이 로그인 회사 소속인지 확인한다(TOBE 추가)
     */
    @Transactional
    public List<PayAnnualRes> save(UserPrincipal user, List<PayAnnualSaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (PayAnnualSaveReq req : rows) {
            PayAnnualRes old = existing(companyId, req.annualId());
            if (old != null && old.apprStatusCode() != null && IN_APPR.contains(old.apprStatusCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "상신중인 문서가 포함되어있습니다. 해당 문서는 저장이 불가능합니다");
            }
            if (req.personId() == null || req.startDate() == null || req.closeDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "성명·적용시작일·적용종료일은 필수입력 항목입니다.");
            }
            if (req.closeDate().isBefore(req.startDate())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "시작일과 종료일을 확인해주세요");
            }
            if (mapper.countPerson(companyId, req.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.stream().map(req -> {
            if (existing(companyId, req.annualId()) != null) {
                mapper.update(companyId, req);
                return mapper.selectById(req.annualId(), companyId, 2);
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, companyId, req);
            return mapper.selectById(newId, companyId, 2);
        }).toList();
    }

    /** AS-IS delete() L635: 상신 중·완료 행이 하나라도 있으면 막는다 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        Long companyId = user.getCompanyId();
        for (Long id : ids) {
            PayAnnualRes old = existing(companyId, id);
            if (old != null && old.apprStatusCode() != null && IN_APPR.contains(old.apprStatusCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "상신중인 문서가 포함되어있습니다. 해당 문서는 삭제가 불가능합니다");
            }
        }
        return mapper.deleteByIds(companyId, ids);
    }

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 연봉계약: 사번(0)·성명(1, 저장 안 함)·적용시작일(2)·적용종료일(3)·시업(4)·종업(5)·기본연봉(6)·퇴직금(7)·
     * 기타약정사항(8)·기본급여(9)·중식대(10)·차량유지비(11)·연장근로(12)·기타급여1(13)·기타급여2(14).
     * [사번/적용시작일/적용종료일]이 같은 내역은 지우고 새로 넣는다. 한 행이라도 오류면 전체 롤백(원본은 commit 전에 중단). 등록한 건수를 돌려준다
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
                String personNo = cellString(row.getCell(0));
                LocalDate startDate = cellDate(row.getCell(2));
                LocalDate closeDate = cellDate(row.getCell(3));
                Long personId = personNo == null ? null : mapper.selectPersonIdByEmpNo(companyId, personNo);
                if (personId == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, (i + 1) + "행의 사번 [" + personNo + "]을 찾을 수 없습니다.");
                }
                if (startDate == null || closeDate == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, (i + 1) + "행의 적용시작일·적용종료일을 읽을 수 없습니다.");
                }
                PayAnnualSaveReq req = new PayAnnualSaveReq(null, personId, startDate, closeDate,
                        cellString(row.getCell(4)), cellString(row.getCell(5)), null,
                        cellLong(row.getCell(6)), cellLong(row.getCell(7)), cellString(row.getCell(8)),
                        cellLong(row.getCell(9)), cellLong(row.getCell(10)), cellLong(row.getCell(11)), null,
                        cellLong(row.getCell(12)), cellLong(row.getCell(13)), cellLong(row.getCell(14)));
                mapper.excelDelete(companyId, personId, startDate, closeDate);
                mapper.excelInsert(mapper.selectNextId(), companyId, personId, req);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    private PayAnnualRes existing(Long companyId, Long annualId) {
        return annualId != null && annualId > 0 ? mapper.selectById(annualId, companyId, 2) : null;
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

    /** ExcelUpload.getLongCellData — 수식은 마지막 계산값(숫자만), 숫자 셀은 소수점 버림, 글자는 쉼표를 빼고 숫자면 그 값 */
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
            String str = cell.getStringCellValue().replace(",", "");
            return str.matches("-?\\d+") ? Long.parseLong(str) : null;
        }
        return null;
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

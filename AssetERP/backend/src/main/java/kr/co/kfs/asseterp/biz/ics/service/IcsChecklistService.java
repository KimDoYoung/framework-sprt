package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistClassCodeRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistUseYnReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistUserRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteGroupReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsChecklistMapper;
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
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * AS-IS Ics10_Tab_ChecklistAdmin·Ics10_Edit_Checklist → server/ics/Ics10_Checklist.java (selectByAdmin L40 / modelUpdate L69 / delete L121)
 * + server/sys/Sys09_Code.selectByIcs21 L213·selectByIcs23 L222 (분류 콤보). 회사는 로그인 회사로 채우고, 조회·수정·삭제도 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsChecklistService {

    private final IcsChecklistMapper mapper;

    /** AS-IS selectByAdmin: 대분류·중분류 없으면 전체, useYn '%'·'true'·'false', 검색어는 %…%, 기준일 오늘 */
    public List<IcsChecklistRes> search(UserPrincipal user, Long checklistLClassId, Long checklistMClassId, String useYn, String searchText) {
        String yn = (useYn == null || useYn.isBlank()) ? "%" : useYn;
        return mapper.selectByAdmin(user.getCompanyId(), checklistLClassId, checklistMClassId, yn,
                "%" + (searchText == null ? "" : searchText) + "%", LocalDate.now());
    }

    /** 새 체크리스트를 열 때 받는 id (AS-IS GridInsertRow가 getSeq로 미리 받아 넣던 id — 연결 법규를 저장 전에 붙이려면 필요) */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /**
     * AS-IS modelUpdate: 중분류·체크대상이 있어야 한다. id가 있으면 고치고(없으면 그 id로 넣는다), 공통 회사(0)가 아니면 고객사별 설정(ics11)의 사용여부도 같이 고친다.
     * → 저장된 행(selectById)
     */
    @Transactional
    public IcsChecklistRes save(UserPrincipal user, IcsChecklistSaveReq req) {
        if (req.checklistMClassId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "중분류는 필수선택 항목입니다");
        }
        if (req.content() == null || req.content().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "체크대상은 필수입력 항목입니다");
        }
        Long companyId = user.getCompanyId();
        long id = (req.checklistId() == null || req.checklistId() <= 0) ? mapper.selectNextId() : req.checklistId();
        IcsChecklistSaveReq row = new IcsChecklistSaveReq(id, req.content(), req.criterion(), req.useYn(), req.checklistMClassId(), req.seq());
        if (companyId != 0L) {
            mapper.updateCompanyUseYn(companyId, id, row.useYn());
        }
        if (mapper.update(companyId, row) == 0) {
            mapper.insert(companyId, row);
        }
        return mapper.selectById(id, companyId);
    }

    /** AS-IS delete(UpdateDataModel.deleteModel): ID로 지운다(작성 기록은 원본도 그대로 둔다) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> checklistIds) {
        return checklistIds.stream().mapToInt(id -> mapper.deleteById(id, user.getCompanyId())).sum();
    }

    // ── K04 내부통제 체크리스트 관리 (Ics10_Tab_Checklist·Ics10_Lookup_UseYn·Ics10_Lookup_ExcelUpload) ──

    private static final String TEMPLATE = "excelTemplete/Template_내부통제 체크리스트.xlsx";

    /** AS-IS selectBySearchText: 대분류·중분류 없으면 전체, 검색어는 %…%, 기준일 오늘. 본 화면은 useYn을 "true"로 고정해 부른다 */
    public List<IcsChecklistUserRes> searchForCompany(UserPrincipal user, Long checklistLClassId, Long checklistMClassId, String useYn, String searchText) {
        String yn = (useYn == null || useYn.isBlank()) ? "%" : useYn;
        return mapper.selectBySearchText(user.getCompanyId(), checklistLClassId, checklistMClassId, yn,
                "%" + (searchText == null ? "" : searchText) + "%", LocalDate.now());
    }

    /** AS-IS preDelete: 고른 체크리스트 중 작성내역이 있는 것의 수(0이 아니면 못 지운다) */
    public int countWritten(UserPrincipal user, List<Long> checklistIds) {
        return checklistIds.stream().mapToInt(id -> mapper.countWrites(user.getCompanyId(), id) == 0 ? 0 : 1).sum();
    }

    /**
     * AS-IS Ics11_ChecklistCompany.updateUseYn: 고객사별 설정(ics11)이 있으면 사용여부를 고치고 없으면 새로 넣는다(담당그룹 없음).
     * 고객사가 만든 체크리스트면 ics10의 사용여부도 같이 고친다
     */
    @Transactional
    public int updateUseYn(UserPrincipal user, List<IcsChecklistUseYnReq> rows) {
        Long companyId = user.getCompanyId();
        for (IcsChecklistUseYnReq row : rows) {
            if (mapper.selectCompanyRowId(companyId, row.checklistId()) != null) {
                mapper.updateCompanyUseYn(companyId, row.checklistId(), row.useYn());
            } else {
                mapper.insertCompanyRow(mapper.selectNextId(), companyId, row.checklistId(), null, row.useYn());
            }
            mapper.updateChecklistUseYn(companyId, row.checklistId(), row.useYn());
        }
        return rows.size();
    }

    /** AS-IS Ics11_ChecklistCompany.updateWriteGroupId: ics11이 있으면 담당그룹만 고치고, 없으면 그 사용여부로 새로 넣는다. writeGroupId가 null이면 지정 해제 */
    @Transactional
    public int updateWriteGroup(UserPrincipal user, IcsChecklistWriteGroupReq req) {
        Long companyId = user.getCompanyId();
        for (IcsChecklistUseYnReq row : req.checklists()) {
            if (mapper.selectCompanyRowId(companyId, row.checklistId()) != null) {
                mapper.updateCompanyWriteGroup(companyId, row.checklistId(), req.writeGroupId());
            } else {
                mapper.insertCompanyRow(mapper.selectNextId(), companyId, row.checklistId(), req.writeGroupId(), row.useYn());
            }
        }
        return req.checklists().size();
    }

    /**
     * 출력/다운로드 — AS-IS는 Sys99_Print.insertRdCheckList(sys99_print에 쌓음) + RD 리포트 Ics10_Rd_Checklist.
     * RD 서버가 없으므로 같은 조회(사용 중인 항목)를 한 시트 xlsx로 쓴다
     */
    public byte[] export(UserPrincipal user, Long checklistLClassId, Long checklistMClassId, String searchText) {
        List<List<Object>> rows = searchForCompany(user, checklistLClassId, checklistMClassId, "true", searchText).stream()
                .map(r -> Arrays.<Object>asList(r.checkLClassName(), r.checkMClassName(), r.content(), r.criterion(), r.writeGroupName()))
                .toList();
        return IcsExcelWriter.write("내부통제 체크리스트", List.of("대분류", "중분류", "체크대상", "근거", "담당그룹"), rows);
    }

    /** 엑셀 템플릿 (AS-IS downloadForm → ./excelTemplete/Template_내부통제 체크리스트.xlsx) */
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * AS-IS ExcelUpload.icsChecklistUpload L3715-3833 — 첫 시트 2번째 행부터 대분류·중분류·체크대상·근거·조회순서(공백을 뺀 이름으로 분류를 찾는다).
     * 앞 세 칸이 모두 빈 행이 11개 넘게 이어지면 끝. 한 행이라도 오류면 전체 롤백(메시지는 AS-IS 그대로). 사용여부 true로 로그인 회사에 넣는다 → 넣은 건수
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int spaceSeq = 0;
            int count = 0;
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
                int line = i + 1;
                if (isEmpty(row.getCell(0))) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러 : " + line + "행) 대분류는 필수입력입니다.");
                }
                Long lClassId = mapper.selectLClassIdByName(companyId, cellString(row.getCell(0)).replaceAll("\\s", ""));
                if (lClassId == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러 : " + line + "행) 대분류는 존재하지 않는 값입니다. [" + cellString(row.getCell(0)) + "]");
                }
                if (isEmpty(row.getCell(1))) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러 : " + line + "행) 중분류는 필수입력입니다.");
                }
                Long mClassId = mapper.selectMClassIdByName(companyId, lClassId, cellString(row.getCell(1)).replaceAll("\\s", ""));
                if (mClassId == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러 : " + line + "행) 중분류는 존재하지 않는 값입니다. [" + cellString(row.getCell(1)) + "]");
                }
                if (isEmpty(row.getCell(2))) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러 : " + line + "행) 체크대상은 필수입력입니다.");
                }
                String content = cellString(row.getCell(2));
                String criterion = isEmpty(row.getCell(3)) ? null : cellString(row.getCell(3));
                Long seq = isEmpty(row.getCell(4)) ? null : cellLong(row.getCell(4));
                mapper.insert(companyId, new IcsChecklistSaveReq(mapper.selectNextId(), content, criterion, "true", mClassId, seq));
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    /** ExcelUpload.isCellEmpty */
    private static boolean isEmpty(Cell cell) {
        return cell == null || cell.getCellType() == CellType.BLANK
                || (cell.getCellType() == CellType.STRING && cell.getStringCellValue().trim().isEmpty());
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 */
    private static String cellString(Cell cell) {
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
    }

    /** ExcelUpload.getLongCellData */
    private static Long cellLong(Cell cell) {
        if (cell.getCellType() == CellType.FORMULA) {
            return cell.getCachedFormulaResultType() == CellType.NUMERIC ? (long) cell.getNumericCellValue() : null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            String s = cell.getStringCellValue().replace(",", "").trim();
            return s.matches("-?\\d+") ? Long.valueOf(s) : null;
        }
        return null;
    }

    /** AS-IS sys.Sys09_Code.selectByIcs21: 사용 중인 대분류 (기준일을 안 주면 오늘 — K05 작성 화면은 기준 분기(월)의 말일) */
    public List<IcsChecklistClassCodeRes> lCodes(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectLCodes(user.getCompanyId(), stdDate == null ? LocalDate.now() : stdDate);
    }

    /** AS-IS sys.Sys09_Code.selectByIcs23: 사용 중인 중분류(대분류를 주면 그 아래만) */
    public List<IcsChecklistClassCodeRes> mCodes(UserPrincipal user, Long checklistLClassId, LocalDate stdDate) {
        return mapper.selectMCodes(user.getCompanyId(), stdDate == null ? LocalDate.now() : stdDate, checklistLClassId);
    }
}

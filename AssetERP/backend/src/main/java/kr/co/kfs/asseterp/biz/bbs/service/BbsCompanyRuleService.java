package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRuleLastCheck;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRuleParam;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRulePushReq;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRuleRes;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRuleSaveReq;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsCompanyRuleMapper;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCompanyMapper;
import kr.co.kfs.asseterp.biz.sys.mapper.SysFileMapper;
import kr.co.kfs.asseterp.common.config.properties.UploadProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

/** 회사규정관리 (AS-IS Bbs15_Tab_CompanyRuleManager → server/bbs/Bbs15_CompanyRule) */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsCompanyRuleService {

    private static final String RELATE_TYPE_RULE = "2";  // 내규
    private static final String[] EXCEL_HEADERS = {"구분", "규정코드", "규정명", "제개정일", "개정회차", "규정 첨부파일 갯수", "공개", "종료일", "비고", "작성자", "변경자", "작성(변경)일"};

    private final BbsCompanyRuleMapper mapper;
    private final SysFileMapper sysFileMapper;
    private final SysCompanyMapper sysCompanyMapper;
    private final UploadProperties uploadProperties;

    /** AS-IS bbs.Bbs15_CompanyRule.selectBySearchTextManager (고객사는 관리자 회사만 고른다. 그 밖에는 로그인 회사) */
    public List<CompanyRuleRes> search(UserPrincipal user, Long companyId, String ruleType, String searchText) {
        return mapper.selectBySearchTextManager(user.companyOf(companyId),
                ruleType == null || ruleType.isEmpty() ? "%" : ruleType, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** 새 회사규정의 id (AS-IS DBUtil.setSeq) — f_create_seq()가 시퀀스를 갱신하므로 쓰기 트랜잭션 */
    @Transactional
    public Long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS bbs.Bbs15_CompanyRule.update — 등록(companyRuleId 없음)·수정 */
    @Transactional
    public CompanyRuleRes save(UserPrincipal user, Long companyRuleId, CompanyRuleSaveReq req) {
        CompanyRuleRes origin = null;
        if (companyRuleId != null) {
            origin = mapper.selectById(companyRuleId);
            if (origin == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            requireOwn(user, origin.companyId());
        }
        validate(req);
        // 등록은 로그인 회사(등록(복사)는 복사 대상 회사 — 관리자 회사만 다른 회사)
        Long companyId = origin != null ? origin.companyId() : user.companyOf(req.companyId());

        // 규정코드 변경 시 반드시 책무연결을 확인한다
        if (origin != null && !origin.companyRuleCode().equals(req.companyRuleCode())
                && mapper.countRelateByRuleCode(origin.companyId(), RELATE_TYPE_RULE, origin.companyRuleCode()) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기존 규정코드(" + origin.companyRuleCode() + ")로 연결된 책무가 존재합니다.");
        }
        Long id = companyRuleId != null ? companyRuleId : req.companyRuleId() != null ? req.companyRuleId() : mapper.selectNextId();
        if (origin == null && mapper.selectById(id) != null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 등록된 회사규정입니다.");
        }
        if (mapper.countUseByCompanyRuleCode(companyId, req.companyRuleCode(), req.revisionNo(), id) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 규정코드입니다. 개정회차를 확인해주세요");
        }

        CompanyRuleParam p = new CompanyRuleParam(id, companyId, req.ruleType(), req.title(), req.content(), req.note(), req.seq(),
                req.revisionDate(), req.revisionNo(), req.publicYn(), req.companyRuleCode(), req.closeDate(), user.getName());
        if (origin == null) {
            mapper.insertCompanyRule(p);
        } else {
            mapper.updateCompanyRule(p);
        }
        return mapper.selectById(id);
    }

    /** Bbs15_Edit_CompanyRuleManager.update L276-299 */
    private void validate(CompanyRuleSaveReq req) {
        if (isBlank(req.ruleType())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "회사규정구분은 필수선택사항입니다.");
        }
        if (isBlank(req.companyRuleCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "회사규정코드는 필수입력사항입니다.");
        }
        if (req.companyRuleCode().length() > 8) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "회사규정코드는 최대 8자리까지 입력가능합니다");
        }
        if (isBlank(req.revisionDate())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "제개정일자는 필수입력입니다.");
        }
        if (req.revisionNo() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "개정회차는 필수입력입니다.");
        }
        if (isBlank(req.title())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "회사규정명은 필수입력사항입니다.");
        }
    }

    /** AS-IS bbs.Bbs15_CompanyRule.delete — 책무 연결·이후 책무배분/기술서가 있으면 삭제 불가 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        List<CompanyRuleRes> rows = ids.stream().map(mapper::selectById).filter(r -> r != null).toList();
        for (CompanyRuleRes r : rows) {
            requireOwn(user, r.companyId());
            // 체크1. 개정없이 제정만 존재하는 경우(내규정보가 1건만 존재)인데 연결정보가 존재하면 삭제불가
            CompanyRuleLastCheck last = mapper.countLastCheck(r.companyId(), r.companyRuleCode());
            if (last.allCnt() == 1 && last.relateCnt() != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "선택한 내규의 책무연결정보가 존재하여 삭제할 수 없습니다");
            }
            // 체크2. 삭제하려는 개정회차의 개정일 이후 책무배분 또는 책무기술서가 등록된 경우 삭제불가
            if (r.revisionDate() != null
                    && mapper.countRelateTask(r.companyId(), RELATE_TYPE_RULE, r.companyRuleCode(), r.revisionDate()) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "선택한 내규의 개정회차 이후 책무배분 및 책무기술서 등록건이 존재하여 삭제할 수 없습니다");
            }
        }
        rows.forEach(r -> mapper.deleteCompanyRule(r.companyRuleId()));
        return rows.size();
    }

    /** AS-IS bbs.Bbs15_CompanyRule.pushData — 고른 규정(첨부파일 포함)을 다른 고객사로 복사 (관리자 회사만) */
    @Transactional
    public int pushData(UserPrincipal user, CompanyRulePushReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        if (req.companyId() == null || req.companyRuleIds() == null || req.companyRuleIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "선택된 내역이 없습니다.");
        }
        CompanyRes target = sysCompanyMapper.selectCompany(req.companyId());
        if (target == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        int count = 0;
        for (Long sourceId : req.companyRuleIds()) {
            CompanyRuleRes src = mapper.selectById(sourceId);
            if (src == null) {
                continue;
            }
            Long newId = mapper.selectNextId();
            mapper.insertRequest(new CompanyRuleParam(newId, req.companyId(), src.ruleType(), src.title(), src.content(), src.note(), src.seq(),
                    src.revisionDate(), src.revisionNo(), src.publicYn(), src.companyRuleCode(), src.closeDate(), user.getName()));
            // 회사규정 자료(첨부파일): 물리 파일을 대상 회사 폴더로 복사
            for (FileRes file : sysFileMapper.selectByParentId(sourceId)) {
                copyFile(newId, target, file);
            }
            count++;
        }
        return count;
    }

    /** pushData L114-141 (파일 하나가 실패해도 다음으로 간다 — 원본도 같다) */
    private void copyFile(Long newParentId, CompanyRes target, FileRes file) {
        try {
            Long newFileId = sysFileMapper.selectNextId();
            String saveFolder = uploadFolder(target.locNm());
            File dir = new File(saveFolder);
            if (!dir.exists() && !dir.mkdirs()) {
                throw new IOException("폴더를 만들 수 없습니다: " + saveFolder);
            }
            File newFile = new File(saveFolder, newFileId.toString());
            Files.copy(new File(file.serverPath(), file.fileId().toString()).toPath(), newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            sysFileMapper.insertFile(newFileId, newParentId, file.fileNm(), saveFolder, (double) (newFile.length() / 1024), file.fileExt(), file.fileYn());
        } catch (Exception e) {
            log.error("회사규정 첨부파일 복사 실패 fileId={}", file.fileId(), e);
        }
    }

    /** AS-IS getUploadPathSafe L203-207 */
    private String uploadFolder(String companyLoc) {
        String path = uploadProperties.dir();
        if (path.endsWith("/") || path.endsWith("\\")) {
            path = path.substring(0, path.length() - 1);
        }
        return path + "/" + (companyLoc == null ? "unknown" : companyLoc) + "/" + new SimpleDateFormat("yyyyMM").format(new Date());
    }

    /**
     * 엑셀 다운로드 — AS-IS는 RD 리포트 서버(Bbs15_Rd_CompanyRuleManager)에 맡겼다. 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다.
     */
    public byte[] download(UserPrincipal user, Long companyId, String ruleType, String searchText) {
        List<CompanyRuleRes> rows = search(user, companyId, ruleType, searchText);
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("회사규정");
            Row head = sheet.createRow(0);
            for (int i = 0; i < EXCEL_HEADERS.length; i++) {
                head.createCell(i).setCellValue(EXCEL_HEADERS[i]);
            }
            int r = 1;
            for (CompanyRuleRes c : rows) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(nvl(c.ruleTypeName()));
                row.createCell(1).setCellValue(nvl(c.companyRuleCode()));
                row.createCell(2).setCellValue(nvl(c.title()));
                row.createCell(3).setCellValue(nvl(c.revisionDate()));
                if (c.revisionNo() != null) {
                    row.createCell(4).setCellValue(c.revisionNo());
                }
                if (c.fileCnt() != null) {
                    row.createCell(5).setCellValue(c.fileCnt());
                }
                row.createCell(6).setCellValue(Boolean.TRUE.equals(c.publicYn()) ? "Y" : "");
                row.createCell(7).setCellValue(nvl(c.closeDate()));
                row.createCell(8).setCellValue(nvl(c.note()));
                row.createCell(9).setCellValue(nvl(c.creName()));
                row.createCell(10).setCellValue(nvl(c.updName()));
                row.createCell(11).setCellValue(nvl(c.updDateStr()));
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }

    /**
     * AS-IS ExcelUpload.bbsUpload L3350-3417 — 첫 시트 2번째 행부터 구분(코드)·규정코드·제개정일·개정회차·규정명, 공개로 등록.
     * 한 행이라도 오류면 전체 롤백. 로그인 회사에 등록한다 (관리자 ROLE_ADMIN — AS-IS isManager 버튼)
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        if (user.getRoles() == null || !user.getRoles().contains("ROLE_ADMIN")) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        DataFormatter formatter = new DataFormatter();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                mapper.excelInsert(new CompanyRuleParam(null, user.getCompanyId(), formatter.formatCellValue(row.getCell(0)).trim(),
                        formatter.formatCellValue(row.getCell(4)).trim(), null, null, null, cellDate(row.getCell(2), formatter),
                        cellLong(row.getCell(3), formatter), true, formatter.formatCellValue(row.getCell(1)).trim(), null, user.getName()));
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    /** ExcelUpload.getCellDate — 날짜 서식 셀 또는 yyyy-MM-dd·yyyy.MM.dd·yyyyMMdd 글자 */
    private static String cellDate(Cell cell, DataFormatter formatter) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getLocalDateTimeCellValue().toLocalDate().toString();
        }
        String s = formatter.formatCellValue(cell).trim().replace('.', '-').replace('/', '-');
        if (s.isEmpty()) {
            return null;
        }
        if (s.matches("\\d{8}")) {
            return LocalDate.parse(s, DateTimeFormatter.BASIC_ISO_DATE).toString();
        }
        return LocalDate.parse(s).toString();
    }

    private static Long cellLong(Cell cell, DataFormatter formatter) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
        }
        String s = formatter.formatCellValue(cell).trim();
        return s.isEmpty() ? null : Long.valueOf(s);
    }

    private void requireOwn(UserPrincipal user, Long companyId) {
        if (!user.isSysAdmin() && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }
}

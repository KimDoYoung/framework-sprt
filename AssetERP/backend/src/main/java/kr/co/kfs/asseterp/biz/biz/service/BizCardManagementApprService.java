package kr.co.kfs.asseterp.biz.biz.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardApprRow;
import kr.co.kfs.asseterp.biz.biz.mapper.BizCardManagementMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * A13 법인카드 내역관리 상신 뒤 처리 (AS-IS Apr01_Edit_ApprDoc L3727-3760 + 호출 화면 updateApprId).
 * ① 상신 연결 기록(Biz05_RelateAppr.insert) ② 첨부 엑셀 `법인카드 내역관리(yyyy.MM).xls`(Biz01_Excel.getExcel) ③ 내역별 증빙 파일을
 * 결재문서로 복사하며 이름을 바꿈(Apr03_Page_Relate.insertBiz01FileList → Sys10_File.copySetFileName).
 * 연관문서 자동등록은 문서를 열 때 link-seed가 돌려준다. AS-IS는 ②가 실패하면 ③을 건너뛰고 "Excel 생성 중 오류가 발생했습니다"를 알린다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BizCardManagementApprService {

    private final BizCardManagementMapper mapper;
    private final BizRelateApprMapper relateApprMapper;
    private final BizRelateApprService relateApprService;
    private final SysFileService sysFileService;

    private static final DateTimeFormatter YMD = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter YMD_COMPACT = DateTimeFormatter.ofPattern("yyyyMMdd");

    /** @return 첨부 엑셀을 만들었으면 true */
    @Transactional
    public boolean afterApproval(UserPrincipal user, String dataYm, Long apprId) {
        relateApprService.insertDataYm(user, dataYm, "A13", apprId);
        List<BizCardApprRow> list = mapper.selectAllForAppr(user.getCompanyId(), dataYm);
        try {
            createExcel(user, apprId, dataYm, list);
        } catch (IOException | RuntimeException e) {
            log.error("A13 첨부 엑셀 생성 실패 apprId={} dataYm={}", apprId, dataYm, e);
            return false;
        }
        for (BizCardApprRow r : list) {
            copyProofs(user, apprId, r);
        }
        return true;
    }

    /** insertBiz01FileList: 이름 `법인카드 증빙_yyyyMMdd_계정과목_제공금액` + 확장자, 여러 개면 둘째부터 `(1)`… */
    private void copyProofs(UserPrincipal user, Long apprId, BizCardApprRow r) {
        List<FileRes> files = sysFileService.searchByParentId(r.promoId());
        String base = "법인카드 증빙_" + (r.approvalDt() == null ? "null" : r.approvalDt().format(YMD_COMPACT)) + "_" + r.accountName() + "_" + r.provideAmt();
        int idx = 0;
        for (FileRes f : files) {
            String name = (files.size() > 1 && idx > 0) ? base + "(" + idx + ")." + f.fileExt() : base + "." + f.fileExt();
            idx++;
            try {
                sysFileService.copyToParent(user, f.fileId(), apprId, name);
            } catch (RuntimeException e) {
                log.error("증빙 파일 복사 실패 fileId={} apprId={}", f.fileId(), apprId, e);  // AS-IS도 printStackTrace만 하고 다음 파일로
            }
        }
    }

    private void createExcel(UserPrincipal user, Long apprId, String dataYm, List<BizCardApprRow> list) throws IOException {
        File temp = Files.createTempFile("card-mgmt-excel-", ".xls").toFile();
        try (HSSFWorkbook wb = new HSSFWorkbook(); FileOutputStream out = new FileOutputStream(temp)) {
            HSSFSheet sheet = wb.createSheet("Sheet1");
            HSSFDataFormat df = wb.createDataFormat();
            HSSFCellStyle header = style(wb, BorderStyle.MEDIUM, HorizontalAlignment.CENTER);
            header.setFillForegroundColor(HSSFColor.HSSFColorPredefined.LIGHT_YELLOW.getIndex());
            header.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            HSSFCellStyle body = style(wb, BorderStyle.THIN, HorizontalAlignment.CENTER);
            HSSFCellStyle numBody = style(wb, BorderStyle.THIN, HorizontalAlignment.RIGHT);
            numBody.setWrapText(false);
            numBody.setDataFormat(df.getFormat("#,##0"));

            String[] names = {"카드", "카드사용자", "카드승인일", "가맹점명", "업종", "승인금액", "제공목적", "제공내역", "계정과목", "계정코드", "과세구분", "증빙자료", "비고(사용내역)"};
            int[] sizes = {5000, 4000, 5000, 5000, 7000, 4000, 5000, 5000, 7000, 4000, 3000, 4000, 8000};
            HSSFRow headerRow = sheet.createRow(0);
            headerRow.setHeight((short) 600);
            for (int i = 0; i < names.length; i++) {
                sheet.setColumnWidth(i, sizes[i]);
                HSSFCell c = headerRow.createCell(i);
                c.setCellValue(names[i]);
                c.setCellStyle(header);
            }
            for (int i = 0; i < list.size(); i++) {
                BizCardApprRow m = list.get(i);
                String[] cols = {m.htmlCardName(), m.regEmpName(), m.approvalDt() == null ? null : m.approvalDt().format(YMD), m.franchiseName(),
                        m.sectorName(), String.valueOf(m.provideAmt()), m.providePurName(), m.provideContentName(), m.accountName(), m.accountCode(),
                        m.taxTypeName(), m.fileCountStr(), m.note()};
                HSSFRow row = sheet.createRow(i + 1);
                for (int c = 0; c < cols.length; c++) {
                    HSSFCell cell = row.createCell(c);
                    if (c == 5) {
                        cell.setCellValue(m.provideAmt() == null ? 0 : m.provideAmt().doubleValue());
                        cell.setCellStyle(numBody);
                    } else {
                        cell.setCellValue(cols[c]);
                        cell.setCellStyle(body);
                    }
                }
            }
            wb.write(out);
        }
        try {
            String locName = relateApprMapper.selectLocName(user.getCompanyId());
            sysFileService.registerRdFile(temp, apprId, locName, "법인카드 내역관리(" + dataYm + ").xls", "xls");
        } finally {
            Files.deleteIfExists(temp.toPath());
        }
    }

    private static HSSFCellStyle style(HSSFWorkbook wb, BorderStyle bottom, HorizontalAlignment align) {
        HSSFCellStyle s = wb.createCellStyle();
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        s.setBorderBottom(bottom);
        s.setBorderTop(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        s.setAlignment(align);
        s.setWrapText(true);
        return s;
    }
}

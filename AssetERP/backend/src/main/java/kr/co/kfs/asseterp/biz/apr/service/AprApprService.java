package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateFundRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuSearchService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/** AS-IS server/apr/Apr01_Appr.java selectByPaging L1170 (selectByDcrWrite) — 문서작성 목록 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprService {

    private final AprApprMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** 등록/결재선/열람권한에 내가 든 문서. searchText·receiveName은 서비스가 %…%로 만든다(빈 글자면 %%). classTreeId가 없으면 분류 조건 없음 */
    public PageRes<AprDcrWriteRes> searchDcrWrite(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText,
                                                  String receiveName, Long classTreeId, long offset, long limit) {
        AprDcrWriteCond cond = new AprDcrWriteCond(user.getCompanyId(), user.getUserId(), startDate, closeDate, "%",
                like(searchText), like(receiveName), classTreeId, limit, offset);
        return new PageRes<>(mapper.selectByDcrWriteTotal(cond), mapper.selectByDcrWritePaging(cond));
    }

    /**
     * AS-IS Apr01_Appr.selectByClassTreeId2 (F02, 이 메뉴는 admin=false). 내 조직이 열람할 수 있는 문서만(연관펀드·열람권한·Link 조건) + 내가 결재선·열람자인 문서.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0. searchText는 서비스가 %…%로 만든다(빈 글자면 %%)
     */
    public List<AprDocRes> searchDocList(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate endDate, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByClassTreeId2(new AprDocListCond(classTreeId, orgId, user.getUserId(), startDate, endDate, like(searchText)));
    }

    /**
     * AS-IS Apr03_RelateFund.selectByIcsClassTreeId (F03, 이 메뉴는 admin=false). 법규분류에 연결된 문서 중 내 조직이 열람할 수 있는 연관펀드만.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0. searchText는 서비스가 %…%로 만든다(빈 글자면 %%)
     */
    public List<AprIcsDocRes> searchIcsDocList(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate endDate, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByIcsClassTreeId(new AprIcsDocListCond(classTreeId, user.getCompanyId(), orgId, startDate, endDate, like(searchText)));
    }

    /**
     * AS-IS Apr01_Appr.selectByText2 (F05 Dcr00_Tab_DocList). admin = LoginUser.getIsManager()(회사관리자·관리자 회사)면 조직·문서권한 조건 없이 Link 문서만 뺀다.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0. 검색어·수신처는 서비스가 %…%로, 상태·문서구분은 전체가 '%'
     */
    public List<AprDocSearchRes> searchDocText(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate endDate, String searchText,
                                               String receiveName, String statusCode, String inoutCode) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        String admin = String.valueOf(SysMenuSearchService.isManager(user));
        return mapper.selectByText2(new AprDocSearchCond(user.getCompanyId(), classTreeId, orgId, user.getUserId(), admin, startDate, endDate,
                like(searchText), like(receiveName), blankToAny(statusCode), blankToAny(inoutCode), "%"));
    }

    /** AS-IS createRdExcel(sys.Sys99_Print.insertRdDocList + RD 리포트 Dcr00_Rd_DocList) — 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다 */
    public byte[] downloadDocText(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate endDate, String searchText,
                                  String receiveName, String statusCode, String inoutCode) {
        List<AprDocSearchRes> rows = searchDocText(user, classTreeId, startDate, endDate, searchText, receiveName, statusCode, inoutCode);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("통합 문서검색");
            Row header = sheet.createRow(0);
            for (int i = 0; i < EXCEL_HEADERS.length; i++) {
                header.createCell(i).setCellValue(EXCEL_HEADERS[i]);
            }
            int r = 1;
            for (AprDocSearchRes a : rows) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(a.regDate() == null ? "" : a.regDate().format(fmt));
                row.createCell(1).setCellValue(nvl(a.regEmpName()));
                row.createCell(2).setCellValue(nvl(a.statusName()).replaceAll("<[^>]+>", ""));
                row.createCell(3).setCellValue(nvl(a.title()));
                row.createCell(4).setCellValue(nvl(a.inOutTypeName()));
                row.createCell(5).setCellValue(nvl(a.classTreeName()));
                row.createCell(6).setCellValue(nvl(a.receiveName()));
                row.createCell(7).setCellValue(nvl(a.stampSeq()));
                row.createCell(8).setCellValue(nvl(a.relateDisplayName()));
                row.createCell(9).setCellValue(nvl(a.note()));
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }

    /** AS-IS Apr03_RelateFund.selectByApprId */
    public List<AprRelateFundRes> searchRelateFunds(Long apprId) {
        return mapper.selectRelateFunds(apprId);
    }

    /** AS-IS Apr12_RelateAdv.selectByApprId */
    public List<AprRelateAdvRes> searchRelateAdvs(Long apprId) {
        return mapper.selectRelateAdvs(apprId);
    }

    private static final String[] EXCEL_HEADERS = {"등록일", "등록자", "결재상태", "상신제목", "문서구분", "문서분류", "수신처", "대외문서번호", "펀드/일임", "비고"};

    private String blankToAny(String code) {
        return code == null || code.isBlank() ? "%" : code;
    }

    private String nvl(String s) {
        return s == null ? "" : s;
    }

    private String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }
}

package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprPreProvideCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprPreProvideRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFundDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprFundDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprItemDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprItemDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprLoadDocCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprLoadDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyApproveCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyAuthCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyAuthRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyApproveRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyReferenceCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyReferenceRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyRequestCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyRequestRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprPutSealRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampSeqCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampSeqRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprSubListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprSubListRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprTotalListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprTotalListRes;
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

    /**
     * AS-IS Apr01_Appr.selectByFundDocList (F06 Apr01_Grid_FundDocList). 고른 펀드(와 그 실제펀드)에 연결된 완료(30) 문서 중 내 조직이 열람할 수 있거나 내가 결재선·열람자인 문서.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0
     */
    public List<AprFundDocRes> searchFundDocList(UserPrincipal user, Long fundCodeId) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByFundDocList(new AprFundDocListCond(fundCodeId, orgId, user.getUserId()));
    }

    /**
     * AS-IS Apr01_Appr.selectByItemDocList (F07 Apr01_Grid_ItemDocList). 고른 종목에 연결된 문서(searchType 2면 그 종목을 운용하는 펀드의 문서 포함) 중
     * 완료(30)이고 내 조직이 열람할 수 있거나 내가 결재선·열람자인 문서. 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0
     */
    public List<AprItemDocRes> searchItemDocList(UserPrincipal user, Long astClassTreeId, String searchType, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByItemDocList(new AprItemDocListCond(astClassTreeId, user.getCompanyId(), orgId, user.getUserId(),
                "2".equals(searchType) ? "2" : "1", nvl(searchText)));
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

    /**
     * AS-IS Apr01_Appr.selectApprListByEmpId (G01 Apr01_Tab_MyApproveList 결재내역 조회). 내가 결재자이거나 내가 대결자인 사람의 결재 단계가 있는 문서.
     * dateType은 'effect'가 아니면 상신일('reg'), 결재상태는 전체가 '%', aprYn은 완료/반려건 포함, 검색어는 서비스가 %…%로 만든다(빈 글자면 %%)
     */
    public List<AprMyApproveRes> searchMyApprove(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate closeDate, String statusCode,
                                                 boolean aprYn, String dateType, String searchText) {
        return mapper.selectApprListByEmpId(new AprMyApproveCond(user.getCompanyId(), user.getUserId(), startDate, closeDate, blankToAny(statusCode),
                String.valueOf(aprYn), "effect".equals(dateType) ? "effect" : "reg", like(searchText), classTreeId, "%"));
    }

    /** AS-IS downLoadButton(sys.Sys99_Print.insertRdApproveList + RD 리포트 Apr01_Rd_MyApproveList) — 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다 */
    public byte[] downloadMyApprove(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate closeDate, String statusCode,
                                    boolean aprYn, String dateType, String searchText) {
        List<AprMyApproveRes> rows = searchMyApprove(user, classTreeId, startDate, closeDate, statusCode, aprYn, dateType, searchText);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("결재내역 조회");
            Row header = sheet.createRow(0);
            for (int i = 0; i < MY_APPROVE_HEADERS.length; i++) {
                header.createCell(i).setCellValue(MY_APPROVE_HEADERS[i]);
            }
            int r = 1;
            for (AprMyApproveRes a : rows) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(nvl(a.statusName()));
                row.createCell(1).setCellValue(a.regDate() == null ? "" : a.regDate().format(fmt));
                row.createCell(2).setCellValue(nvl(a.inOutTypeName()));
                row.createCell(3).setCellValue(nvl(a.title()).replaceAll("<[^>]+>", ""));
                row.createCell(4).setCellValue(nvl(a.regEmpName()));
                row.createCell(5).setCellValue(nvl(a.nextApprName()));
                row.createCell(6).setCellValue(a.effectDate() == null ? "" : a.effectDate().format(fmt));
                row.createCell(7).setCellValue(nvl(a.classTreeName()));
                row.createCell(8).setCellValue(nvl(a.mailYn()));
                row.createCell(9).setCellValue(a.myApprovalDate() == null ? "" : a.myApprovalDate().format(fmt));
                row.createCell(10).setCellValue(a.finalApprovalDate() == null ? "" : a.finalApprovalDate().format(fmt));
                row.createCell(11).setCellValue(nvl(a.note()));
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }

    /**
     * AS-IS Apr01_Appr.selectByRequestEmpId (G02 Apr01_Tab_MyRequestList 상신내역 조회). 내가 상신한 문서.
     * 결재상태는 전체가 '%', aprYn은 완료/반려건 포함, 검색어는 서비스가 %…%로 만든다(빈 글자면 %%)
     */
    public List<AprMyRequestRes> searchMyRequest(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate closeDate, String statusCode,
                                                 boolean aprYn, String searchText) {
        return mapper.selectByRequestEmpId(new AprMyRequestCond(user.getCompanyId(), user.getUserId(), startDate, closeDate, blankToAny(statusCode),
                String.valueOf(aprYn), like(searchText), classTreeId, "%"));
    }

    /**
     * AS-IS Apr01_Appr.selectByText (L06 Apr01_Tab_BizPriorApproval 이익제공 사전승인신청). 로그인 사용자가 올린 문서 중
     * 종류코드 PreProvideRcvType의 Link 문서만(preProvideRcvApprYn=true 가지)
     */
    public List<AprPreProvideRes> searchPreProvide(UserPrincipal user, LocalDate startDate, LocalDate endDate) {
        return mapper.selectPreProvide(new AprPreProvideCond(user.getCompanyId(), user.getUserId(), startDate, endDate));
    }

    /** AS-IS downLoadButton(sys.Sys99_Print.insertRdRequestList + RD 리포트 Apr01_Rd_MyRequestList) — 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다 */
    public byte[] downloadMyRequest(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate closeDate, String statusCode,
                                    boolean aprYn, String searchText) {
        List<AprMyRequestRes> rows = searchMyRequest(user, classTreeId, startDate, closeDate, statusCode, aprYn, searchText);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("상신내역 조회");
            Row header = sheet.createRow(0);
            for (int i = 0; i < MY_REQUEST_HEADERS.length; i++) {
                header.createCell(i).setCellValue(MY_REQUEST_HEADERS[i]);
            }
            int r = 1;
            for (AprMyRequestRes a : rows) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(a.regDate() == null ? "" : a.regDate().format(fmt));
                row.createCell(1).setCellValue(a.effectDate() == null ? "" : a.effectDate().format(fmt));
                row.createCell(2).setCellValue(nvl(a.statusName()));
                row.createCell(3).setCellValue(nvl(a.classTreeName()));
                row.createCell(4).setCellValue(nvl(a.inOutTypeName()));
                row.createCell(5).setCellValue(nvl(a.title()).replaceAll("<[^>]+>", ""));
                row.createCell(6).setCellValue(nvl(a.preconfirmStatusName()));
                row.createCell(7).setCellValue(nvl(a.preconfirmMsgYnStr()));
                row.createCell(8).setCellValue(nvl(a.mailYn()));
                row.createCell(9).setCellValue(nvl(a.recentApprovalName()));
                row.createCell(10).setCellValue(a.recentApprovalDate() == null ? "" : a.recentApprovalDate().format(fmt));
                row.createCell(11).setCellValue(nvl(a.note()));
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }

    /**
     * AS-IS Apr01_Appr.selectByReferenceEmpId (G03 Apr01_Tab_MyReferenceList 참조내역 조회). 내가 참조자(단계 30)인 문서.
     * 결재상태는 전체가 '%', aprYn은 완료/반려건 포함, 검색어는 서비스가 %…%로 만든다(빈 글자면 %%)
     */
    public List<AprMyReferenceRes> searchMyReference(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate closeDate, String statusCode,
                                                     boolean aprYn, String searchText) {
        return mapper.selectByReferenceEmpId(new AprMyReferenceCond(user.getCompanyId(), user.getUserId(), startDate, closeDate, blankToAny(statusCode),
                String.valueOf(aprYn), like(searchText), classTreeId, "%"));
    }

    /** AS-IS downLoadButton(sys.Sys99_Print.insertRdReferenceList + RD 리포트 Apr01_Rd_MyReferenceList) — 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다 */
    public byte[] downloadMyReference(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate closeDate, String statusCode,
                                      boolean aprYn, String searchText) {
        List<AprMyReferenceRes> rows = searchMyReference(user, classTreeId, startDate, closeDate, statusCode, aprYn, searchText);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("참조내역 조회");
            Row header = sheet.createRow(0);
            for (int i = 0; i < MY_REFERENCE_HEADERS.length; i++) {
                header.createCell(i).setCellValue(MY_REFERENCE_HEADERS[i]);
            }
            int r = 1;
            for (AprMyReferenceRes a : rows) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(a.regDate() == null ? "" : a.regDate().format(fmt));
                row.createCell(1).setCellValue(a.effectDate() == null ? "" : a.effectDate().format(fmt));
                row.createCell(2).setCellValue(nvl(a.statusName()));
                row.createCell(3).setCellValue(nvl(a.classTreeName()));
                row.createCell(4).setCellValue(nvl(a.inOutTypeName()));
                row.createCell(5).setCellValue(nvl(a.title()).replaceAll("<[^>]+>", ""));
                row.createCell(6).setCellValue(nvl(a.mailYn()));
                row.createCell(7).setCellValue(nvl(a.regEmpName()));
                row.createCell(8).setCellValue(nvl(a.recentApprovalName()));
                row.createCell(9).setCellValue(a.recentApprovalDate() == null ? "" : a.recentApprovalDate().format(fmt));
                row.createCell(10).setCellValue(nvl(a.note()));
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }

    /**
     * AS-IS Apr01_Appr.selectByAuthEmpId (G04 Apr01_Tab_MyAuthList 공람내역 조회). 내가 공람 대상(apr13)인 완료·반려 문서.
     * 결재상태는 전체가 '%', 검색어는 서비스가 %…%로 만든다(빈 글자면 %%). 출력/다운로드 버튼은 원본에서 툴바에 연결되지 않아 API가 없다
     */
    public List<AprMyAuthRes> searchMyAuth(UserPrincipal user, Long classTreeId, LocalDate startDate, LocalDate closeDate, String statusCode, String searchText) {
        return mapper.selectByAuthEmpId(new AprMyAuthCond(user.getCompanyId(), user.getUserId(), startDate, closeDate, blankToAny(statusCode),
                like(searchText), classTreeId, "%"));
    }

    /** AS-IS Apr01_Appr.selectByTotalList (G16 Apr01_Tab_TotalList 운영현황표). 회사는 세션, 담당자·담당부서는 %…%(빈 글자면 전체) */
    public List<AprTotalListRes> searchTotalList(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String orgName, String personName) {
        return mapper.selectByTotalList(new AprTotalListCond(user.getCompanyId(), like(personName), like(orgName), startDate, closeDate));
    }

    /**
     * AS-IS Apr01_Appr.selectBySubList (G17 Apr01_Tab_SubList 건별명세). 회사는 세션, 담당자·담당부서는 %…%.
     * docType은 일반·내부통제(그 밖은 전체 '%'), statusCode는 true(완료)·false(미처리)(그 밖은 전체 '%') — AS-IS 화면이 콤보 글자를 바꿔 보내던 값
     */
    public List<AprSubListRes> searchSubList(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String orgName, String personName,
                                             String docType, String statusCode) {
        String docTypeText = "일반".equals(docType) || "내부통제".equals(docType) ? docType : "%";
        String statusText = "true".equals(statusCode) || "false".equals(statusCode) ? statusCode : "%";
        return mapper.selectBySubList(new AprSubListCond(user.getCompanyId(), like(personName), like(orgName), startDate, closeDate,
                docTypeText, statusText));
    }

    /** AS-IS Apr01_Appr.selectByApprDate (G06 Apr01_Tab_StampSeq 인감대장). stampId가 null·0이면 모든 인감(AS-IS 서버가 0을 null로 바꿈) */
    public List<AprStampSeqRes> searchStampSeq(UserPrincipal user, LocalDate startDate, LocalDate endDate, Long stampId) {
        return mapper.selectByApprDate(new AprStampSeqCond(user.getCompanyId(), startDate, endDate,
                stampId == null || stampId == 0L ? null : stampId));
    }

    /** AS-IS Apr01_Appr.updatePutSealEmpId (G06 [확인자입력]). 인감확인자는 로그인 사용자, 확인일시는 DB 시각. 바뀐 값을 돌려준다 */
    @Transactional
    public AprPutSealRes updatePutSeal(UserPrincipal user, Long apprId) {
        if (mapper.updatePutSeal(apprId, user.getUserId(), user.getCompanyId()) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "문서를 찾을 수 없습니다.");
        }
        return mapper.selectPutSeal(apprId);
    }

    /**
     * AS-IS Apr03_RelateFund.selectByClassTreeId / selectBySearch (Apr05_Lookup_LoadDoc, W05 ⓒ). searchText가 null이면 분류 클릭(selectByClassTreeId),
     * 아니면 [찾기](selectBySearch, 서비스가 %…%로). 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0
     */
    public List<AprLoadDocRes> searchLoadDocs(UserPrincipal user, Long classTreeId, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        if (searchText == null) {
            return mapper.selectLoadDocByClassTreeId(new AprLoadDocCond(classTreeId, user.getCompanyId(), orgId, user.getUserId(), null));
        }
        return mapper.selectLoadDocBySearch(new AprLoadDocCond(classTreeId, user.getCompanyId(), orgId, user.getUserId(), like(searchText)));
    }

    /** AS-IS Apr03_RelateFund.selectByApprId */
    public List<AprRelateFundRes> searchRelateFunds(Long apprId) {
        return mapper.selectRelateFunds(apprId);
    }

    /** AS-IS Apr12_RelateAdv.selectByApprId */
    public List<AprRelateAdvRes> searchRelateAdvs(Long apprId) {
        return mapper.selectRelateAdvs(apprId);
    }

    private static final String[] MY_APPROVE_HEADERS = {"결재상태", "등록(상신)일", "문서구분", "문서명", "상신자", "다음결재자", "시행일", "문서분류", "송신여부", "나의결재일", "결재완료일", "비고"};

    private static final String[] MY_REQUEST_HEADERS = {"상신일", "시행일", "결재상태", "문서분류", "문서구분", "문서명", "상태", "준감인의견", "송신여부", "최근결재자", "최근결재일", "비고"};

    private static final String[] MY_REFERENCE_HEADERS = {"상신일", "시행일", "결재상태", "문서분류", "문서구분", "문서명", "송신여부", "상신자", "최근결재자", "최근결재일", "비고"};

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

package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFundDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprItemDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyApproveRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyAuthRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyReferenceRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyRequestRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprPreProvideRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprPutSealRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampSeqRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprSubListRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprTotalListRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 상신문서 (AS-IS server/apr/Apr01_Appr) */
@RestController
@RequestMapping("/api/v1/apr/apprs")
@RequiredArgsConstructor
public class AprApprController {

    private final AprApprService service;

    /** AS-IS apr.Apr01_Appr.selectByPaging (Dcr01_Tab_DcrWrite 문서작성 목록, 페이징) */
    @GetMapping("/dcr-write")
    public ApiResponse<PageRes<AprDcrWriteRes>> searchDcrWrite(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                               @RequestParam(defaultValue = "") String searchText,
                                                               @RequestParam(defaultValue = "") String receiveName,
                                                               @RequestParam(required = false) Long classTreeId,
                                                               @RequestParam(defaultValue = "0") long offset,
                                                               @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchDcrWrite(principal, startDate, closeDate, searchText, receiveName, classTreeId, offset, limit));
    }

    /** AS-IS apr.Apr01_Appr.selectByClassTreeId2 (Apr01_Grid_DocList, F02 업무별 문서작성 목록) */
    @GetMapping("/doc-list")
    public ApiResponse<List<AprDocRes>> searchDocList(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam Long classTreeId,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                      @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchDocList(principal, classTreeId, startDate, endDate, searchText));
    }

    /** AS-IS apr.Apr01_Appr.selectByText2 (Dcr00_Tab_DocList, F05 통합 문서검색). 검색어·수신처는 서버가 %…%로, 상태·문서구분은 비면 전체 */
    @GetMapping("/search")
    public ApiResponse<List<AprDocSearchRes>> searchDocText(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(required = false) Long classTreeId,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                            @RequestParam(defaultValue = "") String searchText,
                                                            @RequestParam(defaultValue = "") String receiveName,
                                                            @RequestParam(required = false) String statusCode,
                                                            @RequestParam(required = false) String inoutCode) {
        return ApiResponse.ok(service.searchDocText(principal, classTreeId, startDate, endDate, searchText, receiveName, statusCode, inoutCode));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdDocList + RD 리포트 Dcr00_Rd_DocList → 조회 결과 xlsx) */
    @GetMapping("/search/excel")
    public ResponseEntity<byte[]> downloadDocText(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) Long classTreeId,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                  @RequestParam(defaultValue = "") String searchText,
                                                  @RequestParam(defaultValue = "") String receiveName,
                                                  @RequestParam(required = false) String statusCode,
                                                  @RequestParam(required = false) String inoutCode) {
        byte[] body = service.downloadDocText(principal, classTreeId, startDate, endDate, searchText, receiveName, statusCode, inoutCode);
        String fileName = "통합 문서검색(" + startDate + " ~ " + endDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS apr.Apr01_Appr.selectApprListByEmpId (Apr01_Tab_MyApproveList, G01 결재내역 조회). dateType은 reg(상신일)/effect(시행일), 결재상태는 비면 전체 */
    @GetMapping("/my-approve")
    public ApiResponse<List<AprMyApproveRes>> searchMyApprove(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) Long classTreeId,
                                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                              @RequestParam(required = false) String statusCode,
                                                              @RequestParam(defaultValue = "true") boolean aprYn,
                                                              @RequestParam(defaultValue = "reg") String dateType,
                                                              @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchMyApprove(principal, classTreeId, startDate, closeDate, statusCode, aprYn, dateType, searchText));
    }

    /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdApproveList + RD 리포트 Apr01_Rd_MyApproveList → 조회 결과 xlsx) */
    @GetMapping("/my-approve/excel")
    public ResponseEntity<byte[]> downloadMyApprove(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) Long classTreeId,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                    @RequestParam(required = false) String statusCode,
                                                    @RequestParam(defaultValue = "true") boolean aprYn,
                                                    @RequestParam(defaultValue = "reg") String dateType,
                                                    @RequestParam(defaultValue = "") String searchText) {
        byte[] body = service.downloadMyApprove(principal, classTreeId, startDate, closeDate, statusCode, aprYn, dateType, searchText);
        String fileName = "결재내역 조회(" + startDate + " ~ " + closeDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS apr.Apr01_Appr.selectByRequestEmpId (Apr01_Tab_MyRequestList, G02 상신내역 조회). 결재상태는 비면 전체 */
    @GetMapping("/my-request")
    public ApiResponse<List<AprMyRequestRes>> searchMyRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) Long classTreeId,
                                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                              @RequestParam(required = false) String statusCode,
                                                              @RequestParam(defaultValue = "true") boolean aprYn,
                                                              @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchMyRequest(principal, classTreeId, startDate, closeDate, statusCode, aprYn, searchText));
    }

    /** AS-IS apr.Apr01_Appr.selectByText (L06 Apr01_Tab_BizPriorApproval 이익제공 사전승인신청, preProvideRcvApprYn=true) */
    @GetMapping("/pre-provide")
    public ApiResponse<List<AprPreProvideRes>> searchPreProvide(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ApiResponse.ok(service.searchPreProvide(principal, startDate, endDate));
    }

    /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdRequestList + RD 리포트 Apr01_Rd_MyRequestList → 조회 결과 xlsx) */
    @GetMapping("/my-request/excel")
    public ResponseEntity<byte[]> downloadMyRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) Long classTreeId,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                    @RequestParam(required = false) String statusCode,
                                                    @RequestParam(defaultValue = "true") boolean aprYn,
                                                    @RequestParam(defaultValue = "") String searchText) {
        byte[] body = service.downloadMyRequest(principal, classTreeId, startDate, closeDate, statusCode, aprYn, searchText);
        String fileName = "상신내역 조회(" + startDate + " ~ " + closeDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS apr.Apr01_Appr.selectByReferenceEmpId (Apr01_Tab_MyReferenceList, G03 참조내역 조회). 결재상태는 비면 전체 */
    @GetMapping("/my-reference")
    public ApiResponse<List<AprMyReferenceRes>> searchMyReference(@AuthenticationPrincipal UserPrincipal principal,
                                                                  @RequestParam(required = false) Long classTreeId,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                  @RequestParam(required = false) String statusCode,
                                                                  @RequestParam(defaultValue = "true") boolean aprYn,
                                                                  @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchMyReference(principal, classTreeId, startDate, closeDate, statusCode, aprYn, searchText));
    }

    /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdReferenceList + RD 리포트 Apr01_Rd_MyReferenceList → 조회 결과 xlsx) */
    @GetMapping("/my-reference/excel")
    public ResponseEntity<byte[]> downloadMyReference(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam(required = false) Long classTreeId,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                      @RequestParam(required = false) String statusCode,
                                                      @RequestParam(defaultValue = "true") boolean aprYn,
                                                      @RequestParam(defaultValue = "") String searchText) {
        byte[] body = service.downloadMyReference(principal, classTreeId, startDate, closeDate, statusCode, aprYn, searchText);
        String fileName = "참조내역 조회(" + startDate + " ~ " + closeDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS apr.Apr01_Appr.selectByAuthEmpId (Apr01_Tab_MyAuthList, G04 공람내역 조회). 결재상태는 비면 전체 */
    @GetMapping("/my-auth")
    public ApiResponse<List<AprMyAuthRes>> searchMyAuth(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) Long classTreeId,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                        @RequestParam(required = false) String statusCode,
                                                        @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchMyAuth(principal, classTreeId, startDate, closeDate, statusCode, searchText));
    }

    /** AS-IS apr.Apr01_Appr.selectByTotalList (Apr01_Tab_TotalList, G16 운영현황표). 기간은 시행일 기준, 담당부서·담당자는 포함 검색 */
    @GetMapping("/total-list")
    public ApiResponse<List<AprTotalListRes>> searchTotalList(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                              @RequestParam(defaultValue = "") String orgName,
                                                              @RequestParam(defaultValue = "") String personName) {
        return ApiResponse.ok(service.searchTotalList(principal, startDate, closeDate, orgName, personName));
    }

    /** AS-IS apr.Apr01_Appr.selectBySubList (Apr01_Tab_SubList, G17 건별명세). docType 일반·내부통제, statusCode true(완료)·false(미처리), 비면 전체 */
    @GetMapping("/sub-list")
    public ApiResponse<List<AprSubListRes>> searchSubList(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                          @RequestParam(defaultValue = "") String orgName,
                                                          @RequestParam(defaultValue = "") String personName,
                                                          @RequestParam(required = false) String docType,
                                                          @RequestParam(required = false) String statusCode) {
        return ApiResponse.ok(service.searchSubList(principal, startDate, closeDate, orgName, personName, docType, statusCode));
    }

    /** AS-IS apr.Apr01_Appr.selectByApprDate (Apr01_Tab_StampSeq, G06 인감대장). stampId 0·없음은 모든 인감 */
    @GetMapping("/stamp-seq")
    public ApiResponse<List<AprStampSeqRes>> searchStampSeq(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                            @RequestParam(required = false) Long stampId) {
        return ApiResponse.ok(service.searchStampSeq(principal, startDate, endDate, stampId));
    }

    /** AS-IS apr.Apr01_Appr.updatePutSealEmpId (G06 [확인자입력]) — 인감확인자는 로그인 사용자 */
    @PutMapping("/{apprId}/put-seal")
    public ApiResponse<AprPutSealRes> updatePutSeal(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.updatePutSeal(principal, apprId));
    }

    /** AS-IS apr.Apr03_RelateFund.selectByIcsClassTreeId (Ics01_Grid_ApprList, F03 법규별 문서작성 목록) */
    @GetMapping("/ics-list")
    public ApiResponse<List<AprIcsDocRes>> searchIcsDocList(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam Long classTreeId,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                            @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchIcsDocList(principal, classTreeId, startDate, endDate, searchText));
    }

    /** AS-IS apr.Apr01_Appr.selectByFundDocList (Apr01_Grid_FundDocList, F06 펀드별 문서검색 문서 목록) */
    @GetMapping("/fund-doc-list")
    public ApiResponse<List<AprFundDocRes>> searchFundDocList(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long fundCodeId) {
        return ApiResponse.ok(service.searchFundDocList(principal, fundCodeId));
    }

    /** AS-IS apr.Apr01_Appr.selectByItemDocList (Apr01_Grid_ItemDocList, F07 종목별 문서검색 문서 목록) */
    @GetMapping("/item-doc-list")
    public ApiResponse<List<AprItemDocRes>> searchItemDocList(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long astClassTreeId,
                                                              @RequestParam(defaultValue = "1") String searchType, @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchItemDocList(principal, astClassTreeId, searchType, searchText));
    }

    /** AS-IS apr.Apr03_RelateFund.selectByApprId (Apr03_TabPage_Relate 연관펀드) */
    @GetMapping("/{apprId}/relate-funds")
    public ApiResponse<List<AprRelateFundRes>> searchRelateFunds(@PathVariable Long apprId) {
        return ApiResponse.ok(service.searchRelateFunds(apprId));
    }

    /** AS-IS apr.Apr12_RelateAdv.selectByApprId (Apr03_TabPage_Relate 연관일임) */
    @GetMapping("/{apprId}/relate-advs")
    public ApiResponse<List<AprRelateAdvRes>> searchRelateAdvs(@PathVariable Long apprId) {
        return ApiResponse.ok(service.searchRelateAdvs(apprId));
    }
}

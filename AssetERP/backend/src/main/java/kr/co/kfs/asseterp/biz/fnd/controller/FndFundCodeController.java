package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanAuthRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanDeleteReq;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanListRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.FundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSearchPrintReq;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSearchRes;
import kr.co.kfs.asseterp.biz.fnd.service.FndFundCodeService;
import kr.co.kfs.asseterp.biz.fnd.service.FndFundUploadService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

import java.util.List;

/** 펀드코드 (AS-IS server/fnd/Fnd01_FundCode) */
@RestController
@RequestMapping("/api/v1/fnd/fund-codes")
@RequiredArgsConstructor
public class FndFundCodeController {

    private final FndFundCodeService service;
    private final FndFundUploadService uploadService;

    /** AS-IS fnd.Fnd01_FundCode.selectByFundOrgAuth (Apr01_Tab_FundDocument, F06 펀드별 문서검색) */
    @GetMapping("/org-auth")
    public ApiResponse<List<FundCodeRes>> searchByOrgAuth(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(defaultValue = "false") boolean closeYn,
                                                          @RequestParam(defaultValue = "true") boolean classFundExceptYn,
                                                          @RequestParam(defaultValue = "") String fundName,
                                                          @RequestParam(required = false) String fundTypeCode,
                                                          @RequestParam(required = false) String classTypeCode) {
        return ApiResponse.ok(service.searchByOrgAuth(principal, closeYn, classFundExceptYn, fundName, fundTypeCode, classTypeCode));
    }

    /** AS-IS fnd.Fnd01_FundCode.selectByFundPlan (P01 신규기획펀드 등록) */
    @GetMapping("/plans")
    public ApiResponse<List<FundPlanRes>> searchPlans(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam(defaultValue = "false") boolean closeYn,
                                                      @RequestParam(defaultValue = "") String fundName,
                                                      @RequestParam(required = false) String fundTypeCode) {
        return ApiResponse.ok(service.searchPlans(principal, closeYn, fundName, fundTypeCode));
    }

    /** AS-IS fnd.Fnd01_FundCode.selectByFundName / selectByFundOrgAuth (P02 신규기획펀드 권한설정) */
    @GetMapping("/plan-auths")
    public ApiResponse<List<FundPlanAuthRes>> searchPlansForAuth(@AuthenticationPrincipal UserPrincipal principal,
                                                                 @RequestParam(defaultValue = "false") boolean closeYn,
                                                                 @RequestParam(defaultValue = "") String fundName,
                                                                 @RequestParam(required = false) String fundTypeCode,
                                                                 @RequestParam(required = false) String classTypeCode,
                                                                 @RequestParam(required = false) Long orgId) {
        return ApiResponse.ok(service.searchPlansForAuth(principal, closeYn, fundName, fundTypeCode, classTypeCode, orgId));
    }

    /** AS-IS fnd.Fnd01_FundCode.selectByFundName / selectByFundOrgAuth (P06 펀드 권한설정) */
    @GetMapping("/auths")
    public ApiResponse<List<FundPlanAuthRes>> searchFundsForAuth(@AuthenticationPrincipal UserPrincipal principal,
                                                                 @RequestParam(defaultValue = "false") boolean closeYn,
                                                                 @RequestParam(defaultValue = "") String fundName,
                                                                 @RequestParam(required = false) String fundTypeCode,
                                                                 @RequestParam(required = false) String classTypeCode,
                                                                 @RequestParam(required = false) Long orgId) {
        return ApiResponse.ok(service.searchFundsForAuth(principal, closeYn, fundName, fundTypeCode, classTypeCode, orgId));
    }

    /** AS-IS fnd.Fnd01_FundCode.selectByPlan (P03 상품기획일정 등록) */
    @GetMapping("/plan-funds")
    public ApiResponse<List<FundPlanListRes>> searchPlanFunds(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(defaultValue = "false") boolean closeYn,
                                                              @RequestParam(defaultValue = "") String fundName,
                                                              @RequestParam(required = false) String fundTypeCode) {
        return ApiResponse.ok(service.searchPlanFunds(principal, closeYn, fundName, fundTypeCode));
    }

    /** AS-IS fnd.Fnd01_FundCode.selectByOverlap (P01 [중복확인]) — true면 이미 쓰는 코드 */
    @GetMapping("/plans/overlap")
    public ApiResponse<Boolean> existsOverlap(@RequestParam String fundCode) {
        return ApiResponse.ok(service.existsOverlap(fundCode));
    }

    /** AS-IS fnd.Fnd01_FundCode.update (P01 [저장]) — 저장된 행을 돌려준다 */
    @PutMapping("/plans")
    public ApiResponse<FundPlanRes> savePlan(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundPlanSaveReq req) {
        return ApiResponse.ok(service.savePlan(principal, req));
    }

    /** AS-IS fnd.Fnd01_FundCode.delete (P01 [삭제]) */
    @DeleteMapping("/plans")
    public ApiResponse<Void> deletePlans(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<FundPlanDeleteReq> rows) {
        service.deletePlans(principal, rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS fnd.Fnd01_FundCode.selectByFundName (P07 펀드 조회, 일반 펀드 + 최종 규약) */
    @GetMapping("/search")
    public ApiResponse<List<FundSearchRes>> searchFundSearch(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam(defaultValue = "false") boolean closeYn,
                                                             @RequestParam(defaultValue = "") String fundName,
                                                             @RequestParam(required = false) String fundTypeCode,
                                                             @RequestParam(required = false) String classTypeCode) {
        return ApiResponse.ok(service.searchFundSearch(principal, closeYn, fundName, fundTypeCode, classTypeCode));
    }

    /** AS-IS sys.Sys99_Print.insertRdFundSearch (P07 [엑셀다운로드]) → 출력 그룹 ID */
    @PostMapping("/search/rd-download")
    public ApiResponse<String> searchRdDownload(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundSearchPrintReq req) {
        return ApiResponse.ok(service.insertRdFundSearch(principal, req));
    }

    /** AS-IS fnd.Fnd01_FundCode.selectByFundName (P05 펀드 등록 및 변경, 일반 펀드) */
    @GetMapping
    public ApiResponse<List<FundRes>> searchFunds(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(defaultValue = "false") boolean closeYn,
                                                  @RequestParam(defaultValue = "") String fundName,
                                                  @RequestParam(required = false) String fundTypeCode,
                                                  @RequestParam(required = false) String classTypeCode) {
        return ApiResponse.ok(service.searchFunds(principal, closeYn, fundName, fundTypeCode, classTypeCode));
    }

    /** AS-IS fnd.Fnd01_FundCode.update / noteUpdate (P05 편집 폼 [저장]) → 저장된 행 */
    @PutMapping
    public ApiResponse<FundRes> saveFund(@AuthenticationPrincipal UserPrincipal principal, @RequestBody FundSaveReq req) {
        return ApiResponse.ok(service.saveFund(principal, req));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_펀드정보.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_펀드정보.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(uploadService.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=fundUpload) → 등록·갱신한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(uploadService.upload(principal, file));
    }
}

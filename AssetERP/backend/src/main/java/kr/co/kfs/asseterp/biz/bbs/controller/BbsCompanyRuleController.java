package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRulePushReq;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRuleRes;
import kr.co.kfs.asseterp.biz.bbs.dto.CompanyRuleSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsCompanyRuleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

/** 회사규정관리 (AS-IS Bbs15_Tab_CompanyRuleManager → server/bbs/Bbs15_CompanyRule) */
@RestController
@RequestMapping("/api/v1/bbs/company-rules")
@RequiredArgsConstructor
public class BbsCompanyRuleController {

    private final BbsCompanyRuleService service;

    /** AS-IS bbs.Bbs15_CompanyRule.selectBySearchTextManager */
    @GetMapping
    public ApiResponse<List<CompanyRuleRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) Long companyId,
                                                    @RequestParam(required = false) String ruleType,
                                                    @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, companyId, ruleType, searchText));
    }

    /** 새 회사규정의 id (AS-IS DBUtil.setSeq) */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS bbs.Bbs15_CompanyRule.update (등록) → 저장된 행 */
    @PostMapping
    public ApiResponse<CompanyRuleRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CompanyRuleSaveReq req) {
        return ApiResponse.ok(service.save(principal, null, req));
    }

    /** AS-IS bbs.Bbs15_CompanyRule.update (수정) → 저장된 행 */
    @PutMapping("/{companyRuleId}")
    public ApiResponse<CompanyRuleRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyRuleId,
                                              @RequestBody CompanyRuleSaveReq req) {
        return ApiResponse.ok(service.save(principal, companyRuleId, req));
    }

    /** AS-IS bbs.Bbs15_CompanyRule.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS bbs.Bbs15_CompanyRule.pushData → 복사한 건수 */
    @PostMapping("/push")
    public ApiResponse<Integer> pushData(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CompanyRulePushReq req) {
        return ApiResponse.ok(service.pushData(principal, req));
    }

    /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdCompanyRule + RD 리포트 → 조회 결과 xlsx) */
    @GetMapping("/excel")
    public ResponseEntity<byte[]> download(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam(required = false) Long companyId,
                                           @RequestParam(required = false) String ruleType,
                                           @RequestParam(required = false) String searchText) {
        byte[] body = service.download(principal, companyId, ruleType, searchText);
        String fileName = "회사규정_" + principal.getCompanyName() + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=bbsUpload) → 등록한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }
}

package kr.co.kfs.asseterp.biz.adv.controller;

import kr.co.kfs.asseterp.biz.adv.dto.AccountRes;
import kr.co.kfs.asseterp.biz.adv.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.adv.service.AdvAccountService;
import kr.co.kfs.asseterp.biz.adv.service.AdvAccountUploadService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

/** 일임계좌 (AS-IS server/adv/Adv02_Account) */
@RestController
@RequestMapping("/api/v1/adv/accounts")
@RequiredArgsConstructor
public class AdvAccountController {

    private final AdvAccountService service;
    private final AdvAccountUploadService uploadService;

    /** AS-IS adv.Adv02_Account.selectByManageNamePaging (Q01 일임계좌 등록) — 페이지 행 + 전체 건수 */
    @GetMapping
    public ApiResponse<PageRes<AccountRes>> searchAccounts(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam(defaultValue = "") String searchText,
                                                           @RequestParam(defaultValue = "0") int offset,
                                                           @RequestParam(defaultValue = "500") int limit) {
        return ApiResponse.ok(service.searchAccounts(principal, searchText, offset, limit));
    }

    /** AS-IS adv.Adv02_Account.update (Q01 편집 폼 [저장]) → 저장된 행 */
    @PutMapping
    public ApiResponse<AccountRes> saveAccount(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AccountSaveReq req) {
        return ApiResponse.ok(service.saveAccount(principal, req));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_일임계좌정보.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_일임계좌정보.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(uploadService.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=adv02Upload) → 등록한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(uploadService.upload(principal, file));
    }
}

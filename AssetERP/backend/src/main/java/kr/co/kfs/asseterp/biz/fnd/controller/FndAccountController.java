package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.IpoAccountRes;
import kr.co.kfs.asseterp.biz.fnd.dto.IpoAccountSaveReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndAccountService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

/** 공모주 참여계좌 관리 (AS-IS Fnd32_Tab_Account → server/fnd/Fnd32_Account) — 메뉴 #1290 */
@RestController
@RequestMapping("/api/v1/fnd/accounts")
@RequiredArgsConstructor
public class FndAccountController {

    private final FndAccountService service;

    /** AS-IS fnd.Fnd32_Account.selectByText */
    @GetMapping
    public ApiResponse<List<IpoAccountRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false, defaultValue = "") String searchText,
                                                   @RequestParam(required = false, defaultValue = "%") String accountStateCode) {
        return ApiResponse.ok(service.search(principal, searchText, accountStateCode));
    }

    /** AS-IS fnd.Fnd32_Account.updateList → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<IpoAccountRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IpoAccountSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS fnd.Fnd32_Account.copyUpdate ([등록(복사)]) → 저장된 행 */
    @PostMapping("/copy")
    public ApiResponse<IpoAccountRes> copy(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IpoAccountSaveReq req) {
        return ApiResponse.ok(service.copy(principal, req));
    }

    /** AS-IS fnd.Fnd32_Account.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> accountIds) {
        service.delete(principal, accountIds);
        return ApiResponse.ok(null);
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_공모주참여계좌.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_공모주참여계좌.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=accountUpload) → 등록한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }
}

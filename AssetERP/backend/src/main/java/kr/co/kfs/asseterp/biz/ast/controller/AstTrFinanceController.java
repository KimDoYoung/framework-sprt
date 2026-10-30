package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstTrFinanceService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 금융상품 거래(청약처리) Ast06_Tab_TrIPO (W05) — AS-IS ast.Ast06_Tr.selectByPayCode · selectById · updateFinance. 삭제는 `POST /trs/delete`(U04) */
@RestController
@RequestMapping("/api/v1/ast/trs/finance")
@RequiredArgsConstructor
public class AstTrFinanceController {

    private final AstTrFinanceService service;

    /** ast.Ast06_Tr.selectByPayCode — windowClassName으로 화면을 가린다 */
    @GetMapping
    public ApiResponse<List<TrFinanceRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                  @RequestParam String windowClassName,
                                                  @RequestParam(required = false) String assetType,
                                                  @RequestParam(required = false) String abroType,
                                                  @RequestParam(required = false) Long accountId,
                                                  @RequestParam(required = false) Long classTreeId,
                                                  @RequestParam(required = false) Long trCodeId,
                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, windowClassName, assetType, abroType, accountId, classTreeId, trCodeId, searchText));
    }

    /** ast.Ast06_Tr.selectById */
    @GetMapping("/{trId}")
    public ApiResponse<TrFinanceRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long trId) {
        return ApiResponse.ok(service.get(principal, trId));
    }

    /** ast.Ast06_Tr.updateFinance — 저장한 거래ID */
    @PutMapping
    public ApiResponse<Long> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TrFinanceSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** 엑셀다운로드 (AS-IS ExcelDownload ast06IpoList) — 공모주청약(Ast06_Tab_TrIPO) 조회 결과 */
    @GetMapping("/ipo-excel")
    public ResponseEntity<byte[]> downloadIpoExcel(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                   @RequestParam(required = false) Long accountId,
                                                   @RequestParam(required = false) Long classTreeId,
                                                   @RequestParam(required = false) Long trCodeId,
                                                   @RequestParam(required = false) String searchText) {
        byte[] body = service.downloadIpoExcel(principal, startDate, closeDate, accountId, classTreeId, trCodeId, searchText);
        String fileName = "공모주청약(" + startDate + " ~ " + closeDate + ").xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }
}

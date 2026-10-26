package kr.co.kfs.asseterp.biz.adv.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.adv.dto.BookExtrRes;
import kr.co.kfs.asseterp.biz.adv.dto.BookExtrSaveReq;
import kr.co.kfs.asseterp.biz.adv.service.AdvBookExtrService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 일임보유주식등록(타사무) (AS-IS Adv11_Tab_BookExtr → server/adv/Adv11_BookExtr) — 메뉴 #1427 */
@RestController
@RequestMapping("/api/v1/adv/book-extrs")
@RequiredArgsConstructor
public class AdvBookExtrController {

    private final AdvBookExtrService service;

    /** AS-IS adv.Adv11_BookExtr.selectByStdDate */
    @GetMapping
    public ApiResponse<List<BookExtrRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                 @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, stdDate, searchText));
    }

    /** AS-IS adv.Adv11_BookExtr.selectRecentStdDate → yyyy-MM-dd 또는 null */
    @GetMapping("/recent-std-date")
    public ApiResponse<String> recentStdDate(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.recentStdDate(principal, stdDate));
    }

    /** AS-IS adv.Adv11_BookExtr.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<BookExtrRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BookExtrSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS adv.Adv11_BookExtr.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> bookExtrIds) {
        service.delete(principal, bookExtrIds);
        return ApiResponse.ok(null);
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_일임보유주식등록(타사무).xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_일임보유주식등록(타사무).xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=bookAdvExtrUpload) → 등록한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }
}

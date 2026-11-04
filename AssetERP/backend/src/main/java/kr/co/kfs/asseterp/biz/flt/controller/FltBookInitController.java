package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookInitCheckRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookInitRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookInitSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltBookInitService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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
import java.time.LocalDate;
import java.util.List;

/** 최초원장 등록 (AS-IS Flt13_Lookup_BookInit → server/flt/Flt13_BookInit). 로그인 사원 본인 것 */
@RestController
@RequestMapping("/api/v1/flt/book-inits")
@RequiredArgsConstructor
public class FltBookInitController {

    private final FltBookInitService service;

    /** AS-IS flt.Flt13_BookInit.selectByPersonId */
    @GetMapping
    public ApiResponse<List<BookInitRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** AS-IS flt.Flt13_BookInit.getInitDate — 최초원장이 없으면 data null */
    @GetMapping("/init-date")
    public ApiResponse<LocalDate> initDate(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.initDate(principal));
    }

    /** AS-IS checkPreTr — 영업일·실거래 내역·정기보고 상신문서 점검 */
    @GetMapping("/check")
    public ApiResponse<BookInitCheckRes> check(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.check(principal, stdDate));
    }

    /** AS-IS flt.Flt13_BookInit.update → 저장된 행(요청과 같은 순서) */
    @PutMapping
    public ApiResponse<List<BookInitRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BookInitSaveReq> list) {
        return ApiResponse.ok(service.save(principal, list));
    }

    /** AS-IS flt.Flt13_BookInit.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_초기원장등록.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_초기원장등록.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=fltBookInitUpload) → 안내 문구 */
    @PostMapping("/excel")
    public ApiResponse<String> upload(@AuthenticationPrincipal UserPrincipal principal,
                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                      @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, stdDate, file));
    }
}

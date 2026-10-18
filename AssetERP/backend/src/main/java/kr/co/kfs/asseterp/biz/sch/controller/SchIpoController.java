package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchIpoService;
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

/** 공모주 일정등록 (AS-IS Sch10_Tab_IpoAdmin → server/sch/Sch10_Ipo) */
@RestController
@RequestMapping("/api/v1/sch/ipos")
@RequiredArgsConstructor
public class SchIpoController {

    private final SchIpoService service;

    /** AS-IS sch.Sch10_Ipo.selectBySearchTextAdmin (dateType 1~6, 날짜 yyyy-MM-dd, marketCode 없으면 전체) */
    @GetMapping
    public ApiResponse<List<Sch10IpoRes>> search(@RequestParam String dateType, @RequestParam String startDate, @RequestParam String closeDate,
                                                 @RequestParam(required = false) String searchText, @RequestParam(required = false) String marketCode) {
        return ApiResponse.ok(service.search(dateType, startDate, closeDate, searchText, marketCode));
    }

    /** AS-IS sch.Sch10_Ipo.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<Sch10IpoRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Sch10IpoSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sch.Sch10_Ipo.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_공모주 일정등록.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_공모주 일정등록.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=ipoUpload) → 등록·갱신한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }
}

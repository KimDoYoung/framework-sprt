package kr.co.kfs.asseterp.biz.act.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.act.dto.JournalDeleteReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalNewReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalRes;
import kr.co.kfs.asseterp.biz.act.service.ActJournalEditService;
import kr.co.kfs.asseterp.biz.act.service.ActJournalListService;
import kr.co.kfs.asseterp.biz.act.service.ActJournalUploadService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 전표입력 Act02_Tab_CreateJournal (X01, 메뉴 #1148) · 전표 조회창 Act02_Lookup_JournalList — AS-IS act.Act02_Journal · act.Act08_JournalUpload */
@RestController
@RequestMapping("/api/v1/act/journals")
@RequiredArgsConstructor
public class ActJournalListController {

    private final ActJournalListService service;
    private final ActJournalEditService editService;
    private final ActJournalUploadService uploadService;

    /** act.Act02_Journal.selectByDate — abroType 1:국내(기본)/2:국외 */
    @GetMapping
    public ApiResponse<List<JournalRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                @RequestParam(defaultValue = "1") String abroType,
                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, abroType, searchText));
    }

    /** act.Act02_Journal.selectById */
    @GetMapping("/{journalId}")
    public ApiResponse<JournalRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long journalId) {
        return ApiResponse.ok(service.get(principal, journalId));
    }

    /** act.Act02_Journal.updateAll (NEW) → 새 전표 ID */
    @PostMapping
    public ApiResponse<Long> create(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody JournalNewReq req) {
        return ApiResponse.ok(editService.create(principal, req));
    }

    /** act.Act02_Journal.delete */
    @PostMapping("/delete")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody JournalDeleteReq req) {
        service.delete(principal, req.journalIds());
        return ApiResponse.ok(null);
    }

    /** [템플릿] — ./excelTemplete/Template_분개장 업로드.xlsx */
    @GetMapping("/excel-template")
    public ResponseEntity<byte[]> template() {
        String name = URLEncoder.encode("Template_분개장 업로드.xlsx", StandardCharsets.UTF_8).replace("+", "%20");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + name)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(uploadService.template());
    }

    /** [엑셀업로드] 1단계: act.Act08_JournalUpload.deleteByCompanyId + ExcelUpload?uploadType=journalUpload */
    @PostMapping("/excel")
    public ApiResponse<Void> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        uploadService.upload(principal, file);
        return ApiResponse.ok(null);
    }

    /** [엑셀업로드] 2단계: act.Act08_JournalUpload.journalWork */
    @PostMapping("/excel/work")
    public ApiResponse<Void> journalWork(@AuthenticationPrincipal UserPrincipal principal) {
        uploadService.journalWork(principal);
        return ApiResponse.ok(null);
    }
}

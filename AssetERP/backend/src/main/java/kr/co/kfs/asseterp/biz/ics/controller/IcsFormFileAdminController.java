package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsFormFileAdminRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsFormFileAdminSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsFormFileAdminService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** 법규보고 서식파일 등록 (AS-IS Ics01_Tab_IcsFileUpload·Ics01_Lookup_IcsFileMultiUpload → server/sys/Sys10_File, 서블릿 FileUpload mode=ics01) */
@RestController
@RequestMapping("/api/v1/ics/form-file-admin")
@RequiredArgsConstructor
public class IcsFormFileAdminController {

    private final IcsFormFileAdminService service;

    /** AS-IS sys.Sys10_File.getIcsFile */
    @GetMapping
    public ApiResponse<List<IcsFormFileAdminRes>> search(@RequestParam(defaultValue = "%") String lawType,
                                                         @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(lawType, searchText));
    }

    /** AS-IS sys.Sys10_File.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<IcsFormFileAdminRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestBody List<IcsFormFileAdminSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS FileUpload?mode=ics01&lawName=&content=&parentId=0 → 올린 행 */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<IcsFormFileAdminRes> upload(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam String lawType,
                                                   @RequestParam(defaultValue = "") String note,
                                                   @RequestPart("file") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, lawType, note, file));
    }
}

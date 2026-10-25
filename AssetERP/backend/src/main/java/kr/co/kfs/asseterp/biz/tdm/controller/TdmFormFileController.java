package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.tdm.dto.FormFileRes;
import kr.co.kfs.asseterp.biz.tdm.dto.FormFileSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmFormFileService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** 이행점검 연관양식 등록 (AS-IS Tdm43_Tab_RelateFormFileUpload). 받기·삭제는 `/api/v1/sys/files` */
@RestController
@RequestMapping("/api/v1/tdm/form-files")
@RequiredArgsConstructor
public class TdmFormFileController {

    private final TdmFormFileService service;

    /** AS-IS sys.Sys10_File.getTdmCheckFormFile (formType: % 전체 / 코드) */
    @GetMapping
    public ApiResponse<List<FormFileRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(defaultValue = "%") String formType,
                                                 @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, formType, searchText));
    }

    /** AS-IS sys.Sys10_File.update */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<FormFileSaveReq> rows) {
        service.save(principal, rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS FileUpload?mode=tdmCheckForm&tdmFormType=&note= (폼 항목 fileField → file) */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileRes> upload(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam String formType,
                                       @RequestParam(required = false) String note,
                                       @RequestPart("file") MultipartFile file) {
        return ApiResponse.ok("파일을 성공적으로 등록하였습니다.", service.upload(principal, formType, note, file));
    }
}

package kr.co.kfs.asseterp.biz.icam.controller;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
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

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopApprIdReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopSaveReq;
import kr.co.kfs.asseterp.biz.icam.service.IcamUserStopService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 미사용ID 권한정지 신청 (AS-IS Icam55_Tab_UserStopAuthAppr, 메뉴 #1315). 삭제는 EE29의 `DELETE /api/v1/icam/users`를 같이 쓴다 */
@RestController
@RequestMapping("/api/v1/icam/users/stops")
@RequiredArgsConstructor
public class IcamUserStopController {

    private final IcamUserStopService service;

    /** AS-IS icam.Icam55_IcamUser.selectBySearchText (regType 2) */
    @GetMapping
    public ApiResponse<List<IcamStopRes>> search(@RequestParam(required = false) String searchText,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.search(searchText, stdDate));
    }

    /** AS-IS icam.Icam55_IcamUser.update (UpdateDataModel) */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcamStopSaveReq> rows) {
        service.save(principal, rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS icam.Icam55_IcamUser.updateApprIds */
    @PutMapping("/appr-id")
    public ApiResponse<Void> updateApprIds(@RequestBody IcamStopApprIdReq req) {
        service.updateApprIds(req.ids(), req.apprId());
        return ApiResponse.ok(null);
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_권한정지 신청서.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_권한정지 신청서.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=icamUserStopUpload) → 넣은 행 수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }
}

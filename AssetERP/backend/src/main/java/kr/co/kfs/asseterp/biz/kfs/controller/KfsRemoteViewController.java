package kr.co.kfs.asseterp.biz.kfs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.kfs.dto.RemoteViewRes;
import kr.co.kfs.asseterp.biz.kfs.dto.RemoteViewSaveReq;
import kr.co.kfs.asseterp.biz.kfs.service.KfsRemoteViewService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.List;

/** 리모트뷰 사용기록관리 (AS-IS Kfs01_Tab_RemoteView → server/kfs/Kfs01_RemoteView) — 메뉴 #1334 */
@RestController
@RequestMapping("/api/v1/kfs/remote-views")
@RequiredArgsConstructor
public class KfsRemoteViewController {

    private final KfsRemoteViewService service;

    /** AS-IS kfs.Kfs01_RemoteView.selectByText / selectByPersonName (로그인 이름으로 서버가 고른다) */
    @GetMapping
    public ApiResponse<List<RemoteViewRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false, defaultValue = "") String personName,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                   @RequestParam(defaultValue = "false") boolean checkBox) {
        return ApiResponse.ok(service.search(principal, personName, startDate, closeDate, checkBox));
    }

    /** AS-IS kfs.Kfs01_RemoteView.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<RemoteViewRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<RemoteViewSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS kfs.Kfs01_RemoteView.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> remoteViewIds) {
        service.delete(principal, remoteViewIds);
        return ApiResponse.ok(null);
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=remoteViewUpload) → 등록 대상 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }
}

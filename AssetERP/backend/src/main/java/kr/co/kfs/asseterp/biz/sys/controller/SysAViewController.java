package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AViewRes;
import kr.co.kfs.asseterp.biz.sys.service.SysAViewService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

/** A-View 문서 미리보기 (AS-IS JsonProvider mode=AView, template/fileViewer_AView.jsp) */
@RestController
@RequiredArgsConstructor
public class SysAViewController {

    private final SysAViewService service;

    /** 미리보기 주소 — 화면은 이 주소를 iframe으로 연다 */
    @GetMapping("/api/v1/sys/files/{fileId}/aview")
    public ApiResponse<AViewRes> getViewUrl(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long fileId) {
        return ApiResponse.ok(service.getViewUrl(principal, fileId));
    }

    /** A-View 서버가 가져가는 임시 복사본 (인증 없음 — AS-IS {contextPath}/tmp/{임의이름}과 같다) */
    @GetMapping(SysAViewService.TMP_PATH + "{name}")
    public ResponseEntity<Resource> getTmpFile(@PathVariable String name) {
        File file = service.getTmpFile(name);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE)
                .contentLength(file.length())
                .body(new FileSystemResource(file));
    }
}

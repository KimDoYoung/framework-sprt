package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.sys.service.SysRelateFileService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * 파일 공통 (B10) — AS-IS 서블릿 FileUpload·FileDownload·FileDelete, 서비스 sys.Sys10_File.selectByParentId·sys.Sys11_RelateFile.checkFileDelete.
 * 로그인한 사용자면 누구나 (원본도 권한 검사 없음 — 사용자 결정 2026-10-13).
 */
@RestController
@RequestMapping("/api/v1/sys/files")
@RequiredArgsConstructor
public class SysFileController {

    private final SysFileService sysFileService;
    private final SysRelateFileService sysRelateFileService;

    /** AS-IS sys.Sys10_File.selectByParentId */
    @GetMapping
    public ApiResponse<List<FileRes>> searchByParentId(@RequestParam Long parentId) {
        return ApiResponse.ok(sysFileService.searchByParentId(parentId));
    }

    /** AS-IS FileUpload?parentId=&[mode=emp01]&[fileYn=] (폼 항목 fileField → file) */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileRes> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long parentId,
                                       @RequestParam(required = false) String mode, @RequestParam(required = false) String fileYn,
                                       @RequestPart("file") MultipartFile file) {
        return ApiResponse.ok("파일을 성공적으로 등록하였습니다.", sysFileService.upload(principal, parentId, mode, fileYn, file));
    }

    /** AS-IS FileDownload?fileType=image&(fileId=|parentId=) — 사진 (화면에 그대로 보임) */
    @GetMapping("/image")
    public ResponseEntity<Resource> getImage(@RequestParam(required = false) Long fileId, @RequestParam(required = false) Long parentId) {
        return toResponse(sysFileService.getImage(fileId, parentId), "inline");
    }

    /** AS-IS FileDownload?fileType=file&fileId= */
    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> download(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long fileId) {
        return toResponse(sysFileService.getDownload(principal, fileId), "attachment");
    }

    /** AS-IS sys.Sys11_RelateFile.checkFileDelete → 1 연결만 지움 / 2 다른 상신문서에서 사용 중 / 3 지워도 됨 */
    @PostMapping("/{fileId}/check-delete")
    public ApiResponse<Integer> checkFileDelete(@PathVariable Long fileId, @RequestParam Long parentId) {
        return ApiResponse.ok(sysRelateFileService.checkFileDelete(fileId, parentId));
    }

    /** AS-IS FileDelete?fileId= */
    @DeleteMapping("/{fileId}")
    public ApiResponse<Void> delete(@PathVariable Long fileId) {
        sysFileService.delete(fileId);
        return ApiResponse.ok("파일을 성공적으로 삭제하였습니다.", null);
    }

    /** AS-IS FileDownload.download L65-90: filename은 URL 인코딩(+ → %20) */
    private static ResponseEntity<Resource> toResponse(SysFileService.StoredFile stored, String disposition) {
        String encoded = URLEncoder.encode(stored.fileNm(), StandardCharsets.UTF_8).replace("+", "%20");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, stored.contentType())
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + encoded + "\"")
                .contentLength(stored.file().length())
                .body(new FileSystemResource(stored.file()));
    }
}

package kr.co.kfs.asseterp.oms.biz.file.controller;

import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditEventType;
import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditResult;
import kr.co.kfs.asseterp.oms.biz.audit.service.AuditLogService;
import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.file.dto.FileItemDto;
import kr.co.kfs.asseterp.oms.biz.file.service.FileStorageService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;
    private final AuditLogService auditLogService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileItemDto> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {

        log.info("파일 업로드 요청: filename={}, uploader={}", file.getOriginalFilename(),
                principal != null ? principal.getUsername() : "unknown");

        FileItemDto fileItem;
        try {
            fileItem = fileStorageService.storeFile(file, principal);
        } catch (BusinessException e) {
            auditLogService.record(AuditEventType.FILE_UPLOAD_REJECTED, AuditResult.FAIL, usernameOf(principal),
                    file.getOriginalFilename(), e.getMessage());
            throw e;
        }
        auditLogService.record(AuditEventType.FILE_UPLOAD, AuditResult.SUCCESS, usernameOf(principal),
                fileItem.fileId(), fileItem.originalFilename() + " (" + fileItem.fileSize() + " bytes, " + fileItem.detectedMimeType() + ")");
        return ApiResponse.ok("파일이 성공적으로 업로드되었습니다.", fileItem);
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("fileId") String fileId,
                                                 @AuthenticationPrincipal UserPrincipal principal) {
        FileItemDto meta = fileStorageService.getFileMetadata(fileId);
        Resource resource = fileStorageService.loadFileAsResource(fileId);
        auditLogService.record(AuditEventType.FILE_DOWNLOAD, AuditResult.SUCCESS, usernameOf(principal),
                fileId, meta.originalFilename());

        // RFC 6266/5987: 한글 파일명은 filename*=UTF-8''... 로 인코딩
        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(meta.originalFilename(), StandardCharsets.UTF_8)
                .build();
        // 검증을 통과한 파일이므로 확장자 기준의 표준 MIME 타입으로 응답 (tika-core의 x-tika-* 내부 타입 노출 방지)
        MediaType mediaType = MediaTypeFactory.getMediaType(meta.originalFilename())
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(resource);
    }

    @GetMapping("/list")
    public ApiResponse<List<FileItemDto>> listFiles() {
        List<FileItemDto> files = fileStorageService.listFiles();
        return ApiResponse.ok(files);
    }

    private static String usernameOf(UserPrincipal principal) {
        return principal != null ? principal.getUsername() : null;
    }
}

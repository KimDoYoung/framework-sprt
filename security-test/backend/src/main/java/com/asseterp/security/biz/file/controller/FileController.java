package com.asseterp.security.biz.file.controller;

import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.file.dto.FileItemDto;
import com.asseterp.security.biz.file.service.FileStorageService;
import com.asseterp.security.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileItemDto> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {

        log.info("파일 업로드 요청: filename={}, uploader={}", file.getOriginalFilename(),
                principal != null ? principal.getUsername() : "unknown");

        FileItemDto fileItem = fileStorageService.storeFile(file, principal);
        return ApiResponse.ok("파일이 성공적으로 업로드되었습니다.", fileItem);
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("fileId") String fileId) {
        FileItemDto meta = fileStorageService.getFileMetadata(fileId);
        Resource resource = fileStorageService.loadFileAsResource(fileId);

        String encodedFilename = UriUtils.encode(meta.originalFilename(), StandardCharsets.UTF_8);
        String contentDisposition = "attachment; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename;

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(meta.detectedMimeType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }

    @GetMapping("/list")
    public ApiResponse<List<FileItemDto>> listFiles() {
        List<FileItemDto> files = fileStorageService.listFiles();
        return ApiResponse.ok(files);
    }
}

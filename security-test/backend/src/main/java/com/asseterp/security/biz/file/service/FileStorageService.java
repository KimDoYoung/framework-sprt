package com.asseterp.security.biz.file.service;

import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.file.dto.FileItemDto;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class FileStorageService {

    @Value("${asseterp.upload.dir:/home/kdy987/tmp/asseterp-data/uploads}")
    private String uploadDir;

    private final Tika tika = new Tika();
    private final Map<String, FileItemDto> fileMetadataStore = new ConcurrentHashMap<>();
    private Path uploadPath;

    @PostConstruct
    public void init() {
        try {
            uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            log.info("파일 업로드 디렉토리 초기화 완료: {}", uploadPath);
        } catch (Exception e) {
            log.warn("기본 업로드 디렉토리 생성 실패({}), /tmp/asseterp-data/uploads 로 fallback합니다: {}", uploadDir, e.getMessage());
            try {
                uploadPath = Paths.get(System.getProperty("java.io.tmpdir"), "asseterp-data", "uploads").toAbsolutePath().normalize();
                Files.createDirectories(uploadPath);
                log.info("Fallback 파일 업로드 디렉토리 초기화 완료: {}", uploadPath);
            } catch (IOException ex) {
                log.error("Fallback 디렉토리 생성도 실패: {}", ex.getMessage());
            }
        }
    }

    /**
     * 파일 업로드 및 Apache Tika Magic Number MIME 검사
     */
    public FileItemDto storeFile(MultipartFile file, UserPrincipal principal) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("파일명이 올바르지 않습니다.");
        }

        // 요구사항 9: Apache Tika 기반 Magic Number MIME Type 검사
        String detectedMimeType;
        try (InputStream is = file.getInputStream()) {
            detectedMimeType = tika.detect(is, originalFilename);
        }

        String declaredContentType = file.getContentType();
        log.info("파일 업로드 검사 - 원본명: {}, 선언된 Content-Type: {}, Tika 감지 MIME Type: {}, 크기: {} bytes",
                originalFilename, declaredContentType, detectedMimeType, file.getSize());

        // 고유 저장 파일명 생성
        String fileId = UUID.randomUUID().toString();
        String storedFilename = fileId + "_" + Paths.get(originalFilename).getFileName().toString();
        Path targetLocation = uploadPath.resolve(storedFilename);

        // 실제 파일 디스크 저장
        try (InputStream is = file.getInputStream()) {
            Files.copy(is, targetLocation, StandardCopyOption.REPLACE_EXISTING);
        }

        FileItemDto fileItem = new FileItemDto(
                fileId,
                originalFilename,
                storedFilename,
                file.getSize(),
                detectedMimeType,
                declaredContentType,
                principal != null ? principal.getUsername() : "anonymous",
                LocalDateTime.now()
        );

        fileMetadataStore.put(fileId, fileItem);
        log.info("파일 저장 성공 - fileId: {}, path: {}", fileId, targetLocation);

        return fileItem;
    }

    public Resource loadFileAsResource(String fileId) {
        FileItemDto meta = fileMetadataStore.get(fileId);
        if (meta == null) {
            throw new NoSuchElementException("해당 파일 정보를 찾을 수 없습니다: " + fileId);
        }

        try {
            Path filePath = uploadPath.resolve(meta.storedFilename()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("파일을 읽을 수 없거나 파일이 존재하지 않습니다: " + meta.storedFilename());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("파일 경로 오류: " + meta.storedFilename(), e);
        }
    }

    public FileItemDto getFileMetadata(String fileId) {
        FileItemDto meta = fileMetadataStore.get(fileId);
        if (meta == null) {
            throw new NoSuchElementException("파일 정보를 찾을 수 없습니다: " + fileId);
        }
        return meta;
    }

    public List<FileItemDto> listFiles() {
        return new ArrayList<>(fileMetadataStore.values()).stream()
                .sorted(Comparator.comparing(FileItemDto::uploadedAt).reversed())
                .toList();
    }
}

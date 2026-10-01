package kr.co.kfs.asseterp.oms.biz.file.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.file.dto.FileItemDto;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import kr.co.kfs.asseterp.oms.common.config.properties.UploadProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
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
@RequiredArgsConstructor
public class FileStorageService {

    private final UploadProperties uploadProperties;
    private final Tika tika = new Tika();
    private final Map<String, FileItemDto> fileMetadataStore = new ConcurrentHashMap<>();
    private Path uploadPath;

    @PostConstruct
    public void init() {
        try {
            uploadPath = Paths.get(uploadProperties.dir()).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            log.info("파일 업로드 디렉토리 초기화 완료: {}", uploadPath);
        } catch (Exception e) {
            log.warn("기본 업로드 디렉토리 생성 실패({}), /tmp/asseterp-data/uploads 로 fallback합니다: {}", uploadProperties.dir(), e.getMessage());
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
            throw new BusinessException(ErrorCode.INVALID_FILE, "파일명이 올바르지 않습니다.");
        }
        if (file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_FILE, "빈 파일은 업로드할 수 없습니다.");
        }

        // 요구사항 9: Apache Tika 기반 Magic Number MIME Type 검사 (위변조 파일은 저장 전에 거부)
        String extension = extractExtension(originalFilename);
        String detectedMimeType;
        try (InputStream is = file.getInputStream()) {
            detectedMimeType = validateFileType(extension, is);
        }

        String declaredContentType = file.getContentType();
        log.info("파일 업로드 검사 통과 - 원본명: {}, 선언된 Content-Type: {}, Tika 감지 MIME Type: {}, 크기: {} bytes",
                originalFilename, declaredContentType, detectedMimeType, file.getSize());

        // 저장 파일명은 UUID + 확장자만 사용 (원본 파일명의 특수문자/경로 조작 배제)
        String fileId = UUID.randomUUID().toString();
        String storedFilename = fileId + "." + extension;
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

    /**
     * 확장자가 허용 목록(asseterp.upload.allowed-types)에 있고, 파일 내용(매직 넘버)으로 판별한 MIME 타입이 그 확장자와 일치하는지 검사한다.
     * 파일명 힌트 없이 스트림만으로 판별해야 확장자 위장(예: .exe → .png)을 잡을 수 있다.
     *
     * @return 감지된 MIME 타입
     */
    String validateFileType(String extension, InputStream content) throws IOException {
        Map<String, Set<String>> allowedTypesByExtension = uploadProperties.allowedTypes();
        Set<String> allowedTypes = allowedTypesByExtension.get(extension);
        if (allowedTypes == null) {
            throw new BusinessException(ErrorCode.INVALID_FILE,
                    "허용되지 않는 확장자입니다: ." + extension + " (허용: " + new TreeSet<>(allowedTypesByExtension.keySet()) + ")");
        }

        String detectedMimeType = tika.detect(content);
        if (!allowedTypes.contains(detectedMimeType)) {
            log.warn("파일 위변조 의심 - 확장자: {}, 감지된 MIME: {}", extension, detectedMimeType);
            throw new BusinessException(ErrorCode.INVALID_FILE,
                    "파일 내용이 확장자(." + extension + ")와 일치하지 않습니다. (감지된 형식: " + detectedMimeType + ")");
        }
        return detectedMimeType;
    }

    private String extractExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        if (dot < 0 || dot == filename.length() - 1) {
            throw new BusinessException(ErrorCode.INVALID_FILE, "확장자가 없는 파일은 업로드할 수 없습니다.");
        }
        return filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    public Resource loadFileAsResource(String fileId) {
        FileItemDto meta = getFileMetadata(fileId);

        try {
            Path filePath = uploadPath.resolve(meta.storedFilename()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND,
                    "파일을 읽을 수 없거나 파일이 존재하지 않습니다: " + meta.originalFilename());
        } catch (MalformedURLException e) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "파일 경로 오류: " + meta.originalFilename());
        }
    }

    public FileItemDto getFileMetadata(String fileId) {
        FileItemDto meta = fileMetadataStore.get(fileId);
        if (meta == null) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND, "파일 정보를 찾을 수 없습니다: " + fileId);
        }
        return meta;
    }

    public List<FileItemDto> listFiles() {
        return new ArrayList<>(fileMetadataStore.values()).stream()
                .sorted(Comparator.comparing(FileItemDto::uploadedAt).reversed())
                .toList();
    }
}

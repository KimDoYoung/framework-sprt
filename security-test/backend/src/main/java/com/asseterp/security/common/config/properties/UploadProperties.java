package com.asseterp.security.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Map;
import java.util.Set;

/**
 * 파일 업로드 설정 (asseterp.upload.*)
 *
 * @param dir          업로드 저장 디렉토리
 * @param allowedTypes 허용 확장자(소문자) → 매직 넘버로 판별된 허용 MIME 타입 목록
 */
@ConfigurationProperties(prefix = "asseterp.upload")
public record UploadProperties(
        String dir,
        Map<String, Set<String>> allowedTypes
) {
}

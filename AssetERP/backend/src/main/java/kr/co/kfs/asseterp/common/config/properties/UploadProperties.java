package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 파일 업로드 설정 (asseterp.upload.*)
 * 허용 형식은 properties가 아니라 DB sys60_file_policy(파일보안정책 화면)로 정한다.
 *
 * @param dir 업로드 저장 디렉토리
 */
@ConfigurationProperties(prefix = "asseterp.upload")
public record UploadProperties(
        String dir
) {
}

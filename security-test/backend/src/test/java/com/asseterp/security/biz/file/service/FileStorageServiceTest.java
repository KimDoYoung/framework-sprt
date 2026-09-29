package com.asseterp.security.biz.file.service;

import com.asseterp.security.common.config.properties.UploadProperties;
import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.support.TestProperties;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceTest {

    private static final byte[] PNG_HEADER = {(byte) 0x89, 'P', 'N', 'G', '\r', '\n', 0x1A, '\n', 0, 0, 0, 0x0D, 'I', 'H', 'D', 'R'};
    private static final byte[] EXE_HEADER = {'M', 'Z', (byte) 0x90, 0, 3, 0, 0, 0, 4, 0, 0, 0, (byte) 0xFF, (byte) 0xFF, 0, 0};

    // 실제 application.properties의 asseterp.upload.allowed-types로 검증
    private final FileStorageService service =
            new FileStorageService(TestProperties.bind("asseterp.upload", UploadProperties.class));

    @Test
    void 실제_PNG는_통과() throws IOException {
        assertThat(service.validateFileType("png", new ByteArrayInputStream(PNG_HEADER))).isEqualTo("image/png");
    }

    @Test
    void 확장자를_png로_위장한_exe는_거부() {
        assertThatThrownBy(() -> service.validateFileType("png", new ByteArrayInputStream(EXE_HEADER)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("일치하지 않습니다");
    }

    @Test
    void 허용되지_않은_확장자는_거부() {
        assertThatThrownBy(() -> service.validateFileType("exe", new ByteArrayInputStream(EXE_HEADER)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("허용되지 않는 확장자");
    }

    @Test
    void 한글_텍스트_파일은_통과() throws IOException {
        byte[] text = "종목코드,종목명\n005930,삼성전자\n".getBytes(StandardCharsets.UTF_8);
        assertThat(service.validateFileType("csv", new ByteArrayInputStream(text))).isEqualTo("text/plain");
    }

    @Test
    void OOXML_엑셀은_통과() throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try (ZipOutputStream zip = new ZipOutputStream(bos)) {
            zip.putNextEntry(new ZipEntry("[Content_Types].xml"));
            zip.write("<Types/>".getBytes(StandardCharsets.UTF_8));
            zip.closeEntry();
            zip.putNextEntry(new ZipEntry("xl/workbook.xml"));
            zip.write("<workbook/>".getBytes(StandardCharsets.UTF_8));
            zip.closeEntry();
        }
        assertThat(service.validateFileType("xlsx", new ByteArrayInputStream(bos.toByteArray())))
                .isIn("application/x-tika-ooxml", "application/zip");
    }

    @Test
    void 텍스트를_pdf로_위장하면_거부() {
        byte[] text = "not a pdf".getBytes(StandardCharsets.UTF_8);
        assertThatThrownBy(() -> service.validateFileType("pdf", new ByteArrayInputStream(text)))
                .isInstanceOf(BusinessException.class);
    }
}

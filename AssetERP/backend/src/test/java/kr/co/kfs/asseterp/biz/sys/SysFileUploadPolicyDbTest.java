package kr.co.kfs.asseterp.biz.sys;

import kr.co.kfs.asseterp.biz.audit.service.AuditLogService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.config.properties.UploadProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.io.File;
import java.nio.file.Files;
import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * SFU01 FileUpload 기본 모드 — 허용 형식은 DB sys60_file_policy의 확장자(AS-IS FilePolicyService), 사원 사진은 줄이지 않는다.
 * 저장 폴더는 임시 폴더, DB 행은 @MybatisTest가 롤백한다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(SysFileService.class)
@EnableConfigurationProperties(UploadProperties.class)
class SysFileUploadPolicyDbTest {

    private static final File DIR = newTempDir();

    private static File newTempDir() {
        try {
            return Files.createTempDirectory("asseterp-upload-test").toFile();
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("asseterp.upload.dir", DIR::getAbsolutePath);
    }

    @AfterAll
    static void cleanup() throws Exception {
        try (var w = Files.walk(DIR.toPath())) {
            w.sorted(Comparator.reverseOrder()).map(java.nio.file.Path::toFile).forEach(File::delete);
        }
    }

    @MockitoBean AuditLogService auditLogService;
    @Autowired SysFileService service;

    private final UserPrincipal user = UserPrincipal.builder().userId(-28656L).username("t").companyId(28000L).companyCode("admin").roles(List.of("ROLE_ADMIN")).build();

    private FileRes up(String name, byte[] body, String mode) {
        return service.upload(user, 990099L, mode, "false", new MockMultipartFile("file", name, "application/octet-stream", body));
    }

    @Test
    void DB_정책의_확장자는_받고_없는_확장자나_확장자_없음은_거부한다() {
        // properties 목록에는 없었지만 sys60_file_policy에는 있는 확장자
        assertThat(up("a.xlsm", new byte[]{1, 2, 3}, null).fileNm()).isEqualTo("a.xlsm");
        assertThat(up("b.SVG", new byte[]{1}, null).fileExt()).isEqualTo("SVG");   // 대소문자 무관
        assertThatThrownBy(() -> up("c.exe", new byte[]{1}, null)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> up("noext", new byte[]{1}, null)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 파일_내용은_확장자와_달라도_원본처럼_보지_않는다() {
        // AS-IS는 확장자만 본다(MIME 검사는 주석 처리)
        assertThat(up("fake.png", "not an image".getBytes(), null).fileNm()).isEqualTo("fake.png");
    }

    @Test
    void emp01_모드여도_사진을_줄이지_않고_그대로_저장한다() throws Exception {
        byte[] body = new byte[5000];
        FileRes saved = up("me.jpg", body, "emp01");
        File stored = new File(saved.serverPath(), saved.fileId().toString());
        assertThat(stored.length()).isEqualTo(5000L);
        assertThat(Files.readAllBytes(stored.toPath())).isEqualTo(body);
    }

    @Test
    void 프로필_사진은_없으면_noimage_일반_이미지는_nonamed가_기본이다() throws Exception {
        Files.write(new File(DIR, "noimage.jpg").toPath(), new byte[]{1});
        Files.write(new File(DIR, "nonamed.jpg").toPath(), new byte[]{2, 2});
        assertThat(service.getMonitoringImage(-1L).file().getName()).isEqualTo("noimage.jpg");   // 사진 없는 부모
        assertThat(service.getImage(null, -1L).file().getName()).isEqualTo("nonamed.jpg");
        // 사진이 올라가 있으면 그 사진
        FileRes saved = up("photo.jpg", new byte[]{9, 9, 9}, null);
        // parentId 990099에 올라간 사진을 monitoring이 돌려준다
        assertThat(service.getMonitoringImage(990099L).file().length()).isEqualTo(3L);
        assertThat(saved.fileNm()).isEqualTo("photo.jpg");
    }
}

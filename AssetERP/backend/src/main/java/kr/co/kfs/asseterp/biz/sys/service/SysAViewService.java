package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AViewRes;
import kr.co.kfs.asseterp.common.config.properties.AViewProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * A-View 문서 미리보기 (AS-IS servlet/JsonFileView_AView + template/fileViewer_AView.jsp, Sys10_Lookup_FileViewer.openOther).
 * 파일을 임의 이름으로 임시 폴더에 복사하고, A-View 서버가 그 파일을 {fileBaseUrl}/api/public/aview-tmp/{이름}으로 가져가 변환해 보여 준다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SysAViewService {

    /** 임시 파일 이름 = UUID.확장자 (공개 경로로 내보내므로 이 모양만 받는다) */
    private static final Pattern TMP_NAME = Pattern.compile("[0-9a-f]{32}(\\.[A-Za-z0-9]{1,10})?");
    public static final String TMP_PATH = "/api/public/aview-tmp/";

    private final SysFileService sysFileService;
    private final AViewProperties properties;

    /** AS-IS fileView() L57-134: selectById → randomCopy → aViewPath/view?url=tmpFilePath&onm=encodeURIComponent(onm) */
    public AViewRes getViewUrl(UserPrincipal user, Long fileId) {
        if (!StringUtils.hasText(properties.homeUrl()) || !StringUtils.hasText(properties.fileBaseUrl())) {
            // AS-IS Sys10_Lookup_FileViewer L77-83: 로컬(:8888)에서는 PDF만
            throw new BusinessException(ErrorCode.INVALID_INPUT, "로컬환경에서는 미리보기를 지원하지 않습니다");
        }
        SysFileService.StoredFile stored = sysFileService.getDownload(user, fileId);
        String ext = extOf(stored.fileNm());
        String randomName = UUID.randomUUID().toString().replace("-", "") + (ext.isEmpty() ? "" : "." + ext);
        try {
            Path dir = Path.of(properties.tmpDir());
            Files.createDirectories(dir);
            Files.copy(stored.file().toPath(), dir.resolve(randomName), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("A-View 임시 파일 복사 실패: fileId={}", fileId, e);
            throw new BusinessException(ErrorCode.INVALID_INPUT, "미리보기 파일 생성 중 오류. 다운로드하여 확인해주세요", e);
        }
        String tmpUrl = trimSlash(properties.fileBaseUrl()) + TMP_PATH + randomName;
        String viewUrl = trimSlash(properties.homeUrl()) + "/view?url=" + tmpUrl
                + "&onm=" + URLEncoder.encode(stored.fileNm(), StandardCharsets.UTF_8).replace("+", "%20");
        return new AViewRes(viewUrl);
    }

    /** A-View 서버가 가져갈 임시 파일. 이름이 모양에 맞고 임시 폴더 안에 있을 때만 */
    public File getTmpFile(String name) {
        if (name == null || !TMP_NAME.matcher(name).matches()) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }
        File file = Path.of(properties.tmpDir()).resolve(name).toFile();
        if (!file.isFile()) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }
        return file;
    }

    private static String extOf(String fileNm) {
        int dot = fileNm == null ? -1 : fileNm.lastIndexOf('.');
        String ext = dot < 0 ? "" : fileNm.substring(dot + 1).toLowerCase(Locale.ROOT);
        return ext.matches("[a-z0-9]{1,10}") ? ext : "";
    }

    private static String trimSlash(String s) {
        return s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }
}

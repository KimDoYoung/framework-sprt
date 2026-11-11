package kr.co.kfs.asseterp.biz.rd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlReq;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlRes;
import kr.co.kfs.asseterp.common.config.properties.RdProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;

/**
 * RD 서버 저장(CommonInvoker.jsp)을 브라우저 대신 서버가 부르고, 만들어진 파일을 돌려준다.
 * AS-IS: 화면이 RDUtil.download(page CommonInvoker.jsp, fileName = 서버 경로)를 부르고 → Sys10_File.checkFileStatus(10초, 2초 간격)로 기다린 뒤
 * → Sys10_File.fileReName으로 결재 첨부에 등록한다. 등록은 호출한 쪽이 SysFileService.registerRdFile로 한다.
 * asseterp.rd.pdf-enabled가 true가 아니면 부르지 않는다(AS-IS 개발계의 "개발계는 파일생성기능 제한"과 같은 자리). 개발은 tools/rd-simulator가 data/samples 파일을 그 경로에 복사한다.
 */
@Slf4j
@Component
public class RdFileSaver {

    private static final long WAIT_MILLIS = 10_000;
    private static final long CHECK_INTERVAL = 2_000;

    private final RdService rdService;
    private final RdProperties rdProperties;
    private final boolean enabled;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    public RdFileSaver(RdService rdService, RdProperties rdProperties, @Value("${asseterp.rd.pdf-enabled:false}") boolean enabled) {
        this.rdService = rdService;
        this.rdProperties = rdProperties;
        this.enabled = enabled;
    }

    public boolean enabled() {
        return enabled;
    }

    /**
     * @param tempName 확장자를 뺀 임시 파일 이름(저장 폴더 아래). 사용자끼리 겹치지 않게 출력 그룹 ID 등을 넣는다
     * @return 만들어진 파일. RD가 꺼졌거나 실패·시간초과면 비어 있다(AS-IS도 첨부 없이 상신을 이어 간다)
     */
    public Optional<File> save(UserPrincipal user, String mrd, String options, String exportType, String tempName, Map<String, String> rv) {
        if (!enabled) {
            log.info("RD 서버 저장 꺼짐(asseterp.rd.pdf-enabled) mrd={}", mrd);
            return Optional.empty();
        }
        RdUrlRes call = rdService.buildUrl(user, new RdUrlReq("save", mrd, options, exportType, tempName + "." + exportType, rv));
        String answer = post(call.url());
        if (answer == null || !(answer.equals("success") || answer.contains("성공") || answer.startsWith("success:"))) {
            log.warn("RD 서버 저장 실패 mrd={} 응답={}", mrd, answer);
            return Optional.empty();
        }
        File generated = new File(rdProperties.localDir(), tempName + "." + exportType);
        if (!waitForFile(generated)) {
            log.warn("RD 서버 저장 파일이 생기지 않음 {}", generated);
            return Optional.empty();
        }
        return Optional.of(generated);
    }

    /** RD 서버가 안 열리거나 오류면 null */
    private String post(String url) {
        try {
            HttpResponse<String> res = http.send(
                    HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(60)).POST(HttpRequest.BodyPublishers.noBody()).build(),
                    HttpResponse.BodyHandlers.ofString());
            return res.statusCode() / 100 == 2 ? res.body().trim() : "HTTP " + res.statusCode();
        } catch (IOException e) {
            log.error("RD 서버 호출 실패 url={}", rdProperties.url(), e);
            return null;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return null;
        }
    }

    /** AS-IS Sys10_File.checkFileStatus: 10초 동안 2초 간격으로 파일이 생겼는지 본다 */
    private boolean waitForFile(File file) {
        long start = System.currentTimeMillis();
        try {
            while (true) {
                if (file.isFile()) return true;
                if (System.currentTimeMillis() - start >= WAIT_MILLIS) return false;
                Thread.sleep(CHECK_INTERVAL);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
}

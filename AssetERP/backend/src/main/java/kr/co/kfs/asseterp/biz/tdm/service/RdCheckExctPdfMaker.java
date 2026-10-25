package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlReq;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlRes;
import kr.co.kfs.asseterp.biz.rd.service.RdService;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckExctPdfTarget;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckJobMapper;
import kr.co.kfs.asseterp.common.config.properties.RdProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 이행점검보고서 PDF를 RD 서버(개발은 tools/rd-simulator)로 만든다 (AS-IS Tdm50_TabPage_CheckJob.createRd 한 건 분량).
 * 순서: fileCheck(이전 첨부 삭제) → CreateTdmCheckJob(sys99_print 자료) → RD 서버 저장 호출(CommonInvoker.jsp, 브라우저 대신 서버가 부른다)
 *       → checkFileStatus(파일이 보일 때까지 10초, 2초 간격) → fileReName(업로드 폴더로 옮기고 sys10_file 등록).
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "asseterp.rd.pdf-enabled", havingValue = "true")
public class RdCheckExctPdfMaker implements CheckExctPdfMaker {

    public static final String MRD = "Tdm50_Rd_CheckJob";
    public static final String OPTIONS = "/rpdflinebreak [1] /rwordbreakopt [1] /rsaveopt [2049]";
    private static final String FILE_TYPE = "pdf";
    private static final long WAIT_MILLIS = 10_000;
    private static final long CHECK_INTERVAL = 2_000;

    private final TdmCheckJobMapper mapper;
    private final CheckExctPdfSteps steps;
    private final RdService rdService;
    private final RdProperties rdProperties;
    private final SysFileService sysFileService;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    @Override
    public PdfOutcome make(Long chckExctId, Long companyId, UserPrincipal user) {
        CheckExctPdfTarget target = mapper.selectPdfTarget(chckExctId);
        if (target == null || !companyId.equals(target.companyId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        steps.clearOldFiles(chckExctId);                                          // fileCheck
        Long groupId;
        try {
            groupId = steps.createPrintData(target);                              // CreateTdmCheckJob
        } catch (RuntimeException e) {
            log.error("이행점검 출력 자료 생성 실패 chckExctId={}", chckExctId, e);
            return PdfOutcome.RD_FAILED;
        }
        String tempName = groupId + "_" + chckExctId;                             // 임시 파일 이름

        Map<String, String> rv = new LinkedHashMap<>();
        rv.put("groupId", String.valueOf(groupId));
        rv.put("YYYYMM", yyyymm(target.checkYm()));
        rv.put("roleName", target.roleName());
        rv.put("exctName", target.exctName());
        RdUrlRes call = rdService.buildUrl(user, new RdUrlReq("save", MRD, OPTIONS, FILE_TYPE, tempName + "." + FILE_TYPE, rv));

        String answer = post(call.url());
        if (answer == null || !(answer.equals("success") || answer.contains("성공") || answer.startsWith("success:"))) {
            log.warn("RD 서버 저장 실패 chckExctId={} 응답={}", chckExctId, answer);
            return PdfOutcome.RD_FAILED;
        }

        File generated = new File(rdProperties.localDir(), tempName + "." + FILE_TYPE);
        if (!waitForFile(generated)) {
            return PdfOutcome.FILE_FAILED;
        }
        String fileNm = target.roleName() + "_이행점검(" + target.checkYm() + ")." + FILE_TYPE;
        try {
            sysFileService.registerRdFile(generated, chckExctId, target.locName(), fileNm, FILE_TYPE);
        } catch (IOException e) {
            log.error("RD 파일 옮기기 실패 chckExctId={}", chckExctId, e);
            return PdfOutcome.FILE_FAILED;
        }
        return PdfOutcome.OK;
    }

    /** AS-IS getYYYYMM: '2026.08' → '2026년08월' */
    public static String yyyymm(String checkYm) {
        String ym = checkYm.replace("-", ".");
        return ym.substring(0, 4) + "년" + ym.substring(5, 7) + "월";
    }

    /** RD 서버가 안 열리거나 오류면 null (AS-IS는 RD 콜백이 실패 문구를 줄 때와 같이 취급) */
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

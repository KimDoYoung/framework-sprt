package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlReq;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlRes;
import kr.co.kfs.asseterp.biz.rd.service.RdService;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgPdfTarget;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlPdfMapper;
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
 * 책무매뉴얼 PDF를 RD 서버(개발은 tools/rd-simulator)로 만든다 (AS-IS Tdm42_Tab_ManlManager.createRd 한 건 분량).
 * 순서: fileCheck(이전 첨부 삭제) → CreateTdmManlOrg(sys99_print 자료) → RD 서버 저장 호출(CommonInvoker.jsp, 브라우저 대신 서버가 부른다)
 *       → checkFileStatus(파일이 보일 때까지 10초, 2초 간격) → fileReName(업로드 폴더로 옮기고 sys10_file 등록).
 * 보고서 내용은 RD 서버의 .mrd가 만든다 — 시뮬레이터는 내용 없는 가짜 파일을 쓴다(tools/rd-simulator/README.md).
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "asseterp.rd.pdf-enabled", havingValue = "true")
public class RdManlOrgPdfMaker implements ManlOrgPdfMaker {

    private static final String MRD = "Tdm42_Rd_Manual";
    private static final String OPTIONS = "/rpdflinebreak [1] /rwordbreakopt [1] /rsaveopt [2049]";
    private static final String FILE_TYPE = "pdf";
    private static final long WAIT_MILLIS = 10_000;
    private static final long CHECK_INTERVAL = 2_000;

    private final TdmManlPdfMapper pdfMapper;
    private final ManlOrgPdfSteps steps;
    private final RdService rdService;
    private final RdProperties rdProperties;
    private final SysFileService sysFileService;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    @Override
    public void make(Long manlOrgId, Long companyId, UserPrincipal user) {
        ManlOrgPdfTarget target = pdfMapper.selectPdfTarget(manlOrgId);
        if (target == null || !companyId.equals(target.companyId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (target.startDate() == null || target.exctId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "적용시작일과 임원이 있는 책무매뉴얼만 파일을 만들 수 있습니다");
        }
        steps.clearOldFiles(manlOrgId);                                       // fileCheck
        Long groupId = steps.createPrintData(target);                         // CreateTdmManlOrg
        String tempName = groupId + "_" + manlOrgId;                          // AS-IS tempFileId (임시 파일 이름)

        Map<String, String> rv = new LinkedHashMap<>();
        rv.put("groupId", String.valueOf(groupId));
        rv.put("reportCompanyId", String.valueOf(user.getCompanyId()));
        rv.put("reportPersonId", String.valueOf(user.getUserId()));
        RdUrlRes call = rdService.buildUrl(target.companyId(), target.exctId(),
                new RdUrlReq("save", MRD, OPTIONS, FILE_TYPE, tempName + "." + FILE_TYPE, rv));

        String answer = post(call.url());
        if (!(answer.equals("success") || answer.contains("성공") || answer.startsWith("success:"))) {
            log.warn("RD 서버 저장 실패 manlOrgId={} 응답={}", manlOrgId, answer);
            throw fail("RD 서버가 파일을 만들지 못했습니다");
        }

        File generated = new File(rdProperties.localDir(), tempName + "." + FILE_TYPE);
        waitForFile(generated);
        String fileNm = "책무매뉴얼(" + target.roleName() + " " + target.exctName() + ")." + FILE_TYPE;
        try {
            sysFileService.registerRdFile(generated, manlOrgId, target.locName(), fileNm, FILE_TYPE);
        } catch (IOException e) {
            log.error("RD 파일 옮기기 실패 manlOrgId={}", manlOrgId, e);
            throw fail("파일을 저장하지 못했습니다");
        }
    }

    private String post(String url) {
        try {
            HttpResponse<String> res = http.send(
                    HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(60)).POST(HttpRequest.BodyPublishers.noBody()).build(),
                    HttpResponse.BodyHandlers.ofString());
            return res.statusCode() / 100 == 2 ? res.body().trim() : "HTTP " + res.statusCode();
        } catch (IOException e) {
            log.error("RD 서버 호출 실패 url={}", rdProperties.url(), e);
            throw fail("RD 서버에 연결하지 못했습니다");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw fail("RD 서버 호출이 중단되었습니다");
        }
    }

    /** AS-IS Sys10_File.checkFileStatus: 10초 동안 2초 간격으로 파일이 생겼는지 본다 */
    private void waitForFile(File file) {
        long start = System.currentTimeMillis();
        try {
            while (true) {
                if (file.isFile()) return;
                if (System.currentTimeMillis() - start >= WAIT_MILLIS) break;
                Thread.sleep(CHECK_INTERVAL);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        throw fail("(errorCode:30) 파일세팅실패");
    }

    private static BusinessException fail(String message) {
        return new BusinessException(ErrorCode.INTERNAL_ERROR, message);
    }
}

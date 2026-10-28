package kr.co.kfs.asseterp.biz.rd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlReq;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlRes;
import kr.co.kfs.asseterp.common.config.properties.RdProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * AS-IS client/service/RDUtil.getPageName()의 서버판. 주소·dbName·저장 경로는 asseterp.rd.* 설정이고,
 * rv의 companyId·personId는 로그인 값으로 고정한다(AS-IS는 브라우저가 만들어 위조할 수 있었다).
 * 인증(URL 서명)은 RD 서버 쪽 지원이 정해져야 하므로 아직 없다 — docs/RD-대책.md
 */
@Service
@RequiredArgsConstructor
public class RdService {

    private static final Pattern NAME = Pattern.compile("[A-Za-z0-9_]{1,80}");
    private static final Pattern OPTIONS = Pattern.compile("[A-Za-z0-9 /\\[\\]_.\\-]{0,200}");
    private static final Pattern EXPORT_TYPE = Pattern.compile("[a-z]{2,5}");
    /** AS-IS가 fileName 앞에 붙이는 접두: RD가 앞에 붙이는 report 폴더를 벗어난다 */
    private static final String ESCAPE_PREFIX = "/../../../../../..";

    private final RdProperties props;

    public RdUrlRes buildUrl(UserPrincipal user, RdUrlReq req) {
        return buildUrl(user.getCompanyId(), user.getUserId(), req);
    }

    /**
     * rv의 companyId·personId를 호출한 쪽이 정한다 — 서버가 직접 RD를 부르는 곳(AS-IS 보고서의 대상 회사·사원이 로그인 사용자와 다른 경우, 예: 책무매뉴얼은 임원).
     * 브라우저에서 오는 요청은 위 메서드(로그인 값 고정)만 쓴다
     */
    public RdUrlRes buildUrl(Long companyId, Long personId, RdUrlReq req) {
        String kind = req.kind() == null ? "" : req.kind();
        if ("page".equals(kind)) return pageUrl(companyId, personId, req);
        String page;
        String dir;
        String method;
        switch (kind) {
            case "viewer" -> { page = "CommonViewer.html"; dir = "/ReportingServer/html5/RDhtml/"; method = "GET"; }
            case "download" -> { page = "CommonInvokerDownload.jsp"; dir = "/ReportingServer/jsp/"; method = "POST"; }
            case "save" -> { page = "CommonInvoker.jsp"; dir = "/ReportingServer/jsp/"; method = "POST"; }
            default -> throw invalid("kind는 viewer, download, save, page 중 하나여야 합니다");
        }
        if (req.mrd() == null || !NAME.matcher(req.mrd()).matches()) throw invalid("mrd 이름이 올바르지 않습니다");
        String options = req.options() == null ? "" : req.options();
        if (!OPTIONS.matcher(options).matches()) throw invalid("options 형식이 올바르지 않습니다");

        Map<String, String> query = new LinkedHashMap<>();
        query.put("dns", props.dns());
        query.put("mrd", req.mrd());
        if (!options.isEmpty()) query.put("options", options);
        query.put("dbName", props.dbName());
        if (!"viewer".equals(kind)) {
            if (req.exportType() == null || !EXPORT_TYPE.matcher(req.exportType()).matches()) throw invalid("exportType이 올바르지 않습니다");
            query.put("fileName", fileName(kind, req.fileName()));
            query.put("exportType", req.exportType());
        }
        query.put("rv", rv(companyId, personId, req.rv()));

        StringBuilder url = new StringBuilder(trimEnd(props.url())).append(dir).append(page).append('?');
        query.forEach((k, v) -> url.append(k).append('=').append(encode(v)).append('&'));
        url.setLength(url.length() - 1);
        return new RdUrlRes(url.toString(), method);
    }

    /**
     * 화면에 끼워 넣는 RD 페이지(AS-IS Pay10_Lookup_Rd_List.retrieve L27-54): `…/RDhtml/{mrd}.html?companyId&dbName&dns&personId&…`.
     * CommonViewer와 달리 rv[…] 묶음이 아니라 일반 쿼리 문자열이고, companyId·personId는 마찬가지로 로그인 값이다
     */
    private RdUrlRes pageUrl(Long companyId, Long personId, RdUrlReq req) {
        if (req.mrd() == null || !NAME.matcher(req.mrd()).matches()) throw invalid("mrd 이름이 올바르지 않습니다");
        Map<String, String> query = new LinkedHashMap<>();
        query.put("companyId", String.valueOf(companyId));
        query.put("dbName", props.dbName());
        query.put("dns", props.dns());
        query.put("personId", String.valueOf(personId));
        if (req.rv() != null) {
            req.rv().forEach((k, v) -> {
                if (k == null || !NAME.matcher(k).matches()) throw invalid("rv 키가 올바르지 않습니다: " + k);
                if (query.containsKey(k)) return;
                query.put(k, v == null ? "" : v);
            });
        }
        StringBuilder url = new StringBuilder(trimEnd(props.url())).append("/ReportingServer/html5/RDhtml/").append(req.mrd()).append(".html?");
        query.forEach((k, v) -> url.append(k).append('=').append(encode(v)).append('&'));
        url.setLength(url.length() - 1);
        return new RdUrlRes(url.toString(), "GET");
    }

    private String fileName(String kind, String name) {
        if (name == null || name.isBlank() || name.contains("..") || name.contains("\\") || name.startsWith("/")) {
            throw invalid("fileName이 올바르지 않습니다");
        }
        if ("download".equals(kind)) return name;
        return ESCAPE_PREFIX + trimEnd(props.saveDir()) + "/" + name;
    }

    /** rv=key[value]key[value] — companyId·personId는 로그인 값 */
    private String rv(Long companyId, Long personId, Map<String, String> given) {
        Map<String, String> rv = new LinkedHashMap<>();
        rv.put("companyId", String.valueOf(companyId));
        rv.put("personId", String.valueOf(personId));
        if (given != null) {
            given.forEach((k, v) -> {
                if (k == null || !NAME.matcher(k).matches()) throw invalid("rv 키가 올바르지 않습니다: " + k);
                if ("companyId".equals(k) || "personId".equals(k)) return;
                String value = v == null ? "" : v;
                if (value.contains("[") || value.contains("]")) throw invalid("rv 값에는 [ ]를 쓸 수 없습니다: " + k);
                rv.put(k, value);
            });
        }
        StringBuilder sb = new StringBuilder();
        rv.forEach((k, v) -> sb.append(k).append('[').append(v).append(']'));
        return sb.toString();
    }

    /** GWT URL.encodeQueryString과 같게: 공백은 %20 */
    private static String encode(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8).replace("+", "%20");
    }

    private static String trimEnd(String s) {
        return s != null && s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}

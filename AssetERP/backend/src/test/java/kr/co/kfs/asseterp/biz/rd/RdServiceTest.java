package kr.co.kfs.asseterp.biz.rd;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlReq;
import kr.co.kfs.asseterp.biz.rd.dto.RdUrlRes;
import kr.co.kfs.asseterp.biz.rd.service.RdService;
import kr.co.kfs.asseterp.common.config.properties.RdProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RdServiceTest {

    private final RdService service = new RdService(new RdProperties("http://localhost:5151/", "post_dev-devdb", "admin", "/rd", "/tmp/rd"));
    private final UserPrincipal user = mock(UserPrincipal.class);

    RdServiceTest() {
        when(user.getCompanyId()).thenReturn(28000L);
        when(user.getUserId()).thenReturn(-28656L);
    }

    @Test
    void viewerIsGetWithHtml5Path_andLoginValuesOverrideRv() {
        Map<String, String> rv = new LinkedHashMap<>();
        rv.put("companyId", "1");      // 위조 시도
        rv.put("transDate", "2026-10-01");
        RdUrlRes res = service.buildUrl(user, new RdUrlReq("viewer", "Emp01_Rd_PersonState", "/rhtmlimportopt [2]", null, null, rv));
        assertEquals("GET", res.method());
        assertEquals("http://localhost:5151/ReportingServer/html5/RDhtml/CommonViewer.html?dns=admin&mrd=Emp01_Rd_PersonState"
                + "&options=%2Frhtmlimportopt%20%5B2%5D&dbName=post_dev-devdb"
                + "&rv=companyId%5B28000%5DpersonId%5B-28656%5DtransDate%5B2026-10-01%5D", res.url());
    }

    @Test
    void saveUsesJspAndPrefixesSaveDirWithEscape() {
        RdUrlRes res = service.buildUrl(user, new RdUrlReq("save", "Ics15_Rd_ChecklistDetail", null, "pdf", "a b.pdf", Map.of()));
        assertEquals("POST", res.method());
        assertEquals("http://localhost:5151/ReportingServer/jsp/CommonInvoker.jsp?dns=admin&mrd=Ics15_Rd_ChecklistDetail&dbName=post_dev-devdb"
                + "&fileName=%2F..%2F..%2F..%2F..%2F..%2F..%2Frd%2Fa%20b.pdf&exportType=pdf&rv=companyId%5B28000%5DpersonId%5B-28656%5D", res.url());
    }

    @Test
    void downloadKeepsFileName() {
        RdUrlRes res = service.buildUrl(user, new RdUrlReq("download", "Biz01_Rd_CardContentsDownload", null, "xlsx", "법인카드.xlsx", Map.of("dataYm", "2026.10")));
        assertEquals("POST", res.method());
        assertEquals(true, res.url().contains("/ReportingServer/jsp/CommonInvokerDownload.jsp?"));
        assertEquals(true, res.url().contains("fileName=%EB%B2%95%EC%9D%B8%EC%B9%B4%EB%93%9C.xlsx"));
    }

    @Test
    void rejectsBadInput() {
        assertThrows(BusinessException.class, () -> service.buildUrl(user, new RdUrlReq("other", "X", null, null, null, null)));
        assertThrows(BusinessException.class, () -> service.buildUrl(user, new RdUrlReq("viewer", "../x", null, null, null, null)));
        assertThrows(BusinessException.class, () -> service.buildUrl(user, new RdUrlReq("save", "X", null, "pdf", "../../etc/p.pdf", null)));
        assertThrows(BusinessException.class, () -> service.buildUrl(user, new RdUrlReq("save", "X", null, "pdf", "/abs.pdf", null)));
        assertThrows(BusinessException.class, () -> service.buildUrl(user, new RdUrlReq("viewer", "X", null, null, null, Map.of("k", "a]b[c"))));
        assertThrows(BusinessException.class, () -> service.buildUrl(user, new RdUrlReq("download", "X", null, "PDF;", "a.pdf", null)));
    }
}

package kr.co.kfs.asseterp.biz.biz;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPromoMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.biz.service.BizCardRdPdfService;
import kr.co.kfs.asseterp.biz.rd.service.RdFileSaver;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.File;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * #1131 [상신] RD 첨부 PDF (CH-0112, AS-IS Sys99_Print.insertRdCardSimple + Biz01_Rd_CardSimple + cardFileSetting).
 * 출력 자료는 asseterpdb에서 돌리고 롤백한다(서비스를 직접 만들어 REQUIRES_NEW 없이 시험 트랜잭션 안에서). RD 서버·파일 등록은 가짜로 바꾼다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BizCardRdPdfDbTest {

    private static final long APPR = 9_999_000_001L;
    private static final String TITLE = "[법인카드] 2025년 10월 지출결의 승인 요청의건";

    @Autowired BizPromoMapper promoMapper;
    @Autowired BizRelateApprMapper relateMapper;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(202306221546363L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    private List<Long> ids() {
        return jdbc.queryForList("select biz01_promo_id from biz01_promo where biz01_company_id = 28000 and biz01_real_person_id = 202306221546363"
                + " and biz01_card_data_id is not null order by 1 desc limit 3", Long.class);
    }

    @Test
    void 고른_내역만_출력자료로_쌓인다() {
        BizCardRdPdfService svc = new BizCardRdPdfService(promoMapper, relateMapper, mock(RdFileSaver.class), mock(SysFileService.class));
        List<Long> ids = ids();
        assertThat(ids).hasSize(3);

        long groupId = svc.insertRdCardSimple(user, ids);

        Integer rows = jdbc.queryForObject("select count(*) from sys99_print where sys99_group_id = ? and sys99_window_class_nm = 'Biz01_Tab_Card_Simple'"
                + " and sys99_person_id = 202306221546363 and sys99_string02 is not null and sys99_string08 is not null and sys99_date01 is not null", Integer.class, groupId);
        assertThat(rows).isEqualTo(3);

        // 다른 회사 사용자로는 같은 내역이 안 쌓인다
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).roles(List.of("ROLE_USER")).build();
        long otherGroup = svc.insertRdCardSimple(other, ids);
        assertThat(jdbc.queryForObject("select count(*) from sys99_print where sys99_group_id = ?", Integer.class, otherGroup)).isZero();
    }

    @Test
    void RD가_만든_PDF를_요약_제목으로_결재에_붙인다() throws Exception {
        RdFileSaver rd = mock(RdFileSaver.class);
        SysFileService sysFile = mock(SysFileService.class);
        File pdf = Files.createTempFile("card-rd-", ".pdf").toFile();
        pdf.deleteOnExit();
        when(rd.save(eq(user), eq("Biz01_Rd_CardSimple"), eq("/rpdflinebreak [1]"), eq("pdf"), eq("card_123"),
                eq(Map.of("rdGroupId", "123", "companyId", "28000", "personId", "202306221546363")))).thenReturn(Optional.of(pdf));
        when(sysFile.registerRdFile(eq(pdf), eq(APPR), anyString(), eq("(요약) " + TITLE + ".pdf"), eq("pdf"))).thenReturn(77L);

        BizCardRdPdfService svc = new BizCardRdPdfService(promoMapper, relateMapper, rd, sysFile);
        assertThat(svc.attach(user, 123L, APPR, TITLE)).contains(77L);
    }

    @Test
    void RD가_꺼졌거나_실패하면_첨부없이_넘어간다() throws Exception {
        RdFileSaver rd = mock(RdFileSaver.class);
        SysFileService sysFile = mock(SysFileService.class);
        when(rd.save(any(), anyString(), anyString(), anyString(), anyString(), any())).thenReturn(Optional.empty());

        BizCardRdPdfService svc = new BizCardRdPdfService(promoMapper, relateMapper, rd, sysFile);
        assertThat(svc.attach(user, 123L, APPR, TITLE)).isEmpty();
        verify(sysFile, never()).registerRdFile(any(), anyLong(), anyString(), anyString(), anyString());
    }
}

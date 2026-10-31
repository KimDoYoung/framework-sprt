package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.CarJournalLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.EachContLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.mapper.CarJournalApprMapper;
import kr.co.kfs.asseterp.biz.car.service.CarJournalApprService;
import kr.co.kfs.asseterp.biz.car.service.CarJournalPdfService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V35 A16 차량 운행일지 · C01 계약사관리(개별계약서) 결재창 제목·본문과 상신 행·결재 ID 기록을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, CarJournalLinkSeedProvider.class, EachContLinkSeedProvider.class, FormMappingLinkSeedSupport.class, CarJournalApprService.class})
class AprCarEachContLinkSeedDbTest {

    private static final long INFO = 202207080259701L;
    private static final long CONTRACT = 202303241435917L;
    /** 첨부 한 개(202509269074090)가 붙어 있는 부모 번호 — 상신 행 번호로 써서 첨부 연결을 시험한다 */
    private static final long PARENT_WITH_FILE = 202509269074089L;
    private static final long FILE = 202509269074090L;
    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired CarJournalApprService apprService;
    @Autowired CarJournalApprMapper mapper;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean CarJournalPdfService pdfService;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private static UserPrincipal other() {
        return UserPrincipal.builder().userId(1L).companyId(1L).name("x").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 상신_행을_만들면_결재창이_제목_차량_운행일지로_열린다() {
        Long relateApprId = apprService.createRelateAppr(user(), INFO, "2025.09");
        assertThat(jdbc.queryForObject("select count(*) from car05_relate_appr where car05_relate_appr_id = ? and car05_info_id = ? and car05_yyyymm = '2025.09'", Integer.class, relateApprId, INFO)).isEqualTo(1);
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A16", relateApprId);
        assertThat(res.title()).isEqualTo("차량 운행일지");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).isNull();   // 대표 양식을 쓴다
    }

    @Test
    void 다른_회사나_없는_상신_행이면_결재창을_열_수_없다() {
        Long relateApprId = apprService.createRelateAppr(user(), INFO, "2025.09");
        assertThrows(BusinessException.class, () -> seedService.seed(other(), 1L, "A16", relateApprId));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A16", -1L));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A16", null));
    }

    @Test
    void 결재문서_ID를_기록하고_PDF_첨부를_문서에_한_번만_연결한다() {
        mapper.insertRelateAppr(PARENT_WITH_FILE, 28000L, "2025.09", INFO);
        apprService.updateApprId(user(), PARENT_WITH_FILE, 99L);
        apprService.updateApprId(user(), PARENT_WITH_FILE, 99L);
        assertThat(jdbc.queryForObject("select car05_appr_id from car05_relate_appr where car05_relate_appr_id = ?", Long.class, PARENT_WITH_FILE)).isEqualTo(99L);
        assertThat(jdbc.queryForObject("select count(*) from sys11_relate_file where sys11_file_id = ? and sys11_parent_id = 99 and sys11_parent_table = 'apr01_appr'", Integer.class, FILE)).isEqualTo(1);
        assertThrows(BusinessException.class, () -> apprService.updateApprId(other(), PARENT_WITH_FILE, 98L));
    }

    @Test
    void 개별계약서는_계약사_이름으로_제목을_만들고_양식이_없으면_대표_양식을_쓴다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "C01", CONTRACT);
        assertThat(res.title()).endsWith("(주) 일반사무관리 업무위탁 개별계약의 건");
        assertThat(res.title()).doesNotStartWith("null");
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.saveVisible()).isFalse();
    }

    @Test
    void 개별계약서는_다른_회사나_없는_행이면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(other(), 1L, "C01", CONTRACT));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "C01", -1L));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "C01", null));
    }
}

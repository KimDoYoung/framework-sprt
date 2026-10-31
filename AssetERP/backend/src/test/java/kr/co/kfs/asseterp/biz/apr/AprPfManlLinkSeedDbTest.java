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

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport;
import kr.co.kfs.asseterp.biz.apr.service.link.ManlOrgLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.PfContractLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.est.mapper.EstPfContractMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlOrgMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V21 A60·A61 용역계약 · A93 책무매뉴얼 보고 결재창 제목·본문과 결재 ID 기록을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, PfContractLinkSeedProvider.class, ManlOrgLinkSeedProvider.class, FormMappingLinkSeedSupport.class})
class AprPfManlLinkSeedDbTest {

    /** 수수료 010, 수행내역 2건 / 수수료 020, 수행내역 3건 */
    private static final long PF_010 = 202504032256688L;
    private static final long PF_020 = 202504092260018L;
    private static final long MANL_ORG = 202510259141089L;
    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired EstPfContractMapper pfMapper;
    @Autowired TdmManlOrgMapper manlMapper;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 용역수행_계획서는_양식의_태그를_계약_값으로_바꾼다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A60", PF_010);
        String site = jdbc.queryForObject("select est02_project_site_nm from est02_pf_contract where est02_pf_contract_id = ?", String.class, PF_010);
        assertThat(res.title()).isEqualTo("용역수행 계획서 (" + site + ")");
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("차주명1").doesNotContain("#{용역수행회사}").doesNotContain("#{사업장명}").doesNotContain("#{용역 수행기간}").contains(" ~ ");
    }

    @Test
    void 결과보고서는_수행내역_표를_넣는다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A61", PF_020);
        assertThat(res.title()).startsWith("용역 결과보고서 (");
        assertThat(res.content()).contains("<th>연번</th>").contains("<th>담당부서</th>").doesNotContain("#{용역 수행내역}").doesNotContain("#{첨부파일}");
        int rows = res.content().split("<tr><td>", -1).length - 1;
        assertThat(rows).isEqualTo(3);
    }

    @Test
    void 책무매뉴얼_보고는_사내문서로_고정한다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A93", MANL_ORG);
        String org = jdbc.queryForObject("select f_org_nm(tdm42_org_id, f_sysdate()) from tdm42_manl_org where tdm42_manl_org_id = ?", String.class, MANL_ORG);
        String role = jdbc.queryForObject("select tdm20_role_nm from tdm42_manl_org o join tdm20_role r on r.tdm20_role_id = o.tdm42_role_id where tdm42_manl_org_id = ?", String.class, MANL_ORG);
        assertThat(res.title()).isEqualTo("책무매뉴얼_" + org + "(" + role + ")");
        assertThat(res.content()).isEqualTo(role + " " + org + " 책무매뉴얼을 보고합니다.");
        assertThat(res.inOutTypeCode()).isEqualTo("20");
        assertThat(res.titleReadOnly()).isTrue();
    }

    @Test
    void 없는_행은_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A60", -1L));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A61", null));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A93", -1L));
    }

    @Test
    void 결재_ID_기록은_로그인_회사_행만() {
        assertThat(pfMapper.updatePlanApprId(28000L, PF_010, 1L)).isEqualTo(1);
        assertThat(pfMapper.updateResultApprId(28000L, PF_010, 2L)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select est02_plan_appr_id from est02_pf_contract where est02_pf_contract_id = ?", Long.class, PF_010)).isEqualTo(1L);
        assertThat(jdbc.queryForObject("select est02_result_appr_id from est02_pf_contract where est02_pf_contract_id = ?", Long.class, PF_010)).isEqualTo(2L);
        assertThat(pfMapper.updatePlanApprId(1L, PF_010, 9L)).isZero();
        assertThat(manlMapper.updateApprId(MANL_ORG, 28000L, 3L)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select tdm42_appr_id from tdm42_manl_org where tdm42_manl_org_id = ?", Long.class, MANL_ORG)).isEqualTo(3L);
        assertThat(manlMapper.updateApprId(MANL_ORG, 1L, 3L)).isZero();
    }
}

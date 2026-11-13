package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.CheckJobLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.RoleAllcLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.RoleDescLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.RoleDigmLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmApprLinkMapper;
import kr.co.kfs.asseterp.biz.tdm.service.TdmApprLinkService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V34 책무 결재 상신 A90·A91·A92·A94 결재창 제목·본문과 결재 ID 기록·첨부 연결을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, RoleAllcLinkSeedProvider.class, RoleDescLinkSeedProvider.class, RoleDigmLinkSeedProvider.class,
        CheckJobLinkSeedProvider.class, TdmApprLinkService.class})
class AprTdmLinkSeedDbTest {

    /** 책무배분 상세(2026-07-02 TEST본부장)·책무기술서(나필순)·책무체계도(2026-07-02)·이행점검 작업(2026.11, 점검시작일 2026-08-05)·보고CEO 직책(대표이사(경영)) */
    private static final long DETAIL = 202606229765137L;
    private static final long DESC = 202606229765225L;
    private static final long DIGM = 202606229765354L;
    private static final long JOB = 202608059819878L;
    private static final long CEO_ROLE = 202507250000034L;
    /** 올린 파일(fileType 2) 정보가 한 건이고 첨부 한 개가 붙은 책무체계도 */
    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired TdmApprLinkService linkService;
    @Autowired TdmApprLinkMapper linkMapper;
    @Autowired JdbcTemplate jdbc;

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
    void 임원책무동의서는_직책별_책무_세부내용_표를_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A90", DETAIL);
        assertThat(res.title()).startsWith("임원책무동의서_").endsWith("(TEST본부장)");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("본인의 책무를 확인하였으며, 이에 동의합니다.").contains(">책무<").contains(">책무 세부내용<");
        // 빈 칸 20개 첫 줄 + 동의 줄 + 빈 줄 + 머리 줄 = 4줄 이상 (책무 행은 그 뒤)
        assertThat(res.content().split("<tr>", -1).length - 1).isGreaterThan(4);
    }

    @Test
    void 책무기술서는_임원의_직책별_책무_표를_만들고_제목은_읽기전용이다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A91", DESC);
        assertThat(res.title()).isEqualTo("임원별 책무기술서(리스크관리본부장 나필순)");
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.content()).contains("「금융회사의 지배구조에 관한 법률」에 의거하여 작성한 책무기술서 승인을 요청드립니다.")
                .contains("1. 임원 : 나필순").contains("2. 직책별 책무").contains(">직책<").contains(">겸직여부<").contains(">책무<");
    }

    @Test
    void 책무체계도는_기준일의_직책_임원_직위_겸직여부_표를_만들고_제목을_고칠_수_있다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A92", DIGM);
        assertThat(res.title()).isEqualTo("책무체계도");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.content()).contains("책무체계도 승인을 요청드립니다.").contains(">직책<").contains(">임원<").contains(">직위<").contains(">겸직여부<");
        // 안내 줄 + 빈 줄 + 머리 줄 + 배분 15행 (2026-07-02 기준)
        assertThat(res.content().split("<tr>", -1).length - 1).isEqualTo(3 + 15);
    }

    @Test
    void 이행점검보고서는_점검시작월과_보고CEO_직책으로_제목을_만들고_현황_표를_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A94", JOB, Map.of("roleId", String.valueOf(CEO_ROLE)));
        assertThat(res.title()).isEqualTo("2026년 08월 책무 이행 점검 보고서_대표이사(경영)");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.content()).contains("2026년 08월 책무 이행 점검 보고서를 제출합니다.").contains(">합 계<").contains(">점검상태<");
        // 안내 3줄 + 머리 2줄 + 현황 3행 + 합계 1줄
        assertThat(res.content().split("<tr>", -1).length - 1).isEqualTo(3 + 2 + 3 + 1);
    }

    @Test
    void 이행점검보고서는_직책이_없으면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A94", JOB));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A94", JOB, Map.of()));
    }

    @Test
    void 다른_회사_행이나_없는_행이면_열_수_없다() {
        for (String code : List.of("A90", "A91", "A92")) {
            long ref = code.equals("A90") ? DETAIL : code.equals("A91") ? DESC : DIGM;
            assertThrows(BusinessException.class, () -> seedService.seed(other(), 1L, code, ref));
            assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, code, -1L));
        }
        assertThrows(BusinessException.class, () -> seedService.seed(other(), 1L, "A94", JOB, Map.of("roleId", String.valueOf(CEO_ROLE))));
    }

    @Test
    void 결재문서_ID는_로그인_회사_행에만_기록된다() {
        linkService.updateRoleAllcDetailApprId(user(), DETAIL, 1L);
        assertThat(jdbc.queryForObject("select tdm34_appr_id from tdm34_role_allc_detail where tdm34_role_allc_detail_id = ?", Long.class, DETAIL)).isEqualTo(1L);
        linkService.updateRoleDescApprId(user(), DESC, 2L);
        assertThat(jdbc.queryForObject("select tdm31_appr_id from tdm31_role_desc where tdm31_role_desc_id = ?", Long.class, DESC)).isEqualTo(2L);
        linkService.updateRoleDigmApprId(user(), DIGM, 3L);
        assertThat(jdbc.queryForObject("select tdm32_appr_id from tdm32_role_digm where tdm32_role_digm_id = ?", Long.class, DIGM)).isEqualTo(3L);
        assertThrows(BusinessException.class, () -> linkService.updateRoleAllcDetailApprId(other(), DETAIL, 1L));
        assertThrows(BusinessException.class, () -> linkService.updateRoleDescApprId(other(), DESC, 1L));
        assertThrows(BusinessException.class, () -> linkService.updateRoleDigmApprId(other(), DIGM, 1L));
    }

    @Test
    void 책무기술서_작업중_표시는_켜고_끈다() {
        linkService.updateRoleDescWorkDate(user(), DESC, true);
        assertThat(jdbc.queryForObject("select tdm31_work_date is not null from tdm31_role_desc where tdm31_role_desc_id = ?", Boolean.class, DESC)).isTrue();
        linkService.updateRoleDescWorkDate(user(), DESC, false);
        assertThat(jdbc.queryForObject("select tdm31_work_date is null from tdm31_role_desc where tdm31_role_desc_id = ?", Boolean.class, DESC)).isTrue();
    }

    @Test
    void 책무체계도는_올린_파일이_한_건이면_그_파일을_쓰고_첨부를_문서에_연결한다() {
        // 사용자가 올린 파일 정보(fileType 2)가 딱 한 건이고 실제 파일이 붙은 책무체계도를 DB에서 고른다(자료는 DB 사본마다 다르다)
        List<java.util.Map<String, Object>> picks = jdbc.queryForList("""
                select tdm32_role_digm_id as digm, tdm32_company_id as company, min(tdm33_role_digm_file_id) as info
                  from tdm32_role_digm join tdm33_role_digm_file on tdm33_role_digm_id = tdm32_role_digm_id and tdm33_file_type = '2'
                 group by 1, 2 having count(*) = 1 order by 1 desc""");
        for (var p : picks) {
            long digm = ((Number) p.get("digm")).longValue();
            List<Long> files = linkMapper.selectFileIds(((Number) p.get("info")).longValue());
            if (files.isEmpty()) continue;
            UserPrincipal owner = UserPrincipal.builder().userId(29049L).companyId(((Number) p.get("company")).longValue()).name("시험").roles(List.of("ROLE_USER")).build();
            assertThat(linkService.readyRoleDigmAppr(owner, digm)).isEqualTo("2");
            assertThat(jdbc.queryForObject("select tdm32_use_file_type from tdm32_role_digm where tdm32_role_digm_id = ?", String.class, digm)).isEqualTo("2");
            linkService.updateRoleDigmApprId(owner, digm, 99L);
            linkService.updateRoleDigmApprId(owner, digm, 99L);   // 두 번 해도 한 번만 연결
            for (Long fileId : files) {
                assertThat(jdbc.queryForObject("select count(*) from sys11_relate_file where sys11_file_id = ? and sys11_parent_id = 99 and sys11_parent_table = 'apr01_appr'", Integer.class, fileId)).isEqualTo(1);
            }
            return;
        }
        throw new IllegalStateException("올린 파일이 한 건인 책무체계도가 DB에 없다");
    }

    @Test
    void 시스템_생성_파일_정보가_없으면_책무체계도는_만들어_두고_구분_1로_기록한다() {
        assertThat(linkService.readyRoleDigmAppr(user(), DIGM)).isEqualTo("1");
        assertThat(jdbc.queryForObject("select count(*) from tdm33_role_digm_file where tdm33_role_digm_id = ? and tdm33_file_type = '1'", Integer.class, DIGM)).isEqualTo(1);
        assertThat(linkService.readyRoleDigmAppr(user(), DIGM)).isEqualTo("1");
        assertThat(jdbc.queryForObject("select count(*) from tdm33_role_digm_file where tdm33_role_digm_id = ? and tdm33_file_type = '1'", Integer.class, DIGM)).isEqualTo(1);
    }

    @Test
    void 이행점검_상신은_연결을_기록한다() {
        linkService.insertCheckRelateAppr(user(), JOB, CEO_ROLE, 77L);
        assertThat(jdbc.queryForObject("select count(*) from tdm56_chck_relate_appr where tdm56_relate_table_id = ? and tdm56_appr_id = 77 and tdm56_ceo_role_id = ?", Integer.class, JOB, CEO_ROLE)).isEqualTo(1);
        assertThrows(BusinessException.class, () -> linkService.insertCheckRelateAppr(other(), JOB, CEO_ROLE, 77L));
    }
}

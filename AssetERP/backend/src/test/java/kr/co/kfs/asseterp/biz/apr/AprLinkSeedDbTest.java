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
import kr.co.kfs.asseterp.biz.apr.service.link.EtcLeaveLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpEtcLeaveService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V17 링크코드 결재창의 제목·본문(A25 포상휴가)을 asseterpdb에서 읽는다 (읽기 전용) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, EtcLeaveLinkSeedProvider.class, EmpEtcLeaveService.class})
class AprLinkSeedDbTest {

    @Autowired AprLinkSeedService service;
    @Autowired EmpEtcLeaveService etcLeaveService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 포상휴가_제목과_본문을_만든다() {
        Long etcLeaveId = jdbc.queryForObject("select max(emp22_etc_leave_id) from emp22_etc_leave where emp22_company_id = 28000", Long.class);
        Long classTreeId = jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = 202609229873969", Long.class);
        AprLinkSeedRes res = service.seed(user(), classTreeId, "A25", etcLeaveId);
        assertThat(res.title()).startsWith("포상휴가 품의서 (").contains(" ~ ").endsWith("일)");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.effectDate()).isNotNull();
        assertThat(res.content()).startsWith("<table border=2").contains("- 사유 : ").contains("- 사용기간 : ").contains("사원명").endsWith("</tbody></table>");
        String person = jdbc.queryForObject("select f_emp_kor_nm(emp23_person_id) from emp23_etc_leave_person where emp23_etc_leave_id = ? limit 1", String.class, etcLeaveId);
        assertThat(res.content()).contains(person);
    }

    @Test
    void 없는_행과_모르는_링크코드는_열_수_없다() {
        assertThrows(BusinessException.class, () -> service.seed(user(), 1L, "A25", -1L));
        assertThrows(BusinessException.class, () -> service.seed(user(), 1L, "ZZZ", 1L));
    }

    /** 테스트 트랜잭션은 끝나면 롤백된다(03 원칙 2) */
    @Test
    void 상신_문서_ID를_포상휴가_행에_기록한다() {
        Long etcLeaveId = jdbc.queryForObject("select max(emp22_etc_leave_id) from emp22_etc_leave where emp22_company_id = 28000", Long.class);
        etcLeaveService.updateApprId(user(), etcLeaveId, 202609229873969L);
        Long apprId = jdbc.queryForObject("select emp22_appr_id from emp22_etc_leave where emp22_etc_leave_id = ?", Long.class, etcLeaveId);
        assertThat(apprId).isEqualTo(202609229873969L);
        assertThrows(BusinessException.class, () -> etcLeaveService.updateApprId(user(), -1L, 1L));
    }
}

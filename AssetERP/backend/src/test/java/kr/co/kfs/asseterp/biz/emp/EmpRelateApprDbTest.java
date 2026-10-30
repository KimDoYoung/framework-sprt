package kr.co.kfs.asseterp.biz.emp;

import kr.co.kfs.asseterp.biz.act.service.ActRealAccountMapService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprStatusRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpRelateApprService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** U06(여비교통비 관리)의 마감·상신 행 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 (@MybatisTest는 테스트마다 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpRelateApprService.class, ActRealAccountMapService.class})
class EmpRelateApprDbTest {

    @Autowired EmpRelateApprService service;
    @Autowired ActRealAccountMapService accounts;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 마감과_마감취소는_기준년월_전체를_바꾼다() {
        List<RelateApprRes> before = service.search(user, "2025.04");
        assertThat(before).isNotEmpty().allMatch(r -> "true".equals(r.closeYn()) && "마감".equals(r.closeName()));

        int n = jdbc.queryForObject("select count(*) from emp51_relate_appr where emp51_company_id = 28000 and emp51_yyyymm = '2025.04'", Integer.class);
        assertThat(service.updateCloseYn(user, "2025.04", false)).isEqualTo(n);
        assertThat(service.search(user, "2025.04")).allMatch(r -> "false".equals(r.closeYn()) && r.closeName().isEmpty());
        assertThat(service.updateCloseYn(user, "2025.04", true)).isEqualTo(n);
        assertThat(service.search(user, "2025.04")).allMatch(r -> "true".equals(r.closeYn()));
        // 다른 기준년월은 건드리지 않는다
        assertThat(service.search(user, "2025.03")).allMatch(r -> "true".equals(r.closeYn()));
    }

    @Test
    void 상신_행은_정확히_한_건일_때만_보인다() {
        RelateApprStatusRes st = service.getStatus(user, "2025.04");
        assertThat(st.statusCode()).isEqualTo("30");
        assertThat(service.getApprId(user, "2025.04")).isEqualTo(st.apprId());
        assertThat(service.getStatus(user, "2099.01")).isNull();
        assertThatThrownBy(() -> service.getApprId(user, "2099.01")).isInstanceOf(BusinessException.class);
    }

    @Test
    void 상신_행_만들기는_이미_있으면_지우고_새로_만든다() {
        Long old = service.getStatus(user, "2025.04").relateApprId();
        Long created = service.createStatus(user, "2025.04");
        assertThat(created).isNotEqualTo(old);
        assertThat(jdbc.queryForObject("select count(*) from emp52_relate_appr where emp52_relate_appr_id = ?", Integer.class, old)).isZero();
        assertThat(service.getStatus(user, "2025.04").relateApprId()).isEqualTo(created);

        Long fresh = service.createStatus(user, "2099.01");
        assertThat(service.getStatus(user, "2099.01").statusCode()).isNull();  // 결재 문서 ID가 아직 없다
        service.updateApprId(user, fresh, 202505072272328L);
        assertThat(jdbc.queryForObject("select emp52_appr_id from emp52_relate_appr where emp52_relate_appr_id = ?", Long.class, fresh)).isEqualTo(202505072272328L);
        assertThatThrownBy(() -> service.updateApprId(user, -1L, 1L)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 여비교통비_계정과목() {
        assertThat(accounts.getAccountName(user, "5805", "9540039900")).isEqualTo("여비교통비");
        assertThat(accounts.getAccountName(user, "5805", "없음")).isEmpty();
    }
}

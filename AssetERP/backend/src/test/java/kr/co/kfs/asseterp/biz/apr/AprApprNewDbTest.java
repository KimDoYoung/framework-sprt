package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprNewRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewStepRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprNewService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;

/** V06 새 문서 열기·기본 결재선을 asseterpdb에서 읽는다 (읽기 전용) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(AprApprNewService.class)
class AprApprNewDbTest {

    @Autowired AprApprNewService service;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 기본_결재선은_상신자로_시작하고_조직장_순으로_이어진다() {
        Long classTreeId = jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = 202609229873969", Long.class);
        AprApprNewRes res = service.open(user(29049L), classTreeId);
        assertThat(res.apprId()).isNotNull();
        assertThat(res.statusCode()).isEqualTo("10");
        assertThat(res.regEmpId()).isEqualTo(29049L);
        assertThat(res.signCompany()).isNotBlank();
        assertThat(res.classTreeFullName()).isEqualTo("경영관리/휴가/휴가신청서");
        List<AprNewStepRes> steps = res.steps();
        assertThat(steps).isNotEmpty();
        assertThat(steps.get(0).stepTypeCode()).isEqualTo("00");
        assertThat(steps.get(0).stepTypeName()).isEqualTo("상신");
        assertThat(steps.get(0).stepEmpId()).isEqualTo(29049L);
        assertThat(steps.get(0).seq()).isEqualTo("001");
        assertThat(steps.get(0).stepApprName()).contains("(");
        assertThat(steps.stream().map(AprNewStepRes::stepEmpId).distinct().count()).isEqualTo(steps.size());
        steps.stream().skip(1).filter(s -> "10".equals(s.stepTypeCode())).forEach(s -> assertThat(s.stepStatusCode()).isEqualTo("10"));
    }

    @Test
    void 없는_문서분류는_열_수_없다() {
        org.junit.jupiter.api.Assertions.assertThrows(kr.co.kfs.asseterp.common.error.BusinessException.class, () -> service.open(user(29035L), -1L));
    }
}

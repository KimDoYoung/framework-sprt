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
import kr.co.kfs.asseterp.biz.apr.service.link.JointLeaveLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.TransportMngLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpJointLeaveMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V23 A24 공동연차관리 · A43 여비교통비 관리 결재창 제목·본문·연관문서와 결재 ID 기록을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, JointLeaveLinkSeedProvider.class, TransportMngLinkSeedProvider.class})
class AprJointTransportLinkSeedDbTest {

    private static final long JOINT = 202506172335266L;
    private static final long JOINT_2 = 202301090935150L;
    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired EmpJointLeaveMapper jointMapper;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 공동연차_품의서는_고른_줄을_표로_넣는다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A24", null, Map.of("ids", JOINT + "," + JOINT_2));
        assertThat(res.title()).isEqualTo("공동연차 품의서");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("아래와 같이 품의하오니").contains("2025-05-01").contains("2025-05-02").contains("테스트").contains("연말").contains("2023-12-29");
        assertThat(res.content().split("<tr>", -1).length - 1).isEqualTo(6 + 2);
    }

    @Test
    void 공동연차_ID_없으면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A24", null, Map.of()));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A24", null, Map.of("ids", "-1")));
    }

    @Test
    void 공동연차_결재_ID_기록은_로그인_회사_행만() {
        assertThat(jointMapper.updateApprId(28000L, JOINT, 7L)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select emp24_appr_id from emp24_joint_leave where emp24_joint_leave_id = ?", Long.class, JOINT)).isEqualTo(7L);
        assertThat(jointMapper.updateApprId(1L, JOINT, 8L)).isZero();
    }

    @Test
    void 여비교통비_관리는_그_달_신청서를_표와_연관문서로_넣는다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A43", null, Map.of("yyyymm", "2024.08", "accountName", "국내교통비"));
        assertThat(res.title()).isEqualTo("24년도 08월분 직원경비 내역 (여비교통비)");
        assertThat(res.effectDate().toString()).isEqualTo("2024-08-31");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("지 출 결 의 서").contains("2. 계정과목 : 국내교통비").contains("2024.08.01 ~ 2024.08.31").contains("102,800원").contains("# 상세내역은 연관문서 참조");
        assertThat(res.relateApprs()).hasSize(3);
        Integer rows = jdbc.queryForObject("select count(*) from emp51_relate_appr r join apr01_appr a on a.apr01_appr_id = emp51_appr_id where emp51_company_id = 28000 and emp51_yyyymm = '2024.08' and apr01_status_cd in ('10','20','30')", Integer.class);
        assertThat(rows).isEqualTo(3);
        // 신청번호(숫자) 순
        List<Long> regNos = res.relateApprs().stream().map(r -> jdbc.queryForObject("select emp51_reg_no from emp51_relate_appr where emp51_appr_id = ? and emp51_company_id = 28000", Long.class, r.targetApprId())).toList();
        assertThat(regNos).isSorted();
    }

    @Test
    void 여비교통비_관리는_기준월이_없거나_내용이_없으면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A43", null, Map.of()));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A43", null, Map.of("yyyymm", "1999.01")));
    }
}

package kr.co.kfs.asseterp.biz.emp;

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

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveApprReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpUnLeaveApprService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V39 미사용 연차·월차 [상신] 결재문서 일괄 생성을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(EmpUnLeaveApprService.class)
class EmpUnLeaveApprDbTest {

    private static final long CLASS_TREE = 30451L;
    private static final long REG_EMP = 29025L;              // 연차 행 ...367의 사원 본인
    private static final long YEAR_SELF = 202503172154367L;  // 사원 29025
    private static final long YEAR_OTHER = 202503172154368L; // 사원 29053
    private static final long MONTH_03 = 202407051722773L;
    private static final long MONTH_04 = 202407051722802L;
    private static final long MONTH_05 = 202407051722803L;
    private static final long MONTH_06 = 202407051722804L;

    @Autowired EmpUnLeaveApprService service;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(REG_EMP).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Map<String, Object> appr(long unLeaveId) {
        return jdbc.queryForMap("select a.apr01_appr_id, a.apr01_title, a.apr01_content, a.apr01_status_cd, a.apr01_inout_cd, a.apr01_class_tree_id, a.apr01_reg_emp_id "
                + "from emp21_un_leave u join apr01_appr a on a.apr01_appr_id = u.emp21_appr_id where u.emp21_un_leave_id = ?", unLeaveId);
    }

    private int steps(Object apprId) {
        return jdbc.queryForObject("select count(*) from apr04_appr_step where apr04_appr_id = ?", Integer.class, apprId);
    }

    @Test
    void 연차_상신은_사원마다_결재완료_문서와_결재선을_만든다() {
        int n = service.createYear(user(), new UnLeaveApprReq("2025", CLASS_TREE, List.of(YEAR_SELF, YEAR_OTHER)));
        assertThat(n).isEqualTo(2);

        Map<String, Object> self = appr(YEAR_SELF);
        assertThat((String) self.get("apr01_title")).startsWith("미사용 연차유급휴가일수 통지서_");
        assertThat((String) self.get("apr01_content")).contains("미사용 연차유급휴가일수 통지서", "[관련법령 : 근로기준법 제 61조]", "의무사용연차<br>(B=A*100%)");
        assertThat(self.get("apr01_status_cd")).isEqualTo("30");
        assertThat(self.get("apr01_inout_cd")).isEqualTo("20");
        assertThat(((Number) self.get("apr01_class_tree_id")).longValue()).isEqualTo(CLASS_TREE);
        assertThat(((Number) self.get("apr01_reg_emp_id")).longValue()).isEqualTo(REG_EMP);
        // 본인이 상신자면 상신 단계만, 다른 사원이면 참조 단계가 하나 더
        assertThat(steps(self.get("apr01_appr_id"))).isEqualTo(1);
        assertThat(steps(appr(YEAR_OTHER).get("apr01_appr_id"))).isEqualTo(2);
        assertThat(jdbc.queryForObject("select apr04_step_type_cd from apr04_appr_step where apr04_appr_id = ? and apr04_seq = '20'",
                String.class, appr(YEAR_OTHER).get("apr01_appr_id"))).isEqualTo("30");
    }

    @Test
    void 월차_상신은_구분마다_통지서와_지정통보서를_만든다() {
        int n = service.createMonth(user(), new UnLeaveApprReq("2024", CLASS_TREE, List.of(MONTH_03, MONTH_04, MONTH_05, MONTH_06)));
        assertThat(n).isEqualTo(4);

        assertThat((String) appr(MONTH_03).get("apr01_title")).startsWith("미사용 월차유급휴가일수 통지서_");
        assertThat((String) appr(MONTH_05).get("apr01_title")).startsWith("미사용 월차유급휴가일수 통지서_");
        assertThat((String) appr(MONTH_03).get("apr01_content")).contains("의무사용월차<br>(B=A*100%)");

        Map<String, Object> notice = appr(MONTH_04);
        assertThat((String) notice.get("apr01_title")).startsWith("미사용 월차 유급휴가 사용일시 지정 통보서_");
        assertThat((String) notice.get("apr01_content")).contains("< 근로기준법 제 61조(월차유급휴가의 사용촉진) 관련 >", "< 미사용 월차유급휴가 사용시기 지정 >", "해당월");
        assertThat((String) appr(MONTH_06).get("apr01_title")).startsWith("미사용 월차 유급휴가 사용일시 지정 통보서_");
    }

    @Test
    void 선택이_없거나_행이_없으면_만들지_않는다() {
        assertThrows(BusinessException.class, () -> service.createYear(user(), new UnLeaveApprReq("2025", CLASS_TREE, List.of())));
        assertThrows(BusinessException.class, () -> service.createYear(user(), new UnLeaveApprReq("2025", null, List.of(YEAR_SELF))));
        assertThrows(BusinessException.class, () -> service.createYear(user(), new UnLeaveApprReq("2025", CLASS_TREE, List.of(1L))));
        assertThrows(BusinessException.class, () -> service.createMonth(user(), new UnLeaveApprReq("2024", CLASS_TREE, List.of(YEAR_SELF))));
    }

    @Test
    void 연차_지정통보서는_지정일자를_월별로_나누고_소수_일수는_첫_달에서_뺀다() {
        // 로컬 DB에는 구분 02 행이 없어, 롤백되는 이 트랜잭션 안에서 한 행을 02·잔여 2.5일로 바꿔 시험한다
        jdbc.update("update emp21_un_leave set emp21_un_leave_cd = '02', emp21_remain_days = 2.5 where emp21_un_leave_id = ?", YEAR_OTHER);
        assertThat(service.createYear(user(), new UnLeaveApprReq("2025", CLASS_TREE, List.of(YEAR_OTHER)))).isEqualTo(1);

        Map<String, Object> doc = appr(YEAR_OTHER);
        assertThat((String) doc.get("apr01_title")).startsWith("미사용 연차 유급휴가 사용일시 지정 통보서_");
        String html = (String) doc.get("apr01_content");
        assertThat(html).contains("미사용 연차 유급휴가 사용일시 지정 통보", "< 미사용 연차유급휴가 사용시기 지정 >");
        // 월 표의 사용일수 칸 중 소수(.5)가 하나 있다
        assertThat(html).containsPattern("\\d\\.5 일");
    }
}

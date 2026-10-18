package kr.co.kfs.asseterp.biz.pay;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayWorkTimeRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayWorkTimeSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayWorkTimeService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E23(근로시간기준관리)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(PayWorkTimeService.class)
class PayWorkTimeDbTest {

    @Autowired PayWorkTimeService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 근로시간기준_조회_등록_수정_삭제() {
        int all = jdbc.queryForObject("select count(*) from pay34_work_time_config where pay34_company_id = 0", Integer.class);
        assertThat(service.search()).hasSize(all);

        PayWorkTimeRes created = service.save(sysAdmin, List.of(new PayWorkTimeSaveReq(-1L, LocalDate.of(2099, 1, 1), 8L, 12L, "22:00", "06:00", 1.5, 2.0, 1.5, 2.0))).get(0);
        assertThat(created.workTimeConfigId()).isPositive();
        assertThat(created.ntStartTime()).isEqualTo("22:00");
        assertThat(service.search()).hasSize(all + 1);
        assertThat(service.search().get(0).workTimeConfigId()).isEqualTo(created.workTimeConfigId());  // 적용시작일 내림차순

        PayWorkTimeRes updated = service.save(sysAdmin, List.of(new PayWorkTimeSaveReq(created.workTimeConfigId(), LocalDate.of(2099, 1, 1), 7L, 12L, "21:00", "05:00", 1.5, 2.5, 1.5, 2.0))).get(0);
        assertThat(updated.workTimeConfigId()).isEqualTo(created.workTimeConfigId());
        assertThat(updated.dayWorkHours()).isEqualTo(7L);
        assertThat(updated.ntMultRate()).isEqualTo(2.5);

        assertThatThrownBy(() -> service.save(other, List.of(new PayWorkTimeSaveReq(-1L, LocalDate.of(2099, 1, 1), 8L, 12L, "22:00", "06:00", 1.5, 2.0, 1.5, 2.0)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.delete(other, List.of(created.workTimeConfigId()))).isInstanceOf(BusinessException.class);

        assertThat(service.delete(sysAdmin, List.of(created.workTimeConfigId()))).isEqualTo(1);
        assertThat(service.delete(sysAdmin, List.of())).isZero();
        assertThat(service.search()).hasSize(all);
    }
}

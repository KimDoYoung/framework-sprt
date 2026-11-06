package kr.co.kfs.asseterp.biz.pay;

import static kr.co.kfs.asseterp.support.XlsxFiles.row;
import static kr.co.kfs.asseterp.support.XlsxFiles.xlsx;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.apr.service.link.PayAnnualLinkSeedProvider;
import kr.co.kfs.asseterp.biz.pay.service.PayAnnualService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** 연봉계약 엑셀 업로드(ExcelCells.forEachRow 적용 뒤)를 asseterpdb 에 넣어 보고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(PayAnnualService.class)
class PayAnnualUploadDbTest {

    @MockitoBean PayAnnualLinkSeedProvider linkSeedProvider;  // 업로드는 상신 양식을 쓰지 않는다

    @Autowired PayAnnualService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private int countOn2099() {
        return jdbc.queryForObject("select count(*) from pay01_annual where pay01_company_id = 28000 and pay01_start_date = date '2099-01-01'", Integer.class);
    }

    @Test
    void 사번으로_사원을_찾아_넣고_같은_사원_기간은_지우고_다시_넣는다() {
        String empNo = jdbc.queryForObject("select emp01_emp_no from emp01_person where emp01_company_id = 28000 and emp01_emp_no is not null limit 1", String.class);
        Object[] line = row(empNo, "시험", "2099-01-01", "2099-12-31", "09:00", "18:00", 50000000, 4000000, "비고", 3000000, 100000, 50000, 200000, 10000, 20000);
        assertThat(countOn2099()).isZero();

        assertThat(service.upload(user, xlsx(line))).isEqualTo(1);
        assertThat(countOn2099()).isEqualTo(1);
        // 같은 [사번/시작일/종료일]을 다시 올리면 지우고 새로 넣어 한 건
        assertThat(service.upload(user, xlsx(line))).isEqualTo(1);
        assertThat(countOn2099()).isEqualTo(1);
    }

    @Test
    void 없는_사번과_빠진_기간은_행_번호와_함께_거절한다() {
        assertThatThrownBy(() -> service.upload(user, xlsx(row("NOEMP-XYZ", "x", "2099-01-01", "2099-12-31"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("2행의 사번 [NOEMP-XYZ]을 찾을 수 없습니다");
        String empNo = jdbc.queryForObject("select emp01_emp_no from emp01_person where emp01_company_id = 28000 and emp01_emp_no is not null limit 1", String.class);
        assertThatThrownBy(() -> service.upload(user, xlsx(row(empNo, "x", null, null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("2행의 적용시작일·적용종료일을 읽을 수 없습니다");
        assertThatThrownBy(() -> service.upload(user, xlsx(row((Object) null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("비어있거나");
    }
}

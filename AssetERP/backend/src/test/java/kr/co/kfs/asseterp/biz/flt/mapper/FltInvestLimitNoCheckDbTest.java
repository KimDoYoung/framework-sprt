package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.EmpLimitRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrCheckRes;
import kr.co.kfs.asseterp.biz.flt.dto.ViolateRes;
import kr.co.kfs.asseterp.biz.flt.service.FltRealTrService;
import kr.co.kfs.asseterp.biz.flt.service.FltTrService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 변경반영 CH-0321~0344 — AS-IS 11-11 "투자한도 체크안함"(flt01_invest_limit_no_check_yn).
 * 기준관리가 체크안함이면 ① 보고주기·투자한도 안내(check)와 투자한도(empLimit)가 그 값을 싣고 ② 위반내역의 "연간 추가투자금액 초과"가 빠진다.
 * @MybatisTest는 시험마다 롤백하므로 asseterpdb의 데이터는 바뀌지 않는다. 실제 사원(회사 28000, 사원 29049)
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FltTrService.class, FltRealTrService.class})
class FltInvestLimitNoCheckDbTest {

    private static final String YEAR_OVER = "연간 추가투자금액 초과";

    @Autowired FltTrService trService;
    @Autowired FltRealTrService realTrService;
    @Autowired DataSource dataSource;
    @Autowired SqlSessionTemplate sqlSession;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    private void setNoCheck(String yn) {
        new JdbcTemplate(dataSource).update("UPDATE flt01_company_std SET flt01_invest_limit_no_check_yn = ? WHERE flt01_company_id = 28000", yn);
        sqlSession.clearCache();   // 같은 트랜잭션의 MyBatis 1차 캐시가 바뀌기 전 결과를 돌려주지 않게
    }

    @Test
    void 체크안함이면_투자한도_값이_실리고_연간투자금액초과_위반이_빠진다() {
        // 기본(열이 비어 있음 = 체크함)
        TrCheckRes check0 = trService.check(user, "2026-11-12");
        EmpLimitRes limit0 = realTrService.empLimit(user, "2026-11-12");
        assertThat(check0.investLimitNoCheckYn()).isFalse();
        assertThat(limit0.investLimitNoCheckYn()).isFalse();
        List<ViolateRes> before = trService.searchViolate(user, "2025-12-22", null);
        long yearOverBefore = before.stream().filter(v -> YEAR_OVER.equals(v.checkName())).count();
        long othersBefore = before.size() - yearOverBefore;

        // 체크안함
        setNoCheck("true");
        assertThat(trService.check(user, "2026-11-12").investLimitNoCheckYn()).isTrue();
        assertThat(realTrService.empLimit(user, "2026-11-12").investLimitNoCheckYn()).isTrue();
        List<ViolateRes> after = trService.searchViolate(user, "2025-12-22", null);
        assertThat(after).noneMatch(v -> YEAR_OVER.equals(v.checkName()));
        assertThat(after.size()).isEqualTo(othersBefore);   // 다른 위반은 그대로
    }
}

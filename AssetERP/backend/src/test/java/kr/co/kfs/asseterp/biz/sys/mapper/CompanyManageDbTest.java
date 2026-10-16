package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyManageReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyManageRes;
import kr.co.kfs.asseterp.biz.sys.dto.LoginSecureReq;
import kr.co.kfs.asseterp.biz.sys.dto.LoginSecureRes;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyService;
import kr.co.kfs.asseterp.biz.sys.service.SysLoginSecureService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.apache.ibatis.session.SqlSession;
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

/** A15 관리정보 탭·비고·공인IP를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysCompanyService.class, SysLoginSecureService.class})
class CompanyManageDbTest {

    @Autowired SysCompanyService companyService;
    @Autowired SysLoginSecureService loginSecureService;
    @Autowired JdbcTemplate jdbc;
    @Autowired SqlSession sqlSession; // JdbcTemplate로 직접 바꾼 뒤 MyBatis 1차 캐시를 비우기 위해

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private static final long KFS = 28000L;

    private static CompanyManageReq reqOf(CompanyManageRes r, String useYn, String locNm) {
        return new CompanyManageReq(r.companyId(), r.loginSecureYn(), r.companyNm(), locNm, r.mailInfo(), r.emgrcyPasswd(),
                r.erpProductCd(), r.contType(), r.noticeDate(), r.closeDate(), r.icamCompanyCd(), r.icamAdvisCompanyCd(),
                r.assetYn(), r.advisYn(), r.pbsYn(), useYn);
    }

    @Test
    void 같은_값으로_저장하면_그대로이고_null_사용여부는_null로_남는다() {
        CompanyManageRes before = companyService.getCompanyManage(sysAdmin, KFS);
        CompanyManageRes after = companyService.updateCompanyManage(sysAdmin, reqOf(before, before.useYn(), before.locNm()));
        assertThat(after).isEqualTo(before);

        jdbc.update("update sys01_company set sys01_use_yn = null where sys01_company_id = ?", KFS);
        sqlSession.clearCache();
        CompanyManageRes nullUse = companyService.getCompanyManage(sysAdmin, KFS);
        companyService.updateCompanyManage(sysAdmin, reqOf(nullUse, nullUse.useYn(), nullUse.locNm()));
        assertThat(jdbc.queryForObject("select sys01_use_yn from sys01_company where sys01_company_id = ?", String.class, KFS)).isNull();
    }

    @Test
    void 다른_회사의_서브도메인으로는_바꿀_수_없다() {
        CompanyManageRes r = companyService.getCompanyManage(sysAdmin, KFS);
        assertThatThrownBy(() -> companyService.updateCompanyManage(sysAdmin, reqOf(r, r.useYn(), "admin")))
                .isInstanceOf(BusinessException.class).hasMessage("이미 사용 중인 서브도메인입니다.");
    }

    @Test
    void 조회할_때_main_image_id가_비었으면_채번한다() {
        jdbc.update("update sys01_company set sys01_main_image_id = null where sys01_company_id = ?", KFS);
        companyService.getCompanyManage(sysAdmin, KFS);
        assertThat(jdbc.queryForObject("select sys01_main_image_id from sys01_company where sys01_company_id = ?", Long.class, KFS)).isNotNull();
    }

    @Test
    void 비고와_공인IP를_저장하고_지운다() {
        companyService.updateNote(sysAdmin, KFS, "ZZ_A15_비고");
        assertThat(companyService.getCompanyManage(sysAdmin, KFS).note()).isEqualTo("ZZ_A15_비고");

        int before = loginSecureService.searchLoginSecures(sysAdmin, KFS).size();
        List<LoginSecureRes> saved = loginSecureService.updateLoginSecures(sysAdmin, KFS,
                List.of(new LoginSecureReq(-1L, LocalDate.of(2025, 1, 1), null, "10.0.0.1", "ZZ")));
        assertThat(saved).singleElement().satisfies(s -> {
            assertThat(s.publicIp()).isEqualTo("10.0.0.1");
            assertThat(s.startDate()).isEqualTo(LocalDate.of(2025, 1, 1));
        });
        assertThat(loginSecureService.searchLoginSecures(sysAdmin, KFS)).hasSize(before + 1);
        assertThat(loginSecureService.deleteLoginSecures(sysAdmin, 0L, List.of(saved.get(0).loginSecureId()))).isZero(); // 다른 회사 조건
        assertThat(loginSecureService.deleteLoginSecures(sysAdmin, KFS, List.of(saved.get(0).loginSecureId()))).isEqualTo(1);
        assertThatThrownBy(() -> loginSecureService.updateLoginSecures(sysAdmin, KFS, List.of(new LoginSecureReq(-1L, null, null, " ", null))))
                .isInstanceOf(BusinessException.class).hasMessage("공인IP를 입력하세요.");
    }
}

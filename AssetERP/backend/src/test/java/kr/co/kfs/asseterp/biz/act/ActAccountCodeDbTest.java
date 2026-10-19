package kr.co.kfs.asseterp.biz.act;

import kr.co.kfs.asseterp.biz.act.dto.AccountCodeAdminRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeCopyReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodePrintSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.ActLinkCreateReq;
import kr.co.kfs.asseterp.biz.act.dto.ActLinkRes;
import kr.co.kfs.asseterp.biz.act.service.ActAccountCodeService;
import kr.co.kfs.asseterp.biz.act.service.ActLinkService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E27(계정코드 관리)의 쓰기·복사를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({ActAccountCodeService.class, ActLinkService.class})
class ActAccountCodeDbTest {

    @Autowired ActAccountCodeService service;
    @Autowired ActLinkService links;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    private AccountCodeSaveReq req(Long id, String code, String name) {
        return new AccountCodeSaveReq(id, code, name, name + "2", "en", null, "1", "1", "true", "true", "true", "false", null, "false", "ZZ9", "내용");
    }

    @Test
    void 조회_등록_수정_출력설정_삭제() {
        int all = jdbc.queryForObject("select count(*) from act01_account_code where act01_company_id = 0", Integer.class);
        assertThat(service.search(admin, null, null, null)).hasSize(all);

        AccountCodeAdminRes created = service.save(admin, req(null, "ZZ9E27", "시험계정"));
        assertThat(created.accountCodeId()).isPositive();
        assertThat(created.companyId()).isZero();
        assertThat(created.attributeName()).isNotBlank();  // f_cdnm
        assertThat(service.search(admin, null, null, null)).hasSize(all + 1);
        assertThat(service.search(admin, "시험계정", "true", "1")).extracting(AccountCodeAdminRes::accountCode).contains("ZZ9E27");

        AccountCodeAdminRes updated = service.save(admin, new AccountCodeSaveReq(created.accountCodeId(), "ZZ9E27", "시험수정", null, null, null, "1", "2",
                "false", "false", "false", "false", null, "false", "ZZ9", null));
        assertThat(updated.accountName()).isEqualTo("시험수정");
        assertThat(updated.drcrType()).isEqualTo("2");
        assertThat(updated.useYn()).isEqualTo("false");

        List<AccountCodeAdminRes> printed = service.savePrint(admin, List.of(new AccountCodePrintSaveReq(created.accountCodeId(), "출력명", "true", "true")));
        assertThat(printed.get(0).accountName2()).isEqualTo("출력명");
        assertThat(printed.get(0).printYn()).isEqualTo("true");
        assertThat(printed.get(0).accountName()).isEqualTo("시험수정");  // 세 열만 바뀐다

        // 필수 검사 4종 (원본은 화면에서만 했다)
        assertThatThrownBy(() -> service.save(admin, req(null, "", "x"))).hasMessageContaining("계정코드는 필수입력 항목입니다");
        assertThatThrownBy(() -> service.save(admin, req(null, "ZZ9", ""))).hasMessageContaining("계정과목은 필수입력 항목입니다");
        assertThatThrownBy(() -> service.save(admin, new AccountCodeSaveReq(null, "ZZ9", "x", null, null, null, null, "1", null, null, null, null, null, null, null, null)))
                .hasMessageContaining("계정속성은 필수선택 항목입니다");
        assertThatThrownBy(() -> service.save(admin, new AccountCodeSaveReq(null, "ZZ9", "x", null, null, null, "1", null, null, null, null, null, null, null, null, null)))
                .hasMessageContaining("차대구분은 필수선택 항목입니다");

        // 다른 회사는 관리자 회사 행을 고치지도 지우지도 못한다
        assertThatThrownBy(() -> service.save(other, req(created.accountCodeId(), "ZZ9E27", "침범"))).isInstanceOf(BusinessException.class);
        assertThat(service.delete(other, List.of(created.accountCodeId()))).isZero();

        assertThat(service.delete(admin, List.of(created.accountCodeId()))).isEqualTo(1);
        assertThat(service.delete(admin, List.of())).isZero();
        assertThat(service.search(admin, null, null, null)).hasSize(all);
    }

    @Test
    void 이익제공_연결정보_추가_순서_삭제() {
        ActLinkRes first = links.create(admin, new ActLinkCreateReq("ZZ9E27", "1001"));
        ActLinkRes second = links.create(admin, new ActLinkCreateReq("ZZ9E27", "1002"));
        assertThat(first.provideName()).contains("-");
        assertThat(links.search(admin, "ZZ9E27")).hasSize(2);
        assertThat(links.search(other, "ZZ9E27")).isEmpty();  // 로그인 회사 것만

        // ▲▼: 보이는 순서대로 조회순서 1부터
        assertThat(links.order(admin, List.of(second.linkId(), first.linkId()))).isEqualTo(2);
        assertThat(links.search(admin, "ZZ9E27")).extracting(ActLinkRes::linkId).containsExactly(second.linkId(), first.linkId());
        assertThat(links.search(admin, "ZZ9E27")).extracting(ActLinkRes::seq).containsExactly(1L, 2L);

        assertThat(links.provideContents("10")).isNotEmpty();
        assertThatThrownBy(() -> links.create(admin, new ActLinkCreateReq("ZZ9E27", ""))).hasMessageContaining("내용");

        assertThat(links.delete(other, List.of(first.linkId()))).isZero();
        assertThat(links.delete(admin, List.of(first.linkId(), second.linkId()))).isEqualTo(2);
        assertThat(links.search(admin, "ZZ9E27")).isEmpty();
    }

    @Test
    void 계정과목복사는_상위계정과_연결정보까지_고른_고객사로() {
        // 기준: 관리자 회사의 사용·전표생성 계정 하나 (상위 계정이 있는 것)
        String code = jdbc.queryForObject("select a.act01_account_cd from act01_account_code a where a.act01_company_id = 0 and a.act01_use_yn = 'true' and a.act01_slip_yn = 'true' "
                + "and exists (select 1 from act01_account_code p where p.act01_company_id = 0 and p.act01_account_cd = a.act01_parent_cd and p.act01_use_yn = 'true') limit 1", String.class);
        List<String> chain = new ArrayList<>();
        for (String c = code; c != null; ) {
            chain.add(c);
            List<String> parent = jdbc.queryForList("select p.act01_account_cd from act01_account_code a join act01_account_code p on p.act01_company_id = a.act01_company_id "
                    + "and p.act01_account_cd = a.act01_parent_cd and p.act01_use_yn = 'true' where a.act01_company_id = 0 and a.act01_account_cd = ?", String.class, c);
            c = parent.isEmpty() ? null : parent.get(0);
        }
        assertThat(chain.size()).isGreaterThan(1);

        // 대상: 이 계정이 아직 없는 고객사 (없으면 아무 고객사)
        List<Long> targets = jdbc.queryForList("select sys01_company_id from sys01_company c where coalesce(sys01_use_yn,'false') = 'true' and sys01_company_id != 0 "
                + "and not exists (select 1 from act01_account_code a where a.act01_company_id = c.sys01_company_id and a.act01_account_cd = ?) order by 1 limit 1", Long.class, code);
        Long target = targets.isEmpty() ? 28000L : targets.get(0);

        // 연결정보도 함께 복사된다
        links.create(admin, new ActLinkCreateReq(code, "1001"));

        assertThat(service.copyAdmin(admin, new AccountCodeCopyReq(0L, code, List.of(target)))).isEqualTo(1);
        for (String c : chain) {
            Integer n = jdbc.queryForObject("select count(*) from act01_account_code where act01_company_id = ? and act01_account_cd = ?", Integer.class, target, c);
            assertThat(n).as("복사된 계정 " + c).isEqualTo(1);
        }
        assertThat(jdbc.queryForObject("select count(*) from act14_link where act14_company_id = ? and act14_account_cd = ? and act14_provide_content_cd = '1001'", Integer.class, target, code)).isEqualTo(1);

        // 두 번째는 있는 계정을 덮어쓴다 — 원본은 정렬코드를 넘기지 않아 NULL이 된다, 연결정보는 중복으로 넣지 않는다
        assertThat(service.copyAdmin(admin, new AccountCodeCopyReq(0L, code, List.of(target)))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select act01_print_seq from act01_account_code where act01_company_id = ? and act01_account_cd = ?", String.class, target, code)).isNull();
        assertThat(jdbc.queryForObject("select count(*) from act14_link where act14_company_id = ? and act14_account_cd = ? and act14_provide_content_cd = '1001'", Integer.class, target, code)).isEqualTo(1);

        // 관리자만
        assertThatThrownBy(() -> service.copyAdmin(other, new AccountCodeCopyReq(0L, code, List.of(target)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.companies(other)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.tree(other, 0L)).isInstanceOf(BusinessException.class);
        assertThat(service.companies(admin)).isNotEmpty();
        assertThat(service.tree(admin, 0L)).isNotEmpty();
    }
}

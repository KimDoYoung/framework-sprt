package kr.co.kfs.asseterp.biz.com;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.ComRelateApprRes;
import kr.co.kfs.asseterp.biz.com.dto.ComRelateApprSaveReq;
import kr.co.kfs.asseterp.biz.com.service.ComRelateApprService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** EE34 증빙자료(Com01_Lookup_RelateAppr) 조회·연결·제거·열람권한을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(ComRelateApprService.class)
class ComRelateApprDbTest {

    @Autowired ComRelateApprService service;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 이미_있는_연결을_키테이블ID로_읽는다() {
        // 로그인 회사 문서에 걸린 연결이 있는 키를 하나 고른다
        Long keyId = jdbc.queryForObject("select com01_key_table_id from com01_relate_appr r join apr01_appr a on a.apr01_appr_id = r.com01_appr_id "
                + "where a.apr01_company_id = 28000 limit 1", Long.class);
        List<ComRelateApprRes> rows = service.search(user(), keyId);
        assertThat(rows).isNotEmpty();
        assertThat(rows.get(0).title()).isNotNull();
        assertThat(rows.get(0).statusName()).isNotNull();
        assertThat(service.search(user(), -1L)).isEmpty();
    }

    @Test
    void 문서를_연결하고_제거한다() {
        Long apprId = jdbc.queryForObject("select apr01_appr_id from apr01_appr where apr01_company_id = 28000 and apr01_status_cd = '30' limit 1", Long.class);
        long keyId = 999_000_111L;
        assertThat(service.add(user(), new ComRelateApprSaveReq("zz999", keyId, List.of(apprId)))).isEqualTo(1);
        List<ComRelateApprRes> rows = service.search(user(), keyId);
        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).apprId()).isEqualTo(apprId);
        assertThat(rows.get(0).keyTable()).isEqualTo("zz999");
        assertThat(service.delete(user(), List.of(rows.get(0).relateApprId()))).isEqualTo(1);
        assertThat(service.search(user(), keyId)).isEmpty();
    }

    @Test
    void 다른_회사_문서는_연결도_제거도_안_된다() {
        Long other = jdbc.queryForObject("select apr01_appr_id from apr01_appr where apr01_company_id <> 28000 limit 1", Long.class);
        assertThat(service.add(user(), new ComRelateApprSaveReq("zz999", 999_000_222L, List.of(other)))).isZero();
        assertThat(service.search(user(), 999_000_222L)).isEmpty();
    }

    @Test
    void 연결_정보가_없으면_거절한다() {
        assertThatThrownBy(() -> service.add(user(), new ComRelateApprSaveReq("", 1L, List.of(1L)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.add(user(), new ComRelateApprSaveReq("abcdef", 1L, List.of(1L)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.add(user(), new ComRelateApprSaveReq("zz999", 1L, List.of()))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 열람권한은_문서_상신자에게는_있고_없는_문서는_없다() {
        Long own = jdbc.queryForObject("select apr01_appr_id from apr01_appr where apr01_company_id = 28000 and apr01_reg_emp_id = 29049 limit 1", Long.class);
        assertThat(own).isNotNull();
        assertThat(service.canView(user(), own)).isTrue();
        assertThat(service.canView(user(), -1L)).isFalse();
    }

    @Test
    void 신규문서_단추는_S1이_아닌_회사만() {
        String code = jdbc.queryForObject("select sys01_erp_product_cd from sys01_company where sys01_company_id = 28000", String.class);
        assertThat(service.apprButtonEnabled(user())).isEqualTo(!"S1".equals(code));
    }
}

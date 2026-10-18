package kr.co.kfs.asseterp.biz.ast;

import kr.co.kfs.asseterp.biz.ast.dto.AstDetailRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstDetailSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstDetailService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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

/** E21 자산상세 항목관리(Ast02_Detail)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(AstDetailService.class)
class AstDetailDbTest {

    @Autowired AstDetailService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 조회는_공통회사_전용이고_사용여부_검색어_적용() {
        int all = jdbc.queryForObject("select count(*) from ast02_detail where ast02_company_id = 0 and ast02_default_yn = 'true' and ast02_ast_class_tree_id = 0", Integer.class);
        assertThat(service.search(sysAdmin, "", false)).hasSize(all);
        assertThat(service.search(sysAdmin, "", true)).hasSizeLessThanOrEqualTo(all);
        assertThat(service.search(other, "", false)).isEmpty();
    }

    @Test
    void 등록_수정_삭제와_필수_검사() {
        AstDetailRes created = service.save(sysAdmin, List.of(new AstDetailSaveReq(-1L, 99L, "시험항목", "시험태그", "true"))).get(0);
        assertThat(created.detailId()).isPositive();
        assertThat(jdbc.queryForObject("select ast02_default_yn||ast02_ast_class_tree_id from ast02_detail where ast02_detail_id = ?", String.class, created.detailId())).isEqualTo("true0");

        AstDetailRes updated = service.save(sysAdmin, List.of(new AstDetailSaveReq(created.detailId(), 98L, "시험항목2", null, "false"))).get(0);
        assertThat(updated.detailId()).isEqualTo(created.detailId());
        assertThat(updated.title()).isEqualTo("시험항목2");
        assertThat(updated.useYn()).isEqualTo("false");
        assertThat(service.search(sysAdmin, "시험항목2", true)).isEmpty();
        assertThat(service.search(sysAdmin, "시험항목2", false)).hasSize(1);

        assertThatThrownBy(() -> service.save(sysAdmin, List.of(new AstDetailSaveReq(-1L, null, "x", null, "true")))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.save(sysAdmin, List.of(new AstDetailSaveReq(-1L, 1L, null, null, "true")))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.save(other, List.of(new AstDetailSaveReq(-1L, 1L, "x", null, "true")))).isInstanceOf(BusinessException.class);

        assertThat(service.delete(sysAdmin, List.of(created.detailId()))).isEqualTo(1);
        assertThat(service.delete(sysAdmin, List.of())).isZero();
    }
}

package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookListRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookRes;
import kr.co.kfs.asseterp.biz.flt.service.FltBookService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** I04 보유내역 조회창(읽기 전용)을 asseterpdb에서 돌린다. 실제 사원(회사 28000, 사원 29049, 계좌 202204070100311) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(FltBookService.class)
class FltBookDbTest {

    @Autowired FltBookService service;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    @Test
    void 보유내역은_본인_계좌만_읽힌다() {
        List<BookRes> list = service.searchExpect(user, 202204070100311L, "2026-08-20", null);
        assertThat(list).isNotEmpty();
        assertThat(list.get(0).accountNo()).contains("(");
        assertThat(list).allMatch(b -> b.bookDate().equals("2026-08-20"));
        assertThat(service.searchExpect(user, 202204070100311L, "2026-08-20", "KCC")).isNotEmpty().allMatch(b -> b.itemName().contains("KCC") || b.itemCode().contains("KCC"));
        // 다른 사원으로는 같은 계좌가 안 보인다
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(28000L).roles(List.of("ROLE_USER")).build();
        assertThat(service.searchExpect(other, 202204070100311L, "2026-08-20", null)).isEmpty();
        assertThat(service.lockupStd(user, "2026-08-20")).isNotNull();
    }

    /** J04 준감인 보유내역조회 — personId 없으면 회사 전체 사원(2026-08-20: 2명 50행), 사원을 주면 그 사원만 */
    @Test
    void 준감인_보유내역은_회사_전체_또는_선택_사원이다() {
        List<BookListRes> all = service.searchListAdmin(user, null, "2026-08-20", null);
        assertThat(all).hasSize(50);
        assertThat(all).allMatch(b -> b.personOrgName() != null && b.personOrgName().contains("("));
        List<BookListRes> one = service.searchListAdmin(user, 29049L, "2026-08-20", null);
        assertThat(one).isNotEmpty().hasSizeLessThan(all.size());
        assertThat(service.searchList(user, "2026-08-20", null)).hasSameSizeAs(one);
        assertThat(service.downloadListAdmin(user, null, "2026-08-20", null)).isNotEmpty();
    }
}

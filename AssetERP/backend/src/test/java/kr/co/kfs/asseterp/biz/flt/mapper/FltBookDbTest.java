package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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
}

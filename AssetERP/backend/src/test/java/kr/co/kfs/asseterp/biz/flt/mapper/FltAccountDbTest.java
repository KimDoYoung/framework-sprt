package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AccountCloseReq;
import kr.co.kfs.asseterp.biz.flt.dto.AccountCloseRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltAccountService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** I02 계좌신고(저장·삭제·계좌폐쇄·폐쇄취소)를 asseterpdb에서 실제로 돌리고 롤백한다. 없는 회사(99999)·사원(1)으로 한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(FltAccountService.class)
class FltAccountDbTest {

    @Autowired FltAccountService service;

    private final UserPrincipal fake = UserPrincipal.builder().userId(1L).companyId(99999L).roles(List.of("ROLE_USER")).build();

    private AccountSaveReq newRow(String no, Boolean main) {
        return new AccountSaveReq(-1L, "2026-10-01", "2", "1", main, "시험", no, null, "점", "101000", "비고");
    }

    @Test
    void 저장_수정_폐쇄_폐쇄취소_삭제() {
        AccountRes saved = service.update(fake, List.of(newRow("123-456", true))).get(0);
        assertThat(saved.accountId()).isPositive();
        assertThat(saved.accountNoDec()).isEqualTo("123-456");   // 암호화해 저장하고 복호화해 읽는다
        assertThat(saved.mainAccountYn()).isTrue();
        assertThat(saved.setupDate()).isEqualTo("2026-10-01");
        assertThat(service.search(fake)).hasSize(1);

        AccountRes changed = service.update(fake, List.of(new AccountSaveReq(saved.accountId(), "2026-10-02", "2", "1", false,
                "시험2", "999-1", null, "점2", "101000", null))).get(0);
        assertThat(changed.accountName()).isEqualTo("시험2");
        assertThat(changed.mainAccountYn()).isFalse();
        assertThat(changed.accountNoDec()).isEqualTo("999-1");

        // 폐쇄: 목록에서 빠지고 폐쇄 목록에 나온다 → 폐쇄취소하면 다시 나온다
        assertThat(service.createCloses(fake, new AccountCloseReq("2026-10-20", List.of(saved.accountId())))).isEqualTo(1);
        assertThat(service.search(fake)).isEmpty();
        List<AccountCloseRes> closes = service.searchCloses(fake);
        assertThat(closes).hasSize(1);
        assertThat(closes.get(0).closeDate()).isEqualTo("2026-10-20");
        assertThat(service.deleteCloses(fake, List.of(closes.get(0).accountCloseId()))).isEqualTo(1);
        assertThat(service.search(fake)).hasSize(1);

        assertThat(service.delete(fake, List.of(saved.accountId()))).isEqualTo(1);
        assertThat(service.search(fake)).isEmpty();
    }

    @Test
    void 다른_사원의_계좌는_폐쇄할_수_없다() {
        AccountRes saved = service.update(fake, List.of(newRow("1-1", null))).get(0);
        UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(99999L).roles(List.of("ROLE_USER")).build();
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> service.createCloses(other, new AccountCloseReq("2026-10-20", List.of(saved.accountId()))))
                .isInstanceOf(kr.co.kfs.asseterp.common.error.BusinessException.class);
    }

    @Test
    void 안내_두줄과_종목유형_이름() {
        assertThat(service.status(fake).checkCycle()).isNull();
        assertThat(service.docClass(fake, "B05")).isNull();
        assertThat(service.itemTypeName(fake, "101000")).isNotNull();
    }
}

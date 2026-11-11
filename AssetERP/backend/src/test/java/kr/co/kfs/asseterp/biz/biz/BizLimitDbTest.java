package kr.co.kfs.asseterp.biz.biz;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizLimitService;

/** #1130 이익제공 기준관리 — 원본 2026-11-06 [거래상대방 필수입력] 열(biz90_target_info_req_yn) 저장·조회 (CH-0014·0122·0123·0160). 롤백 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(BizLimitService.class)
class BizLimitDbTest {

    @Autowired BizLimitService service;

    private static final UserPrincipal USER = UserPrincipal.builder().userId(29035L).companyId(28000L).name("시험").roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 거래상대방_필수입력을_저장하고_다시_읽는다() {
        BizLimitRes saved = service.save(USER, List.of(new BizLimitSaveReq(null, LocalDate.of(2099, 1, 1), "1",
                1000L, 2000L, 3000L, 4000L, 5000L, "true"))).get(0);
        assertThat(saved.targetInfoReqYn()).isEqualTo("true");

        BizLimitRes changed = service.save(USER, List.of(new BizLimitSaveReq(saved.limitId(), saved.startDate(), "1",
                1000L, 2000L, 3000L, 4000L, 5000L, "false"))).get(0);
        assertThat(changed.targetInfoReqYn()).isEqualTo("false");
        assertThat(service.search(USER)).anySatisfy(r -> {
            assertThat(r.limitId()).isEqualTo(saved.limitId());
            assertThat(r.targetInfoReqYn()).isEqualTo("false");
        });
    }
}

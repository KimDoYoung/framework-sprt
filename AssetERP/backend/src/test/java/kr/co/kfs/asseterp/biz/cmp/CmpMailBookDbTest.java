package kr.co.kfs.asseterp.biz.cmp;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailBookRes;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailBookSaveReq;
import kr.co.kfs.asseterp.biz.cmp.service.CmpMailBookService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** #1212 공용메일 관리 — 고칠 때 비고와 비밀번호(원본 2026-11-02 CH-0087: createPassword로 다시 저장). asseterpdb에서 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(CmpMailBookService.class)
class CmpMailBookDbTest {

    @Autowired CmpMailBookService service;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 고치면_비고와_비밀번호가_바뀐다() {
        CmpMailBookRes created = service.create(user, new CmpMailBookSaveReq("cmp-test@example.com", "first-pw", "처음"));
        assertThat(created.decPassword()).isEqualTo("first-pw");

        CmpMailBookRes updated = service.update(user, created.mailBookId(), new CmpMailBookSaveReq(null, "second-pw", "고침"));
        assertThat(updated.note()).isEqualTo("고침");
        assertThat(updated.decPassword()).isEqualTo("second-pw");
        assertThat(updated.emailAddr()).isEqualTo("cmp-test@example.com");   // 메일주소는 고치지 않는다
    }
}

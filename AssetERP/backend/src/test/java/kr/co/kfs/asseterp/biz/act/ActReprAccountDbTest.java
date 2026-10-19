package kr.co.kfs.asseterp.biz.act;

import kr.co.kfs.asseterp.biz.act.dto.ReprAccountInitReq;
import kr.co.kfs.asseterp.biz.act.dto.ReprAccountRes;
import kr.co.kfs.asseterp.biz.act.dto.ReprAccountSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActReprAccountService;
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

/** E28(대표계정관리)의 쓰기·기초데이터생성을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(ActReprAccountService.class)
class ActReprAccountDbTest {

    @Autowired ActReprAccountService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 조회_등록_수정_삭제() {
        int all = jdbc.queryForObject("select count(*) from act10_repr_account where act10_company_id = 0", Integer.class);
        assertThat(service.search(admin, null, null)).hasSize(all);
        assertThat(service.search(admin, "%", "")).hasSize(all);

        ReprAccountRes created = service.update(admin, List.of(new ReprAccountSaveReq(-1L, "ZZ9", "시험대표", "1", null, "시험"))).get(0);
        assertThat(created.reprAccountId()).isPositive();
        assertThat(created.companyId()).isZero();
        assertThat(created.attributeName()).isNotBlank();  // f_cdnm
        assertThat(service.search(admin, null, null)).hasSize(all + 1);
        assertThat(service.search(admin, "1", "zz9")).extracting(ReprAccountRes::reprAccountCode).containsExactly("ZZ9");  // 코드||이름 LIKE, 대소문자 무시

        // 상대 대표계정: 같은 회사의 코드를 가리키면 이름이 따라온다
        String other0 = jdbc.queryForObject("select act10_repr_account_cd from act10_repr_account where act10_company_id = 0 order by 1 limit 1", String.class);
        ReprAccountRes updated = service.update(admin, List.of(new ReprAccountSaveReq(created.reprAccountId(), "ZZ9", "시험대표2", "2", other0, null))).get(0);
        assertThat(updated.reprAccountName()).isEqualTo("시험대표2");
        assertThat(updated.attributeCode()).isEqualTo("2");
        assertThat(updated.tgtReprAccountCode()).isEqualTo(other0);
        assertThat(updated.tgtReprAccountName()).isNotBlank();

        // 필수 3종은 원본이 DB 제약에 맡겼다 — 서버가 안내로 막는다
        assertThatThrownBy(() -> service.update(admin, List.of(new ReprAccountSaveReq(null, "", "x", "1", null, null)))).hasMessageContaining("대표계정코드는 필수입력 항목입니다");
        assertThatThrownBy(() -> service.update(admin, List.of(new ReprAccountSaveReq(null, "ZZ8", "", "1", null, null)))).hasMessageContaining("대표계정명은 필수입력 항목입니다");
        assertThatThrownBy(() -> service.update(admin, List.of(new ReprAccountSaveReq(null, "ZZ8", "x", null, null, null)))).hasMessageContaining("계정속성은 필수선택 항목입니다");

        // 다른 회사는 관리자 회사 행을 고치지도 지우지도 못한다
        assertThatThrownBy(() -> service.update(other, List.of(new ReprAccountSaveReq(created.reprAccountId(), "ZZ9", "침범", "1", null, null)))).isInstanceOf(BusinessException.class);
        assertThat(service.delete(other, List.of(created.reprAccountId()))).isZero();

        assertThat(service.delete(admin, List.of(created.reprAccountId()))).isEqualTo(1);
        assertThat(service.delete(admin, List.of())).isZero();
        assertThat(service.search(admin, null, null)).hasSize(all);
    }

    @Test
    void 기초데이터생성은_고객사의_같은_코드를_지우고_관리자_회사_것을_복사() {
        List<ReprAccountRes> base = service.search(admin, null, null);
        List<String> codes = base.stream().limit(2).map(ReprAccountRes::reprAccountCode).toList();
        Long target = 28000L;
        int before = jdbc.queryForObject("select count(*) from act10_repr_account where act10_company_id = ?", Integer.class, target);
        int existing = jdbc.queryForObject("select count(*) from act10_repr_account where act10_company_id = ? and act10_repr_account_cd in (?, ?)", Integer.class, target, codes.get(0), codes.get(1));

        assertThat(service.insertInitData(admin, new ReprAccountInitReq(List.of(target), codes))).isEqualTo(1);
        // 같은 코드는 지우고 새로 넣으므로 코드마다 정확히 1행
        for (String code : codes) {
            assertThat(jdbc.queryForObject("select count(*) from act10_repr_account where act10_company_id = ? and act10_repr_account_cd = ?", Integer.class, target, code)).isEqualTo(1);
        }
        assertThat(jdbc.queryForObject("select count(*) from act10_repr_account where act10_company_id = ?", Integer.class, target)).isEqualTo(before - existing + 2);
        // 두 번 해도 같다
        service.insertInitData(admin, new ReprAccountInitReq(List.of(target), codes));
        assertThat(jdbc.queryForObject("select count(*) from act10_repr_account where act10_company_id = ?", Integer.class, target)).isEqualTo(before - existing + 2);

        // 선택한 코드가 없으면 아무 것도 안 하고 성공(원본: "생성이 완료되었습니다.")
        assertThat(service.insertInitData(admin, new ReprAccountInitReq(List.of(target), List.of()))).isEqualTo(1);

        // 관리자만
        assertThatThrownBy(() -> service.insertInitData(other, new ReprAccountInitReq(List.of(target), codes))).isInstanceOf(BusinessException.class);
    }
}

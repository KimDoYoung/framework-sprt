package kr.co.kfs.asseterp.biz.act;

import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapInitReq;
import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapRes;
import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActRealAccountMapService;
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

/** E31(실계정맵핑)의 쓰기·기초데이터생성을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(ActRealAccountMapService.class)
class ActRealAccountMapDbTest {

    @Autowired ActRealAccountMapService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 조회_등록_수정_삭제() {
        // 조회는 대표계정과 INNER JOIN이라 대표계정이 없는 행은 빠진다
        int all = jdbc.queryForObject("""
                select count(*) from act13_real_account_map
                 inner join act10_repr_account on (act10_company_id = act13_company_id and act10_repr_account_cd = act13_repr_account_cd)
                 where act13_company_id = 0""", Integer.class);
        assertThat(service.search(admin, null)).hasSize(all);
        assertThat(service.search(admin, "")).hasSize(all);

        String repr = jdbc.queryForObject("select act10_repr_account_cd from act10_repr_account where act10_company_id = 0 order by 1 limit 1", String.class);
        String real = jdbc.queryForObject("select act01_account_cd from act01_account_code where act01_company_id = 0 order by 1 limit 1", String.class);

        RealAccountMapRes created = service.update(admin, List.of(new RealAccountMapSaveReq(-1L, repr, "ZZTEST", real, "시험"))).get(0);
        assertThat(created.realAccountMapId()).isPositive();
        assertThat(created.companyId()).isZero();
        assertThat(created.reprAccountName()).isNotBlank();  // 대표계정명 JOIN
        assertThat(created.realAccountName()).isNotBlank();  // 실계정과목
        assertThat(service.search(admin, null)).hasSize(all + 1);
        assertThat(service.search(admin, "zztest")).extracting(RealAccountMapRes::accountMap).containsExactly("ZZTEST");  // 대소문자 무시

        RealAccountMapRes updated = service.update(admin, List.of(new RealAccountMapSaveReq(created.realAccountMapId(), repr, "ZZTEST", null, "시험2"))).get(0);
        assertThat(updated.note()).isEqualTo("시험2");
        assertThat(updated.realAccountCode()).isNull();

        // 없는 대표계정코드를 직접 입력해 저장해도 응답 행은 있다(selectById를 LEFT OUTER JOIN으로 바꿨다)
        RealAccountMapRes orphan = service.update(admin, List.of(new RealAccountMapSaveReq(-1L, "NOPE", "ZZTEST", null, null))).get(0);
        assertThat(orphan).isNotNull();
        assertThat(orphan.reprAccountCode()).isEqualTo("NOPE");
        assertThat(orphan.reprAccountName()).isNull();
        assertThat(service.search(admin, null)).hasSize(all + 1);  // 조회는 INNER JOIN이라 이 행은 안 보인다(원본 그대로)

        // 대표계정코드는 화면 update() L374가 막는다 — 서버도 같은 문구
        assertThatThrownBy(() -> service.update(admin, List.of(new RealAccountMapSaveReq(null, "", "x", null, null)))).hasMessageContaining("대표계정코드는 필수입력 항목입니다");

        // 다른 회사는 관리자 회사 행을 고치지도 지우지도 못한다
        assertThatThrownBy(() -> service.update(other, List.of(new RealAccountMapSaveReq(created.realAccountMapId(), repr, "ZZTEST", null, "침범")))).isInstanceOf(BusinessException.class);
        assertThat(service.delete(other, List.of(created.realAccountMapId()))).isZero();

        assertThat(service.delete(admin, List.of(created.realAccountMapId()))).isEqualTo(1);
        assertThat(service.delete(admin, List.of())).isZero();
        assertThat(service.search(admin, null)).hasSize(all);
    }

    @Test
    void 기초데이터생성은_고객사의_같은_맵핑을_지우고_관리자_회사_것을_복사() {
        List<RealAccountMapRes> base = service.search(admin, null).stream().filter(r -> r.accountMap() != null).limit(2).toList();
        List<RealAccountMapInitReq.Item> items = base.stream().map(r -> new RealAccountMapInitReq.Item(r.reprAccountCode(), r.accountMap())).toList();
        Long target = 28000L;
        int before = jdbc.queryForObject("select count(*) from act13_real_account_map where act13_company_id = ?", Integer.class, target);
        int existing = 0;
        for (var item : items) {
            existing += jdbc.queryForObject("select count(*) from act13_real_account_map where act13_company_id = ? and act13_repr_account_cd = ? and act13_account_map = ?",
                    Integer.class, target, item.reprAccountCode(), item.accountMap());
        }

        assertThat(service.insertInitData(admin, new RealAccountMapInitReq(List.of(target), items))).isEqualTo(1);
        // 같은 (대표계정, 맵핑ID)는 지우고 새로 넣는다 — 관리자 회사에 있는 개수만큼
        int expectedNew = 0;
        for (var item : items) {
            expectedNew += jdbc.queryForObject("select count(*) from act13_real_account_map where act13_company_id = 0 and act13_repr_account_cd = ? and act13_account_map = ?",
                    Integer.class, item.reprAccountCode(), item.accountMap());
        }
        assertThat(jdbc.queryForObject("select count(*) from act13_real_account_map where act13_company_id = ?", Integer.class, target)).isEqualTo(before - existing + expectedNew);
        // 두 번 해도 같다
        service.insertInitData(admin, new RealAccountMapInitReq(List.of(target), items));
        assertThat(jdbc.queryForObject("select count(*) from act13_real_account_map where act13_company_id = ?", Integer.class, target)).isEqualTo(before - existing + expectedNew);

        // 선택한 행이 없으면 아무 것도 안 하고 성공(원본: "생성이 완료되었습니다.")
        assertThat(service.insertInitData(admin, new RealAccountMapInitReq(List.of(target), List.of()))).isEqualTo(1);

        // 관리자만
        assertThatThrownBy(() -> service.insertInitData(other, new RealAccountMapInitReq(List.of(target), items))).isInstanceOf(BusinessException.class);
    }
}
